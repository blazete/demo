# MVIS Camera, Project Office and Headlights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the procedural CAM-5 and office models with the supplied GLBs and add realistic forward night illumination to the WAP-7 locomotive.

**Architecture:** Bundle optimized immutable GLB derivatives under `public/assets/models`, load them through focused R3F components using `useGLTF`, and preserve the existing operator/UI contracts. Named-node material clones drive CAM-5 lens and LED state; the office wraps a scaled portacabin model with the existing metrics UI; night headlights combine emissive housings, spotlights and transparent beam geometry.

**Tech Stack:** React 18, TypeScript 5.6, React Three Fiber 8, Drei `useGLTF`, Three.js 0.169, glTF Transform CLI, Vitest and Playwright.

## Global Constraints

- Do not modify source files in Downloads.
- Preserve CAM-5 selection, compact preview, full POV and light-toggle behavior.
- Keep the portacabin entirely beside the tracks at the existing project-office location.
- Preserve the operational metrics panel and project-office label.
- Day scenes must not render visible headlight beams.
- Do not push to GitHub unless explicitly requested.

---

### Task 1: Bundle and validate supplied assets

**Files:**
- Create: `public/assets/models/line-scan-camera-enclosure.glb`
- Create: `public/assets/models/mvis-project-office-portacabin.glb`
- Modify: `public/assets/models/README.md`
- Modify: `public/assets/ATTRIBUTION.md`

**Interfaces:**
- Produces stable URLs `/assets/models/line-scan-camera-enclosure.glb` and `/assets/models/mvis-project-office-portacabin.glb`.

- [x] Copy the verified 92 KB line-scan GLB to the bundled model directory.
- [x] Extract `source/Portacabin .glb` from the supplied ZIP into a temporary directory and optimize it to the bundled office URL.
- [x] Inspect both outputs and verify bounds, extension requirements and named CAM-5 nodes.
- [x] Record the models as user-supplied assets without asserting an unknown licence.

### Task 2: Replace procedural CAM-5 with the GLB

**Files:**
- Modify: `src/scene/portal/LineScanCameraAssembly.tsx`
- Create: `src/test/lineScanAsset.test.ts`

**Interfaces:**
- Preserves: `LineScanCameraAssembly({active, defect, lightsEnabled, selected, onSelect})`.
- Uses: `LineScanLens_Dome` and all `LEDStrip_*` nodes.

- [x] Add an asset-contract test that reads the bundled GLB and asserts the required lens and eight LED names are present.
- [x] Run the focused test and confirm failure before the bundled asset exists.
- [x] Implement a Suspense-loaded cloned GLB model with shadows and cloned mutable lens/LED materials.
- [x] Drive lens/LED emissive state from active, defect, lights and selected props.
- [x] Retain click selection, pointer cursor, marker and a compact procedural loading fallback.
- [x] Run the focused test and production build.

### Task 3: Replace the project-office shell

**Files:**
- Modify: `src/scene/control-room/ControlRoom.tsx`
- Create: `src/test/projectOfficeAsset.test.ts`

**Interfaces:**
- Preserves: `ControlRoom({metrics})` and its metrics display.
- Loads: `/assets/models/mvis-project-office-portacabin.glb`.

- [x] Add an asset-contract test that confirms the optimized office GLB exists and is non-empty.
- [x] Clone, centre and normalize the model to the approved project-office dimensions.
- [x] Keep world placement `[14, 0, -5]`, add a foundation pad and retain metrics/exterior lighting.
- [x] Replace the procedural building shell and add the `MVIS PROJECT OFFICE` label.
- [x] Run tests and build.

### Task 4: Add forward night headlight throw

**Files:**
- Modify: `src/scene/assets/LicensedRailwayAssets.tsx`
- Modify: `src/scene/train/Train.tsx` only if quality/night data needs forwarding.

**Interfaces:**
- Preserves: `LicensedLocomotive({night})`.
- Produces: twin night spotlights, local fill and visible beam cones aimed along negative Z.

- [x] Replace glow-only point lighting with two finite-distance spotlights targeting the track 50 m ahead.
- [x] Add subtle transparent beam cones with no depth writing and no daytime visibility.
- [x] Retain emissive lamp housings and short-range nose fill.
- [x] Verify TypeScript build and inspect night/day screenshots.

### Task 5: Rendered verification and handoff

**Files:**
- Modify: `scripts/operator-smoke.mjs` if asset-specific checks are needed.
- Modify: `.planning/2026-08-26-mvis-threejs-website-specification/findings.md`
- Modify: `.planning/2026-08-26-mvis-threejs-website-specification/progress.md`
- Modify: `.planning/2026-08-26-mvis-threejs-website-specification/task_plan.md`

**Interfaces:**
- Validates the exact completed implementation.

- [x] Run all Vitest tests and the production build.
- [x] Run operator and existing-feature Playwright smoke flows with no failed requests or console errors.
- [x] Capture and inspect CAM-5, project-office and night-headlight screenshots.
- [x] Correct scale, orientation, clipping, lighting or responsive regressions found visually.
- [x] Re-run verification after the final code change and update planning records.
- [x] Commit the implementation locally.
