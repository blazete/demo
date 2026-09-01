# MVIS Asset Transform Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose CAM-5's real upward-facing lens and relocate the portacabin completely outside the railway corridor with its long side parallel to the tracks.

**Architecture:** Move the approved physical transforms into one typed layout module so rendering and tests share the same values. Apply those constants to the existing GLB wrappers, then extend the asset visual-QA flow to capture close CAM-5 and elevated office-placement evidence.

**Tech Stack:** React 18, TypeScript 5.6, React Three Fiber 8, Drei, Three.js 0.169, Vitest, Playwright, Vite.

## Global Constraints

- Do not modify or replace either project-owner supplied GLB.
- Use the real `LineScanLens_Dome`, `LineScanLens_Body`, and `LineScanLens_TrimRing`; do not add a procedural substitute lens.
- CAM-5 source-local positive Z must map to world positive Y.
- Office position is `[15, 0, -5]`; office scale is `0.16`; office rotation around Y is `0`.
- The office foundation minimum world X must be greater than `12.5` m.
- The cabin and foundation long dimensions must remain parallel to world Z and the tracks.
- Preserve camera selection, POV, light switching, defect state, metrics, shadows, night lighting, mobile UI, train controls, audio, weather, and free roam.
- Preserve the untracked repository-root `line_scan_camera_enclosure.glb` source copy.

---

### Task 1: Centralize and test physical transforms

**Files:**
- Create: `src/scene/layout/siteAssetTransforms.ts`
- Create: `src/test/siteAssetTransforms.test.ts`

**Interfaces:**
- Produces: `CAM5_MODEL_TRANSFORM`, `PROJECT_OFFICE_TRANSFORM`, `PROJECT_OFFICE_FOUNDATION`, and `SITE_FENCE_X` constants.
- Consumed by: CAM-5 and project-office rendering components in Task 2.

- [x] **Step 1: Write the failing transform tests**

```ts
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
```

- [x] **Step 2: Run the focused test and verify it fails because the transform module does not exist**

Run: `npm test -- --run src/test/siteAssetTransforms.test.ts`

Expected: FAIL resolving `../scene/layout/siteAssetTransforms`.

- [x] **Step 3: Add the typed transform constants**

```ts
export const SITE_FENCE_X = 12;

export const CAM5_MODEL_TRANSFORM = {
  position: [0, 0.3, 0] as const,
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
```

- [x] **Step 4: Run the focused test and verify all three assertions pass**

Run: `npm test -- --run src/test/siteAssetTransforms.test.ts`

Expected: 1 test file and 3 tests pass.

- [x] **Step 5: Commit the tested transform contract**

```bash
git add src/scene/layout/siteAssetTransforms.ts src/test/siteAssetTransforms.test.ts
git commit -m "test: define MVIS asset placement invariants"
```

### Task 2: Correct CAM-5 and office rendering

**Files:**
- Modify: `src/scene/portal/LineScanCameraAssembly.tsx`
- Modify: `src/scene/control-room/ControlRoom.tsx`
- Modify: `src/data/equipment/equipmentRegistry.ts`
- Test: `src/test/siteAssetTransforms.test.ts`

**Interfaces:**
- Consumes: the four constants exported by `src/scene/layout/siteAssetTransforms.ts`.
- Preserves: `LineScanCameraAssembly` and `ControlRoom` public props.

- [x] **Step 1: Replace CAM-5's inline transform with the tested constant**

Import `CAM5_MODEL_TRANSFORM`, then render the loaded model with:

```tsx
<group
  rotation={[CAM5_MODEL_TRANSFORM.rotationX, 0, 0]}
  scale={CAM5_MODEL_TRANSFORM.scale}
  position={[...CAM5_MODEL_TRANSFORM.position]}
>
  <primitive object={prepared.model} />
</group>
```

This maps the real source-local positive-Z lens axis to world positive Y and lifts the dome and trim ring above the LED-strip plane.

- [x] **Step 2: Replace the office wrapper and foundation transforms with tested constants**

