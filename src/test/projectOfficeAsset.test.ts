import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('bundled MVIS project-office asset', () => {
  it('contains a non-empty optimized portacabin GLB', () => {
    const stat = statSync(resolve('public/assets/models/mvis-project-office-portacabin.glb'));
    expect(stat.size).toBeGreaterThan(100_000);
    expect(stat.size).toBeLessThan(3_500_000);
  });
});
