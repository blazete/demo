# Indian Railways MVIS Site Redesign

## Goal

Replace the fictional gate portal with a drawing-faithful, open trackside MVIS installation and raise the complete scene to a credible Indian Railways field-demonstration standard.

## Accepted visual reference

- Engineering layout: `01_MVIS_Site_Plan_Top_View.png`
- Engineering cross-section: `02_MVIS_Cross_Section_End_View.png`
- Consolidated visual target: `public/reference/mvis-open-trackside-concept.png`

The drawings control equipment count, relative placement and the absence of an overhead connecting structure. The generated concept controls material mood, environmental detail, field-engineer styling and photographic lighting.

## Inspection installation

The installation is an open 3 m inspection zone around a 1.676 m broad-gauge track. It contains two independent adjustable galvanized-steel lighting poles, four area-scan camera housings, eight side LED lamp modules, six low longitudinal LED strips, one protected centreline line-scan pit, two service cabinets and visible protected cable routes. Nothing bridges the track overhead.

Upper cameras target the coach body and upper underframe. Lower cameras target wheels, springs, brake rigging and bogies. The line-scan unit targets the underside. During active inspection, restrained translucent view volumes and warm practical light make coverage understandable. During defect focus, only the relevant indicators change to red.

## Materials and environment

The scene uses shared PBR materials with deterministic procedural surface variation: weathered galvanized steel, powder-coated camera housings, dark polished railheads, oxidized rail webs, stained concrete sleepers, coarse mixed ballast, dusty ground, rubber cable, safety-yellow lamp bodies, glass lenses and painted electrical cabinets. A warm Indian afternoon sun, sky/ground hemisphere fill, soft shadows and light atmospheric haze provide the default day look.

## Rolling stock and person

The native LHB-style train is restyled in an Indian Railways red/grey livery and receives improved body, window, underframe, wheel and bogie materials. A field engineer stands outside the track safety envelope wearing a pale-blue shirt, navy trousers, orange-yellow reflective vest, white helmet, ID badge, work boots and holding a rugged tablet. The native engineer has a subtle breathing/tablet-check animation.

The preferred external replacements are the selected downloadable CC-BY Sketchfab LHB coach and Indian person. Sketchfab requires authenticated downloads, so external assets are integrated only after their archives are supplied. The application keeps working with production-quality native fallbacks and exposes stable optional GLB paths.

## Licensing and attribution

Only assets with confirmed download rights and commercial-compatible terms may ship. Every imported asset must record title, author, source URL, licence and modifications in `public/assets/ATTRIBUTION.md`. CC-BY attribution remains visible from the completion screen or project credits. Unauthenticated scraping is prohibited.

## Performance and accessibility

Repeated sleepers, ballast and lamps use instancing or shared geometry/materials. Imported GLBs must be decimated and compressed before shipping; desktop targets remain below 250k visible triangles and mobile below 120k. Scan volumes are nonessential and reduced in low quality. Existing keyboard controls, captions, state narrative and 2D fallback remain intact.

## Acceptance criteria

- No gate, arch or overhead crossbeam is visible.
- Equipment topology matches both engineering drawings.
- Broad-gauge rails, under-track scanner and safe engineer position are visually legible.
- The welcome, pause/resume, inspection and defect-focus states still work.
- Desktop and mobile browser screenshots show no clipping or error overlay.
- Tests and production build pass.
- External assets, when supplied, load through optional adapters and retain attribution.
