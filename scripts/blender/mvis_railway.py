import math

import bpy

from mvis_common import box, collection, create_text, curve_tube, cylinder


TRACK_CENTRES = (0.0, 4.9, 12.1)
TRACK_LENGTH = 120.0
GAUGE = 1.676
RAIL_LEVEL = 0.72


def linked_copy(source, name, location, target):
    obj = source.copy()
    obj.data = source.data
    obj.name = name
    obj.location = location
    target.objects.link(obj)
    return obj


def build_formation(materials):
    formation = collection("MVIS_Railway_Formation")
    box("Prepared_Earthwork", (0, 6.0, -0.75), (TRACK_LENGTH, 22.0, 1.5), materials["earth"], formation, 0.0)
    box("Blanket_Layer", (0, 6.0, 0.03), (TRACK_LENGTH, 21.0, 0.6), materials["blanket"], formation, 0.0)
    for index, centre in enumerate(TRACK_CENTRES, start=1):
        box(
            f"Track_{index}_Ballast_Bed",
            (0, centre, 0.43),
            (TRACK_LENGTH, 4.2, 0.45),
            materials["ballast"],
            formation,
            0.06,
        )
    box("Station_Ground_Left", (0, -4.2, 0.3), (TRACK_LENGTH, 4.0, 0.6), materials["ground"], formation, 0.03)
    box("Station_Ground_Right", (0, 16.3, 0.3), (TRACK_LENGTH, 4.0, 0.6), materials["ground"], formation, 0.03)
    return formation


def build_tracks(materials):
    tracks = collection("MVIS_Tracks")
    sleeper_spacing = 0.65
    sleeper_count = int(TRACK_LENGTH / sleeper_spacing) + 1

    sleeper_template = box(
        "Sleeper_Template",
        (-TRACK_LENGTH / 2, TRACK_CENTRES[0], 0.60),
        (0.24, 2.75, 0.16),
        materials["sleeper"],
        tracks,
        0.025,
    )
    fastener_template = box(
        "Fastener_Template",
        (-TRACK_LENGTH / 2, TRACK_CENTRES[0] - GAUGE / 2, 0.715),
        (0.11, 0.16, 0.07),
        materials["fastener"],
        tracks,
        0.012,
    )

    for track_index, centre in enumerate(TRACK_CENTRES, start=1):
        for side, rail_y in (("L", centre - GAUGE / 2), ("R", centre + GAUGE / 2)):
            box(
                f"Track_{track_index}_Rail_{side}",
                (0, rail_y, RAIL_LEVEL),
                (TRACK_LENGTH, 0.075, 0.15),
                materials["rail"],
                tracks,
                0.018,
            )
        for sleeper_index in range(sleeper_count):
            x = -TRACK_LENGTH / 2 + sleeper_index * sleeper_spacing
            if track_index == 1 and sleeper_index == 0:
                sleeper = sleeper_template
                sleeper.name = "Track_1_Sleeper_000"
            else:
                sleeper = linked_copy(
                    sleeper_template,
                    f"Track_{track_index}_Sleeper_{sleeper_index:03d}",
                    (x, centre, 0.60),
                    tracks,
                )
            for side_index, rail_y in enumerate((centre - GAUGE / 2, centre + GAUGE / 2)):
                if track_index == 1 and sleeper_index == 0 and side_index == 0:
                    fastener = fastener_template
                    fastener.name = "Track_1_Fastener_000_L"
                else:
                    fastener = linked_copy(
                        fastener_template,
                        f"Track_{track_index}_Fastener_{sleeper_index:03d}_{side_index}",
                        (x, rail_y, 0.715),
                        tracks,
                    )
    return tracks


def build_station_context(materials):
    context = collection("MVIS_Station_Context")
    box("Platform_Left", (0, -3.2, 1.05), (TRACK_LENGTH, 2.7, 0.72), materials["platform"], context, 0.04)
    box("Platform_Right", (0, 15.3, 1.05), (TRACK_LENGTH, 2.7, 0.72), materials["platform"], context, 0.04)
    for platform_y in (-1.88, 13.98):
        box("Platform_Edge", (0, platform_y, 1.39), (TRACK_LENGTH, 0.16, 0.08), materials["safety_yellow"], context, 0.01)

    for side_index, mast_y in enumerate((-2.0, 14.1)):
        for mast_index, x in enumerate(range(-54, 55, 18)):
            cylinder(
                f"OHE_Mast_{side_index}_{mast_index}",
                (x, mast_y, 4.25),
                0.09,
                6.5,
                materials["steel"],
                context,
                16,
            )
            box(
                f"OHE_Arm_{side_index}_{mast_index}",
                (x, 6.0, 6.25),
                (0.1, 16.2, 0.1),
                materials["steel"],
                context,
                0.015,
            )
    for track_index, centre in enumerate(TRACK_CENTRES, start=1):
        curve_tube(
            f"OHE_Contact_Wire_{track_index}",
            ((-60, centre, 5.72), (60, centre, 5.72)),
            0.018,
            materials["wire"],
            context,
        )

    for fence_y in (-1.35, 13.45):
        for x in range(-56, 57, 4):
            cylinder(f"Fence_Post_{fence_y}_{x}", (x, fence_y, 1.25), 0.035, 1.8, materials["steel"], context, 10)
        for z in (0.75, 1.25, 1.7):
            curve_tube(f"Fence_Rail_{fence_y}_{z}", ((-58, fence_y, z), (58, fence_y, z)), 0.018, materials["steel"], context)

    for index, (x, y) in enumerate(((-18, -1.0), (22, 13.1), (38, 6.0))):
        pole = cylinder(f"Signal_Pole_{index}", (x, y, 2.2), 0.07, 3.0, materials["steel"], context, 16)
        box(f"Signal_Head_{index}", (x, y, 3.75), (0.38, 0.3, 0.72), materials["signal_black"], context, 0.06)
        cylinder(f"Signal_Green_{index}", (x - 0.155, y, 3.62), 0.09, 0.035, materials["signal_green"], context, 20, (0, math.pi / 2, 0))

    sign_panel = box("NZM_Station_Sign", (-10, -3.0, 2.45), (5.8, 0.18, 1.25), materials["station_sign"], context, 0.05)
    create_text("NZM_Sign_Text", "HAZRAT NIZAMUDDIN", (-10, -3.10, 2.4), 0.42, materials["text_dark"], context, (math.pi / 2, 0, 0))
    return context
