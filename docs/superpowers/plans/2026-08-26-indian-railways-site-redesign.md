# Indian Railways MVIS Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the portal gate with the approved open MVIS array, improve scene realism, add an Indian Railways field engineer and preserve the guided inspection flow.

**Architecture:** Split the visual redesign into reusable material, inspection-array, character and attribution modules. Keep procedural/native assets as the reliable default and expose optional GLB replacement paths for authenticated CC-BY Sketchfab downloads.

**Tech Stack:** React 18, TypeScript, React Three Fiber, Drei, Three.js, XState, Vitest, Playwright.

## Global Constraints

- No overhead gate, arch or connecting beam.
- Track gauge is 1.676 m.
- External Sketchfab assets require confirmed licence, attribution and an authenticated user-supplied download.
- Preserve existing state-machine behavior and accessible narrative.
- Reuse geometry/materials and keep mobile rendering practical.

---

### Task 1: Shared railway PBR materials

**Files:**
- Create: `src/scene/materials/railwayMaterials.ts`
- Test: `src/test/railwayMaterials.test.ts`

**Interfaces:**
- Produces: `createRailwayMaterialPalette(): RailwayMaterialPalette` and deterministic material/texture helpers.

- [ ] Write tests for material keys, PBR ranges and deterministic texture output.
- [ ] Run the focused test and confirm it fails.
- [ ] Implement shared steel, rail, concrete, ballast, paint, glass, rubber and emissive materials.
- [ ] Run the focused test and confirm it passes.

### Task 2: Open MVIS inspection array

**Files:**
- Replace: `src/scene/portal/Portal.tsx`
- Create: `src/scene/portal/inspectionLayout.ts`
- Test: `src/test/inspectionLayout.test.ts`

**Interfaces:**
- Produces: `INSPECTION_LAYOUT`, `InspectionArray`, camera/lamp/pit positions.
- Consumes: `RailwayMaterialPalette`, `PortalState`.

- [ ] Write layout tests for four cameras, eight lamps, six rail strips, one line scanner and no crossbeam.
- [ ] Run the focused test and confirm it fails.
- [ ] Implement independent poles, camera housings, lamps, line-scan pit, cabinets, cables and active coverage effects.
- [ ] Run the focused test and confirm it passes.

### Task 3: Indian field engineer

**Files:**
- Create: `src/scene/character/FieldEngineer.tsx`
- Modify: `src/scene/World.tsx`

**Interfaces:**
- Produces: `FieldEngineer({ active, qualityTier })`.
- Consumes: existing scenario state and quality tier.

- [ ] Implement a detailed native engineer with PPE, tablet and subtle procedural idle motion.
- [ ] Place the engineer outside the safety envelope and disable fine details on low quality.
- [ ] Verify silhouette, scale and camera visibility in the browser.

### Task 4: Indian railway environment and train materials

**Files:**
- Modify: `src/scene/environment/Environment.tsx`
- Modify: `src/scene/train/Train.tsx`
- Modify: `src/scene/effects/LightingRig.tsx`

**Interfaces:**
- Consumes: shared material palette and existing scene props.
- Produces: broad-gauge track bed, richer ballast, Indian LHB-style livery and daylight rig.

- [ ] Replace flat ground/track surfaces with layered ballast, concrete sleepers, polished rails and maintenance paths.
- [ ] Upgrade coach, bogie, wheel and underframe materials while preserving interaction IDs.
- [ ] Tighten outdoor shadows and practical inspection lighting.

### Task 5: Optional licensed model adapters and attribution

**Files:**
- Create: `src/scene/assets/OptionalLicensedModel.tsx`
- Create: `public/assets/ATTRIBUTION.md`
- Create: `public/assets/models/README.md`

**Interfaces:**
- Produces: optional GLB loading boundary with native fallback.
- Consumes: user-supplied optimized GLB files.

- [ ] Document exact expected filenames, normalization and attribution fields.
- [ ] Implement lazy optional loading without making missing files a runtime error.
- [ ] Record the selected Sketchfab source links and licence status.

### Task 6: Camera and copy alignment

**Files:**
- Modify: `src/systems/camera/CameraDirector.tsx`
- Modify: `src/ui/accessibility/AccessibleNarrative.tsx`
- Modify: `src/ui/fallback/AccessibleWalkthrough.tsx`

**Interfaces:**
- Produces: top/site, equipment, line-scanner and defect-focus views.

- [ ] Reframe guided shots around the open installation.
- [ ] Replace gate language with inspection-array language where user-visible.
- [ ] Verify safe camera movement and readable mobile framing.

### Task 7: Verification and visual fidelity

**Files:**
- Temporary only: Playwright script and screenshots under `/private/tmp`.

- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Run Playwright desktop and mobile flows: load, start, pause/resume, inspection, defect focus.
- [ ] Compare the latest screenshots with `public/reference/mvis-open-trackside-concept.png` and both engineering drawings.
- [ ] Fix visible gate remnants, topology errors, clipping, material drift and relevant console errors.
