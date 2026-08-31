# MVIS Asset Transform Correction Design

## Purpose

Correct two visible placement defects in the official-demo scene without modifying or replacing the project-owner supplied GLBs:

1. CAM-5 currently presents as a block because its real lens is rotated downward into the inspection pit.
2. The portacabin is oriented laterally and visually occupies a railway line instead of the trackside office area.

## Confirmed Causes

The CAM-5 GLB's `LineScanLens_Dome`, `LineScanLens_Body`, and `LineScanLens_TrimRing` point along source-local positive Z. The runtime wrapper currently rotates the model positive 90 degrees around X, mapping that optical axis downward. The supplied lens geometry is present; no replacement lens is required.

The portacabin is approximately 2.85 m wide by 6.08 m long after runtime scaling. Its negative 90-degree Y wrapper maps the long dimension across the railway corridor. The model should retain its source orientation so its long dimension follows the railway tracks.

## Approved Correction

### CAM-5

- Rotate the loaded enclosure negative 90 degrees around X so source positive Z maps to world positive Y.
- Keep the camera centred at the broad-gauge inspection location.
- Use inner model offset `[0, 0.22, 0]`. Combined with CAM-5's outer y=-0.08 position, this leaves the enclosure body protected below the inspection surface while bringing its lens region into the visible strip opening.
- Continue using the named GLB meshes for lens animation and lighting state. Do not add a fake procedural lens.
- Preserve equipment selection, marker, simulated POV, light switching, defect colour, shadows, and Suspense fallback behavior.

### Project office

- Remove the cabin wrapper's Y-axis quarter turn.
- Place the office at `[15, 0, -5]`, beyond the x=12 perimeter fence.
- Keep the 6.08 m dimension parallel to world Z and the railway tracks.
- Keep the complete cabin footprint and foundation outside the fence and every track corridor.
- Put the project-office label, metrics display, and exterior lamp on the cabin's inward-facing negative-X long side, facing the service path.
- Preserve the supplied materials, metre-scale normalization, shadows, metrics, and night lighting.

## Safety Invariants

- Active track centre: x=0; parallel track centres: x=-5.5, -11, and -16.5.
- Perimeter fence on the project-office side: x=12.
- The office foundation's minimum world X must be greater than 12.5 m, providing visible fence clearance.
- CAM-5's named lens dome must have a world-space centre above its housing body after the runtime transform.
- No other portal, train, camera POV, free-roam, audio, weather, or mobile behavior changes are in scope.

## Verification

- Add transform tests for optical-axis orientation and office/fence clearance.
- Run the complete Vitest suite and production build.
- Capture a close CAM-5 image that visibly shows the real dome/trim geometry.
- Capture a top or elevated site image proving the entire portacabin and foundation sit outside the fence and run parallel to the tracks.
- Re-run the operator and existing-feature browser smoke flows with no failed requests, console errors, or framework overlay.

## Acceptance Criteria

- CAM-5 visibly reads as a camera enclosure with an upward-facing lens, not a plain block.
- The project office does not touch or cover any rail, sleeper, ballast bed, inspection equipment, or perimeter fence.
- The office's long side is parallel to the rails.
- Existing interactive controls and responsive layouts continue to pass their regression checks.
