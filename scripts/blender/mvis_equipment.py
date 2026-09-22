import math

import bpy

from mvis_common import MODEL_DIR, box, collection, curve_tube, cylinder, import_glb
from mvis_railway import GAUGE, RAIL_LEVEL


RIGHT_CABINET_LENGTH = 5.0
RIGHT_CABINET_DEPTH = 0.5
RIGHT_CABINET_HEIGHT = 0.8
LEFT_CABINET_LENGTH = 1.5
LEFT_CABINET_DEPTH = 0.5
LEFT_CABINET_HEIGHT = 1.8
RIGHT_STRUCTURE_Y = 2.2
LEFT_STRUCTURE_Y = 7.9


def add_bolts(prefix, x, y, z, materials, target):
    for index, (dx, dy) in enumerate(((-0.07, -0.07), (-0.07, 0.07), (0.07, -0.07), (0.07, 0.07)), 1):
        cylinder(
            f"{prefix}_Anchor_Bolt_{index}",
            (x + dx, y + dy, z),
            0.025,
            0.04,
            materials["steel"],
            target,
            16,
        )


def foundation(prefix, x, y, top_z, materials, target):
    box(
        f"{prefix}_Foundation",
        (x, y, top_z - 0.25),
        (0.5, 0.5, 0.5),
        materials["concrete"],
        target,
        0.025,
    )
    box(
        f"{prefix}_Base_Plate",
        (x, y, top_z + 0.015),
        (0.22, 0.22, 0.03),
        materials["steel"],
        target,
        0.006,
    )
    add_bolts(prefix, x, y, top_z + 0.05, materials, target)


def cabinet(prefix, centre, dimensions, materials, target, separators=()):
    x, y, z = centre
    length, depth, height = dimensions
    frame = 0.04
    box(f"{prefix}_Core", centre, (length - 0.08, depth - 0.04, height - 0.08), materials["cabinet"], target, 0.012)
    for label, frame_x in (("Left", x - length / 2 + frame / 2), ("Right", x + length / 2 - frame / 2)):
        box(f"{prefix}_Frame_{label}", (frame_x, y, z), (frame, depth, height), materials["steel"], target, 0.006)
    for label, frame_z in (("Bottom", z - height / 2 + frame / 2), ("Top", z + height / 2 - frame / 2)):
        box(f"{prefix}_Frame_{label}", (x, y, frame_z), (length, depth, frame), materials["steel"], target, 0.006)
    for index, separator_z in enumerate(separators, 1):
        box(f"{prefix}_Separator_{index}", (x, y - depth / 2 - 0.01, separator_z), (length - 0.08, 0.035, frame), materials["steel"], target, 0.004)


def build_structures(materials):
    right = collection("MVIS_Right_Structure")
    left = collection("MVIS_Left_Structure")
    foundations = collection("MVIS_Underground")

    right_foundation_top = RAIL_LEVEL - 1.0
    right_cabinet_bottom = RAIL_LEVEL
    for label, x in (("Left", -2.25), ("Right", 2.25)):
        foundation(f"Right_{label}", x, RIGHT_STRUCTURE_Y, right_foundation_top, materials, foundations)
        pole_center = (right_foundation_top + right_cabinet_bottom) / 2
        box(f"Right_{label}_Post", (x, RIGHT_STRUCTURE_Y, pole_center), (0.05, 0.05, 1.0), materials["steel"], right, 0.005)
    cabinet(
        "Right_Cabinet",
        (0, RIGHT_STRUCTURE_Y, right_cabinet_bottom + RIGHT_CABINET_HEIGHT / 2),
        (RIGHT_CABINET_LENGTH, RIGHT_CABINET_DEPTH, RIGHT_CABINET_HEIGHT),
        materials,
        right,
        (right_cabinet_bottom + RIGHT_CABINET_HEIGHT / 2,),
    )

    left_foundation_top = RAIL_LEVEL
    left_cabinet_bottom = RAIL_LEVEL + 0.3
    for label, x in (("Left", -0.5), ("Right", 0.5)):
        foundation(f"Left_{label}", x, LEFT_STRUCTURE_Y, left_foundation_top, materials, foundations)
        box(f"Left_{label}_Post", (x, LEFT_STRUCTURE_Y, RAIL_LEVEL + 0.15), (0.05, 0.05, 0.3), materials["steel"], left, 0.005)
    cabinet(
        "Left_Cabinet",
        (0, LEFT_STRUCTURE_Y, left_cabinet_bottom + LEFT_CABINET_HEIGHT / 2),
        (LEFT_CABINET_LENGTH, LEFT_CABINET_DEPTH, LEFT_CABINET_HEIGHT),
        materials,
        left,
        (left_cabinet_bottom + 0.6, left_cabinet_bottom + 1.2),
    )
    return right, left, foundations


