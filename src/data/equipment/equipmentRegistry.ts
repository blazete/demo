import { INSPECTION_LAYOUT } from '../../scene/portal/inspectionLayout';

export type Vec3Tuple = readonly [number, number, number];
export type CameraId = 'CAM-1' | 'CAM-2' | 'CAM-3' | 'CAM-4' | 'CAM-5';
export type EquipmentId = CameraId | `LED-${1 | 2 | 3 | 4}${'L' | 'R'}` | 'TRACK-LED-ARRAY' | 'SENSOR-ENTRY' | 'SENSOR-EXIT' | 'RELAY-CABINET';
export type EquipmentCategory = 'cameras' | 'lighting' | 'detection' | 'control';
export type EquipmentKind = 'camera' | 'line-scan' | 'side-light' | 'track-light' | 'sensor' | 'relay';
export type OperatorMode = 'explore' | 'focus' | 'pov';

export type CameraMedia = {
  mediaType: 'simulation' | 'image' | 'video';
  previewImage?: string;
  posterImage?: string;
  videoUrl?: string;
  alt: string;
};

export interface EquipmentDefinition {
  id: EquipmentId;
  name: string;
  shortName: string;
  category: EquipmentCategory;
  kind: EquipmentKind;
  position: Vec3Tuple;
  focusPosition: Vec3Tuple;
  purpose: string;
  specification: string;
  proposed?: boolean;
  capabilities: readonly ('locate' | 'preview' | 'pov' | 'toggle' | 'trigger' | 'coverage')[];
}

export interface CameraEquipment extends EquipmentDefinition {
  id: CameraId;
  kind: 'camera' | 'line-scan';
  lookTarget: Vec3Tuple;
  fov: number;
  lens: '6 mm' | '12 mm' | 'Line scan';
  media: CameraMedia;
}

const simulationMedia = (id: CameraId, description: string): CameraMedia => ({
  mediaType: 'simulation',
  alt: `${id} simulated camera view showing ${description}. Real footage pending.`,
});

export const CAMERA_EQUIPMENT: readonly CameraEquipment[] = [
  {
    id: 'CAM-1', name: 'CAM-1 Upper Area Scan — Left', shortName: 'CAM-1', category: 'cameras', kind: 'camera',
    position: INSPECTION_LAYOUT.cameras[0].position, focusPosition: [-4.5, 3.3, 3.1], lookTarget: [0, 1.15, 0], fov: 62, lens: '6 mm',
    purpose: 'Wide upper-body coverage of the passing locomotive and coach side.', specification: 'Upper area-scan camera · 6 mm lens · adjustable housing',
    capabilities: ['locate', 'preview', 'pov', 'coverage'], media: simulationMedia('CAM-1', 'the upper coach side and roof-line zone'),
  },
  {
    id: 'CAM-2', name: 'CAM-2 Upper Area Scan — Right', shortName: 'CAM-2', category: 'cameras', kind: 'camera',
    position: INSPECTION_LAYOUT.cameras[1].position, focusPosition: [4.5, 3.3, 3.1], lookTarget: [0, 1.15, 0], fov: 62, lens: '6 mm',
    purpose: 'Opposing wide upper-body coverage for complete coach-side evidence.', specification: 'Upper area-scan camera · 6 mm lens · adjustable housing',
    capabilities: ['locate', 'preview', 'pov', 'coverage'], media: simulationMedia('CAM-2', 'the opposite upper coach side and roof-line zone'),
  },
  {
    id: 'CAM-3', name: 'CAM-3 Lower Area Scan — Left', shortName: 'CAM-3', category: 'cameras', kind: 'camera',
    position: INSPECTION_LAYOUT.cameras[2].position, focusPosition: [-4, 1.7, 2.7], lookTarget: [0, 0.58, 0], fov: 42, lens: '12 mm',
    purpose: 'Detailed inspection of wheels, springs, brake rigging and the lower bogie.', specification: 'Lower area-scan camera · 12 mm lens · low-angle housing',
    capabilities: ['locate', 'preview', 'pov', 'coverage'], media: simulationMedia('CAM-3', 'the left wheel, bogie and underframe zone'),
  },
  {
    id: 'CAM-4', name: 'CAM-4 Lower Area Scan — Right', shortName: 'CAM-4', category: 'cameras', kind: 'camera',
    position: INSPECTION_LAYOUT.cameras[3].position, focusPosition: [4, 1.7, 2.7], lookTarget: [0, 0.58, 0], fov: 42, lens: '12 mm',
    purpose: 'Opposing detailed inspection of wheels, springs, brakes and the bogie.', specification: 'Lower area-scan camera · 12 mm lens · low-angle housing',
    capabilities: ['locate', 'preview', 'pov', 'coverage'], media: simulationMedia('CAM-4', 'the right wheel, bogie and underframe zone'),
  },
  {
    id: 'CAM-5', name: 'CAM-5 Under-track Line Scan', shortName: 'CAM-5', category: 'cameras', kind: 'line-scan',
    position: [0, 0.19, 0], focusPosition: [1.45, 0.9, 1.4], lookTarget: [0, 2.4, 0], fov: 28, lens: 'Line scan',
    purpose: 'Builds a high-resolution strip image of the train underside as it passes.', specification: 'Under-track line-scan camera · vertical optical axis · six-strip illumination',
    capabilities: ['locate', 'preview', 'pov', 'coverage'], media: simulationMedia('CAM-5', 'a generated underframe line-scan strip'),
  },
];

