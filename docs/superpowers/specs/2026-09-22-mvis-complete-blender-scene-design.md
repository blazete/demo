# MVIS Complete Blender Demonstration Scene Design

## Purpose

Create a polished Blender demonstration of the complete MVIS installation at Hazrat Nizamuddin Station. The scene must explain the above-ground railway arrangement, the MVIS inspection hardware, and the below-ground foundations and cable route shown in `DRAWING FOR NZM MVIS INSTALLATION.pdf`.

The result is a presentation and visualization asset. Dimensions explicitly shown in the PDF are modeled at engineering scale; missing site-survey and fabrication dimensions remain editable and must not be represented as construction-certified measurements.

## Visual approach

Use a hybrid technical-cinematic approach. Geometry and spacing follow the general arrangement drawing, while materials, lighting, trains, station context, scanning effects, and camera movement make the installation understandable to a nontechnical audience.

Blender units use metres with 1 mm = 0.001 m. The world axes are:

- X: direction of train travel and track length.
- Y: cross-track direction.
- Z: elevation.

## Railway formation

Build a 120 m long railway corridor with three parallel broad-gauge tracks. Use 4.9 m between the first and second track centres and 7.2 m between the second and third track centres, matching the dimension strings visible in the general arrangement drawing.

Each track includes:

- Two steel rails at Indian broad gauge.
- Repeated concrete sleepers using linked instances.
- Fasteners represented at presentation detail.
- A shaped ballast shoulder.
- A 450 mm ballast layer.
- A 600 mm sub-ballast or blanket layer.
- Prepared earthwork extending to the 1.5 m reference depth shown in the section.

The ground is modeled as separate layers so the cross-section camera can reveal the foundations and cable route. Above-ground cinematic views use an intact terrain surface.

## Trains

Place three Indian railway train consists, one on each track, using the existing project assets:

- `public/assets/models/indian-wap7-locomotive.glb`
- `public/assets/models/indian-lhb-coach.glb`
- `public/assets/models/indian-lhb-generator-car.glb`

Use linked duplicates for repeated coaches. One foreground consist moves through the inspection zone during the main animation. The other two trains provide the three-track arrangement shown in the drawing and move more slowly or remain staged to keep the scene readable.

## MVIS structures

Retain and refine the existing right-side and left-side structures. Both use galvanized steel frames, light metallic cabinet panels, base plates, anchor bolts, and 500 × 500 × 500 mm foundations.

Right-side structure:

- Cabinet cross-track depth: 500 mm.
- Cabinet height: 800 mm.
- Positioned 2.2 m from the adjacent track centreline.
- 50 mm support poles extending from rail level to 1.0 m below rail level.
- Current 5.0 m along-track cabinet length remains a named, editable assumption until checked against the DWG.

Left-side structure:

- Along-track length: 1.5 m.
- Cross-track depth: 500 mm.
- Cabinet height: 1.8 m.
- Cabinet base: 300 mm above the local reference surface shown in the drawing.
- Two 50 mm supports and two 500 mm foundations.

## Inspection equipment and safety visualization

Use `public/assets/models/line-scan-camera-enclosure.glb` for the track-level inspection enclosure. Add paired line-scan cameras, trigger sensors, and small equipment markers around the inspection point.

Represent the no-mechanised-tamping area as an optional translucent red overlay spanning the 120 m protected corridor. Keep it hidden in beauty renders and visible in technical explanation shots.

Add animated scan effects:

- Thin emissive scan planes crossing wheel and underframe areas.
- Trigger pulses when the locomotive reaches the inspection point.
- Brief equipment status lights on both cabinets.
- A subtle HUD-style overlay only in the explanatory camera sequence.

## Below-ground installation

Model the underground elements shown in the cross-section:

- Four concrete foundations for the two structures.
- Vertical support poles continuing below rail level where shown.
- A red cable or conduit route running horizontally below the formation and rising to the left-side structure.
- Distinct ballast, blanket, and earth materials so the route remains legible.

Create an optional cutaway collection that hides the near half of the formation layers. This provides a clear underground explanation without permanently cutting the beauty-render terrain.

## Station environment

Build a restrained Hazrat Nizamuddin-inspired railway environment rather than a survey-exact station replica. Include platform edges, overhead electrification masts and wires, safety fencing, signal equipment, utility cabinets, station signage, and distant urban context. Reuse `mvis-project-office-portacabin.glb` and `indian-field-engineer.glb` as secondary context where they improve scale and storytelling.

Keep background assets lower detail than the inspection installation. The MVIS equipment and railway corridor remain the visual focus.

## Materials and lighting

Use physically based materials for rail steel, galvanized frames, painted cabinets, concrete, ballast, soil, sleepers, train paint, glass, and emissive sensors. Reuse project textures when available and procedural materials for repeated infrastructure.

Provide two lighting setups:

- Day: clear neutral daylight for technical explanation and dimensional readability.
- Night: cool ambient light, locomotive headlights, platform lighting, and visible scan effects.

## Cameras and animation

Create named cameras for:

- `CAM_Overview`: three-quarter view of the complete corridor.
- `CAM_Cross_Section`: orthographic view matching the PDF arrangement.
- `CAM_Trackside`: low view of the train entering the inspection zone.
- `CAM_Inspection`: close view of camera housings and scan effects.
- `CAM_Underground`: cutaway view of foundations and conduit.
- `CAM_Operator`: moving walkthrough camera for presentation.

Create a 20-second, 24 fps timeline:

- Frames 1-96: overview and train approach.
- Frames 97-240: train crosses the MVIS sensors and scan effects activate.
- Frames 241-360: cross-section and underground explanation.
- Frames 361-480: night hero view and completion hold.

## Scene organization

Use these top-level collections:

- `MVIS_Railway_Formation`
- `MVIS_Tracks`
- `MVIS_Trains`
- `MVIS_Right_Structure`
- `MVIS_Left_Structure`
- `MVIS_Inspection_Equipment`
- `MVIS_Underground`
- `MVIS_Station_Context`
- `MVIS_Presentation`
- `MVIS_Technical_Overlays`

Use linked duplicates and collection instances for sleepers, coaches, masts, and repeated details. Keep all uncertain dimensions exposed as named constants in the build script.

## Deliverables

- `MVIS_NZM_Complete_Scene.blend`
- `MVIS_NZM_Complete_preview.png`
- Reusable Blender Python build scripts under `scripts/blender/`
- A GLB export suitable for integration into the existing Three.js experience.
- A short MP4 presentation render when the complete scene has passed still-image review.

## Verification

- Confirm all PDF dimensions represented in the scene match their stated values.
- Confirm three tracks use centre spacing of 4.9 m and 7.2 m.
- Confirm all trains sit correctly on the rail gauge without wheel or ground penetration.
- Confirm four 500 mm foundation blocks and the underground conduit are visible in the cutaway view.
- Confirm the moving train, trigger event, scan effects, and camera sequence animate without missing assets.
- Confirm both day and night lighting setups render without broken materials.
- Confirm the `.blend` file opens in Blender 5.2.2 and the GLB export loads in the Three.js project.
