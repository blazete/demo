# MVIS Line-Scan GLB and Night Headlight Design

## Objective

Replace the procedural CAM-5 line-scan enclosure with the user-created `line_scan_camera_enclosure.glb` while preserving the complete operator interaction contract. Improve the WAP-7 night headlights so they visibly illuminate the railway ahead instead of only glowing around the locomotive.

## Source Asset Findings

- Source file: `/Users/shreyanshmalviya/Downloads/line_scan_camera_enclosure.glb`
- Size: approximately 92 KB.
- Bounds: approximately 0.95 m × 1.30 m × 0.38 m.
- No animations or required GLTF extensions.
- The project-root copy has the same SHA-256 hash as the Downloads source.
- The asset contains concrete surround, enclosure walls, camera housing, lens assembly and eight LED-strip meshes.
- Required named lens node: `LineScanLens_Dome`.
- Other useful nodes include `LineScanLens_Body`, `LineScanLens_TrimRing`, `CameraHousing_Body`, `CameraHousing_LensCollar`, `LEDStrip_Left_0` through `LEDStrip_Left_3`, and `LEDStrip_Right_0` through `LEDStrip_Right_3`.

## CAM-5 Integration

### Asset Location and Loading

- Bundle the verified GLB as `public/assets/models/line-scan-camera-enclosure.glb`.
- Load it with Drei `useGLTF`, which uses Three.js `GLTFLoader` while matching the application’s React Three Fiber lifecycle and Suspense architecture.
- Preload the URL after component declaration.
- Do not retain duplicate procedural enclosure geometry after the model loads.

### Scene Preparation

- Clone the loaded scene before mutating materials or visibility.
- Enable cast and receive shadows on mesh descendants.
- Compute bounds and derive a stable transform that aligns the enclosure with `INSPECTION_LAYOUT.lineScanner.position`.
- Preserve the model’s real-world scale when it matches the drawing; apply only the rotation and centre offset needed for the site coordinate system.
- Keep the optical axis vertical toward the train underside.

### Named-Node Behavior

- Resolve `LineScanLens_Dome` with `getObjectByName`.
- Clone the lens material before changing emissive, color or opacity properties so the cached GLB remains immutable.
- Standby: subtle cyan lens glow.
- Active inspection: brighter cyan pulse.
- Defect detected: controlled red pulse.
- Selected equipment: cyan highlight coordinated with the existing equipment marker.
- Resolve every node whose name starts with `LEDStrip_` and clone its material.
- Connect LED emissive intensity to the existing global light switch and portal active/defect state.

### Existing Behavior to Preserve

- Clicking any visible part of the model selects CAM-5.
- Pointer cursor indicates selection affordance.
- The CAM-5 equipment inspector, simulated compact preview and full line-scan POV remain unchanged.
- The selected equipment marker remains visible without obstructing the enclosure.
- The model remains compatible with coverage overlays, guided inspection and operator mode.

### Loading and Failure State

- Wrap the GLB component in Suspense.
- Show a compact procedural camera/pit silhouette while loading.
- If the bundled asset cannot be requested, the application must remain navigable and report the failure through existing browser diagnostics; production verification rejects failed asset requests.

## WAP-7 Night Headlights

### Lighting Layout

- Retain the two visible warm-white emissive lamp housings at the locomotive front.
- Add two forward-facing spotlights aligned with the locomotive’s negative-Z travel-facing end.
- Aim each spotlight slightly inward and down toward the rail centre approximately 45–60 m ahead.
- Use a soft penumbra, physically plausible inverse-square decay and finite distance.
- Add restrained short-range point fill near each lamp so the locomotive nose is readable.

### Beam Visibility

- Render subtle transparent cones from each lamp during night scenes to communicate direction and range.
- Beam cones must use additive or transparent blending, disable depth writing and avoid opaque geometry.
- Keep the cone intensity low enough that rails and ballast remain visible through it.
- Beam cones and spotlights are absent during daytime; only a low emissive housing glow remains.

### Performance and Quality

- Reuse geometries and materials between the two beams where practical.
- Shadow casting from headlights is optional and disabled by default to avoid unnecessary GPU cost.
- The headlight effect must work on balanced and high quality. Low quality may omit visible beam cones while retaining forward spotlights if profiling requires it.

## Verification

- Confirm the production bundle serves the GLB from the expected URL with no failed request.
- Confirm `LineScanLens_Dome` and all eight `LEDStrip_*` nodes are found.
- Verify CAM-5 click selection, compact preview and full POV.
- Verify global light off/on changes the GLB LED strips.
- Verify active and defect states change the lens/LED pulse without mutating cached shared materials.
- Verify the model is correctly centred, vertically oriented and not duplicated with the procedural enclosure.
- Verify night headlights illuminate rails and sleepers ahead from inspection, train-side and site views.
- Verify day scenes do not show visible beam cones.
- Run unit tests, production build, operator browser smoke and existing regression smoke.
- Record desktop screenshots of CAM-5 and the night headlight throw.

## Scope Boundaries

- This change does not remodel or alter the source GLB.
- It does not add actual CAM-5 railway footage.
- It does not change camera calibration records or the equipment-menu media contract.
- It does not push changes to GitHub until explicitly requested.
