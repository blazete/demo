# MVIS Free-Roam, Equipment Inspection and Camera POV Design

## Purpose

Upgrade the Indian Railways MVIS digital twin into an official-demo operator experience. A visitor must be able to roam the complete four-track site, locate inspection equipment, understand how the system is triggered, and view simulated or future real media from every inspection camera.

## Approved Experience Direction

Use an Operator Digital Twin with three viewing modes:

1. **Site Explore** — unrestricted orbit, pan, zoom and keyboard movement across the full site.
2. **Equipment Focus** — smoothly focus a selected camera, lamp, sensor or cabinet while showing its information panel.
3. **Camera POV** — open a compact preview first, then optionally switch the main viewport into a full camera view.

The experience remains presentation-friendly for railway officials. Engineering overlays are available but not permanently shown.

## Navigation

### Site Explore

- Left drag or one-finger drag rotates around the site.
- Right drag or two-finger drag pans.
- Mouse wheel or pinch smoothly zooms between equipment detail and the entire four-track site.
- WASD pans across the site, Q/E changes altitude, and Shift increases movement speed.
- A Whole Site action restores a reliable overview.
- Preset transitions end after reaching their destination and do not continuously fight user input.
- Zoom limits support both close inspection and a complete OHE/site overview.

### Equipment Focus

- Selecting an item in the equipment menu moves the camera to a suitable inspection position.
- Selecting supported 3D equipment opens the same focus state through raycasting.
- The selected object receives a restrained highlight and floating identifier.
- The side panel provides name, type, location, purpose, specification, operational state and available actions.
- Back restores the camera position and target captured before focus.

### Camera POV

- CAM-1 through CAM-5 expose Preview and Open Full POV actions.
- Preview keeps the main site visible and opens a compact simulated feed.
- Full POV moves the main camera to the equipment's calibrated world position and viewing direction.
- Full POV includes camera identity, status, media state and Return to Site.
- Area-scan POVs use perspective rendering and a field-of-view overlay.
- CAM-5 uses a vertical under-track line-scan visualization with a narrow scan band and generated strip preview.

## Equipment Registry

All operator UI and scene selection use one typed registry rather than duplicated hard-coded labels.

### Cameras

- CAM-1: upper-left area scan, 6 mm lens.
- CAM-2: upper-right area scan, 6 mm lens.
- CAM-3: lower-left area scan, 12 mm lens.
- CAM-4: lower-right area scan, 12 mm lens.
- CAM-5: under-track line-scan camera.

Each camera includes world position, look target, preview position, field of view, purpose, mounting description, media configuration and current simulated status.

### Lighting

- LED-1L through LED-4L.
- LED-1R through LED-4R.
- Six under-track LED strips grouped as Track LED Array.

Lighting can be switched globally or per group. Scene emissive intensity and coverage lighting react to state. Controls remain operable in standby for demonstration purposes.

### Detection and Relay

Because the supplied drawings do not label relay sensors, the demo presents them as a proposed trigger subsystem:

- Entry axle/approach sensor before the inspection zone.
- Exit axle/approach sensor after the inspection zone.
- Relay cabinet beside the inspection equipment.
- Inspection trigger zone spanning the camera array.

The interaction panel explains the event chain:

`Entry sensor → relay cabinet → cameras and lights activate → train inspection → exit sensor → recording closes → standby`

Sensor visualization can be switched on/off and manually triggered to demonstrate the sequence.

## Menu and Panel Design

A Site Equipment button opens a responsive drawer with Cameras, Lighting, Detection and Control Equipment sections. Each item shows status and offers appropriate actions:

- Locate
- Preview
- Full POV
- Toggle
- Show coverage
- Trigger simulation

The detail panel appears beside the preview on desktop and as a bottom sheet on mobile. The 3D canvas remains visible whenever the compact preview is used.

## Future Real Media Contract

Each camera supports optional media fields:

```ts
type CameraMedia = {
  mediaType: 'simulation' | 'image' | 'video';
  previewImage?: string;
  posterImage?: string;
  videoUrl?: string;
  alt: string;
};
```

Initial records use `simulation`. The UI explicitly says “Simulated Camera POV — Real footage pending.” When media URLs are later provided, the same component renders an image or muted inline video. A failed or missing asset falls back to the simulated 3D view and reports the fallback state without breaking navigation.

## State and Component Boundaries

- `equipmentRegistry.ts` owns equipment definitions and camera calibration.
- `OperatorCameraController.tsx` owns explore, focus and POV camera behavior.
- `EquipmentInteractionContext` or shell-owned state tracks selected equipment, preview visibility, POV mode and toggles.
- `EquipmentMenu.tsx` renders discovery and selection controls.
- `EquipmentInspector.tsx` renders information and compact POV/media.
- Scene components receive selection and toggle state through focused props.
- Trigger sensors and relay equipment live in a dedicated scene component.

The guided cinematic state machine remains independent. Entering operator mode pauses guided camera ownership; leaving operator mode restores the guide without corrupting the scenario.

## Visual Behavior

- Selected equipment uses a cyan outline/glow; active alarms use amber/red only when meaningful.
- Camera coverage cones are hidden by default and enabled from Engineering Details.
- Sensor beams use thin amber lines and a short pulse during manual trigger simulation.
- POV overlays use railway-style identifiers, simulated timestamps, camera health and lens labels.
- UI avoids backend, cloud or AI architecture language during the official demonstration.

## Error Handling

- Missing media falls back to simulated POV.
- Invalid equipment IDs clear selection and return to Site Explore.
- Camera transitions clamp distance and target to safe site bounds.
- Escape exits full POV or closes the topmost panel.
- Reset View remains available even if pointer or keyboard interaction is interrupted.

## Accessibility

- All menu items and actions are keyboard reachable.
- Equipment status and selection changes are announced through an ARIA live region.
- Preview media includes meaningful alternative text.
- Camera movement respects reduced-motion preferences by using immediate transitions.
- Controls include text labels and do not rely only on color or icons.

## Verification

Automated and browser checks must cover:

- Registry contains CAM-1 through CAM-5 with unique IDs and valid positions.
- Explore mode allows orbit, pan, zoom and reset without preset snap-back.
- Each camera opens preview and full POV, then returns to the captured site view.
- CAM-5 displays the line-scan-specific treatment.
- Future image/video configuration falls back safely when absent.
- Lighting toggles change scene output and UI status.
- Entry/exit sensors and relay cabinet are present, selectable and trigger the demo sequence.
- Desktop and mobile panels fit the viewport.
- Existing train playback, horn, rain, guided flow and evidence behavior remain operational.
- Production build, unit tests and browser console/request checks pass.

## Scope Boundaries

This phase does not ingest actual railway footage, implement backend streaming, or claim surveyed relay-sensor coordinates. It provides the UI/data contract and clearly labelled simulated feeds so real media and verified field coordinates can be added later.
