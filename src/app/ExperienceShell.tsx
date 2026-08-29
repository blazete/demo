import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { createActor } from 'xstate';
import { getScenario } from '../data/mock/scenarios';
import { World } from '../scene/World';
import { HUD } from '../ui/hud/HUD';
import { EvidenceCard } from '../ui/evidence/EvidenceCard';
import { Controls } from '../ui/controls/Controls';
import { WelcomeScreen } from '../ui/controls/WelcomeScreen';
import { CompletionSummary } from '../ui/hud/CompletionSummary';
import { AccessibleNarrative } from '../ui/accessibility/AccessibleNarrative';
import { AccessibleWalkthrough } from '../ui/fallback/AccessibleWalkthrough';
import type { DronePreset } from '../systems/camera/DroneCamera';
import { Soundscape } from '../systems/audio/Soundscape';
import { scenarioMachine } from '../experience/machine/scenarioMachine';
import { getComponentId } from '../data/types';
import type { ScenarioId, PortalState, QualityTier, GuideStage, InspectionProgress, ScenarioContext } from '../data/types';

const STAGE_CAPTIONS: Partial<Record<GuideStage, string | null>> = {
  SITE_ARRIVAL: 'You have arrived at the MVIS inspection site.',
  STANDBY: 'Portal ready. Waiting for the approaching train.',
  APPROACH: 'Train approaching from the distance.',
  ACTIVATION: 'Inspection portal activating.',
  INSPECTION: 'Live inspection in progress.',
  DEFECT_FOCUS: 'Potential defect identified.',
  EVIDENCE: 'Evidence prepared for railway review.',
  EXIT: 'Train exiting the portal area.',
  COMPLETE: 'Inspection complete.',
};

function stageValue(value: unknown): GuideStage {
  return typeof value === 'string' ? value as GuideStage : 'WELCOME';
}

