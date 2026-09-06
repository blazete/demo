# MVIS Image Generation Prompt Pack

These prompts are designed for Nano Banana and GPT Image. For the most consistent results, attach the same references in this order for every generation:

1. The selected photorealistic MVIS reference image.
2. `01_MVIS_Site_Plan_Top_View.png` as the controlling site-layout reference.
3. `02_MVIS_Cross_Section_End_View.png` as the controlling camera-height and lighting reference.

The engineering drawings control layout and physical relationships. The photorealistic image controls materials, atmosphere, train appearance, and visual quality. Do not reproduce labels, dimensions, arrows, or title blocks from the drawings.

## Recommended settings

- Aspect ratio: 16:9 landscape, except the cross-section view, which may use 4:3.
- Quality: highest available.
- Stylization: low.
- Initial variants: three per angle.
- Keep the same seed or reference image when the generator supports consistency controls.

## Master scene-lock prompt

Paste this block first, followed by exactly one angle prompt from the sections below.

```text
Create a technically credible, engineering-photorealistic Blender/Cycles-style visualization of the same proposed Indian Railways Machine Vision Inspection System site shown in the attached references.

SCENE IDENTITY AND GEOMETRY LOCK:
Show exactly four straight, parallel Indian broad-gauge railway tracks. The active MVIS line is the rightmost of the four tracks, with three complete empty tracks to its left. Every track has two continuous weathered steel rails, concrete sleepers, realistic brown-grey ballast and correct spacing. A red-and-cream WAP-7 electric locomotive hauling blue/red Indian Railways LHB coaches travels on the rightmost active track. Wheels sit correctly on the rails and the train has believable Indian railway proportions.

Show realistic Indian 25 kV AC overhead electrification over all four tracks: galvanized steel masts, cantilevers, insulators, continuous messenger wires, droppers and contact wires correctly aligned above each track. All wires must be connected and tensioned; no floating or broken wire fragments.

MVIS LAYOUT LOCK:
This is an OPEN trackside inspection array. There is no overhead MVIS portal, gate, arch, gantry, tunnel, roof, canopy or structure crossing above the train.
- CAM-1 and CAM-2 are adjustable upper industrial area-scan cameras on opposite sides of the active track at approximately 1.8 m height, aimed toward the upper train body.
- CAM-3 and CAM-4 are lower industrial area-scan cameras on opposite sides at approximately 0.6 m height, aimed toward wheels, springs, brake rigging and bogies.
- CAM-5 is a protected under-track line-scan camera centred between the active rails in a rectangular flush inspection pit. Its circular cyan-tinted optical glass dome and trim ring visibly face upward.
- Show exactly eight 150 W inspection lamps, four on each side, mounted on short adjustable poles and aimed across the train body and underframe.
- Show exactly six narrow warm-white under-track LED strips across the active inspection zone around CAM-5.
- Show separate entry and exit axle sensors and one relay/control cabinet beside the active line.
- Keep every item outside the train clearance envelope except the protected flush CAM-5 pit and LED strips.

SAFETY AND OFFICE LOCK:
Include a chain-link perimeter fence and a clean maintenance/service path. Place a dark-green corrugated project-office portacabin beyond the fence on the service-road side. The entire cabin and concrete foundation must be clear of all rails, sleepers and ballast beds. Its long side must be parallel to the tracks. Include one Indian railway field engineer in a high-visibility vest and white hard hat standing safely beside the equipment for human scale.

VISUAL LOCK:
Use physically based materials, realistic scale, crisp industrial detail, restrained natural colours, accurate shadows and professional railway-infrastructure presentation quality. The site should look maintained but operational, not futuristic or pristine. No readable text, labels, arrows, dimensions, title blocks, floating interface, watermark or invented railway logo.

STRICTLY AVOID:
An overhead inspection frame; station platform; passenger station; roof canopy; tunnel; more or fewer than four tracks; cabin on railway infrastructure; hidden CAM-5 lens; incorrect track gauge; disconnected overhead wires; cameras attached to the train; floating train; distorted wheels; toy-like miniatures; cyberpunk neon; holograms; excessive depth of field; trees or clutter blocking the MVIS equipment.

This image is visual art direction for a later Blender model. Engineering dimensions remain controlled by the supplied drawings.
```

## Angle 1 - Official aerial hero

