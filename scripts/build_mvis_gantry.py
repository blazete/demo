import math

import bpy
from mathutils import Vector


OUTPUT_PATH = "/Users/shreyanshmalviya/Desktop/threejs/MVIS_NZM_Gantry_Structures.blend"
GENERATED_COLLECTIONS = (
    "MVIS_Right_Structure",
    "MVIS_Left_Structure",
    "MVIS_Foundations",
    "MVIS_Presentation",
)


def remove_generated_content():
    for collection_name in GENERATED_COLLECTIONS:
        collection = bpy.data.collections.get(collection_name)
        if collection is None:
            continue
        for obj in list(collection.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        bpy.data.collections.remove(collection)


def make_collection(name):
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection


def make_material(name, base_color, metallic, roughness):
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*base_color, 1.0)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    return material


def make_concrete_material():
    material = bpy.data.materials.get("MVIS_Concrete") or bpy.data.materials.new(
        "MVIS_Concrete"
    )
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    noise = nodes.new("ShaderNodeTexNoise")
    ramp = nodes.new("ShaderNodeValToRGB")
    bump = nodes.new("ShaderNodeBump")

    noise.inputs["Scale"].default_value = 6.0
    noise.inputs["Detail"].default_value = 3.0
    noise.inputs["Roughness"].default_value = 0.65
    ramp.color_ramp.elements[0].color = (0.22, 0.24, 0.26, 1.0)
    ramp.color_ramp.elements[1].color = (0.52, 0.55, 0.57, 1.0)
    bump.inputs["Strength"].default_value = 0.18
    bump.inputs["Distance"].default_value = 0.08
    shader.inputs["Roughness"].default_value = 0.88

    links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(ramp.outputs["Color"], shader.inputs["Base Color"])
    links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    return material


def move_to_collection(obj, collection):
    for source in list(obj.users_collection):
        source.objects.unlink(obj)
    collection.objects.link(obj)


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


def add_bolt(name, location, material, collection):
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.025, depth=0.035, location=location)
    bolt = bpy.context.object
    bolt.name = name
    bolt.data.materials.append(material)
    move_to_collection(bolt, collection)
    bevel = bolt.modifiers.new("Bolt Edge Bevel", "BEVEL")
    bevel.width = 0.004
    bevel.segments = 2
    return bolt


def add_foundation(name, x, y, concrete, steel, foundations):
    add_box(
        f"{name}_Foundation",
        (x, y, 0.25),
        (0.5, 0.5, 0.5),
        concrete,
        foundations,
        bevel=0.025,
    )
    add_box(
        f"{name}_Base_Plate",
        (x, y, 0.515),
        (0.2, 0.2, 0.03),
        steel,
        foundations,
        bevel=0.006,
    )
    for index, (dx, dy) in enumerate(
        ((-0.07, -0.07), (-0.07, 0.07), (0.07, -0.07), (0.07, 0.07)),
        start=1,
    ):
        add_bolt(
            f"{name}_Anchor_Bolt_{index}",
            (x + dx, y + dy, 0.545),
            steel,
            foundations,
        )


def build_right_structure(steel, panel, concrete, right, foundations):
    y = 1.75
    post_x_positions = (-2.25, 2.25)
    for side, x in zip(("Left", "Right"), post_x_positions):
        add_foundation(f"Right_{side}", x, y, concrete, steel, foundations)
        add_box(
            f"Right_{side}_Post",
            (x, y, 1.0),
            (0.05, 0.05, 1.0),
            steel,
            right,
            bevel=0.006,
        )

    cabinet_center_z = 1.9
    add_box(
        "Right_Cabinet_Core",
        (0.0, y, cabinet_center_z),
        (4.92, 0.46, 0.72),
        panel,
        right,
        bevel=0.012,
    )
    for side, x in (("Left", -2.48), ("Right", 2.48)):
        add_box(
            f"Right_Cabinet_Frame_{side}",
            (x, y, cabinet_center_z),
            (0.04, 0.5, 0.8),
            steel,
            right,
            bevel=0.006,
        )
    for side, z in (("Bottom", 1.52), ("Top", 2.28)):
        add_box(
            f"Right_Cabinet_Frame_{side}",
            (0.0, y, z),
            (5.0, 0.5, 0.04),
            steel,
            right,
            bevel=0.006,
        )
    add_box(
        "Right_Cabinet_Mid_Rail",
        (0.0, y - 0.251, cabinet_center_z),
        (4.92, 0.035, 0.04),
        steel,
        right,
        bevel=0.004,
    )


