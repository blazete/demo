# MVIS Vertical-Slice Remediation Implementation Plan

> **For agentic workers:** Execute task-by-task with verification checkpoints. Preserve the existing visual direction and do not add live MVIS infrastructure.

**Goal:** Bring the current React/R3F vertical slice into reliable compliance with the approved MVIS specification.

**Architecture:** Make one XState v5 machine authoritative for stage, pause, replay, defect discovery, evidence, and free-roam transitions. Keep scene systems data-driven and keep the DOM UI/fallback derived from the same validated scenario context.

**Tech Stack:** Vite, React, TypeScript, Three.js, React Three Fiber, Drei, XState v5, Vitest, and an approved browser runner.

## Global Constraints

- Preserve guided cinematic inspection followed by optional third-person free roam.
- Keep first-person mode absent and active-track areas inaccessible.
- Use scenario data for coach IDs, component IDs, defects, evidence, timestamps, and mode labels.
- Keep databases, MQTT, cloud storage, AI internals, and infrastructure topology out of visitor UI.
- Keep an accessible DOM equivalent for essential 3D information.
- Evidence becomes visible only after defect focus completes.
- Run npm run build after TypeScript or build configuration changes.
- Do not modify unrelated untracked files.

## File map

### Create

- src/experience/machine/scenarioMachine.ts — XState v5 state machine.
- src/experience/machine/scenarioMachine.test.ts — machine transition tests.
- src/systems/character/ThirdPersonController.tsx — safe free-roam controller.
- src/ui/fallback/AccessibleWalkthrough.tsx — DOM-only fallback journey.
- src/ui/evidence/EvidenceGallery.tsx — four evidence types.
- src/systems/quality/QualityManager.ts — quality policy and hysteresis.
- src/systems/audio/AudioManager.tsx — user-gated audio boundary.
- src/test/dataConsistency.test.ts — train/coach/defect consistency tests.

### Modify

- package.json and package-lock.json — XState and approved test tooling.
- src/data/types/index.ts and src/data/mock/scenarios.ts — coherent train and scenario contracts.
- src/app/ExperienceShell.tsx — machine integration, controls, timing, cleanup.
- src/scene/World.tsx and src/scene/train/Train.tsx — data-driven train and context.
- src/scene/portal/Portal.tsx — independent lights and deterministic scan.
- src/scene/environment/Environment.tsx — deterministic props and safe paths.
- src/scene/effects/LightingRig.tsx — weather and quality behavior.
- src/systems/camera/CameraDirector.tsx — defect-focus and free-roam camera.
- src/scene/control-room/ControlRoom.tsx — visible SiteMetrics.
- UI controls, evidence, HUD, accessibility, and global styles — real state, evidence, fallback, and responsive behavior.

## Task 1: Install and prove the state-machine foundation

**Files:** Create scenarioMachine.ts and scenarioMachine.test.ts; modify package.json and package-lock.json.

**Produces:** createScenarioMachine(initialScenario) and semantic events START, PAUSE, RESUME, SKIP, DEFECT_FOUND, EVIDENCE_READY, EXPLORE, RETURN_TO_GUIDE, REPLAY, OPEN_FALLBACK, and RESET.

- [ ] Add XState v5 with npm install xstate@^5; keep lockfile changes scoped.
- [ ] Write tests for start, pause/resume, skip, defect-focus ordering, replay reset, and clean completion.
- [ ] Implement setup with typed context/events/input and cancellable stage actors.
- [ ] Run npm test -- --run src/experience/machine/scenarioMachine.test.ts; expected: all pass.
- [ ] Run npm run build; expected: pass.

## Task 2: Integrate the machine and make controls real

**Files:** Modify ExperienceShell.tsx, Controls.tsx, HUD.tsx, and CompletionSummary.tsx.

**Produces:** machine-derived ScenarioContext and InspectionProgress plus real pause, resume, skip, replay, explore, and return callbacks.

- [ ] Remove shell stage timers and the inspection interval as authoritative logic.
- [ ] Start the machine from the selected scenario and derive state with selectors.
- [ ] Pause scenario time, train, camera, effects, and audio; resume from the same state.
- [ ] Keep defect count zero until DEFECT_FOUND.
- [ ] Show evidence only after defect-focus completion.
- [ ] Add tests for pause state preservation and replay cleanup.
- [ ] Run npm run build; expected: pass.

## Task 3: Correct data, train, rail, and defect alignment

**Files:** Modify data types, mock scenarios, Train.tsx, and World.tsx; create dataConsistency.test.ts.

**Produces:** CoachRecord list with exact count and getComponentId(location) for stable defect paths.

- [ ] Write tests for exact coach counts, unique IDs, defect coach existence, and generated component IDs.
- [ ] Separate locomotive from the coach list and make the 18-coach scenario consistent.
- [ ] Use one track-centre constant for rails, train, portal, wheels, and camera anchors.
- [ ] Render coach records rather than synthesizing B1–B18 independently.
- [ ] Replace literal B4 highlighting with the selected defect location.
- [ ] Run data tests and npm run build; expected: pass.

