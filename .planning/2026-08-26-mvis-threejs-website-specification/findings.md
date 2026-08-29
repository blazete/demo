# Findings & Decisions

## Requirements
- Read both PDFs in `/Users/shreyanshmalviya/Desktop/threejs`.
- Produce one comprehensive Markdown file in the same folder.
- Specify a start-to-end interactive Three.js website experience.
- Improve missing or weak areas proactively while preserving the source intent.
- Cover enough detail for a development team to implement the site later.

## Current Implementation Audit
- The user has created a Vite React 18 / TypeScript / React Three Fiber vertical-slice application in this folder.
- The stated implementation covers the scenario machine, portal, train, environment, control room, camera director, HUD, evidence, controls, welcome screen, and accessible narrative.
- The application package does not currently list XState, although the user describes an XState v5 machine. This is an initial dependency-compliance risk to validate before runtime testing.
- `npm run build` succeeds: TypeScript type-check and Vite production build both complete. Vite reports one bundle-size warning: the generated JavaScript chunk is 1,003.10 kB uncompressed (274.39 kB gzip), which exceeds its 500 kB warning threshold.
- The local Vite server is running at `http://127.0.0.1:5173` after an initial sandbox port-binding restriction was resolved with approved local-network access.
- The in-app Browser runtime reports that no browser is available in this session. Rendered validation will use the Playwright fallback if the project provides it.
- Playwright is not present in package dependencies or node_modules. The agent-browser CLI is also unavailable (`command not found`). No new browser-testing dependency has been installed because the user has not authorized dependency changes.
- Server-level HTTP smoke test could not connect to port 5173 from the restricted command sandbox, even though the Vite server reported readiness from the approved server session. This is a sandbox network-boundary issue, not yet an application failure.
- Re-running the local HTTP smoke check with the same approved local-network access returns HTTP 200 and the expected Vite HTML document. The app is served correctly at `http://127.0.0.1:5173`.
- The source tree does not contain `src/experience/machine/scenarioMachine.ts`, despite the user-provided inventory. The current `ExperienceShell.tsx` instead implements state progression with local React state, timers, and intervals; it does not import or use XState.
- The production build passes because the missing scenario-machine file is not imported.
- Initial code-review findings in `ExperienceShell.tsx`: Pause/Resume callbacks are no-ops; the defect highlight is hard-coded to B4 rather than using scenario data; defect count is set before a defect necessarily occurs; the inspection loop is capped at six coaches; and the evidence panel opens during the defect-focus state rather than after it. These are specification-compliance gaps to validate and remediate after design approval.
- Additional scene/UI review findings: the camera maps DEFECT_FOCUS to the general inspection shot, leaving the dedicated defect-focus shot unused; FREE_ROAM has no third-person/WASD controller; and Train click callbacks are never supplied by the application shell.
- Train data and 3D construction disagree: mock data declares 18 total entries including a locomotive and B1–B17, while the Train component renders a locomotive plus B1–B18. The rail centreline is also offset from the train centreline, which is likely to make the wheels appear misaligned with the rails.
- The weather scenario is not materially rendered because LightingRig only uses time of day. The control room receives metrics but does not render values. The evidence card shows metadata but not the required evidence gallery. The accessible-walkthrough link starts the 3D defect scenario instead of a 2D fallback.
- No audio system exists; mute does not control any audio. Quality tier only changes antialiasing/exposure and is not adaptive. Portal lights reuse one ref for multiple meshes, so not every intended strip can be independently animated. Background trees use render-time Math.random, weakening deterministic replay.
- The user approved a focused, spec-first remediation rather than a visual redesign. The written remediation design is at `docs/superpowers/specs/2026-08-26-mvis-remediation-design.md`.
- The prior specification remains the implementation baseline; the current task is to test and improve the existing app, not redesign the product.

