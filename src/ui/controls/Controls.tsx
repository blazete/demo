import type { QualityTier, PortalState } from '../../data/types';
import type { DronePreset } from '../../systems/camera/DroneCamera';

export function Controls({ isGuided, isPaused, qualityTier, muted, captionsOn, onPause, onResume, onSkip, onMuteToggle, onCaptionsToggle, onQualityChange, onReplay, onExplore, onReturnToGuide, droneMode, dronePreset, onDroneToggle, onDronePreset, manualTrain, onManualPlay, onManualDirection, onManualSpeed, onManualReset, onManualPosition, onHorn }: {
  isGuided: boolean; isPaused: boolean; portalState: PortalState; qualityTier: QualityTier; muted: boolean; captionsOn: boolean;
  onPause: () => void; onResume: () => void; onSkip: () => void; onMuteToggle: () => void;
  onCaptionsToggle: () => void; onQualityChange: (t: QualityTier) => void; onReplay: () => void;
  onExplore: () => void; onReturnToGuide: () => void;
  droneMode: boolean; dronePreset: DronePreset; onDroneToggle: () => void; onDronePreset: (preset: DronePreset) => void;
  manualTrain: { position: number; speed: number; direction: 1 | -1; playing: boolean };
  onManualPlay: () => void; onManualDirection: (direction: 1 | -1) => void; onManualSpeed: (speed: number) => void; onManualReset: () => void; onManualPosition: (position: number) => void;
  onHorn: () => void;
}) {
  return (
    <div className="mvis-controls" style={{ position: 'absolute', top: 12, right: 16, display: 'flex', gap: 6, zIndex: 15, pointerEvents: 'auto' }}>
      {isGuided && (
        <>
          <Btn onClick={isPaused ? onResume : onPause} label={isPaused ? 'Resume' : 'Pause'}>{isPaused
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#F2EFE6"><polygon points="6,4 20,12 6,20" /></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="#F2EFE6"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>}</Btn>
          <Btn onClick={onSkip} label="Skip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F2EFE6" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg></Btn>
        </>
      )}
      {!isGuided && <Btn onClick={onReturnToGuide} label="Return to guide"><span style={{ color: '#F2EFE6', fontFamily: 'Inter, sans-serif', fontSize: 11 }}>Guide</span></Btn>}
      <Btn onClick={onDroneToggle} label={droneMode ? 'Exit drone view' : 'Open drone view'}><span style={{ color: droneMode ? '#2CBAE8' : '#F2EFE6', fontFamily: 'Inter, sans-serif', fontSize: 11 }}>DRONE</span></Btn>
      <Btn onClick={onHorn} label="Train horn"><span style={{ color: '#F2B544', fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700 }}>HORN</span></Btn>
      <Btn onClick={onMuteToggle} label={muted ? 'Unmute' : 'Mute'}>
        {muted ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F2EFE6" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F2EFE6" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>}
      </Btn>
      <Btn onClick={onCaptionsToggle} label="Captions">
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: captionsOn ? '#2CBAE8' : '#73797D' }}>CC</span>
      </Btn>
      <select value={qualityTier} onChange={e => onQualityChange(e.target.value as QualityTier)}
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, background: 'rgba(11,31,51,0.85)', color: '#F2EFE6', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}>
        <option value="high">High</option><option value="balanced">Balanced</option><option value="low">Low</option>
      </select>
      {droneMode && <div className="mvis-drone-panel">
        <div className="mvis-drone-row"><span>DRONE VIEW</span><span>{dronePreset.replace('-', ' ').toUpperCase()}</span></div>
        <div className="mvis-drone-hint">Click the train to open this panel · Space play/pause · ←/→ direction · ↑/↓ speed · R reset</div>
        <div className="mvis-drone-presets">{(['site', 'top', 'inspection', 'train-side'] as DronePreset[]).map(preset => <button key={preset} onClick={() => onDronePreset(preset)} aria-label={`Drone ${preset} view`} className={dronePreset === preset ? 'active' : ''}>{preset === 'train-side' ? 'TRAIN' : preset.toUpperCase()}</button>)}</div>
        <div className="mvis-drone-row"><span>TRAIN PLAYBACK</span><span>{manualTrain.speed.toFixed(1)} m/s</span></div>
        <input aria-label="Train timeline" type="range" min="-80" max="80" step="0.5" value={manualTrain.position} onChange={e => onManualPosition(Number(e.target.value))} />
        <div className="mvis-drone-actions">
          <button onClick={onManualPlay}>{manualTrain.playing ? 'Pause' : 'Play'}</button>
          <button onClick={() => onManualDirection(manualTrain.direction === 1 ? -1 : 1)}>{manualTrain.direction === 1 ? 'Reverse' : 'Forward'}</button>
          <button onClick={onManualReset}>Reset</button>
          <select aria-label="Train speed" value={manualTrain.speed} onChange={e => onManualSpeed(Number(e.target.value))}><option value="3">Slow</option><option value="8">Normal</option><option value="14">Fast</option></select>
        </div>
      </div>}
    </div>
  );
}

function Btn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} title={label}
      style={{ background: 'rgba(11,31,51,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
      {children}
    </button>
  );
}
