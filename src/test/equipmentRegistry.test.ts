import { describe, expect, it } from 'vitest';
import { CAMERA_EQUIPMENT, EQUIPMENT_REGISTRY, getEquipment } from '../data/equipment/equipmentRegistry';

describe('MVIS equipment registry', () => {
  it('defines the five calibrated inspection cameras', () => {
    expect(CAMERA_EQUIPMENT.map(camera => camera.id)).toEqual(['CAM-1', 'CAM-2', 'CAM-3', 'CAM-4', 'CAM-5']);
    expect(CAMERA_EQUIPMENT.map(camera => camera.lens)).toEqual(['6 mm', '6 mm', '12 mm', '12 mm', 'Line scan']);
    expect(new Set(CAMERA_EQUIPMENT.map(camera => camera.id)).size).toBe(5);
    CAMERA_EQUIPMENT.forEach(camera => {
      expect([...camera.position, ...camera.lookTarget, ...camera.focusPosition].every(Number.isFinite)).toBe(true);
      expect(camera.media.mediaType).toBe('simulation');
    });
  });

  it('covers the drawing equipment and proposed trigger subsystem', () => {
    expect(EQUIPMENT_REGISTRY.filter(item => item.kind === 'side-light')).toHaveLength(8);
    expect(EQUIPMENT_REGISTRY.filter(item => item.kind === 'track-light')).toHaveLength(1);
    expect(EQUIPMENT_REGISTRY.filter(item => item.kind === 'sensor')).toHaveLength(2);
    expect(EQUIPMENT_REGISTRY.filter(item => item.kind === 'relay')).toHaveLength(1);
    expect(getEquipment('CAM-5')?.name).toContain('Line Scan');
  });
});
