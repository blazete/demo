import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('bundled CAM-5 line-scan asset', () => {
  it('contains the named lens and eight controllable LED strips', () => {
    const asset = readFileSync(resolve('public/assets/models/line-scan-camera-enclosure.glb'));
    const text = asset.toString('utf8');
    expect(text).toContain('LineScanLens_Dome');
    const ledNames = [...text.matchAll(/LEDStrip_(?:Left|Right)_[0-3]/g)].map(match => match[0]);
    expect(new Set(ledNames).size).toBe(8);
  });
});