## Task 4: Repair camera, portal, deterministic scene, and inspection flow

**Files:** Modify World.tsx, CameraDirector.tsx, Portal.tsx, Train.tsx, and Environment.tsx.

- [ ] Map DEFECT_FOCUS to the dedicated defect-focus shot and actual component anchor.
- [ ] Use independent refs or a parent emissive group for portal light strips.
- [ ] Drive scan motion from pausable scenario time and reset it on replay.
- [ ] Replace render-time Math.random() with seeded or module-stable environment placement.
- [ ] Verify replay clears highlights, scan planes, portal state, audio, and transient camera state.
- [ ] Run npm run build; expected: pass.

## Task 5: Implement safe third-person free roam

**Files:** Create ThirdPersonController.tsx; modify World.tsx, CameraDirector.tsx, Controls.tsx, AccessibleNarrative.tsx, and globals.css.

**Produces:** ThirdPersonController with enabled, speed, bounds, exclusionZones, and onInspect inputs.

- [ ] Test pure movement helpers for W/A/S/D and active-track clamping.
- [ ] Implement refs-based keyboard input with listener cleanup, bounded maintenance-path movement, and no jump/FPS mode.
- [ ] Activate the controller on Explore and restore guided camera on Return to guide.
- [ ] Pass onComponentInspect from ExperienceShell through World to Train.
- [ ] Add visible focus/proximity states and DOM alternatives.
- [ ] Run movement tests and npm run build; expected: pass.

## Task 6: Add evidence, fallback, dashboard, weather, and quality behavior

**Files:** Create EvidenceGallery.tsx, AccessibleWalkthrough.tsx, and QualityManager.ts; modify evidence/UI/lighting/world files.

- [ ] Test and implement inspection image, inspection snapshot, defect snapshot, and report tabs with alt text, thumbnails, zoom, missing-media state, and simulated label.
- [ ] Make Welcome’s accessible walkthrough open the DOM fallback, not 3D.
- [ ] Render all four SiteMetrics values in control-room screens and accessible markup.
- [ ] Make overcast visibly alter sky/fog/exposure and add low-cost haze/rain only at supported tiers; keep night distinct.
- [ ] Make quality tiers control pixel ratio, shadows, particles, rain/haze, and post-processing with downgrade hysteresis.
- [ ] Run focused tests and npm run build; expected: pass.

## Task 7: Add audio boundary, accessibility, and responsive polish

**Files:** Create AudioManager.tsx; modify ExperienceShell.tsx, Controls.tsx, AccessibleNarrative.tsx, and globals.css.

- [ ] Add tests for caption toggles, coalesced announcements, keyboard focus, and fallback navigation.
- [ ] Start audio only after Begin inspection; if files are absent, retain visual/caption cues without misleading mute behavior.
- [ ] Use polite stage announcements and concise defect/evidence alerts.
- [ ] Add mobile bottom sheets, safe touch targets, responsive evidence panels, reduced-motion substitutions, and focus styles.
- [ ] Run npm run build; expected: pass.

## Task 8: Browser and performance verification

**Files:** Create tests/mvis-smoke.spec.ts only after an approved browser runner is available; modify package files only for approved tooling.

- [ ] Use the in-app Browser when available; otherwise ask before installing Playwright.
- [ ] Test welcome, defect scenario, activation, defect focus, evidence, completion, clean scenario, fallback, and one mobile viewport.
- [ ] Assert title, nonblank content, no framework overlay, no relevant console errors, and visible state changes.
- [ ] Run production preview performance checks and record load, frame rate, and replay memory behavior.
- [ ] Run npm test and npm run build; report browser-tool limitations separately from app failures.

## Final handoff checklist

- [x] XState machine exists and is imported by ExperienceShell.
- [x] No local stage timer/inspection interval remains the authoritative scenario controller.
- [x] Controls visibly pause, resume, skip, replay, explore, and open fallback paths in source wiring.
- [x] Train, defect, highlight, evidence, and camera use the corrected data contract.
- [x] Build and unit tests pass.
- [ ] Browser smoke result and remaining risks are documented.

## Execution status

- Task 1 complete: XState dependency, machine, and four machine tests.
- Task 2 complete: shell integration, pause/resume/skip/replay events, and evidence gating.
- Task 3 complete: coach records, stable component IDs, exact counts, rail-centre alignment, and two data tests.
- Task 4 complete: dedicated defect shot selection, independent portal strip animation, pausable scan, deterministic environment, and portal reset on skip.
- Task 5 partial: safe keyboard free roam and return-to-guide control exist; pointer/touch look and component selection card remain.
- Task 6 partial: evidence gallery, DOM walkthrough, dashboard metrics, and weather distinction exist; adaptive quality manager and full asset-loading strategy remain.
- Task 7 pending: audio assets/manager, full responsive polish, and final accessibility QA remain.
- Task 8 partial: build, unit tests, and HTTP smoke pass; rendered browser smoke is blocked because no browser runner is installed/available.