```text
CAMERA ANGLE: Elevated three-quarter hero view from the service-road side, camera height approximately 14 m, looking diagonally along the tracks. Use a 35-45 mm full-frame-equivalent lens. Compose the MVIS inspection zone at the visual centre, show all four tracks from foreground into the distance, and show the WAP-7 locomotive entering the equipment array without hiding CAM-3, CAM-4 or CAM-5. Keep the complete fenced portacabin visible in the middle distance with obvious railway clearance. Natural late-morning daylight, slightly warm sun, clean blue sky, soft shadows, mild atmospheric perspective and only subtle depth of field. Formal railway proposal hero image, wide 16:9.
```

## Angle 2 - High drone site overview

```text
CAMERA ANGLE: High oblique drone overview from approximately 35 m above ground, looking along the entire railway corridor with a 28-35 mm lens. Clearly show and make countable all four parallel tracks, the complete overhead-electrification layout, entry sensor, inspection zone, exit sensor, relay cabinet, maintenance path, fence and portacabin. The train is approaching the MVIS zone on the rightmost active track. Prioritize spatial clarity and site relationships over cinematic depth of field. Bright neutral daytime, engineering master-plan visualization, wide 16:9.
```

## Angle 3 - Engineering top view

```text
CAMERA ANGLE: Near-orthographic top-down view, camera directly above the MVIS zone with the track direction vertical in the image. Show exactly four complete parallel tracks. The train occupies the rightmost active line, with enough transparency of composition or train offset to keep the paired cameras, eight side lamps, six under-track strips, CAM-5 pit, entry/exit sensors and relay cabinet readable. The fenced portacabin must sit fully outside the railway corridor and parallel to the tracks. Use realistic 3D materials and shadows but retain the clarity of an engineering site-plan render. No labels or dimension lines. Wide 16:9.
```

## Angle 4 - Cross-section end view

```text
CAMERA ANGLE: Symmetrical end-on cross-section-style 3D view across the active broad-gauge track, camera centred on the active track at approximately 1.3 m height with a 50-70 mm lens. Show both rails in the foreground, CAM-1 and CAM-2 at the upper 1.8 m level on opposite sides, CAM-3 and CAM-4 at the lower 0.6 m level, the upward-facing CAM-5 lens centred below between the rails, six LED strips around the pit, and four lamps per side. Include the train farther behind the inspection plane so equipment remains visible. Preserve realistic depth and materials while making height relationships unmistakable. Neutral daylight, balanced technical lighting, 4:3 or 16:9.
```

## Angle 5 - Trackside side elevation

```text
CAMERA ANGLE: Low trackside side-elevation view from the fenced service-path side, camera height approximately 1.5 m, parallel to the rails, using a 50 mm lens. Show the WAP-7 and first LHB coach passing slowly through the open MVIS zone. Clearly reveal the upper and lower camera pairs, lamp poles, relay cabinet, axle sensor and the flush LED-strip/CAM-5 pit zone beneath the train. Keep all equipment visibly outside the loading gauge. Show the cabin beyond the fence in the background, aligned parallel to the train. Realistic midday industrial photography style with crisp underframe detail, wide 16:9.
```

## Angle 6 - Train approach view

```text
CAMERA ANGLE: Front three-quarter approach view from a safe elevated position beside the service path, looking toward the oncoming WAP-7 with an 85 mm lens. The locomotive approaches but has not yet covered the MVIS array. Frame the paired upper/lower cameras and inspection lamps on both sides like a precise open corridor, never an overhead gate. Show the CAM-5 cyan lens and six strip lights in the foreground between the active rails. All four tracks and continuous overhead wires remain visible. Natural daylight, restrained cinematic tension, technically accurate and presentation-ready, wide 16:9.
```

## Angle 7 - Train exit and coach inspection view

```text
CAMERA ANGLE: Rear three-quarter elevated view from the opposite end of the site, camera height approximately 5 m with a 60 mm lens. The locomotive has passed and the first LHB coaches are moving through the MVIS zone, exposing wheels, coil springs, brake rigging and bogies to the lower cameras and warm inspection lamps. Keep CAM-5 visible through a gap beneath the coach and preserve the open, unobstructed overhead clearance. Show the three empty parallel tracks beside the active line and realistic OHE perspective. Clean late-afternoon daylight, wide 16:9.
```

## Angle 8 - CAM-5 line-scan macro

```text
CAMERA ANGLE: Close engineering detail shot from approximately 1 m above and 1.5 m to the side of the active track, using a 70-90 mm macro-style lens. Focus on the protected rectangular CAM-5 enclosure between the rails. Clearly show the circular cyan-tinted optical glass dome, metallic trim ring, dark anodized camera body, protective housing, cable connector, drainage details and six narrow warm-white LED strips. Keep rail heads and concrete sleepers in frame for scale. The lens must face upward and remain unobstructed. No train directly over the pit; show a blurred LHB coach approaching in the background. High-detail PBR materials, realistic glass reflections, technical product-visualization quality, wide 16:9.
```

