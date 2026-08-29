import { describe, expect, it } from 'vitest';
import { createNoiseTexture, createRailwayMaterialPalette, disposeRailwayMaterialPalette } from '../scene/materials/railwayMaterials';

describe('railway materials', () => {
  it('creates deterministic procedural surface data', () => {
    const a = createNoiseTexture(17, 8);
    const b = createNoiseTexture(17, 8);
    expect(Array.from(a.image.data)).toEqual(Array.from(b.image.data));
    a.dispose(); b.dispose();
  });

  it('keeps physical values in valid ranges', () => {
    const palette = createRailwayMaterialPalette();
    expect(Object.keys(palette)).toHaveLength(10);
    Object.values(palette).forEach((material) => {
      expect(material.roughness).toBeGreaterThanOrEqual(0);
      expect(material.roughness).toBeLessThanOrEqual(1);
      expect(material.metalness).toBeGreaterThanOrEqual(0);
      expect(material.metalness).toBeLessThanOrEqual(1);
    });
    disposeRailwayMaterialPalette(palette);
  });
});
