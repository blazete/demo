import json
import sys
from pathlib import Path

import bpy


SCRIPT_DIR = Path("/Users/shreyanshmalviya/Desktop/threejs/scripts/blender")
PROJECT_ROOT = Path("/Users/shreyanshmalviya/Desktop/threejs")
BLEND_PATH = PROJECT_ROOT / "MVIS_NZM_Complete_Scene.blend"
PREVIEW_PATH = PROJECT_ROOT / "MVIS_NZM_Complete_preview.png"
GLB_PATH = PROJECT_ROOT / "public/assets/models/mvis-nzm-complete-scene.glb"

if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from mvis_common import concrete_material, material, reset_scene
from mvis_equipment import build_inspection_equipment, build_structures, build_underground
from mvis_presentation import configure_presentation, validate_scene
from mvis_railway import build_formation, build_station_context, build_tracks
from mvis_trains import build_trains


def create_materials():
    return {
        "earth": material("MVIS_Earth", (0.23, 0.12, 0.055), 0.0, 0.95),
        "blanket": material("MVIS_Blanket", (0.43, 0.34, 0.22), 0.0, 0.92),
        "ballast": material("MVIS_Ballast", (0.31, 0.33, 0.35), 0.0, 0.9),
        "ground": material("MVIS_Ground", (0.15, 0.18, 0.16), 0.0, 0.94),
        "rail": material("MVIS_Rail_Steel", (0.09, 0.11, 0.13), 0.86, 0.24),
        "sleeper": material("MVIS_Sleeper_Concrete", (0.36, 0.39, 0.4), 0.0, 0.8),
        "fastener": material("MVIS_Fastener", (0.06, 0.07, 0.08), 0.9, 0.25),
        "platform": material("MVIS_Platform", (0.35, 0.32, 0.28), 0.0, 0.88),
        "safety_yellow": material("MVIS_Safety_Yellow", (0.95, 0.58, 0.03), 0.05, 0.42),
        "steel": material("MVIS_Galvanized_Steel", (0.08, 0.1, 0.12), 0.72, 0.3),
        "wire": material("MVIS_OHE_Wire", (0.04, 0.045, 0.05), 0.9, 0.2),
        "signal_black": material("MVIS_Signal_Black", (0.008, 0.012, 0.015), 0.25, 0.3),
        "signal_green": material("MVIS_Signal_Green", (0.02, 0.18, 0.04), 0.1, 0.22, ((0.03, 1.0, 0.08), 8.0)),
        "station_sign": material("MVIS_Station_Sign", (0.9, 0.72, 0.05), 0.05, 0.45),
        "text_dark": material("MVIS_Text_Dark", (0.015, 0.02, 0.025), 0.0, 0.55),
        "text_light": material("MVIS_Text_Light", (0.88, 0.92, 0.95), 0.1, 0.36),
        "cabinet": material("MVIS_Cabinet", (0.48, 0.55, 0.64), 0.6, 0.28),
        "concrete": concrete_material(),
        "sensor": material("MVIS_Sensor_Emissive", (0.02, 0.3, 0.08), 0.1, 0.25, ((0.02, 1.0, 0.15), 12.0)),
        "scan": material("MVIS_Scan_Blue", (0.01, 0.16, 0.35), 0.0, 0.18, ((0.01, 0.45, 1.0), 18.0), 0.22),
        "conduit": material("MVIS_Conduit_Red", (0.65, 0.015, 0.01), 0.15, 0.38, ((1.0, 0.02, 0.01), 1.5)),
        "warning": material("MVIS_No_Tamping_Red", (0.8, 0.01, 0.01), 0.0, 0.4, ((1.0, 0.02, 0.01), 1.0), 0.18),
        "headlight": material("MVIS_Headlight", (1.0, 0.78, 0.38), 0.05, 0.15, ((1.0, 0.72, 0.28), 15.0)),
        "building": material("MVIS_Distant_Building", (0.16, 0.19, 0.23), 0.05, 0.78),
    }


def build():
    reset_scene()
    materials = create_materials()
    build_formation(materials)
    build_tracks(materials)
    build_station_context(materials)
    build_structures(materials)
    build_inspection_equipment(materials)
    build_underground(materials)
    build_trains(materials)
    cameras = configure_presentation(materials)

    summary = validate_scene()
    scene = bpy.context.scene
    scene.frame_set(1)
    scene.camera = cameras["overview"]
    scene.render.filepath = str(PREVIEW_PATH)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    bpy.ops.render.render(write_still=True)
    bpy.ops.export_scene.gltf(
        filepath=str(GLB_PATH),
        export_format="GLB",
        export_animations=True,
        export_cameras=True,
        export_lights=True,
    )
    print("MVIS_COMPLETE_SCENE", json.dumps(summary, sort_keys=True))
    print(f"BLEND={BLEND_PATH}")
    print(f"PREVIEW={PREVIEW_PATH}")
    print(f"GLB={GLB_PATH}")


build()
