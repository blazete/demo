# MVIS Four-Track Drone and Playback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Replace the tree-heavy three-track scene with a four-track Indian Railways site using the supplied environment scan, realistic overhead wires, a drone camera, a named train, and controllable smooth playback.

**Architecture:** Keep guided inspection driven by the existing XState machine. Add a separate manual playback controller in the shell and pass its target position/speed into the world; drone mode uses orbit controls only when guided mode is off. Environment and catenary stay isolated in `Environment.tsx`, while supplied GLB loading stays in `LicensedRailwayAssets.tsx`.

**Tech Stack:** React 18, TypeScript, React Three Fiber, Three.js, Drei `OrbitControls`/`Text`/`useGLTF`, XState v5, Vitest, Vite, Playwright.

> **Correction implemented:** The supplied railway scene scan was removed from the runtime and generated asset bundle at the user's request. The `Shreyansh` tag was moved from the train to the character. OHE was rebuilt from Indian Railways/RDSO dimensions, and procedural rain plus Web Audio sound were added.

## Global Constraints

- Preserve the current guided defect-inspection journey and native Suspense fallbacks.
- Use metre-based coordinates, 1.676 m broad gauge, +Y up, and four parallel tracks.
- Keep the visitor-facing scene free of backend/storage implementation details.
- Hide trees from both procedural background elements and the supplied environment scan.
- Preserve CC BY attribution and update bundled asset documentation.

### Task 1: Normalize and register the environment scan

**Files:**
- Create: `public/assets/models/indian-railway-scene-scan.glb`
- Modify: `src/scene/assets/LicensedRailwayAssets.tsx`
- Modify: `public/assets/ATTRIBUTION.md`
- Modify: `public/assets/models/README.md`

- [x] Optimize the supplied root GLB with the existing glTF Transform command and write the derivative under `public/assets/models/`.
- [x] Add a `LicensedRailwayEnvironment` component that clones the scene, enables shadows, scales it to the track-site coordinates, and hides nodes/materials matching `tree|foliage|plant|banana|vegetation`.
- [x] Preload the model and preserve a null/native fallback if it fails.
- [x] Record the supplied Sketchfab source and derivative filename in attribution documentation.
- [x] Run `npm run build`.

### Task 2: Build the four-track site and catenary

**Files:**
- Modify: `src/scene/environment/Environment.tsx`
- Modify: `src/test/inspectionLayout.test.ts`

- [x] Define `TRACK_CENTERS = [0, -5.5, -11, -16.5]` and render one `Track` for each center.
- [x] Keep the MVIS inspection array on track 1 and place the other three tracks visibly parallel with matching sleepers, ballast and rail height.
- [x] Remove the procedural tree output from `BackgroundElements` while retaining useful non-tree site props.
- [x] Replace the single abstract traction wire with repeated catenary spans: poles at regular Z intervals, crossarms, insulators, messenger wires and contact wires centered over all four tracks.
- [x] Render the licensed scene scan behind/around the native track system without allowing its tree materials back into the scene.
- [x] Add tests for four track centers and the 1.676 m gauge invariant.

### Task 3: Add train identity and smooth manual playback

**Files:**
- Modify: `src/scene/train/Train.tsx`
- Modify: `src/scene/World.tsx`
- Modify: `src/app/ExperienceShell.tsx`
- Modify: `src/data/types/index.ts`

- [x] Add a `Text` label reading `Shreyansh` above the locomotive or first coach, with a dark railway-style badge and a small cyan accent.
- [x] Make train visual position follow a damped target ref rather than assigning the target directly each frame.
- [x] Keep guided mode’s machine target authoritative; apply manual playback only in drone/free-roam mode.
- [x] Add play/pause, reset, forward/reverse, speed step and timeline scrubber controls.
- [x] Ensure manual controls update immediately and never mutate the scenario machine’s inspection index.

### Task 4: Add drone camera mode and presets

**Files:**
- Create: `src/systems/camera/DroneCamera.tsx`
- Modify: `src/systems/camera/CameraDirector.tsx`
- Modify: `src/app/ExperienceShell.tsx`
- Modify: `src/ui/controls/Controls.tsx`
- Modify: `src/styles/globals.css`

- [x] Use Drei `OrbitControls` with damping, bounded polar angle, usable min/max distance and target centered on the MVIS array.
- [x] Add `drone` as a camera mode distinct from guided shots and third-person walking.
- [x] Add preset buttons for `Site`, `Top`, `Inspection`, and `Train side`; selecting a preset smoothly updates camera position and target.
- [x] Disable guided camera writes while drone mode is active and restore the previous guided shot on return.
- [x] Make the drone controls usable on desktop drag/scroll and mobile touch/pinch.
- [x] Add accessible labels and a visible active-mode indicator.

### Task 5: Verify behavior and visual quality

**Files:**
- Modify: `/private/tmp/mvis-redesign-smoke.mjs`
- Modify: `.planning/2026-08-26-mvis-threejs-website-specification/progress.md`
- Modify: `.planning/2026-08-26-mvis-threejs-website-specification/findings.md`

- [x] Run `npm test -- --run` and confirm all unit tests pass.
- [x] Run `npm run build` and record any non-blocking bundle warning.
- [x] Run the Playwright flow: load -> begin -> pause/resume -> drone mode -> preset change -> manual play/pause -> reset -> guided mode -> inspection -> defect focus.
- [x] Capture a desktop drone screenshot and check tree removal, four-track layout, catenary alignment, label readability, camera clipping and responsive controls.
- [x] Confirm no page errors, framework overlay or missing GLB requests.
- [x] Update the project progress/findings logs with exact results.
