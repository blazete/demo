import { describe, expect, it } from 'vitest';
import { BROAD_GAUGE, INSPECTION_LAYOUT, TRACK_CENTERS } from '../scene/portal/inspectionLayout';

describe('open MVIS inspection layout', () => {
  it('matches the engineering equipment topology', () => {
    expect(BROAD_GAUGE).toBe(1.676);
    expect(INSPECTION_LAYOUT.poles).toHaveLength(2);
    expect(INSPECTION_LAYOUT.cameras).toHaveLength(4);
    expect(INSPECTION_LAYOUT.sideLamps).toHaveLength(8);
    expect(INSPECTION_LAYOUT.railStrips).toHaveLength(6);
    expect(INSPECTION_LAYOUT.lineScanner.id).toBe('CAM-5');
  });

  it('contains no gate or crossbeam element', () => {
    expect(Object.keys(INSPECTION_LAYOUT)).not.toContain('gate');
    expect(Object.keys(INSPECTION_LAYOUT)).not.toContain('crossbeam');
  });

  it('defines four parallel broad-gauge track centers', () => {
    expect(TRACK_CENTERS).toHaveLength(4);
    expect(new Set(TRACK_CENTERS).size).toBe(4);
    expect(TRACK_CENTERS[0]).toBe(0);
    expect(TRACK_CENTERS[3]).toBe(-16.5);
  });
});
