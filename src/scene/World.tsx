import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Ground, TractionPoles, Fencing, Signals, BackgroundElements } from './environment/Environment';
import { Portal } from './portal/Portal';
import { Train } from './train/Train';
import { CameraDirector, type CameraShot } from '../systems/camera/CameraDirector';
import { LightingRig } from './effects/LightingRig';
import { ControlRoom } from './control-room/ControlRoom';
import { ThirdPersonController } from '../systems/character/ThirdPersonController';
import { FieldEngineer } from './character/FieldEngineer';
import { OperatorCameraController } from '../systems/camera/OperatorCameraController';
import { TriggerSensorSystem } from './sensors/TriggerSensorSystem';
import { getEquipment } from '../data/equipment/equipmentRegistry';
import type { EquipmentId, OperatorMode } from '../data/equipment/equipmentRegistry';
import { MOCK_SITE_METRICS } from '../data/mock/scenarios';
import type { PortalState, Scenario, ScenarioContext } from '../data/types';

const TRAIN_SPEED = 8;
const COACH_START = 21;
const COACH_SPACING = 23.5;

interface WorldProps {
  scenario: Scenario | null;
  context: ScenarioContext;
  portalState: PortalState;
  currentShot: CameraShot;
  isGuided: boolean;
  highlightedComponent: string | null;
  onComponentInspect?: (componentId: string) => void;
  droneMode?: boolean;
  dronePreset?: 'site' | 'top' | 'inspection' | 'train-side';
  manualTrain?: { position: number; speed: number; direction: 1 | -1; playing: boolean };
  onManualTrainPosition?: (position: number) => void;
  onTrainSelect?: () => void;
  selectedEquipmentId?: EquipmentId | null;
  operatorMode?: OperatorMode;
  operatorResetToken?: number;
  lightsEnabled?: boolean;
  sensorsEnabled?: boolean;
  coverageEnabled?: boolean;
  sensorPulse?: number;
  onEquipmentSelect?: (id: EquipmentId) => void;
  onExitPov?: () => void;
}

export function World({ scenario, context, portalState, currentShot, isGuided, highlightedComponent, onComponentInspect, droneMode = false, dronePreset = 'site', manualTrain, onManualTrainPosition, onTrainSelect, selectedEquipmentId = null, operatorMode = 'explore', operatorResetToken = 0, lightsEnabled = true, sensorsEnabled = true, coverageEnabled = false, sensorPulse = 0, onEquipmentSelect, onExitPov = () => {} }: WorldProps) {
  const trainPos = useRef(50);
  const timeOfDay = scenario?.environment.timeOfDay ?? 'day';
  const activeIdx = Math.min(context.currentCoachIndex, (scenario?.trainRun.coachCount ?? 6) - 1);
  const lastManualUpdate = useRef(0);
  const manualPosition = useRef(manualTrain?.position ?? 50);

  useEffect(() => {
    if (!manualTrain?.playing) manualPosition.current = manualTrain?.position ?? 50;
  }, [manualTrain?.position, manualTrain?.playing]);

  useFrame((_, dt) => {
    if (droneMode && manualTrain) {
      if (manualTrain.playing) manualPosition.current += manualTrain.speed * manualTrain.direction * dt;
      manualPosition.current = THREE.MathUtils.clamp(manualPosition.current, -80, 80);
      trainPos.current = manualPosition.current;
      if (manualTrain.playing && onManualTrainPosition && performance.now() - lastManualUpdate.current > 100) {
        lastManualUpdate.current = performance.now();
        onManualTrainPosition(manualPosition.current);
      }
    } else if (portalState === 'preparing') {
      trainPos.current -= TRAIN_SPEED * dt;
    } else if (portalState === 'active' || portalState === 'defect_detected') {
      const targetPosition = -COACH_START - activeIdx * COACH_SPACING;
      trainPos.current = THREE.MathUtils.damp(trainPos.current, targetPosition, 3.5, dt);
    } else if (portalState === 'resetting') {
      trainPos.current -= TRAIN_SPEED * dt;
    }
  });

  return (
    <>
      <LightingRig timeOfDay={timeOfDay} weather={scenario?.environment.weather} qualityTier={context.qualityTier} portalActive={portalState === 'active' || portalState === 'defect_detected'} />
      <CameraDirector currentShot={currentShot} trainPosition={trainPos.current} trainSpeed={TRAIN_SPEED}
        activeCoachIndex={activeIdx} portalState={portalState} highlightedComponent={highlightedComponent} isGuided={isGuided && !droneMode} />
      <OperatorCameraController enabled={droneMode} mode={operatorMode} preset={dronePreset} selectedEquipment={getEquipment(selectedEquipmentId)} resetToken={operatorResetToken} onExitPov={onExitPov} />
      <ThirdPersonController enabled={!isGuided && !droneMode} />
      <Ground />
      <TractionPoles />
      <Fencing />
      <Signals />
      <BackgroundElements />
      <Portal portalState={portalState} paused={context.paused ?? false} selectedEquipmentId={selectedEquipmentId} lightsEnabled={lightsEnabled} coverageEnabled={coverageEnabled} onEquipmentSelect={onEquipmentSelect} />
      <TriggerSensorSystem visible={sensorsEnabled} pulse={sensorPulse} selectedEquipmentId={selectedEquipmentId} onEquipmentSelect={onEquipmentSelect ?? (() => {})} />
      <FieldEngineer active={portalState === 'active' || portalState === 'defect_detected'} qualityTier={context.qualityTier} />
      <Train position={trainPos.current} speed={TRAIN_SPEED} night={timeOfDay === 'night'} coachCount={scenario?.trainRun.coachCount ?? 18}
        coaches={scenario?.trainRun.coaches}
        portalState={portalState} activeCoachIndex={activeIdx} highlightedComponent={highlightedComponent}
        scenarioSeed={scenario?.scenarioSeed ?? 0} onComponentInspect={onComponentInspect} onTrainSelect={onTrainSelect} />
      <ControlRoom metrics={MOCK_SITE_METRICS} />
    </>
  );
}