def build_left_structure(steel, panel, concrete, left, foundations):
    y = -1.75
    post_x_positions = (-0.5, 0.5)
    for side, x in zip(("Left", "Right"), post_x_positions):
        add_foundation(f"Left_{side}", x, y, concrete, steel, foundations)
        add_box(
            f"Left_{side}_Post",
            (x, y, 0.65),
            (0.05, 0.05, 0.3),
            steel,
            left,
            bevel=0.006,
        )

    cabinet_center_z = 1.7
    add_box(
        "Left_Cabinet_Core",
        (0.0, y, cabinet_center_z),
        (1.42, 0.46, 1.72),
        panel,
        left,
        bevel=0.012,
    )
    for side, x in (("Left", -0.73), ("Right", 0.73)):
        add_box(
            f"Left_Cabinet_Frame_{side}",
            (x, y, cabinet_center_z),
            (0.04, 0.5, 1.8),
            steel,
            left,
            bevel=0.006,
        )
    for side, z in (("Bottom", 0.82), ("Top", 2.58)):
        add_box(
            f"Left_Cabinet_Frame_{side}",
            (0.0, y, z),
            (1.5, 0.5, 0.04),
            steel,
            left,
            bevel=0.006,
        )
    for index, z in enumerate((1.4, 2.0), start=1):
        add_box(
            f"Left_Cabinet_Separator_{index}",
            (0.0, y - 0.251, z),
            (1.42, 0.035, 0.04),
            steel,
            left,
            bevel=0.004,
        )


def point_camera(camera, target):
    direction = Vector(target) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def configure_presentation(ground, presentation):
    add_box(
        "MVIS_Ground",
        (0.0, 0.0, -0.08),
        (10.0, 8.0, 0.15),
        ground,
        presentation,
        bevel=0.03,
    )

    camera = bpy.data.objects.get("Camera")
    if camera is None:
        camera_data = bpy.data.cameras.new("Camera")
        camera = bpy.data.objects.new("Camera", camera_data)
        bpy.context.scene.collection.objects.link(camera)
    camera.location = (7.8, -10.5, 5.8)
    camera.data.lens = 52
    point_camera(camera, (0.0, 0.0, 1.25))
    bpy.context.scene.camera = camera

    light = bpy.data.objects.get("Light")
    if light is None or light.type != "LIGHT":
        light_data = bpy.data.lights.new("Light", "AREA")
        light = bpy.data.objects.new("Light", light_data)
        bpy.context.scene.collection.objects.link(light)
    light.data.type = "AREA"
    light.data.energy = 1100
    light.data.shape = "DISK"
    light.data.size = 5.0
    light.location = (-2.5, -3.5, 7.0)
    point_camera(light, (0.0, 0.0, 1.0))

    sun_data = bpy.data.lights.new("MVIS_Sun", "SUN")
    sun_data.energy = 2.0
    sun_data.angle = math.radians(18)
    sun = bpy.data.objects.new("MVIS_Sun", sun_data)
    presentation.objects.link(sun)
    sun.rotation_euler = (math.radians(28), math.radians(-20), math.radians(32))

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = "/Users/shreyanshmalviya/Desktop/threejs/MVIS_NZM_Gantry_preview.png"
    scene.world.color = (0.035, 0.045, 0.06)
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.length_unit = "METERS"


def build_scene():
    remove_generated_content()

    right = make_collection("MVIS_Right_Structure")
    left = make_collection("MVIS_Left_Structure")
    foundations = make_collection("MVIS_Foundations")
    presentation = make_collection("MVIS_Presentation")

    steel = make_material("MVIS_Dark_Galvanized_Steel", (0.055, 0.075, 0.09), 0.72, 0.3)
    panel = make_material("MVIS_Cabinet_Panel", (0.5, 0.56, 0.64), 0.58, 0.26)
    ground = make_material("MVIS_Ground_Material", (0.055, 0.065, 0.075), 0.05, 0.82)
    concrete = make_concrete_material()

    build_right_structure(steel, panel, concrete, right, foundations)
    build_left_structure(steel, panel, concrete, left, foundations)
    configure_presentation(ground, presentation)

    bpy.ops.wm.save_as_mainfile(filepath=OUTPUT_PATH)
    print(f"MVIS gantry scene saved to {OUTPUT_PATH}")


build_scene()