export function ExperienceShell() {
  const actorRef = useRef(createActor(scenarioMachine, { input: { scenario: null } }));
  const actor = actorRef.current;
  const [snapshot, setSnapshot] = useState(() => actor.getSnapshot());
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [qualityTier, setQualityTier] = useState<QualityTier>('balanced');
  const [droneMode, setDroneMode] = useState(false);
  const [dronePreset, setDronePreset] = useState<DronePreset>('site');
  const [manualTrain, setManualTrain] = useState({ position: 50, speed: 8, direction: -1 as 1 | -1, playing: false });
  const [hornTrigger, setHornTrigger] = useState(0);

  useEffect(() => {
    actor.start();
    const subscription = actor.subscribe(setSnapshot);
    return () => subscription.unsubscribe();
  }, [actor]);

  useEffect(() => {
    if (!isLoading) return;
    let progress = 0;
    const interval = window.setInterval(() => {
      progress = Math.min(1, progress + 0.04);
      setLoadingProgress(progress);
      if (progress >= 1) {
        window.clearInterval(interval);
        window.setTimeout(() => setIsLoading(false), 250);
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [isLoading]);

  const stage = stageValue(snapshot.value);
  const showWelcome = isLoading || stage === 'WELCOME' || stage === 'BOOT' || stage === 'LOADING';
  const isPaused = snapshot.context.paused;
  const scenario = snapshot.context.scenario;
  const currentCoach = scenario?.trainRun.coaches[snapshot.context.currentCoachIndex]?.coachId ?? '';
  const totalCoaches = scenario?.trainRun.coachCount ?? 0;
  const isGuided = !showWelcome && !['FREE_ROAM', 'COMPLETE', 'FALLBACK'].includes(stage);

  useEffect(() => {
    if (isLoading || showWelcome || isPaused || ['COMPLETE', 'FREE_ROAM', 'FALLBACK'].includes(stage)) return;
    const interval = window.setInterval(() => actor.send({ type: 'TICK', delta: 0.1 }), 100);
    return () => window.clearInterval(interval);
  }, [actor, isLoading, showWelcome, isPaused, stage]);

  const handleStart = useCallback((scenarioId: ScenarioId) => {
    actor.send({ type: 'START', scenario: getScenario(scenarioId) });
  }, [actor]);
  const handleOpenFallback = useCallback(() => {
    actor.send({ type: 'START', scenario: getScenario('spring-defect-day') });
    actor.send({ type: 'OPEN_FALLBACK' });
  }, [actor]);

  const handleReplay = useCallback(() => actor.send({ type: 'REPLAY' }), [actor]);
  const handleSkip = useCallback(() => actor.send({ type: 'SKIP' }), [actor]);
  const handlePause = useCallback(() => actor.send({ type: 'PAUSE' }), [actor]);
  const handleResume = useCallback(() => actor.send({ type: 'RESUME' }), [actor]);
  const handleExplore = useCallback(() => actor.send({ type: 'EXPLORE' }), [actor]);
  const handleReturnToGuide = useCallback(() => actor.send({ type: 'RETURN_TO_GUIDE' }), [actor]);
  const handleManualPosition = useCallback((position: number) => setManualTrain(value => ({ ...value, position })), []);
  const toggleDrone = useCallback(() => setDroneMode(value => !value), []);
  const resetManualTrain = useCallback(() => setManualTrain(value => ({ ...value, position: 50, playing: false })), []);
  const handleTrainSelect = useCallback(() => { setDroneMode(true); setDronePreset('train-side'); setManualTrain(value => ({ ...value, playing: false })); }, []);

  useEffect(() => {
    if (!droneMode || showWelcome) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.code === 'Space') { event.preventDefault(); setManualTrain(value => ({ ...value, playing: !value.playing })); }
      if (event.code === 'ArrowLeft') setManualTrain(value => ({ ...value, direction: -1 }));
      if (event.code === 'ArrowRight') setManualTrain(value => ({ ...value, direction: 1 }));
      if (event.code === 'ArrowUp') setManualTrain(value => ({ ...value, speed: value.speed >= 14 ? 14 : value.speed >= 8 ? 14 : 8 }));
      if (event.code === 'ArrowDown') setManualTrain(value => ({ ...value, speed: value.speed <= 3 ? 3 : value.speed <= 8 ? 3 : 8 }));
      if (event.code === 'KeyR') resetManualTrain();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [droneMode, resetManualTrain, showWelcome]);

  const currentShot = useMemo(() => {
    switch (stage) {
      case 'SITE_ARRIVAL': return 'arrival' as const;
      case 'STANDBY': return 'standby' as const;
      case 'APPROACH': return 'approach' as const;
      case 'ACTIVATION': return 'activation' as const;
      case 'DEFECT_FOCUS': return 'defect_focus' as const;
      case 'INSPECTION': case 'EVIDENCE': return 'inspection' as const;
      case 'EXIT': return 'exit' as const;
      case 'COMPLETE': return 'completion' as const;
      case 'FREE_ROAM': return 'free_roam' as const;
      default: return 'standby' as const;
    }
  }, [stage]);
  const highlightedComponent = snapshot.context.activeDefect ? getComponentId(snapshot.context.activeDefect.location) : null;

  const portalState: PortalState = snapshot.context.portalState;
  const context: ScenarioContext = {
    scenario,
    scenarioSeed: scenario?.scenarioSeed ?? 0,
    trainPosition: 0,
    trainSpeed: 8,
    currentCoachIndex: snapshot.context.currentCoachIndex,
    totalCoaches,
    currentComponent: stage === 'INSPECTION' ? 'inspecting' : stage === 'APPROACH' ? 'approaching' : stage === 'EXIT' ? 'exiting' : '',
    defects: snapshot.context.discoveredDefects,
    evidenceIds: snapshot.context.activeDefect?.evidenceIds ?? [],
    alertStatus: snapshot.context.alertStatus,
    qualityTier,
    muted,
    captionsOn,
    paused: isPaused,
    reducedMotion: false,
    error: null,
    inspectionStartTime: null,
    inspectionEndTime: null,
    coachesInspected: snapshot.context.currentCoachIndex,
    currentCoach,
  };
  const progress: InspectionProgress = {
    currentCoach: currentCoach || '—',
    coachesInspected: snapshot.context.currentCoachIndex,
    totalCoaches,
    activeComponent: snapshot.context.currentComponent,
    defectsFound: snapshot.context.discoveredDefects.length,
    portalStatus: portalState,
  };
  const stageCaption = captionsOn ? STAGE_CAPTIONS[stage] ?? null : null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas shadows camera={{ fov: 50, near: 0.1, far: 300, position: [12, 6, 20] }}
        gl={{ antialias: qualityTier !== 'low', powerPreference: 'high-performance', toneMapping: 3, toneMappingExposure: qualityTier === 'low' ? 0.8 : 1.0 }}
        style={{ background: '#0B1F33' }}>
        <World scenario={scenario} context={context} portalState={portalState}
          currentShot={currentShot} isGuided={isGuided} highlightedComponent={highlightedComponent} droneMode={droneMode}
          dronePreset={dronePreset} manualTrain={manualTrain} onManualTrainPosition={handleManualPosition} onTrainSelect={handleTrainSelect} />
      </Canvas>
      {!showWelcome && <Soundscape muted={muted} stage={stage} weather={scenario?.environment.weather ?? 'clear'} portalState={portalState} hornTrigger={hornTrigger} />}

      {!showWelcome && stage !== 'FALLBACK' && (
        <>
          <HUD portalState={portalState} progress={progress} isGuided={isGuided || stage === 'COMPLETE'} scenarioId={scenario?.scenarioId ?? 'unknown'} />
          <Controls isGuided={isGuided} isPaused={isPaused} portalState={portalState} qualityTier={qualityTier} muted={muted} captionsOn={captionsOn}
            onPause={handlePause} onResume={handleResume} onSkip={handleSkip} onMuteToggle={() => setMuted(value => !value)}
            onCaptionsToggle={() => setCaptionsOn(value => !value)} onQualityChange={setQualityTier}
            onReplay={handleReplay} onExplore={handleExplore} onReturnToGuide={handleReturnToGuide}
            droneMode={droneMode} dronePreset={dronePreset} onDroneToggle={toggleDrone} onDronePreset={setDronePreset}
            manualTrain={manualTrain} onManualPlay={() => setManualTrain(value => ({ ...value, playing: !value.playing }))}
            onManualDirection={(direction) => setManualTrain(value => ({ ...value, direction }))}
            onManualSpeed={(speed) => setManualTrain(value => ({ ...value, speed }))} onManualReset={resetManualTrain} onManualPosition={handleManualPosition}
            onHorn={() => setHornTrigger(value => value + 1)} />
          <EvidenceCard defect={snapshot.context.activeDefect} evidence={scenario?.evidence ?? []} scenario={scenario} onClose={() => actor.send({ type: 'HIDE_EVIDENCE' })} isVisible={snapshot.context.evidenceVisible} />
          <CompletionSummary scenario={scenario ?? getScenario('spring-defect-day')} defects={snapshot.context.discoveredDefects} coachCount={totalCoaches}
            isVisible={stage === 'COMPLETE'} onExplore={handleExplore} onReviewEvidence={() => actor.send({ type: 'SHOW_EVIDENCE' })} onReplay={handleReplay} />
          <AccessibleNarrative stage={stage} portalState={portalState} progress={progress} stageCaption={stageCaption} />
        </>
      )}

      {showWelcome && <WelcomeScreen onStart={handleStart} onOpenFallback={handleOpenFallback} loadingProgress={loadingProgress} isLoading={isLoading} />}
      {stage === 'FALLBACK' && <AccessibleWalkthrough scenario={scenario ?? getScenario('spring-defect-day')} onClose={() => actor.send({ type: 'START', scenario: scenario ?? getScenario('spring-defect-day') })} onReplay={() => actor.send({ type: 'REPLAY' })} />}

      {captionsOn && stageCaption && isGuided && !showWelcome && (
        <div role="status" style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', background: 'rgba(11,31,51,0.9)', borderRadius: 8, padding: '8px 16px', fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#F2EFE6', maxWidth: 500, textAlign: 'center', zIndex: 15, pointerEvents: 'none' }}>
          [{stageCaption}]
        </div>
      )}
    </div>
  );
}