## Angle 9 - Paired cameras and lighting detail

```text
CAMERA ANGLE: Medium close three-quarter view from the service-path side at approximately 2 m height with a 55 mm lens. Feature one upper 6 mm area-scan camera, one lower 12 mm area-scan camera, their adjustable galvanized mounts, protective housings, cable conduits, nearby 150 W inspection lamps and relay cabinet. Across the rails, show the matching opposite-side camera pair to communicate full coverage. Keep the passing train slightly behind the equipment and preserve safe clearance. Crisp daylight, realistic industrial product photography, wide 16:9.
```

## Angle 10 - Project office safety context

```text
CAMERA ANGLE: Elevated three-quarter view from outside the perimeter, camera height approximately 6 m with a 40 mm lens. Feature the dark-green corrugated MVIS project-office portacabin on its concrete foundation, fully beyond the chain-link fence and aligned parallel to the railway tracks. Show the service path connecting the office to the inspection zone, with the field engineer walking safely toward the relay cabinet. In the background, show all four tracks, OHE and the open MVIS array. Make the physical gap between cabin, fence and nearest railway infrastructure unmistakable. Bright neutral daylight, professional site-safety visualization, wide 16:9.
```

## Angle 11 - Night operation

```text
CAMERA ANGLE: Elevated trackside three-quarter view from the service-road side at blue hour/night, camera height approximately 7 m with a 45 mm lens. The WAP-7 approaches the open MVIS zone on the rightmost active track. Its twin warm-white headlights throw realistic long beams down the rails. Eight inspection lamps and six under-track LED strips illuminate the train body, wheels and underframe without overexposure. CAM-5's cyan lens glows subtly upward from the protected pit. The portacabin has restrained warm interior/exterior light beyond the fence. Keep overhead wires, masts, all four tracks and equipment readable against a deep navy sky. Realistic exposure, no neon cyberpunk colour, wide 16:9.
```

## Angle 12 - Monsoon rain operation

```text
CAMERA ANGLE: Dynamic but technically readable elevated three-quarter view during moderate Indian monsoon rain, camera height approximately 8 m with a 50 mm lens. Show visible rain streaks, wet reflective rail heads, damp sleepers, darkened ballast, small controlled puddles beside the drainage path and realistic spray near the passing train. Keep the MVIS camera housings, electrical cabinets and CAM-5 pit visibly weather-sealed. Inspection lamps reflect softly on wet surfaces while the upward CAM-5 lens remains clear, not flooded. The portacabin stays safely outside the fence. Preserve exactly four tracks and correctly connected OHE. Overcast daylight, realistic subdued palette, no storm destruction or flooding, wide 16:9.
```

## Correction prompt for inconsistent results

Use this after attaching the incorrect generated image plus both engineering drawings:

```text
Correct only the engineering-layout errors while preserving the image's camera angle, lighting, realistic materials, train appearance and overall composition.

Required corrections:
1. Show exactly four complete parallel broad-gauge tracks; the train is on the rightmost track and three empty tracks are to its left.
2. Remove every overhead MVIS gate, arch, gantry, canopy or cross-track frame. Keep only normal 25 kV railway electrification above the tracks.
3. Restore four area-scan cameras: two upper cameras at approximately 1.8 m and two lower cameras at approximately 0.6 m, positioned on opposite sides of the active track.
4. Restore exactly eight side inspection lamps, four per side, and exactly six under-track LED strips.
5. Make the real CAM-5 circular cyan optical dome and trim ring visible facing upward inside a protected rectangular pit between the active rails.
6. Move the complete green portacabin and its foundation beyond the chain-link fence, entirely off ballast and parallel to the tracks.
7. Connect and align all messenger wires, droppers and contact wires over all four tracks.

Do not change correct parts of the image. Add no text, labels, arrows, dimensions, watermark, invented logo, station platform, extra track, futuristic lighting or railway obstruction.
```

## Generator-specific usage

### Nano Banana

Attach all three references, then paste the Master scene-lock prompt followed by one angle block. Add: `Use the first image for photorealistic appearance, the second for plan geometry, and the third for equipment heights. Geometry references override appearance references whenever they conflict.`

### GPT Image

Attach all three references, then paste the Master scene-lock prompt followed by one angle block. End with: `Preserve exact counts and spatial relationships. Produce one presentation-ready image without captions, labels, borders or watermark.`
