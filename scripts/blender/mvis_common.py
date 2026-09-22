import math
from pathlib import Path

import bpy
from mathutils import Vector


PROJECT_ROOT = Path("/Users/shreyanshmalviya/Desktop/threejs")
MODEL_DIR = PROJECT_ROOT / "public/assets/models"


def reset_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)
    for target in list(bpy.data.collections):
        if target.name != "Collection":
            bpy.data.collections.remove(target)
    default = bpy.data.collections.get("Collection")
    if default:
        default.name = "MVIS_Root"


def collection(name):
    target = bpy.data.collections.get(name)
    if target is None:
        target = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(target)
    return target


def move_to_collection(obj, target):
    for source in list(obj.users_collection):
        source.objects.unlink(obj)
    target.objects.link(obj)


def material(name, color, metallic=0.0, roughness=0.5, emission=None, alpha=1.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, alpha)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Alpha"].default_value = alpha
    if emission:
        emission_input = shader.inputs.get("Emission Color") or shader.inputs.get("Emission")
        strength_input = shader.inputs.get("Emission Strength")
        emission_input.default_value = (*emission[0], 1.0)
        if strength_input:
            strength_input.default_value = emission[1]
    if alpha < 1.0:
        mat.surface_render_method = "DITHERED"
    return mat


def concrete_material():
    mat = bpy.data.materials.get("MVIS_Concrete") or bpy.data.materials.new("MVIS_Concrete")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    noise = nodes.new("ShaderNodeTexNoise")
    ramp = nodes.new("ShaderNodeValToRGB")
    bump = nodes.new("ShaderNodeBump")
    noise.inputs["Scale"].default_value = 7.0
    noise.inputs["Detail"].default_value = 3.0
    ramp.color_ramp.elements[0].color = (0.18, 0.2, 0.22, 1)
    ramp.color_ramp.elements[1].color = (0.54, 0.57, 0.59, 1)
    bump.inputs["Strength"].default_value = 0.16
    bump.inputs["Distance"].default_value = 0.07
    shader.inputs["Roughness"].default_value = 0.86
    links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(ramp.outputs["Color"], shader.inputs["Base Color"])
    links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    return mat


def box(name, location, dimensions, mat, target, bevel=0.02):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    move_to_collection(obj, target)
    if bevel:
        modifier = obj.modifiers.new("Edge Bevel", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
    if mat:
        obj.data.materials.append(mat)
    return obj


def cylinder(name, location, radius, depth, mat, target, vertices=20, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation
    )
    obj = bpy.context.object
    obj.name = name
    move_to_collection(obj, target)
    if mat:
        obj.data.materials.append(mat)
    return obj


def curve_tube(name, points, radius, mat, target, cyclic=False):
    curve_data = bpy.data.curves.new(name, "CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = radius
    curve_data.bevel_resolution = 3
    spline = curve_data.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, coordinate in zip(spline.points, points):
        point.co = (*coordinate, 1.0)
    spline.use_cyclic_u = cyclic
    obj = bpy.data.objects.new(name, curve_data)
    target.objects.link(obj)
    if mat:
        curve_data.materials.append(mat)
    return obj


def look_at(obj, target, track="-Z", up="Y"):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat(track, up).to_euler()


def world_bounds(objects):
    points = []
    for obj in objects:
        if obj.type != "MESH":
            continue
        points.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
    if not points:
        return Vector((0, 0, 0)), Vector((1, 1, 1))
    return (
        Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points))),
        Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points))),
    )


def imported_descendants(root):
    return [obj for obj in bpy.data.objects if obj == root or root in obj.parent_recursive]


def import_glb(path, name, target, target_length=None, target_height=None):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(path), import_shading="NORMALS")
    imported = list(set(bpy.data.objects) - before)
    root = bpy.data.objects.new(name, None)
    target.objects.link(root)
    for obj in imported:
        if obj.parent is None:
            obj.parent = root
        move_to_collection(obj, target)

    bpy.context.view_layer.update()
    minimum, maximum = world_bounds(imported)
    dimensions = maximum - minimum
    longest_axis = max(range(3), key=lambda index: dimensions[index])
    if longest_axis == 1:
        root.rotation_euler[2] = -math.pi / 2
    elif longest_axis == 2:
        root.rotation_euler[1] = math.pi / 2
    bpy.context.view_layer.update()

    minimum, maximum = world_bounds(imported)
    dimensions = maximum - minimum
    if target_length:
        scale = target_length / max(dimensions.x, 0.001)
    elif target_height:
        scale = target_height / max(dimensions.z, 0.001)
    else:
        scale = 1.0
    root.scale = (scale, scale, scale)
    bpy.context.view_layer.update()

    minimum, maximum = world_bounds(imported)
    root.location += Vector((-(minimum.x + maximum.x) / 2, -(minimum.y + maximum.y) / 2, -minimum.z))
    bpy.context.view_layer.update()
    return root, imported


def create_text(name, body, location, size, mat, target, rotation=(math.pi / 2, 0, 0)):
    data = bpy.data.curves.new(name, "FONT")
    data.body = body
    data.align_x = "CENTER"
    data.size = size
    data.extrude = size * 0.025
    obj = bpy.data.objects.new(name, data)
    obj.location = location
    obj.rotation_euler = rotation
    target.objects.link(obj)
    data.materials.append(mat)
    return obj
