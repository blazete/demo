export const INSPECTION_LENGTH = 3;
export const BROAD_GAUGE = 1.676;
export const TRACK_CENTERS = [0, -5.5, -11, -16.5] as const;

export const INSPECTION_LAYOUT = {
  poles: [
    { id: 'pole-left', position: [-2.45, 0, 0] as const, side: -1 as const },
    { id: 'pole-right', position: [2.45, 0, 0] as const, side: 1 as const },
  ],
  cameras: [
    { id: 'CAM-1', kind: 'upper', position: [-2.05, 2.55, 0.15] as const, rotation: [0, 0.18, -0.1] as const },
    { id: 'CAM-2', kind: 'upper', position: [2.05, 2.55, 0.15] as const, rotation: [0, -0.18, 0.1] as const },
    { id: 'CAM-3', kind: 'lower', position: [-1.82, 0.72, -0.05] as const, rotation: [0, 0.25, -0.08] as const },
    { id: 'CAM-4', kind: 'lower', position: [1.82, 0.72, -0.05] as const, rotation: [0, -0.25, 0.08] as const },
  ],
  sideLamps: Array.from({ length: 8 }, (_, index) => ({
    id: `LED-${Math.floor(index / 4) + 1}${index < 4 ? 'L' : 'R'}-${(index % 4) + 1}`,
    position: [index < 4 ? -2.22 : 2.22, 2.92, -1.05 + (index % 4) * 0.7] as const,
  })),
  railStrips: Array.from({ length: 6 }, (_, index) => ({
    id: `TRACK-LED-${index + 1}`,
    position: [-0.62 + index * 0.248, 0.18, 0] as const,
  })),
  lineScanner: { id: 'CAM-5', position: [0, -0.08, 0] as const },
} as const;