const SIDE_LIGHTS: EquipmentDefinition[] = INSPECTION_LAYOUT.sideLamps.map((lamp, index) => {
  const side = index < 4 ? 'Left' : 'Right';
  return {
    id: lamp.id as EquipmentId,
    name: `${lamp.id} 150 W Area Light`, shortName: lamp.id, category: 'lighting', kind: 'side-light',
    position: [lamp.position[0], 2.16, lamp.position[2]],
    focusPosition: [lamp.position[0] * 1.8, 3.3, lamp.position[2] + 2.4],
    purpose: `${side}-side high-intensity illumination for blur-free image capture.`, specification: '150 W LED area lamp · synchronized inspection lighting',
    capabilities: ['locate', 'toggle'],
  };
});

const SUPPORT_EQUIPMENT: EquipmentDefinition[] = [
  { id: 'TRACK-LED-ARRAY', name: 'Under-track LED Strip Array', shortName: 'Track LEDs', category: 'lighting', kind: 'track-light', position: [0, 0.18, 0], focusPosition: [3.1, 2, 2.8], purpose: 'Illuminates the underframe for CAM-5 line-scan capture.', specification: 'Six LED strips · 300 mm each', capabilities: ['locate', 'toggle'] },
  { id: 'SENSOR-ENTRY', name: 'Proposed Entry Axle Sensor', shortName: 'Entry Sensor', category: 'detection', kind: 'sensor', position: [0, 0.22, 7], focusPosition: [4, 2.1, 9], purpose: 'Detects an approaching train and requests inspection activation through the relay.', specification: 'Proposed dual-rail trigger sensor · field position to be surveyed', proposed: true, capabilities: ['locate', 'toggle', 'trigger'] },
  { id: 'SENSOR-EXIT', name: 'Proposed Exit Axle Sensor', shortName: 'Exit Sensor', category: 'detection', kind: 'sensor', position: [0, 0.22, -7], focusPosition: [4, 2.1, -9], purpose: 'Closes the inspection event after the final vehicle clears the array.', specification: 'Proposed dual-rail trigger sensor · field position to be surveyed', proposed: true, capabilities: ['locate', 'toggle', 'trigger'] },
  { id: 'RELAY-CABINET', name: 'Inspection Relay Cabinet', shortName: 'Relay Cabinet', category: 'control', kind: 'relay', position: [3.15, 0.62, 0.72], focusPosition: [5.6, 2.1, 3.2], purpose: 'Sequences trigger sensors, inspection cameras and synchronized lighting.', specification: 'Trackside relay/control cabinet · proposed trigger interface', proposed: true, capabilities: ['locate', 'trigger'] },
];

export const EQUIPMENT_REGISTRY: readonly EquipmentDefinition[] = [...CAMERA_EQUIPMENT, ...SIDE_LIGHTS, ...SUPPORT_EQUIPMENT];

export function getEquipment(id: EquipmentId | null | undefined) {
  return id ? EQUIPMENT_REGISTRY.find(item => item.id === id) ?? null : null;
}

export function isCameraEquipment(item: EquipmentDefinition | null): item is CameraEquipment {
  return Boolean(item && (item.kind === 'camera' || item.kind === 'line-scan'));
}
