# MVIS Complete Blender Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, animate, render, and export a complete three-track NZM MVIS demonstration scene in Blender.

**Architecture:** Focused Blender Python modules create procedural railway infrastructure, import and normalize licensed GLB assets, build MVIS equipment and underground layers, and configure presentation cameras, lighting, and animation. A small orchestrator reloads the modules, builds the scene idempotently, validates key dimensions, saves the `.blend`, renders a still, and exports a GLB.

**Tech Stack:** Blender 5.2 Python API, Blender MCP localhost socket, glTF 2.0 assets, Eevee renderer.

## Global Constraints

- Use metres with 1 mm = 0.001 m.
- Use track centres at Y = 0.0 m, 4.9 m, and 12.1 m.
- Use 1.676 m Indian broad gauge.
- Build a 120 m corridor along X.
- Use four 0.5 × 0.5 × 0.5 m equipment foundations.
- Keep uncertain dimensions as named constants.
- Preserve existing source GLBs and unrelated user files.
- Target Blender 5.2.2 and `BLENDER_EEVEE`.

---

### Task 1: Shared Blender Build Utilities

**Files:**
- Create: `scripts/blender/mvis_common.py`

**Interfaces:**
- Produces: `reset_scene()`, `collection(name)`, `material(name, color, metallic, roughness, emission=None)`, `box(...)`, `cylinder(...)`, `curve_tube(...)`, `look_at(...)`, `import_glb(...)`, `normalize_root(...)`.

- [ ] **Step 1: Implement idempotent collection and object helpers**

```python
def box(name, location, dimensions, mat, target, bevel=0.02):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    target.objects.link(obj)
    bpy.context.collection.objects.unlink(obj)
    return obj
```

- [ ] **Step 2: Implement GLB import and normalization**

Import a GLB, parent all imported roots to a named empty, compute world-space bounds, rotate the longest horizontal dimension onto X, and uniformly scale to a requested target length or height.

- [ ] **Step 3: Validate module syntax**

Run `python3 -m py_compile scripts/blender/mvis_common.py` and expect exit code 0.

### Task 2: Railway Formation and Infrastructure

**Files:**
- Create: `scripts/blender/mvis_railway.py`

**Interfaces:**
- Consumes helpers from `mvis_common.py`.
- Produces: `build_formation(materials)` and `build_tracks(materials)`.

- [ ] **Step 1: Build the layered corridor**

Create separate earth, blanket, ballast, and ground objects extending 120 m along X. Shape three ballast shoulders with a rectangular core and sloped side wedges.

- [ ] **Step 2: Build three broad-gauge tracks**

For each centre Y value, add two rails at `centre ± 0.838`, repeated 2.75 × 0.24 × 0.16 m sleepers at 0.65 m spacing, and compact fastener blocks at each rail seat.

- [ ] **Step 3: Build platform and overhead electrification context**

Create platform edges beyond the outer tracks, electrification masts at 18 m intervals, contact wires, fencing, signals, utility cabinets, and an `HAZRAT NIZAMUDDIN` station sign.

- [ ] **Step 4: Validate module syntax**

Run `python3 -m py_compile scripts/blender/mvis_railway.py` and expect exit code 0.

### Task 3: MVIS Structures, Cameras, and Underground Work

**Files:**
- Create: `scripts/blender/mvis_equipment.py`

**Interfaces:**
- Consumes helpers from `mvis_common.py`.
- Produces: `build_structures(materials)`, `build_inspection_equipment(materials)`, and `build_underground(materials)`.

- [ ] **Step 1: Port and refine both approved cabinet structures**

Use the verified cabinet dimensions, support poles, base plates, bolts, and four 500 mm foundations from `scripts/build_mvis_gantry.py`. Place the right-side cabinet 2.2 m from Track 1 centre and the left-side cabinet beside Track 2 according to the PDF section.

- [ ] **Step 2: Import and normalize the line-scan enclosure**

Import `public/assets/models/line-scan-camera-enclosure.glb`, normalize it to a 0.55 m envelope, and place paired enclosures beside the rails at X = 0.

- [ ] **Step 3: Add trigger sensors and animated scan planes**

Create sensor heads, emissive status lights, and two transparent scan planes. Keyframe scan emission from 0 at frame 96 to full intensity at frame 120 and back to 0 at frame 240.

- [ ] **Step 4: Build underground foundations and conduit**

Create a red 75 mm conduit path at Z = -1.25 m with vertical risers to both structures. Add an optional translucent 120 m no-tamping overlay in `MVIS_Technical_Overlays`.

- [ ] **Step 5: Validate module syntax**

Run `python3 -m py_compile scripts/blender/mvis_equipment.py` and expect exit code 0.

### Task 4: Train Assets and Motion

