import { useEffect, useState } from 'react';
import type { CameraEquipment } from '../../data/equipment/equipmentRegistry';

export function CameraPreview({ camera }: { camera: CameraEquipment }) {
  const [mediaFailed, setMediaFailed] = useState(false);
  useEffect(() => setMediaFailed(false), [camera.id, camera.media.mediaType]);
  const media = camera.media;

  if (!mediaFailed && media.mediaType === 'image' && media.previewImage) {
    return <img className="mvis-camera-media" src={media.previewImage} alt={media.alt} onError={() => setMediaFailed(true)} />;
  }
  if (!mediaFailed && media.mediaType === 'video' && media.videoUrl) {
    return <video className="mvis-camera-media" src={media.videoUrl} poster={media.posterImage} aria-label={media.alt} muted loop autoPlay playsInline onError={() => setMediaFailed(true)} />;
  }

  return (
    <div className={`mvis-simulated-feed ${camera.kind === 'line-scan' ? 'line-scan' : ''}`} role="img" aria-label={media.alt}>
      <div className="mvis-feed-grid" />
      {camera.kind === 'line-scan' ? (
        <><div className="mvis-line-scan-strip" /><div className="mvis-line-scan-direction">TRAIN MOVEMENT →</div></>
      ) : (
        <><div className="mvis-feed-reticle"><span /><span /></div><div className="mvis-feed-rail" /><div className="mvis-feed-wheel left" /><div className="mvis-feed-wheel right" /></>
      )}
      <div className="mvis-feed-label">SIMULATED CAMERA POV · REAL FOOTAGE PENDING</div>
    </div>
  );
}
