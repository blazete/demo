# MVIS Blender Gantry Structures Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and save a dimensionally accurate Blender scene containing both MVIS support structures from the Hazrat Nizamuddin Station arrangement drawing.

**Architecture:** A reusable Blender Python script creates named collections, materials, and box-based fabrication geometry at metre scale. The script is sent to the running Blender add-on through its localhost socket, then a separate verification command reads object dimensions and collection membership before the `.blend` file is saved.

**Tech Stack:** Blender 5.2 Python API (`bpy`), Blender MCP socket on `127.0.0.1:9876`, Python 3 socket client.

## Global Constraints

- Use metres with 1 mm = 0.001 m.
- Right cabinet: 5.0 m wide, 0.5 m deep, 0.8 m high.
- Right cabinet bottom: 1.0 m above 0.5 m-high foundation tops.
- Left cabinet: 1.5 m wide, 0.5 m deep, 1.8 m high.
- Left cabinet bottom: 0.3 m above 0.5 m-high foundation tops.
- All four foundations: 0.5 × 0.5 × 0.5 m.
- Preserve the existing camera and light; replace only previously generated `MVIS_*` content.

---

### Task 1: Parametric Structure Builder

**Files:**
- Create: `scripts/build_mvis_gantry.py`

**Interfaces:**
- Produces: `build_scene()` which creates `MVIS_Right_Structure`, `MVIS_Left_Structure`, `MVIS_Foundations`, and `MVIS_Presentation` collections.
- Produces: `add_box(name, location, dimensions, material, collection, bevel=0.015)` returning a `bpy.types.Object`.
- Produces: `make_material(name, base_color, metallic, roughness)` returning a `bpy.types.Material`.

- [x] **Step 1: Create the material and geometry helpers**

```python
def add_box(name, location, dimensions, material, collection, bevel=0.015):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        modifier = obj.modifiers.new("Edge Bevel", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
    obj.data.materials.append(material)
    move_to_collection(obj, collection)
    return obj
```

- [x] **Step 2: Build the right-side structure**

Create two 0.5 m foundations centered at `x=-2.25` and `x=2.25`, 50 mm posts from foundation top to cabinet bottom, a 5.0 × 0.5 × 0.72 m cabinet panel, and a 40 mm perimeter frame. Place the assembly around `y=1.75` with its cabinet center at `z=1.9`.

```python
foundation_top = 0.5
cabinet_bottom = foundation_top + 1.0
cabinet_height = 0.8
cabinet_center_z = cabinet_bottom + cabinet_height / 2
```

- [x] **Step 3: Build the left-side structure**

Create two 0.5 m foundations centered beneath a 1.5 m cabinet, 50 mm supports, a 1.5 × 0.5 × 1.72 m cabinet panel, a 40 mm perimeter frame, and two horizontal 40 mm separators. Place the assembly around `y=-1.75` with its cabinet center at `z=1.7`.

```python
foundation_top = 0.5
cabinet_bottom = foundation_top + 0.3
cabinet_height = 1.8
cabinet_center_z = cabinet_bottom + cabinet_height / 2
```

- [x] **Step 4: Add presentation elements and save**

Add a neutral ground plane, set the existing camera to a three-quarter view, configure the existing light as a soft area light, add a sun, and save to `/Users/shreyanshmalviya/Desktop/threejs/MVIS_NZM_Gantry_Structures.blend`.

```python
bpy.ops.wm.save_as_mainfile(
    filepath="/Users/shreyanshmalviya/Desktop/threejs/MVIS_NZM_Gantry_Structures.blend"
)
```

- [x] **Step 5: Validate syntax**

Run:

```bash
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python scripts/build_mvis_gantry.py
```

Expected: Blender exits successfully after saving the scene.

- [x] **Step 6: Commit**

```bash
git add scripts/build_mvis_gantry.py
git commit -m "feat: build MVIS Blender gantry structures"
```

### Task 2: Live Blender Execution and Verification

**Files:**
- Read: `scripts/build_mvis_gantry.py`
- Verify: `MVIS_NZM_Gantry_Structures.blend`

**Interfaces:**
- Consumes: `build_scene()` from `scripts/build_mvis_gantry.py`.
- Produces: populated live Blender scene and a saved `.blend` artifact.

- [x] **Step 1: Execute the script through the Blender MCP socket**

Send an `execute_code` command whose code is the full contents of `scripts/build_mvis_gantry.py` to `127.0.0.1:9876`.

- [x] **Step 2: Read exact dimensions from the live scene**

Run this verification inside Blender:

```python
import bpy, json
names = ["Right_Cabinet_Core", "Left_Cabinet_Core"]
print(json.dumps({name: list(bpy.data.objects[name].dimensions) for name in names}))
```

Expected cabinet core dimensions are `[4.92, 0.46, 0.72]` and `[1.42, 0.46, 1.72]`; the outer frames establish the exact 5.0 × 0.5 × 0.8 m and 1.5 × 0.5 × 1.8 m envelopes.

- [x] **Step 3: Verify foundations and collections**

Confirm four objects with names ending in `_Foundation` have dimensions `[0.5, 0.5, 0.5]`, and confirm all four required `MVIS_*` collections exist.

- [x] **Step 4: Inspect the live viewport**

Confirm both structures are visible, separated, correctly framed, and free of obvious overlap or missing members.

- [x] **Step 5: Save the verified scene**

Run `bpy.ops.wm.save_as_mainfile(filepath=...)` once more after verification so the delivered `.blend` contains the validated state.
