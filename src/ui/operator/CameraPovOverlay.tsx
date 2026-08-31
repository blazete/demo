import type { CameraEquipment } from '../../data/equipment/equipmentRegistry';

export function CameraPovOverlay({ camera, onReturn }: { camera: CameraEquipment | null; onReturn: () => void }) {
  if (!camera) return null;
  return (
    <div className={`mvis-pov-overlay ${camera.kind === 'line-scan' ? 'line-scan' : ''}`} aria-label={`${camera.name} full point of view`}>
      <div className="mvis-pov-top"><div><strong>{camera.id}</strong><span>{camera.name}</span></div><div><span className="mvis-live-dot" /> SIMULATION · {camera.lens}</div></div>
      <div className="mvis-pov-crosshair"><span /><span /></div>
      {camera.kind === 'line-scan' && <div className="mvis-pov-scan-band"><span>UNDER-TRACK LINE SCAN</span></div>}
      <div className="mvis-pov-bottom"><span>MVIS INSPECTION ARRAY · {new Date().toLocaleTimeString('en-IN', { hour12: false })}</span><button onClick={onReturn}>Return to Site</button></div>
    </div>
  );
}
