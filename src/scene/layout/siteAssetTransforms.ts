export const SITE_FENCE_X = 12;

export const CAM5_MODEL_TRANSFORM = {
  position: [0, 0.22, 0] as const,
  rotationX: -Math.PI / 2,
  scale: 0.72,
} as const;

export const PROJECT_OFFICE_TRANSFORM = {
  position: [15, 0, -5] as const,
  rotationY: 0,
  scale: 0.16,
} as const;

export const PROJECT_OFFICE_FOUNDATION = {
  size: [3.4, 0.11, 6.55] as const,
  position: [0, 0.055, 0] as const,
} as const;
