import type { Vec3Tuple } from '../../data/equipment/equipmentRegistry';

export type OperatorPreset = 'site' | 'top' | 'inspection' | 'train-side';
export type OperatorViewState = { position: Vec3Tuple; target: Vec3Tuple; fov: number };

const PRESETS: Record<OperatorPreset, OperatorViewState> = {
  site: { position: [27, 24, 34], target: [-8, 0.5, 0], fov: 50 },
  top: { position: [-7, 42, 5], target: [-8, 0, 0], fov: 48 },
  inspection: { position: [10, 7, 10], target: [0, 1.1, 0], fov: 48 },
  'train-side': { position: [16, 5, 12], target: [0, 2, 0], fov: 50 },
};

export function clampOperatorTarget([x, y, z]: Vec3Tuple): [number, number, number] {
  return [Math.max(-35, Math.min(35, x)), Math.max(0, Math.min(25, y)), Math.max(-90, Math.min(90, z))];
}

export function getOverviewPreset(preset: OperatorPreset): OperatorViewState {
  return restoreViewState(PRESETS[preset]);
}

export function restoreViewState(view: OperatorViewState): OperatorViewState {
  return { position: [...view.position], target: [...view.target], fov: view.fov };
}
