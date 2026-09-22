import math

import bpy

from mvis_common import MODEL_DIR, collection, cylinder, import_glb, move_to_collection
from mvis_railway import RAIL_LEVEL, TRACK_CENTRES


LOCOMOTIVE_LENGTH = 19.9
COACH_LENGTH = 23.54
VEHICLE_GAP = 0.55


def parent_at(root, train_root, local_x, local_y=0.0, local_z=0.0):
    root.parent = train_root
    root.location = (local_x, local_y, local_z)


def add_headlights(train_index, train_root, locomotive_x, materials, target):
    for side_index, y in enumerate((-0.58, 0.58), 1):
        lens = cylinder(
            f"Train_{train_index}_Headlight_{side_index}",
            (locomotive_x - LOCOMOTIVE_LENGTH / 2 - 0.06, y, 2.65),
            0.13,
            0.06,
            materials["headlight"],
            target,
            24,
            (0, math.pi / 2, 0),
        )
        lens.parent = train_root
        light_data = bpy.data.lights.new(f"Train_{train_index}_Spot_{side_index}", "SPOT")
        light_data.color = (1.0, 0.87, 0.58)
        light_data.energy = 350 if train_index == 1 else 120
        light_data.spot_size = math.radians(24)
        light_data.spot_blend = 0.55
        light_data.shadow_soft_size = 0.3
        light = bpy.data.objects.new(f"Train_{train_index}_Spot_{side_index}", light_data)
        target.objects.link(light)
        light.location = (locomotive_x - LOCOMOTIVE_LENGTH / 2 - 0.15, y, 2.65)
        light.rotation_euler = (0, -math.pi / 2, 0)
        light.parent = train_root
        light_data.energy = 100
        light_data.keyframe_insert(data_path="energy", frame=1)
        light_data.keyframe_insert(data_path="energy", frame=359)
        light_data.energy = 650 if train_index == 1 else 220
        light_data.keyframe_insert(data_path="energy", frame=400)


def build_consist(train_index, track_y, materials, target):
    train_root = bpy.data.objects.new(f"Train_{train_index}_Root", None)
    target.objects.link(train_root)
    train_root.location = (0, track_y, RAIL_LEVEL + 0.075)

    paths = (
        (MODEL_DIR / "indian-wap7-locomotive.glb", "Locomotive", LOCOMOTIVE_LENGTH),
        (MODEL_DIR / "indian-lhb-generator-car.glb", "Generator", COACH_LENGTH),
        (MODEL_DIR / "indian-lhb-coach.glb", "Coach_A", COACH_LENGTH),
        (MODEL_DIR / "indian-lhb-coach.glb", "Coach_B", COACH_LENGTH),
    )
    total_length = sum(item[2] for item in paths) + VEHICLE_GAP * (len(paths) - 1)
    cursor = -total_length / 2
    locomotive_x = 0.0
    for path, label, length in paths:
        centre_x = cursor + length / 2
        asset_root, imported = import_glb(
            path,
            f"Train_{train_index}_{label}",
            target,
            target_length=length,
        )
        parent_at(asset_root, train_root, centre_x)
        if label == "Locomotive":
            locomotive_x = centre_x
        cursor += length + VEHICLE_GAP
    add_headlights(train_index, train_root, locomotive_x, materials, target)
    return train_root


def build_trains(materials):
    target = collection("MVIS_Trains")
    trains = []
    for index, track_y in enumerate(TRACK_CENTRES, 1):
        trains.append(build_consist(index, track_y, materials, target))

    hero, middle, far = trains
    hero.location.x = -58
    hero.keyframe_insert(data_path="location", frame=1)
    hero.location.x = 0
    hero.keyframe_insert(data_path="location", frame=168)
    hero.location.x = 58
    hero.keyframe_insert(data_path="location", frame=360)
    middle.location.x = 18
    far.location.x = -16
    return trains
