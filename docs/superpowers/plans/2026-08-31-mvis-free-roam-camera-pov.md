# MVIS Free-Roam and Camera POV Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an official-demo operator mode with unrestricted site exploration, selectable MVIS equipment, compact and full-screen camera POVs, future media hooks, trigger sensors, relay visualization and working light controls.

**Architecture:** A typed equipment registry is the source of truth for menu labels, camera calibration and future media. Shell-owned operator state coordinates focused equipment, preview/POV mode and subsystem toggles; focused scene components render physical feedback while one camera controller exclusively owns explore/focus/POV movement.

**Tech Stack:** React 18, TypeScript 5.6, React Three Fiber 8, Drei OrbitControls/Html, Three.js 0.169, Vitest and Playwright.

## Global Constraints

- Preserve the guided XState flow, train playback, horn, weather, evidence and current model assets.
- CAM-1/CAM-2 are 6 mm upper area-scan cameras; CAM-3/CAM-4 are 12 mm lower area-scan cameras; CAM-5 is an under-track line-scan camera.
- Real footage is not bundled in this phase; every camera uses an explicit simulated-feed fallback and a future image/video media contract.
- Relay/axle sensors are labelled as proposed trigger equipment because their surveyed positions are not present in the supplied drawings.
- No new runtime dependency is required.

---

### Task 1: Typed equipment registry

**Files:**
- Create: `src/data/equipment/equipmentRegistry.ts`
- Create: `src/test/equipmentRegistry.test.ts`
- Modify: `src/scene/portal/inspectionLayout.ts`

**Interfaces:**
- Produces: `EquipmentId`, `EquipmentDefinition`, `CameraEquipment`, `EQUIPMENT_REGISTRY`, `CAMERA_EQUIPMENT`, `getEquipment(id)`.
- Camera records expose `position`, `lookTarget`, `focusPosition`, `fov`, `lens`, `media`, `category` and `capabilities`.

- [x] Write tests asserting five unique camera IDs, lens assignments, valid finite vectors, simulation media fallback, eight side lamps, one track-light group, two sensors and one relay cabinet.
- [x] Run `npm test -- --run src/test/equipmentRegistry.test.ts` and confirm failure because the registry does not exist.
- [x] Implement immutable typed registry entries derived from `INSPECTION_LAYOUT` positions, including future media fields:

```ts
export type CameraMedia = {
  mediaType: 'simulation' | 'image' | 'video';
  previewImage?: string;
  posterImage?: string;
  videoUrl?: string;
  alt: string;
};
```

- [x] Run the registry test and confirm it passes.

### Task 2: Operator camera controller

**Files:**
- Create: `src/systems/camera/OperatorCameraController.tsx`
- Create: `src/systems/camera/operatorCameraState.ts`
- Create: `src/test/operatorCameraState.test.ts`
- Modify: `src/scene/World.tsx`
- Modify: `src/systems/camera/DroneCamera.tsx`

**Interfaces:**
- Consumes: selected `EquipmentDefinition`, operator mode `'explore' | 'focus' | 'pov'`, reset token and POV exit callback.
- Produces: exclusive camera ownership with captured/restored `{position, target}` view state.

- [x] Write pure-state tests for safe target clamping, camera mode transitions and restoration of the captured explore view.
- [x] Run the focused test and verify failure.
- [x] Implement `OperatorCameraController` with damped OrbitControls, `minDistance=0.8`, `maxDistance=140`, pan/zoom/rotation, WASD/QE movement, Shift boost, Home reset and Escape exit.
- [x] Stop continuous preset lerping after transition completion so manual zoom/pan is retained.
- [x] Give POV mode the selected camera position/look target/FOV and disable orbit input until Return to Site.
- [x] Replace DroneCamera ownership in `World` with the operator controller while keeping legacy preset buttons mapped to operator overview targets.
- [x] Run focused tests and the TypeScript build.

### Task 3: Selectable cameras, lights, sensors and relay scene