## Research Findings
- The folder contains exactly two source PDFs and no existing website code or Markdown specification.
- `MVIS_ThreeJS_Digital_Twin_Blueprint.pdf` is a 2-page PDF (about 25 KB), likely the concise interactive-site concept.
- `MVIS_NR_FITT_PSPL_ANVT - sahibabad1-Model.pdf` is a 1-page PDF (about 207 KB), likely a visual/model reference sheet.
- The blueprint is ReportLab-generated with text streams compressed using ASCII85 plus Flate; direct `strings` cannot recover its body text.
- The model/reference PDF contains substantial embedded image/content data and is better suited to rendered-page inspection.
- The blueprint targets non-technical railway officials and requires the experience to explain inspection visually while hiding databases, cloud infrastructure, MQTT, APIs, AI models, storage pipelines, and other engineering internals.
- Required story: visitor enters an idle railway site; a train approaches; portal warning lights, cameras, and scanning effects activate; the train passes; wheels, springs, brakes, and bogies receive subtle emphasis; an optional spring defect is shown; evidence and an alert appear; the train exits; the portal returns to standby.
- Required interaction: cinematic third-person walking with WASD, a follow camera, inspectable portal/cameras/train/control screens, and no first-person mode.
- Required environment: realistic track, ballast, poles, signals, maintenance paths, industrial gantry, train models, ambient railway audio, dynamic lighting, and a nearby control room with simple operational metrics.
- Evidence UI should look like railway inspection output, not a software-architecture workflow. Suggested outputs include inspection image, inspection snapshot, defect snapshot, and report.
- Future CAD integration should replace placeholders with verified portal dimensions, camera positions, track spacing, and inspection zones.
- The engineering layout shows a real Indian Railways/Northern Railway multi-track site, with the MVIS portal on the DN main line, parallel tracks, trackside camera/screen structures, cable routes, a remote edge-processing/server-room location, traction infrastructure, and a temporary office/control location.
- The engineering drawing should guide spatial plausibility and asset placement; it should not be exposed directly as a technical overlay to the non-technical visitor.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Treat the blueprint's anti-technical-content instruction as a product requirement | The target visitor is a railway official, so implementation internals belong in the build specification, not the visitor-facing experience |
| Use the engineering plan as a spatial reference rather than a literal CAD viewer | This preserves site credibility without overwhelming the narrative experience |
| Documentation type: implementation specification/reference | Target readers are the designers and developers who will build the interactive demonstration; the visitor-facing audience remains non-technical railway officials |
| Exclude backend/cloud internals from the visitor experience but include integration contracts in the implementation sections | This satisfies the blueprint while keeping the build document complete |
| Use a guided-first experience with optional free-roam afterward | Approved by the user; it serves officials who need a clear story while preserving interactive inspection |
| Product direction is Guided Digital Twin | User selected approach 1; scenario controls remain simple and visitor-facing internals stay hidden |
| Experience architecture is approved | User approved the complete guided journey, including replay modes and optional free roam |
| Technical architecture is approved | The specification will use an explicit state machine, modular Three.js scene systems, progressive GLB/KTX2 assets, mock-to-live data contracts, adaptive rendering, and a 2D fallback |
| Visual/performance/quality section is approved | The approved direction uses railway-specific visual language, orchestrated scan motion, measurable device budgets, accessible equivalents, and failure-recovery testing |
| Final artifact | `MVIS_THREEJS_INTERACTIVE_WEBSITE_SPEC.md`, containing 44 numbered implementation sections and appendices |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| `mdls` was given a wildcard containing a spaced filename and could not resolve it | Use explicit absolute paths for each PDF |
| Spotlight `mdls` also failed on explicit absolute paths in this environment | Use direct PDF stream extraction and rendered-page inspection instead |
| Quick Look rendering failed inside the sandbox | Re-ran the same read-only rendering command with approved system access and inspected the temporary PNG |
| A findings update patch failed because research bullets had been appended below the issues table | Re-read the file and normalized the Research Findings and Issues sections |

## Resources
- `MVIS_ThreeJS_Digital_Twin_Blueprint.pdf`
- `MVIS_NR_FITT_PSPL_ANVT - sahibabad1-Model.pdf`

## Browser Validation Findings
- Desktop and mobile routes render successfully through Vite.
- The guided flow reaches the inspection state and then `DEFECT_FOCUS` for coach B4, with the “Potential defect identified” accessible status present.
- Pause/resume and skip controls are interactive in a real Chromium session.
- Chromium reports repeated WebGL `GPU stall due to ReadPixels` warnings during screenshot capture. These are performance warnings from headless rendering, not application exceptions; profile on target edge/browser hardware before production.
- Browser screenshots: `/private/tmp/mvis-desktop-welcome.png`, `/private/tmp/mvis-desktop-inspection.png`, `/private/tmp/mvis-mobile-welcome.png`.
- The supplied WAP-7 and HD track assets were matched to their Sketchfab source pages and confirmed as CC BY; all five bundled asset sources are documented in `public/assets/ATTRIBUTION.md`.
- Final GLB-integrated browser QA passes page identity, welcome rendering, pause/resume, inspection entry, actual defect focus, mobile rendering, framework-overlay absence and console health.
- Visual QA confirmed that the open trackside array matches the supplied top/end-view topology: paired upper/lower area cameras, four lamp stations per side and an under-track scan strip, with no overhead gate.