Import `PROJECT_OFFICE_TRANSFORM` and `PROJECT_OFFICE_FOUNDATION`. Render the outer group at `PROJECT_OFFICE_TRANSFORM.position` with Y rotation `PROJECT_OFFICE_TRANSFORM.rotationY`; render the GLB using `PROJECT_OFFICE_TRANSFORM.scale`; size and place the pad from `PROJECT_OFFICE_FOUNDATION`.

- [x] **Step 3: Move office information to the inward-facing long side**

Place the label at `[-1.52, 2.1, 0]`, metrics at `[-1.57, 1.45, 0]`, and exterior point light at `[-1.8, 2.45, 0]`. Rotate both `Text` and `Html` by `[0, -Math.PI / 2, 0]` so they face the negative-X service path.

- [x] **Step 3a: Tighten CAM-5's operator focus view**

Set CAM-5 `position` to `[0, 0.19, 0]` and `focusPosition` to `[1.45, 0.9, 1.4]` in the equipment registry so the Locate action clearly presents the real dome and trim ring.

- [x] **Step 4: Run focused tests and production compilation**

Run: `npm test -- --run src/test/siteAssetTransforms.test.ts src/test/lineScanAsset.test.ts src/test/projectOfficeAsset.test.ts`

Expected: 3 test files and 5 tests pass.

Run: `npm run build`

Expected: TypeScript and Vite exit 0; the existing large-chunk advisory may remain.

- [x] **Step 5: Commit the rendering correction**

```bash
git add src/scene/portal/LineScanCameraAssembly.tsx src/scene/control-room/ControlRoom.tsx src/data/equipment/equipmentRegistry.ts
git commit -m "fix: correct MVIS camera and office placement"
```

### Task 3: Add rendered placement verification and complete regression QA

**Files:**
- Modify: `scripts/asset-visual-qa.mjs`
- Modify: `.planning/2026-08-26-mvis-threejs-website-specification/findings.md`
- Modify: `.planning/2026-08-26-mvis-threejs-website-specification/progress.md`

**Interfaces:**
- Consumes: the running Vite app and existing accessible operator controls.
- Produces: `/private/tmp/mvis-corrected-cam5.png`, `/private/tmp/mvis-corrected-office.png`, and the existing night-headlight image.

- [x] **Step 1: Extend visual QA with CAM-5 and office screenshots**

After opening drone mode, use the existing Site Equipment menu to select CAM-5, wait for the equipment information panel, click its `Locate` action, and save `/private/tmp/mvis-corrected-cam5.png`. Return to Whole Site, choose the top preset, close overlays, and save `/private/tmp/mvis-corrected-office.png`. Retain the night train-side headlight capture and console-error collection.

- [x] **Step 2: Run the visual-QA script and inspect all three images**

Run: `node scripts/asset-visual-qa.mjs`

Expected: exit 0 with `{ "issues": [] }`. Visually confirm the named dome/trim lens is visible, the cabin is entirely outside the fence, and its long edge is parallel to the rails.

- [x] **Step 3: Run both browser regression flows**

Run: `MVIS_URL=http://127.0.0.1:5177/ node scripts/operator-smoke.mjs`

Run: `node /private/tmp/mvis-correction-smoke.mjs`

Expected: every check passes with empty `issues` and `failedRequests` arrays.

- [x] **Step 4: Run final complete verification**

Run: `npm test -- --run`

Expected: all test files pass, including the 3 new transform assertions.

Run: `npm run build`

Expected: exit 0.

Run: `git diff --check`

Expected: no output and exit 0.

- [x] **Step 5: Record verified results and commit QA changes**

Append the exact test counts and rendered findings to the planning files, then run:

```bash
git add scripts/asset-visual-qa.mjs \
  .planning/2026-08-26-mvis-threejs-website-specification/findings.md \
  .planning/2026-08-26-mvis-threejs-website-specification/progress.md \
  docs/superpowers/plans/2026-09-01-mvis-asset-transform-correction.md
git commit -m "test: verify corrected MVIS asset placement"
```

- [x] **Step 6: Confirm repository hygiene**

Run: `git status --short`

Expected: only the project-owner's pre-existing untracked root `line_scan_camera_enclosure.glb` remains; no build or screenshot artifacts are tracked.