**Files:**
- Create: `scripts/blender/mvis_trains.py`

**Interfaces:**
- Consumes `import_glb()` and `normalize_root()` from `mvis_common.py`.
- Produces: `build_trains(materials)` returning the three train root empties.

- [ ] **Step 1: Import normalized WAP-7 and LHB assets**

Use target lengths of 19.9 m for the locomotive, 23.54 m for an LHB coach, and 23.54 m for the generator car. Cache imported collections and create linked collection instances for repeated vehicles.

- [ ] **Step 2: Assemble three compact consists**

Each consist contains one locomotive, one generator car, and two coaches aligned along X. Place the consists at the three track-centre Y coordinates with wheel bottoms aligned to rail level.

- [ ] **Step 3: Animate the foreground train**

Keyframe the Track 1 consist from X = -58 m at frame 1 through X = 0 at frame 168 to X = 58 m at frame 360. Stage the other two consists at distinct positions for depth.

- [ ] **Step 4: Add locomotive headlights**

Create paired emissive lenses and spotlights parented to each locomotive root. Keyframe the hero train lights brighter during the night segment.

- [ ] **Step 5: Validate module syntax**

Run `python3 -m py_compile scripts/blender/mvis_trains.py` and expect exit code 0.

### Task 5: Presentation, Cameras, Render, and Export

**Files:**
- Create: `scripts/blender/mvis_presentation.py`
- Create: `scripts/blender/build_mvis_complete_scene.py`

**Interfaces:**
- Consumes all build functions from Tasks 1-4.
- Produces: `configure_presentation(materials)`, `validate_scene()`, and `build()`.

- [ ] **Step 1: Configure day and night lighting**

Create sun, sky fill, platform lights, and a world background. Animate sun energy and world strength down after frame 360 while platform lights and train headlights brighten.

- [ ] **Step 2: Create six named cameras**

Create `CAM_Overview`, `CAM_Cross_Section`, `CAM_Trackside`, `CAM_Inspection`, `CAM_Underground`, and `CAM_Operator` with fixed lens values and targets. Add timeline markers that bind the active camera for the four presentation segments.

- [ ] **Step 3: Add contextual people and office assets**

Import and normalize the field engineer and portacabin assets, placing them away from the clearance envelope.

- [ ] **Step 4: Implement scene validation**

```python
assert [round(y, 3) for y in TRACK_CENTRES] == [0.0, 4.9, 12.1]
assert len([o for o in bpy.data.objects if o.name.endswith("_Foundation")]) == 4
assert all(bpy.data.collections.get(name) for name in REQUIRED_COLLECTIONS)
```

- [ ] **Step 5: Save, render, and export**

Save `/Users/shreyanshmalviya/Desktop/threejs/MVIS_NZM_Complete_Scene.blend`, render `/Users/shreyanshmalviya/Desktop/threejs/MVIS_NZM_Complete_preview.png`, and export `/Users/shreyanshmalviya/Desktop/threejs/public/assets/models/mvis-nzm-complete-scene.glb`.

- [ ] **Step 6: Validate all module syntax**

Run `python3 -m py_compile scripts/blender/*.py` and expect exit code 0.

### Task 6: Execute and Verify the Complete Scene

**Files:**
- Verify: `MVIS_NZM_Complete_Scene.blend`
- Verify: `MVIS_NZM_Complete_preview.png`
- Verify: `public/assets/models/mvis-nzm-complete-scene.glb`

**Interfaces:**
- Consumes: `build()` from `scripts/blender/build_mvis_complete_scene.py`.
- Produces: final Blender, still-image, and Three.js artifacts.

- [ ] **Step 1: Build headlessly in Blender 5.2.2**

Run:

```bash
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python scripts/blender/build_mvis_complete_scene.py
```

Expected: validation summary followed by successful `.blend`, PNG, and GLB writes.

- [ ] **Step 2: Inspect the rendered preview**

Confirm three tracks and trains, both MVIS structures, inspection equipment, OHE, platform context, and readable composition. Adjust camera and asset normalization when anything clips or disappears.

- [ ] **Step 3: Load the saved `.blend` and re-run dimension assertions**

Open the saved file headlessly and assert track-centre coordinates, four foundation dimensions, required collections, frame range 1-480, and six named cameras.

- [ ] **Step 4: Load the exported GLB in the Three.js build**

Run `npm run build` after registering no new runtime dependency. Confirm the existing application build succeeds and the exported GLB is a valid glTF binary.

- [ ] **Step 5: Commit implementation**

```bash
git add scripts/blender public/assets/models/mvis-nzm-complete-scene.glb docs/superpowers/plans/2026-09-22-mvis-complete-blender-scene.md
git commit -m "feat: build complete NZM MVIS Blender scene"
```
