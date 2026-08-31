import { isCameraEquipment } from '../../data/equipment/equipmentRegistry';
import type { EquipmentDefinition } from '../../data/equipment/equipmentRegistry';
import { CameraPreview } from './CameraPreview';

interface Props {
  equipment: EquipmentDefinition | null;
  lightsEnabled: boolean;
  sensorsEnabled: boolean;
  coverageEnabled: boolean;
  onClose: () => void;
  onLocate: () => void;
  onOpenPov: () => void;
  onToggleLights: () => void;
  onToggleSensors: () => void;
  onToggleCoverage: () => void;
  onTrigger: () => void;
}

export function EquipmentInspector(props: Props) {
  const { equipment } = props;
  if (!equipment) return null;
  const camera = isCameraEquipment(equipment) ? equipment : null;
  const toggleLabel = equipment.category === 'lighting' ? (props.lightsEnabled ? 'Switch lights off' : 'Switch lights on') : equipment.kind === 'sensor' ? (props.sensorsEnabled ? 'Hide sensors' : 'Show sensors') : null;

  return (
    <aside className="mvis-equipment-inspector" aria-label={`${equipment.name} information`}>
      <div className="mvis-operator-heading"><div><span>{equipment.category.toUpperCase()} · {equipment.proposed ? 'PROPOSED LAYOUT' : 'OPERATIONAL'}</span><h2>{equipment.name}</h2></div><button onClick={props.onClose} aria-label="Close equipment information">×</button></div>
      {camera && <CameraPreview camera={camera} />}
      <dl><div><dt>Purpose</dt><dd>{equipment.purpose}</dd></div><div><dt>Specification</dt><dd>{equipment.specification}</dd></div>{camera && <><div><dt>Lens</dt><dd>{camera.lens}</dd></div><div><dt>Feed</dt><dd>{camera.media.mediaType === 'simulation' ? 'Simulated — media slot ready' : camera.media.mediaType}</dd></div></>}</dl>
      {equipment.proposed && <p className="mvis-proposed-note">Position shown for demonstration. Final field coordinates require site survey approval.</p>}
      <div className="mvis-inspector-actions">
        <button onClick={props.onLocate}>Locate</button>
        {camera && <button className="primary" onClick={props.onOpenPov}>Open Full POV</button>}
        {toggleLabel && <button onClick={equipment.category === 'lighting' ? props.onToggleLights : props.onToggleSensors}>{toggleLabel}</button>}
        {camera && <button onClick={props.onToggleCoverage}>{props.coverageEnabled ? 'Hide coverage' : 'Show coverage'}</button>}
        {equipment.capabilities.includes('trigger') && <button className="amber" onClick={props.onTrigger}>Trigger sequence</button>}
      </div>
    </aside>
  );
}
