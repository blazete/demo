# MVIS Blender Gantry Structures Design

## Purpose

Create a dimensionally accurate, presentation-ready Blender model of the complete MVIS support installation shown in the Hazrat Nizamuddin Station general arrangement drawing. The scene will include both the right-side overhead structure and the left-side cabinet structure.

## Modeling approach

Use a hybrid engineering model: preserve the stated dimensions and overall construction while adding restrained fabrication detail, bevels, and realistic materials. The model should remain lightweight enough for interactive inspection and later export to GLB.

Blender units will use metres, with source dimensions converted from millimetres at a scale of 1 mm = 0.001 m.

## Right-side structure

- Overall cabinet width: 5.0 m.
- Cabinet height: 0.8 m.
- Cabinet depth: 0.5 m.
- Cabinet bottom: 1.0 m above the foundation tops.
- Two vertical steel posts with 50 mm square sections.
- Two concrete foundations, each 0.5 m wide, 0.5 m deep, and 0.5 m high.
- Framed metal cabinet with a pale galvanized face and darker perimeter frame.

## Left-side structure

- Overall cabinet width: 1.5 m.
- Cabinet height: 1.8 m.
- Cabinet depth: 0.5 m.
- Three vertically stacked cabinet sections separated by horizontal steel members.
- Two short steel supports providing 0.3 m clearance between the cabinet and foundation tops.
- Two concrete foundations, each 0.5 m wide, 0.5 m deep, and 0.5 m high.
- Dark steel perimeter frame and pale metal cabinet panels.

## Scene layout and organization

Place the two assemblies beside each other with enough separation for inspection. Orient their front faces toward the default viewing direction. Keep the camera and light, then reposition them to frame the complete installation.

Organize generated objects into these collections:

- `MVIS_Right_Structure`
- `MVIS_Left_Structure`
- `MVIS_Foundations`

Use descriptive names for every object and material. Apply small bevels to exposed edges and smooth shading where appropriate. Do not add dimension annotations, railway tracks, vehicles, terrain, or surrounding station assets in this pass.

## Materials and presentation

- Steel frame: dark galvanized grey with moderate roughness.
- Cabinet panels: light grey metallic finish.
- Foundations: neutral concrete with subtle surface variation.
- Ground plane: simple matte neutral surface for scale and shadows.

Use a sun light and a soft area light for readable form. Set a three-quarter camera angle that shows the front and 0.5 m depth of both structures.

## Verification

After generation:

- Confirm the right cabinet dimensions are 5.0 × 0.5 × 0.8 m.
- Confirm the left cabinet dimensions are 1.5 × 0.5 × 1.8 m.
- Confirm both foundation pairs use 0.5 m cubes.
- Confirm the right post clearance is 1.0 m and the left cabinet clearance is 0.3 m above foundation tops.
- Confirm all generated objects are present in the expected collections and the scene can be saved without errors.
