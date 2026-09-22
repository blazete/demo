import math

import bpy

from mvis_common import MODEL_DIR, box, collection, create_text, import_glb, look_at
from mvis_equipment import LEFT_STRUCTURE_Y, RIGHT_STRUCTURE_Y
from mvis_railway import TRACK_CENTRES


REQUIRED_COLLECTIONS = (
    "MVIS_Railway_Formation",
    "MVIS_Tracks",
    "MVIS_Trains",
    "MVIS_Right_Structure",
    "MVIS_Left_Structure",
    "MVIS_Inspection_Equipment",
    "MVIS_Underground",
    "MVIS_Station_Context",
    "MVIS_Presentation",
    "MVIS_Technical_Overlays",
)


def camera(name, location, target, lens=45, orthographic_scale=None):
    data = bpy.data.cameras.new(name)
    obj = bpy.data.objects.new(name, data)
    collection("MVIS_Presentation").objects.link(obj)
    obj.location = location
    look_at(obj, target)
    if orthographic_scale:
        data.type = "ORTHO"
        data.ortho_scale = orthographic_scale
    else:
        data.lens = lens
    return obj


def build_cameras():
    cameras = {
        "overview": camera("CAM_Overview", (95, -90, 58), (0, 5.8, 1.0), 52),
        "cross": camera("CAM_Cross_Section", (-68, 6.0, 4.0), (0, 6.0, 1.3), orthographic_scale=23.5),
        "trackside": camera("CAM_Trackside", (-18, -5.6, 2.3), (0, 0.0, 1.7), 42),
        "inspection": camera("CAM_Inspection", (10, -8.5, 4.5), (0, 0.2, 1.0), 58),
        "underground": camera("CAM_Underground", (15, -20, 5.3), (0, 4.5, -0.4), 52),
        "operator": camera("CAM_Operator", (-12, -2.8, 1.75), (3, 1.4, 1.2), 35),
    }
    scene = bpy.context.scene
    scene.timeline_markers.clear()
    for frame, label, cam in (
        (1, "Overview", cameras["overview"]),
        (97, "Inspection", cameras["inspection"]),
        (241, "Underground", cameras["underground"]),
        (361, "Night Hero", cameras["trackside"]),
    ):
        marker = scene.timeline_markers.new(label, frame=frame)
        marker.camera = cam
    scene.camera = cameras["overview"]
    return cameras


def build_lighting(materials):
    target = collection("MVIS_Presentation")
    sun_data = bpy.data.lights.new("MVIS_Day_Sun", "SUN")
    sun_data.energy = 2.2
    sun_data.angle = math.radians(12)
    sun = bpy.data.objects.new("MVIS_Day_Sun", sun_data)
    target.objects.link(sun)
    sun.rotation_euler = (math.radians(28), math.radians(-22), math.radians(35))
    sun_data.keyframe_insert(data_path="energy", frame=1)
    sun_data.keyframe_insert(data_path="energy", frame=340)
    sun_data.energy = 0.12
    sun_data.keyframe_insert(data_path="energy", frame=400)

    area_data = bpy.data.lights.new("MVIS_Sky_Fill", "AREA")
    area_data.energy = 1800
    area_data.shape = "DISK"
    area_data.size = 18
    area = bpy.data.objects.new("MVIS_Sky_Fill", area_data)
    target.objects.link(area)
    area.location = (0, 4, 24)
    look_at(area, (0, 5, 0))

    for index, (x, y) in enumerate(((-30, -2.0), (0, -2.0), (30, -2.0), (-30, 14.0), (0, 14.0), (30, 14.0))):
        light_data = bpy.data.lights.new(f"Platform_Light_{index}", "AREA")
        light_data.color = (1.0, 0.73, 0.4)
        light_data.energy = 20
        light_data.shape = "DISK"
        light_data.size = 2.0
        light_data.keyframe_insert(data_path="energy", frame=340)
        light_data.energy = 550
        light_data.keyframe_insert(data_path="energy", frame=400)
        light = bpy.data.objects.new(f"Platform_Light_{index}", light_data)
        target.objects.link(light)
        light.location = (x, y, 6.3)
        look_at(light, (x, y, 0.8))

    world = bpy.context.scene.world or bpy.data.worlds.new("MVIS_World")
    bpy.context.scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background")
    background.inputs["Color"].default_value = (0.14, 0.19, 0.28, 1)
    background.inputs["Strength"].default_value = 0.55
    background.inputs["Strength"].keyframe_insert(data_path="default_value", frame=340)
    background.inputs["Strength"].default_value = 0.08
    background.inputs["Strength"].keyframe_insert(data_path="default_value", frame=400)


def build_context_assets(materials):
    target = collection("MVIS_Station_Context")
    engineer, _ = import_glb(MODEL_DIR / "indian-field-engineer.glb", "MVIS_Field_Engineer", target, target_height=1.75)
    engineer.location = (5.5, -2.8, 1.41)
    office, _ = import_glb(MODEL_DIR / "mvis-project-office-portacabin.glb", "MVIS_Project_Office", target, target_length=6.5)
    office.location = (26, -4.6, 1.42)

    for index, (x, y, width, depth, height) in enumerate(
        ((-34, 18.0, 22, 5, 7), (0, 19.5, 28, 6, 9), (35, 18.0, 24, 5, 6))
    ):
        box(f"Distant_Station_Block_{index}", (x, y, height / 2), (width, depth, height), materials["building"], target, 0.15)
    create_text("MVIS_Title", "MVIS INSPECTION ZONE", (0, -1.8, 1.72), 0.34, materials["text_light"], target, (math.pi / 2, 0, 0))


def configure_render():
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.render.image_settings.color_mode = "RGBA"
    scene.frame_start = 1
    scene.frame_end = 480
    scene.render.fps = 24
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.length_unit = "METERS"
    scene.view_settings.look = "AgX - Medium High Contrast"


def configure_presentation(materials):
    configure_render()
    cameras = build_cameras()
    build_lighting(materials)
    build_context_assets(materials)
    return cameras


def validate_scene():
    assert [round(y, 3) for y in TRACK_CENTRES] == [0.0, 4.9, 12.1]
    foundations = [obj for obj in bpy.data.objects if obj.name.endswith("_Foundation")]
    assert len(foundations) == 4, f"Expected four foundations, found {len(foundations)}"
    assert all(tuple(round(v, 3) for v in obj.dimensions) == (0.5, 0.5, 0.5) for obj in foundations)
    missing = [name for name in REQUIRED_COLLECTIONS if bpy.data.collections.get(name) is None]
    assert not missing, f"Missing collections: {missing}"
    camera_names = [
        "CAM_Overview",
        "CAM_Cross_Section",
        "CAM_Trackside",
        "CAM_Inspection",
        "CAM_Underground",
        "CAM_Operator",
    ]
    assert all(bpy.data.objects.get(name) for name in camera_names)
    assert bpy.context.scene.frame_end == 480
    return {
        "objects": len(bpy.data.objects),
        "foundations": len(foundations),
        "collections": len(REQUIRED_COLLECTIONS),
        "cameras": len(camera_names),
        "frame_end": bpy.context.scene.frame_end,
    }
