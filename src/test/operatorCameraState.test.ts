import { describe, expect, it } from 'vitest';
import { clampOperatorTarget, getOverviewPreset, restoreViewState } from '../systems/camera/operatorCameraState';

describe('operator camera state', () => {
  it('clamps exploration targets to the railway site bounds', () => {
    expect(clampOperatorTarget([100, -10, 200])).toEqual([35, 0, 90]);
    expect(clampOperatorTarget([-100, 50, -200])).toEqual([-35, 25, -90]);
  });

  it('provides an overview that contains all four tracks', () => {
    const view = getOverviewPreset('site');
    expect(view.position[1]).toBeGreaterThan(15);
    expect(view.target[0]).toBeLessThan(-5);
  });

  it('restores a captured view without sharing mutable arrays', () => {
    const original = { position: [4, 5, 6] as const, target: [1, 2, 3] as const, fov: 50 };
    const restored = restoreViewState(original);
    expect(restored).toEqual(original);
    expect(restored.position).not.toBe(original.position);
  });
});