**Files:**
- Create: `src/scene/sensors/TriggerSensorSystem.tsx`
- Create: `src/scene/selection/EquipmentMarker.tsx`
- Modify: `src/scene/portal/Portal.tsx`
- Modify: `src/scene/portal/LineScanCameraAssembly.tsx`
- Modify: `src/scene/World.tsx`

**Interfaces:**
- Consumes: `selectedEquipmentId`, `lightsEnabled`, `sensorsEnabled`, `coverageEnabled`, `sensorPulse`, `onEquipmentSelect`.
- Produces: raycastable scene equipment and visual operational feedback.

- [x] Add named click targets to CAM-1 through CAM-4, CAM-5, lamp groups and line-scan assembly with pointer cursor behavior and event propagation stopped.
- [x] Render proposed entry/exit rail sensors, relay cabinet, thin trigger beams and a short sensor pulse animation.
- [x] Add selected cyan marker/label and optional camera coverage volumes.
- [x] Connect global/group lighting state to lamp and line-scan LED emissive intensity.
- [x] Verify click selection from a running browser and confirm the train click behavior remains isolated.

### Task 4: Equipment menu and compact preview

**Files:**
- Create: `src/ui/operator/EquipmentMenu.tsx`
- Create: `src/ui/operator/EquipmentInspector.tsx`
- Create: `src/ui/operator/CameraPreview.tsx`
- Modify: `src/styles/globals.css`
- Modify: `src/app/ExperienceShell.tsx`

**Interfaces:**
- Consumes: registry, selected item, operator mode, lighting/sensor/coverage state and media records.
- Produces: locate, preview, full POV, return, toggle, trigger and engineering-detail actions.

- [x] Add shell-owned `operatorState` containing menu state, selected ID, preview visibility, mode, reset token and subsystem toggles.
- [x] Render a searchable/category-grouped Site Equipment drawer with accessible buttons and current status.
- [x] Render a compact desktop side card/mobile bottom sheet with specifications, purpose, status and actions.
- [x] Render simulated POV using a clear 3D-camera schematic for area cameras and a narrow generated strip for CAM-5.
- [x] Support future `<img>` and muted `<video>` rendering from media configuration; handle media errors by returning to simulation.
- [x] Add Full POV and Return to Site controls, Escape handling and ARIA live selection announcements.
- [x] Add responsive styles that preserve canvas visibility and do not overlap the existing HUD/control panels.

### Task 5: Lighting, sensor and POV overlays

**Files:**
- Create: `src/ui/operator/CameraPovOverlay.tsx`
- Modify: `src/ui/controls/Controls.tsx`
- Modify: `src/app/ExperienceShell.tsx`
- Modify: `src/styles/globals.css`

**Interfaces:**
- Consumes: selected camera, operator mode and status toggles.
- Produces: full POV railway overlay, Whole Site action and stable operator-mode entry.

- [x] Rename the DRONE action to EXPLORE while preserving its accessible backward-compatible intent.
- [x] Add Whole Site and Site Equipment actions.
- [x] Add full POV overlay with camera ID, lens/type, simulated timestamp, LIVE/SIMULATION status, scan reticle and Return to Site.
- [x] Give CAM-5 a line-scan-specific strip overlay and direction indicator.
- [x] Connect global light toggle, sensor visibility, coverage visibility and trigger simulation to scene props.

### Task 6: Regression and browser verification

**Files:**
- Create: `scripts/operator-smoke.mjs`
- Modify: `.planning/2026-08-26-mvis-threejs-website-specification/progress.md`

**Interfaces:**
- Validates the complete implementation and existing flows.

- [x] Run `npm test -- --run` and require all tests to pass.
- [x] Run `npm run build` and require TypeScript/Vite success.
- [x] Run the operator browser smoke flow: begin inspection, open Explore, open equipment menu, preview CAM-1, enter/exit full POV, preview CAM-5, toggle lights, trigger sensors, reset Whole Site, zoom, and verify mobile panel fit.
- [x] Check no failed requests, page errors, framework overlay or unexpected console errors.
- [x] Run the existing correction smoke flow to protect train controls, horn, rain, mobile layout and guided scenario behavior.
- [x] Record final test evidence and remaining performance advisory in progress.md.