def build_inspection_equipment(materials):
    equipment = collection("MVIS_Inspection_Equipment")
    enclosure_path = MODEL_DIR / "line-scan-camera-enclosure.glb"
    for side, y in (("L", -GAUGE / 2 - 0.38), ("R", GAUGE / 2 + 0.38)):
        root, _ = import_glb(enclosure_path, f"Line_Scan_Enclosure_{side}", equipment, target_length=0.55)
        root.location = (0, y, RAIL_LEVEL + 0.03)
        root.rotation_euler[2] += math.pi / 2

    for index, x in enumerate((-3.2, 3.2), 1):
        for side, y in (("L", -1.18), ("R", 1.18)):
            box(f"Trigger_{index}_{side}_Base", (x, y, RAIL_LEVEL + 0.12), (0.22, 0.18, 0.24), materials["steel"], equipment, 0.025)
            cylinder(f"Trigger_{index}_{side}_Lens", (x, y - 0.095 * (1 if y > 0 else -1), RAIL_LEVEL + 0.18), 0.045, 0.035, materials["sensor"], equipment, 20, (math.pi / 2, 0, 0))

    for index, x in enumerate((-0.16, 0.16), 1):
        scan = box(
            f"MVIS_Scan_Plane_{index}",
            (x, 0, 2.0),
            (0.018, 3.3, 4.0),
            materials["scan"],
            equipment,
            0.0,
        )
        scan.scale.z = 0.01
        scan.keyframe_insert(data_path="scale", frame=96)
        scan.scale.z = 1.0
        scan.keyframe_insert(data_path="scale", frame=120)
        scan.keyframe_insert(data_path="scale", frame=216)
        scan.scale.z = 0.01
        scan.keyframe_insert(data_path="scale", frame=240)

    for index, (x, y, z) in enumerate(((0, RIGHT_STRUCTURE_Y - 0.27, 1.2), (0, LEFT_STRUCTURE_Y - 0.27, 2.25)), 1):
        light = cylinder(f"Cabinet_Status_{index}", (x, y, z), 0.055, 0.025, materials["sensor"], equipment, 20, (math.pi / 2, 0, 0))
        light.scale = (1, 1, 1)
        light.keyframe_insert(data_path="scale", frame=96)
        light.scale = (1.35, 1.35, 1.35)
        light.keyframe_insert(data_path="scale", frame=120)
        light.keyframe_insert(data_path="scale", frame=216)
        light.scale = (1, 1, 1)
        light.keyframe_insert(data_path="scale", frame=240)
    return equipment


def build_underground(materials):
    underground = collection("MVIS_Underground")
    conduit_points = (
        (-55, -3.0, -1.25),
        (0, -3.0, -1.25),
        (0, RIGHT_STRUCTURE_Y, -1.25),
        (0, LEFT_STRUCTURE_Y, -1.25),
        (0, LEFT_STRUCTURE_Y, RAIL_LEVEL - 0.55),
    )
    curve_tube("MVIS_Red_Underground_Conduit", conduit_points, 0.075, materials["conduit"], underground)
    overlays = collection("MVIS_Technical_Overlays")
    zone = box("No_Tamping_Zone_120m", (0, 0, RAIL_LEVEL + 0.025), (120, 4.0, 0.05), materials["warning"], overlays, 0.0)
    zone.hide_render = True
    zone.hide_viewport = True
    return underground, overlays
