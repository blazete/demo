import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  CAM5_MODEL_TRANSFORM,
  PROJECT_OFFICE_FOUNDATION,
  PROJECT_OFFICE_TRANSFORM,
  SITE_FENCE_X,
} from '../scene/layout/siteAssetTransforms';

describe('site asset transforms', () => {
  it('rotates the CAM-5 source optical axis upward', () => {
    const opticalAxis = new THREE.Vector3(0, 0, 1)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), CAM5_MODEL_TRANSFORM.rotationX);
    expect(opticalAxis.y).toBeGreaterThan(0.999);
  });

  it('keeps the complete project-office foundation beyond the fence', () => {
    const minimumX = PROJECT_OFFICE_TRANSFORM.position[0] - PROJECT_OFFICE_FOUNDATION.size[0] / 2;
    expect(minimumX).toBeGreaterThan(SITE_FENCE_X + 0.5);
  });

  it('aligns the project office and foundation parallel to the tracks', () => {
    expect(PROJECT_OFFICE_TRANSFORM.rotationY).toBe(0);
    expect(PROJECT_OFFICE_FOUNDATION.size[2]).toBeGreaterThan(PROJECT_OFFICE_FOUNDATION.size[0]);
  });
});
