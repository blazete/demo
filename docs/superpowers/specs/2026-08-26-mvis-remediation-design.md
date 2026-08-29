# MVIS Vertical-Slice Remediation Design

## Purpose

Bring the existing React/React Three Fiber vertical slice into reliable compliance with the approved MVIS website specification, without redesigning its visual language or expanding it into a production backend.

## Scope

The remediation will:

1. Replace local stage timers and intervals with a deterministic XState v5 scenario machine.
2. Make pause, resume, skip, replay, and free-roam transitions real and cancellable.
3. Establish one train contract so scenario data, rendered coach IDs, defect locations, rail centreline, and camera focus agree.
4. Make the spring defect scenario data-driven rather than hard-coded to B4.
5. Delay evidence until defect focus completes and render a lightweight evidence gallery with the four specified evidence types.
6. Add a keyboard-controlled third-person/free-roam mode with safe camera orbit and no access to the active track.
7. Make control-room metrics visible, render night/weather differences, and make quality tiers meaningful.
8. Add a real accessible 2D walkthrough route/mode and make the existing live regions less noisy.
9. Add targeted unit tests and browser smoke coverage if approved development dependencies can be installed.

## Architecture

### Scenario state machine

The machine is the sole owner of scenario stage, pause state, selected scenario, active coach/component, defect discovery, evidence visibility, and reset/replay behavior. Scene components receive typed derived props. UI components send semantic events such as START, PAUSE, SKIP, EXPLORE, and REPLAY.

The initial implementation uses the existing stages: WELCOME, SITE_ARRIVAL, STANDBY, APPROACH, ACTIVATION, INSPECTION, DEFECT_FOCUS, EVIDENCE, EXIT, COMPLETE, and FREE_ROAM. It retains FALLBACK and RECOVERABLE_ERROR as explicit recovery paths.

### Train and inspection flow

The scenario will define the locomotive separately from the coach list. If coachCount is 18, the visual train will render exactly 18 coaches, with matching IDs. The track centreline will be aligned with the train centreline. The defect component ID will be generated from the selected defect location, never written as a literal B4 path.

Inspection advances by scenario clock. In a defect scenario it stops at the configured component, transitions to DEFECT_FOCUS, then EVIDENCE. In a clean scenario it completes the configured coach list and transitions to EXIT. The defect count remains zero until discovery.

### Interaction and accessibility

Guided mode keeps the cinematic camera. Free roam adds keyboard movement and a constrained orbit camera on permitted maintenance paths. The active track remains blocked. The accessible walkthrough is a DOM sequence using the same scenario data and evidence, and is selected from the welcome screen rather than starting the 3D scene.

### Visual systems

Quality settings control pixel ratio, shadows, and optional effects. Night changes the light rig; weather introduces an inexpensive overcast/haze treatment. Control-room screen values come from SiteMetrics. Audio remains a capability boundary: controls stay correct without audio assets, and the UI does not imply mute affects sounds that do not exist.

## Testing

- Build and type-check.
- Unit tests for state transitions, pause/skip/reset, defect identification, and train identifiers.
- Browser smoke test: welcome -> start -> activation -> defect -> evidence -> completion; plus clean scenario and 2D fallback.
- Desktop and mobile viewport checks.
- Runtime checks for console errors and visual overlap.

## Non-goals

- No live MVIS API or messaging integration.
- No real evidence files, audio production, GLB/CAD asset pipeline, or full physical site navigation.
- No visual redesign beyond corrections needed for legibility and the approved design language.

## Acceptance criteria

- The scenario is driven by XState and no longer relies on uncoordinated UI timers.
- Pause/resume, skip, replay, and free roam work visibly.
- Defect coach/component, rendered train, highlights, camera focus, and evidence all use the same data.
- Clean, defect, night, weather, and accessible walkthrough entries produce distinct expected states.
- Existing build passes; new targeted tests pass; browser smoke test is run when tooling is available.
