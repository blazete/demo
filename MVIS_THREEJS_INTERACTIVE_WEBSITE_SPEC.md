# MVIS Three.js Interactive Website Specification

**Project:** Machine Vision Inspection System (MVIS) Guided Digital Twin  
**Primary audience for the experience:** Indian Railways officials, inspectors, operations leaders, and demonstration visitors  
**Primary audience for this document:** Product owners, railway-domain reviewers, UX designers, 3D artists, frontend engineers, QA engineers, and deployment teams  
**Document status:** Approved design specification for implementation  
**Prepared:** 26 August 2026  
**Recommended filename:** MVIS_THREEJS_INTERACTIVE_WEBSITE_SPEC.md  

---

## 1. Document purpose, ownership, and revision control

This document defines the complete product, experience, visual, 3D, technical, data, quality, and delivery requirements for an interactive Three.js demonstration of the Indian Railways Machine Vision Inspection System.

The website is a guided digital twin: it explains how a train passes through an MVIS portal, how rolling-stock components are inspected, how a defect becomes evidence, and how an official receives a clear result. It must communicate operational value without exposing databases, message brokers, AI-model internals, storage pipelines, or other backend architecture to the visitor.

This is an implementation contract, not a mood board. Deviations that affect the journey, data meaning, accessibility, performance budgets, or acceptance criteria require product-owner approval.

| Field | Value |
|---|---|
| Product owner | To be assigned by the MVIS programme |
| Railway-domain approver | To be assigned |
| Technical owner | To be assigned |
| Design owner | To be assigned |
| Current revision | 1.0 |
| Source of truth | This Markdown file and approved linked assets |
| Change process | Pull request or controlled document revision with review notes |

### Revision history

| Revision | Date | Summary | Approval |
|---|---|---|---|
| 1.0 | 2026-08-26 | Initial implementation-ready specification | Pending named stakeholder sign-off |

---

## 2. Executive summary

The product will open inside a believable Indian railway inspection site. A third-person visitor arrives while the portal is idle, hears and sees a train approach, watches the inspection portal activate, follows the passing train, and observes wheels, springs, brake assemblies, and bogies being inspected.

In the default scenario, one spring defect is detected. The camera moves to a safe, readable inspection view; the affected component receives a controlled visual emphasis; and an evidence card reports defect type, coach number, severity, inspection time, and supporting imagery. The train then exits, the portal returns to standby, and the visitor may explore the site or replay another scenario.

The implementation will use React, TypeScript, React Three Fiber, and Three.js. A deterministic finite-state machine will govern the experience. GLB assets, compressed geometry, KTX2 textures, progressive loading, reusable materials, level-of-detail models, and adaptive quality will make the experience practical on field laptops and mobile devices.

The final product must feel like railway inspection—not a generic technology dashboard or science-fiction simulation.

---

## 3. Source material and interpretation

### 3.1 Source PDFs

1. [MVIS Three.js Digital Twin Blueprint](./MVIS_ThreeJS_Digital_Twin_Blueprint.pdf)
2. [MVIS Northern Railway Site Layout Reference](<./MVIS_NR_FITT_PSPL_ANVT - sahibabad1-Model.pdf>)

### 3.2 Requirements derived from the blueprint

- The visitor is generally non-technical.
- The primary explanation must be visual and operational.
- The site includes railway track, ballast, poles, signals, maintenance paths, an industrial inspection portal, train models, ambient railway sound, and changing light conditions.
- Movement is third-person, with keyboard and touch equivalents. First-person mode is excluded.
- The inspection story progresses from standby to approach, activation, scanning, defect handling, evidence, alert, exit, and reset.
- Wheels, springs, brakes, and bogies receive subtle component emphasis during inspection.
- The default defect is a spring fault.
- Evidence includes an inspection image, inspection snapshot, defect snapshot, and inspection report.
- A nearby control room displays simple operational metrics.
- Future CAD data will replace placeholder dimensions and camera positions.

### 3.3 Requirements derived from the engineering layout

- The world should resemble a multi-track Indian railway site rather than an isolated showroom.
- The MVIS portal is concentrated around one operational line with parallel tracks nearby.
- Camera structures, cable routes, traction infrastructure, service paths, and a control-room or office location inform spatial plausibility.
- The engineering drawing is an internal production reference. It must not be presented to visitors as a dense technical overlay.

### 3.4 Interpretation rules

- Where the PDFs conflict with implementation feasibility, preserve the visitor outcome and document the technical adjustment.
- Dimensions shown in the experience are provisional until validated against approved CAD or survey data.
- Demonstration data must be clearly marked as simulated whenever it could be mistaken for a live railway record.
- Visitor-facing terminology uses railway and inspection language. Engineering terms remain in this implementation document only.

---

## 4. Product vision and audience

### 4.1 Vision

Create the clearest possible interactive explanation of trackside machine-vision inspection: a railway official should understand what activates, what is inspected, what evidence is produced, and what action follows—without needing a technical presentation.

### 4.2 Primary visitor groups

| Visitor | Need | Experience response |
|---|---|---|
| Railway decision-maker | Understand value quickly | Guided story with clear outcomes and evidence |
| Inspection or maintenance official | Verify component and defect relevance | Inspectable train components and credible terminology |
| Operations official | Understand flow and alert timing | Visible sequence from train arrival to actionable result |
| Demonstration presenter | Control a reliable presentation | Pause, skip, replay, scenario selection, and predictable timing |
| Mobile visitor | Review the concept without workstation hardware | Touch controls, simplified scene, and 2D alternative |

### 4.3 Internal delivery audiences

- Product and programme management
- Railway-domain specialists
- UX and visual designers
- 3D/CAD and technical artists
- Frontend and Three.js engineers
- API/integration engineers
- Accessibility and quality engineers
- Hosting and security teams

---

## 5. Goals and measurable success criteria

### 5.1 Product goals

1. Explain the complete inspection sequence in under three minutes.
2. Make the portal, inspected components, detected defect, and evidence immediately understandable.
3. Preserve enough realism to earn technical and railway-domain trust.
4. Allow exploration without sacrificing the clarity of the guided narrative.
5. Run reliably across presentation displays, office laptops, field laptops, and supported mobile devices.
6. Provide a clean migration path from simulated data to approved MVIS summary APIs.

### 5.2 Success measures

| Measure | Target |
|---|---|
| Guided story comprehension | At least 80% of pilot users can identify the inspected components and result without additional explanation |
| Guided journey completion | At least 85% of started guided sessions reach the result state |
| Defect evidence discovery | At least 90% of observed sessions expose the defect evidence card |
| Crash-free sessions | At least 99.5% during controlled demonstrations |
| Interactive standby load | Within 6 seconds on the defined 10 Mbps test profile |
| Mobile rendering | Sustained 30 FPS or higher on the approved baseline device |
| Desktop rendering | Target 55–60 FPS on the approved high-quality device |
| Accessibility | No critical keyboard, reduced-motion, contrast, or screen-reader blockers |

Analytics must be disabled or privacy-filtered when policy does not permit visitor tracking.

---

## 6. Scope, non-goals, assumptions, and dependencies

### 6.1 In scope

- Full-screen interactive 3D railway site
- Guided cinematic inspection story
- Optional third-person free roam
- Desktop keyboard/mouse and mobile touch controls
- Portal, train, inspected components, control room, and environmental props
- Normal, defect, night, and adverse-weather scenarios
- Inspection progress, defect card, evidence gallery, alert, and summary
- Adaptive rendering and 2D fallback
- Mock data with future live-data adapters
- Accessibility, testing, analytics boundaries, and deployment guidance

### 6.2 Out of scope for the first release

- Training or evaluating a YOLO model
- Displaying live model inference overlays or bounding boxes
- Visualizing cloud storage, databases, MQTT, queues, edge servers, or network topology
- Controlling real railway equipment
- Serving as the official system of record
- Editing or acknowledging operational defects
- Multi-user simulation
- Full CAD/BIM authoring inside the browser
- First-person or virtual-reality mode
- Photoreal digital reproduction of every Sahibabad site object before CAD validation

### 6.3 Assumptions

- Approved or placeholder GLB models can be created for the portal, train, track, and environment.
- Railway-domain reviewers will validate component names and defect wording.
- The first release uses simulated records.
- The hosting platform supports HTTPS, static asset caching, compressed files, and secure API access if live mode is enabled.
- Audio files, fonts, logos, and train liveries will be cleared for use.

### 6.4 Dependencies requiring stakeholder input

| Dependency | Required decision |
|---|---|
| CAD/site survey | Portal dimensions, track positions, camera mounts, and control-room position |
| Train reference | Locomotive and coach types to represent |
| Defect taxonomy | Approved name, severity, and visual representation of spring fault |
| Evidence content | Approved sample images and report wording |
| Branding | Indian Railways, Northern Railway, partner marks, colours, and disclaimer |
| Languages | English-only release or Hindi/regional localization |
| Live integration | API availability, authentication, update frequency, and data policy |

---

## 7. Experience and design principles

1. **Show the operation, not the architecture.** Visitors see the train, inspection, evidence, and result.
2. **Guide first, explore second.** The first session delivers a coherent story before offering free roam.
3. **Use realism to clarify.** Detail supports railway understanding; decoration that distracts from inspection is removed.
4. **Make every state legible.** Standby, activation, inspection, defect, completion, and failure each have distinct visual, motion, audio, and text cues.
5. **Reserve emphasis for evidence.** Strong colour and motion appear only when operationally meaningful.
6. **Never rely on colour alone.** Labels, symbols, patterns, and motion reinforce status.
7. **Keep the experience deterministic.** A presenter can replay the same scenario with predictable timing.
8. **Degrade gracefully.** Lower quality reduces visual cost, not meaning.
9. **Treat the active track safely.** The avatar remains on designated paths and cannot walk into the passing train.
10. **Use plain operational language.** Avoid phrases such as “model inference pipeline” in visitor UI.

---

## 8. Information architecture

The product is one immersive application with layered controls rather than a conventional multi-page site.

### 8.1 Experience layers

| Layer | Purpose |
|---|---|
| 3D world | Railway site, portal, train, inspection and exploration |
| Guided director | Camera, timing, scene focus, narration captions, and progression |
| Operational HUD | Portal status, train identity, coach progress, and scenario stage |
| Evidence layer | Defect details, images, report summary, and alert outcome |
| Control layer | Pause, skip, replay, mute, captions, quality, help, and exit guide |
| Accessible narrative | DOM-based structured equivalent of the essential 3D information |

### 8.2 Top-level modes

- **Guided mode:** Default. Camera direction and scenario timing explain the complete process.
- **Free-roam mode:** Available after completion or from an explicit “Explore site” action.
- **Replay mode:** Presenter selects Clean inspection, Spring defect, Night inspection, or Adverse weather.
- **Fallback mode:** A lightweight 2D sequence presents the same story when 3D is unavailable or intentionally disabled.

### 8.3 Persistent controls

- Pause or resume
- Skip current guided moment
- Replay scenario
- Mute or unmute
- Captions on or off
- Controls/help
- Quality: Auto, High, Balanced, Low
- Exit guided mode or return to guided mode

On mobile, secondary controls collapse behind an accessible “Experience settings” button.

---

## 9. Complete visitor journey

### 9.1 Loading and welcome

The page immediately shows a branded but restrained loading surface. Progress uses understandable stages: “Preparing railway site,” “Loading inspection portal,” and “Preparing train.” A still image or lightweight procedural track prevents a blank canvas.

When essentials are ready, the welcome panel states:

> Experience how MVIS inspects a moving train and turns a detected defect into reviewable evidence.

Primary action: **Begin inspection**  
Secondary action: **View accessible walkthrough**

Audio remains off until the visitor begins.

### 9.2 Site arrival

The camera reveals the third-person visitor on a designated maintenance path. The MVIS portal is visible ahead but inactive. A short, optional prompt introduces movement and camera controls.

The visitor is given several seconds to orient. The guided director then moves attention toward the portal and track.

### 9.3 Standby

Portal lights are subdued. Camera housings are visible but inactive. The operational HUD shows:

- Portal: Standby
- Track: Clear
- Next inspection: Approaching

Environmental sound establishes place without overpowering instructions.

### 9.4 Train approach

A distant horn, rail vibration, signal change, and directional sound communicate approach. A concise banner identifies the simulated train and expected arrival.

The camera remains outside the track exclusion zone. The visitor may rotate the view but cannot interrupt critical staging.

### 9.5 Portal activation

Safety indicators blink in a controlled pattern. Blue inspection LEDs illuminate. Camera heads or visible sensor housings wake in sequence. A scan pulse travels across the portal.

Visitor-facing status changes to **Portal active**. No servers, models, or network diagrams appear.

### 9.6 Live inspection

As coaches pass:

- Wheels receive a brief rim-light or material-emphasis pulse.
- Springs receive a localized glow.
- Brake assemblies receive a short inspection highlight.
- Bogies receive a wider structural emphasis.
- A coach/progress ribbon advances without obscuring the train.
- The active component name appears in plain language.

No generic object-detection boxes are used. The effect represents inspection attention, not raw AI output.

### 9.7 Defect focus

In the default defect scenario, one spring is marked for review. The guided camera blends to a safe close inspection angle and tracks the component. Time may slow visually, but the train must not appear to stop unrealistically unless the UI clearly labels the moment as an inspection replay.

The defect uses:

- Red/amber edge emphasis
- Warning icon
- Text label
- Component locator line
- Short pulse pattern

### 9.8 Evidence and alert

An evidence card appears after the defect is established. It reports:

- Defect type
- Component
- Coach number
- Side and axle/bogie location when available
- Severity
- Inspection time
- Evidence count
- Review status

The card can expand into Inspection Image, Inspection Snapshot, Defect Snapshot, and Inspection Report tabs. The alert outcome is presented as “Alert prepared for railway review” in simulated mode.

### 9.9 Train exit and reset

The final coaches exit. Portal lighting powers down in reverse sequence. The HUD reports inspection completion and summarizes inspected coaches, inspected components, defects found, and evidence generated.

### 9.10 Completion and exploration

The visitor receives three clear actions:

- **Explore the site**
- **Review evidence**
- **Replay another scenario**

Free roam unlocks inspectable portal cameras, a train-component viewer, and control-room screens. The active track remains inaccessible.

---

## 10. Scenario state machine

The experience must use one authoritative finite-state machine. Timeouts may request events, but timers must not directly mutate unrelated scene objects.

### 10.1 States

| State | Visitor experience | Required exit event |
|---|---|---|
| BOOT | Capability check and minimum shell | CAPABILITY_READY or CAPABILITY_FAILED |
| LOADING | Essential assets and data load | ESSENTIALS_READY or LOAD_FAILED |
| WELCOME | Start and fallback choices | START_GUIDE or OPEN_FALLBACK |
| SITE_ARRIVAL | Camera establishes visitor and portal | ARRIVAL_COMPLETE |
| STANDBY | Portal idle; train pending | TRAIN_APPROACHING |
| APPROACH | Train audio/visual approach | TRAIN_AT_ACTIVATION_POINT |
| ACTIVATION | Portal equipment wakes | PORTAL_READY |
| INSPECTION | Coaches and components pass | DEFECT_FOUND or TRAIN_CLEARED_PORTAL |
| DEFECT_FOCUS | Camera and component focus | FOCUS_COMPLETE |
| EVIDENCE | Evidence and alert summary | EVIDENCE_ACKNOWLEDGED or AUTO_CONTINUE |
| EXIT | Remaining train exits; portal resets | TRAIN_EXITED |
| COMPLETE | Summary and next actions | EXPLORE, REPLAY, or REVIEW_EVIDENCE |
| FREE_ROAM | Visitor-controlled exploration | RETURN_TO_GUIDE or REPLAY |
| FALLBACK | Accessible 2D journey | RETRY_3D or REPLAY_2D |
| RECOVERABLE_ERROR | Retry or reduced-quality choice | RETRY_SUCCESS, USE_FALLBACK, or ABORT |

### 10.2 Global events

- PAUSE
- RESUME
- SKIP_STAGE
- MUTE_CHANGED
- CAPTIONS_CHANGED
- QUALITY_CHANGED
- VISIBILITY_HIDDEN
- VISIBILITY_VISIBLE
- WEBGL_CONTEXT_LOST
- WEBGL_CONTEXT_RESTORED
- RESTART

### 10.3 Determinism rules

- Scenario choice includes a fixed seed.
- Defect coach, component, timing, and evidence IDs come from scenario data—not random frame logic.
- Pausing freezes scenario time, train movement, camera timeline, component inspection, and synchronized audio.
- Skipping a stage invokes its cleanup and completion actions before entering the next state.
- Replaying disposes transient objects, resets mixers/timelines, clears selected evidence, and restores the initial quality-safe scene.

### 10.4 Nominal guided timing

| Segment | Target duration |
|---|---:|
| Welcome and start | User controlled |
| Site arrival | 8–12 seconds |
| Standby orientation | 8–15 seconds |
| Train approach | 10–15 seconds |
| Portal activation | 4–6 seconds |
| Inspection | 35–60 seconds, configurable by train length |
| Defect focus | 6–10 seconds |
| Evidence explanation | 12–20 seconds or user controlled |
| Exit and summary | 8–12 seconds |

The complete guided run should usually remain below three minutes.

---

## 11. Guided mode and free-roam behavior

### 11.1 Guided mode

- Camera control is partially constrained but the visitor may make small look adjustments.
- The director owns major camera position, focus, and transitions.
- A “Return camera to subject” control appears if the visitor looks away.
- Critical text remains in stable screen space.
- The user can pause or skip every non-loading stage.
- Reduced-motion mode replaces travel shots with short fades or cuts.

### 11.2 Free-roam mode

- Third-person only.
- Walk on marked maintenance paths and control-room areas.
- No jumping, crouching, climbing, or entering track exclusion zones.
- Inspectable objects receive a subtle proximity marker and visible focus state.
- Selecting an object opens a concise information card and may trigger a safe camera orbit.
- Train replay is disabled while the visitor occupies a conflicting zone; selecting replay safely relocates the avatar.

### 11.3 Presenter controls

A presenter drawer, hidden by default, provides:

- Scenario selection
- Restart from a named stage
- Auto-advance on/off
- Defect coach selection
- Day/night/weather selection
- Quality lock
- UI reset

Presenter controls must not expose unsupported operational actions or imply control of live railway hardware.

---

## 12. Site layout and spatial zones

### 12.1 Coordinate convention

- Units: metres
- Positive Y: up
- Positive Z: nominal train travel direction
- Positive X: right when facing train travel
- World origin: centreline of the inspected track at the centre of the portal, at the chosen rail-reference elevation

All imported assets must be converted to this convention before integration. Scale fixes inside runtime components are temporary and must be documented.

### 12.2 Required zones

| Zone | Purpose |
|---|---|
| Approach corridor | Train becomes visible/audible and is prepared for activation |
| Portal zone | Hero inspection gantry, cameras, LEDs, scanner effects, and active component focus |
| Exit corridor | Train clears the site and audio/visual intensity falls |
| Visitor maintenance path | Safe third-person navigation and guided viewpoints |
| Control-room zone | Dashboard screens and evidence exploration |
| Parallel-track context | Establishes a credible multi-track railway environment |
| Utility/traction context | Poles, signals, fencing, cable routes, cabinets, and service structures |
| Background boundary | Low-detail site continuation, skyline, vegetation, and occlusion |

### 12.3 Safety and navigation

- Active rails, under-train space, moving train envelope, traction assets, and portal machinery use invisible collision/exclusion volumes.
- The avatar route must never imply that personnel may stand in an unsafe operational position.
- Collision meshes are simple boxes, capsules, or low-poly meshes and remain separate from visual geometry.
- A navmesh or authored walkable polygons define accessible ground.
- If CAD geometry changes, navigation and cinematic viewpoints must be revalidated.

### 12.4 Placeholder spatial envelope

Until approved CAD is available, use a compact demonstration site with the portal at the origin, long train corridors along Z, parallel context tracks along X, and the control room offset beyond the maintenance path. Placeholder values must live in a site-configuration file rather than inside components.

---

## 13. Scene hierarchy and coordinate ownership

The runtime scene graph should follow operational ownership. Animation systems move stable parent groups rather than editing arbitrary imported nodes.

```text
MVISWorld
├── Environment
│   ├── GroundAndBallast
│   ├── TrackNetwork
│   ├── MaintenancePaths
│   ├── TractionAndSignals
│   ├── SiteStructures
│   └── BackgroundBoundary
├── InspectionSite
│   ├── PortalStructure
│   ├── CameraAssemblies
│   ├── PortalLighting
│   ├── ScanEffects
│   ├── SafetyVolumes
│   └── InteractionProxies
├── TrainAssembly
│   ├── Locomotive
│   ├── Coach_001..N
│   │   ├── Body
│   │   ├── Bogie_Front
│   │   ├── Bogie_Rear
│   │   └── InspectionAnchors
│   └── TrainAudio
├── Visitor
│   ├── AvatarVisual
│   ├── CharacterController
│   └── FollowCameraRig
├── ControlRoom
│   ├── Building
│   ├── DisplaySurfaces
│   └── InteractionProxies
└── RuntimeSystems
    ├── LightingRig
    ├── Weather
    ├── GuidedCameraRig
    ├── AudioEmitters
    └── DebugHelpers
```

### Scene ownership rules

- Imported visual nodes do not own application state.
- The scenario machine owns operational stage.
- The train controller owns position, velocity, coach indexing, and wheel rotation.
- The inspection director owns component timing and inspection emphasis.
- The camera director owns guided camera shots and blends.
- The interaction manager owns hover, selection, and proximity results.
- The UI derives from typed application state and never scrapes the scene graph.
- Production debug helpers are disabled unless an authorized debug flag is active.

---

## 14. World, portal, train, and environment requirements

### 14.1 Track and ground

- Use continuous rails, sleepers, fasteners where visible, ballast, drainage hints, and maintenance-path transitions.
- Repeated sleepers, clips, poles, and fence elements should use instancing or merged geometry.
- Distant track sections use lower-detail meshes and reduced texture resolution.
- Ballast should use tiled PBR textures with geometry detail only near visitor viewpoints.
- Track geometry must follow CAD-verified spacing when available.

### 14.2 Inspection portal

The portal is the visual hero and requires:

- Industrial structural frame
- Credible camera/sensor housings placed around the train envelope
- Service cabinets and protected cable routing
- Safety markers and identification signage
- Standby, active, warning, and fault lighting states
- Named camera and light anchors
- Portal scan-effect anchors
- Simplified collision and interaction meshes
- LOD variants for mobile and distant viewing

Visitor-facing portal information explains where images are captured and which train areas are inspected. It does not explain inference infrastructure.

### 14.3 Train

The train is assembled from reusable modules:

- One approved locomotive type
- Configurable coach count
- Shared coach shell where appropriate
- Front and rear bogie modules
- Wheelsets, axle boxes, suspension springs, brake assemblies, and underframe anchors
- Coach number and train identifier display surfaces
- Optional livery/material variants

Each inspectable component requires a stable identifier and an authored focus anchor. Visual mesh names alone are not a reliable data contract.

### 14.4 Control room

The control room can be a compact trackside building or viewing station informed by the site plan. It includes four simple screens:

1. Total trains inspected
2. Defects found
3. Today’s activity
4. Latest alerts

Screens are HTML overlays or canvas textures with a DOM-accessible equivalent. They should look like railway operations displays, not consumer analytics cards.

### 14.5 Environmental context

Include only elements that improve site credibility:

- Parallel track
- Traction poles and overhead-line context
- Signals and signage
- Fencing and maintenance routes
- Equipment cabinets
- Utility or office structures
- Controlled vegetation and distant skyline
- Dust, haze, or light atmospheric particles at high quality

Avoid dense decorative clutter, excessive animated vehicles, crowds, or unrelated machinery.

---

## 15. Train composition and inspection-anchor contract

### 15.1 Stable identifiers

Use human-readable identifiers:

```text
train/12952
coach/B4
coach/B4/bogie/front
coach/B4/bogie/front/wheelset/01
coach/B4/bogie/front/spring/left-primary-01
coach/B4/bogie/front/brake/left-01
```

### 15.2 Required metadata per component

| Field | Meaning |
|---|---|
| componentId | Stable cross-system identifier |
| componentType | wheel, spring, brake, bogie, axle-box, or approved extension |
| coachId | Parent coach |
| bogiePosition | front or rear |
| side | left or right relative to travel |
| focusAnchor | Object3D or authored transform for camera focus |
| highlightGroup | Meshes that receive temporary inspection emphasis |
| interactionProxy | Simplified selectable geometry |
| evidenceRefs | Related evidence identifiers |

### 15.3 Animation strategy

- Move the complete train as one parent group along the configured track curve.
- Derive wheel rotation from travelled distance and wheel radius.
- Use shared animation clips only for repeated mechanical motion that cannot be procedural.
- Keep component highlights independent of imported material names.
- Use animation mixers only where authored clips are required, and update every active mixer with delta time.
- Pause all train and mixer motion when scenario time is paused or the document is hidden.

### 15.4 Long-train strategy

- Reuse coach geometry and materials.
- Clone skinned or animated assets correctly; do not share mutable skeleton state accidentally.
- Keep distant coaches at reduced LOD.
- Disable interior geometry unless visible and relevant.
- Stream or instantiate later coaches before they enter the approach corridor.
- Dispose unused scenario variants after a safe transition.

---

## 16. Camera direction and third-person movement

### 16.1 Camera principles

- The camera serves comprehension before spectacle.
- The portal and train movement must preserve screen direction across cuts.
- Defect focus must keep the component and coach context visible.
- Camera movement uses eased position and target interpolation.
- Head bob, rapid orbit, roll, and abrupt FOV changes are prohibited.
- Reduced-motion mode uses stable cuts or brief crossfades.

### 16.2 Starting parameters

These values are tuning baselines, not final constants:

| Parameter | Starting value |
|---|---:|
| Perspective FOV, desktop | 50 degrees |
| Perspective FOV, mobile | 55 degrees |
| Near plane | 0.1 m |
| Far plane | Site-dependent; keep as tight as practical |
| Follow distance | 4.0–4.5 m |
| Follow height | 2.0–2.4 m |
| Walk speed | Approximately 2.2 m/s |
| Camera collision margin | 0.2–0.4 m |
| Guided blend duration | 0.8–1.8 seconds |

### 16.3 Camera shot list

| Shot | Purpose |
|---|---|
| Arrival reveal | Establish visitor, portal, and multi-track site |
| Standby medium-wide | Explain the idle portal |
| Approach long view | Show direction and train arrival |
| Activation three-quarter view | Show cameras and lights waking |
| Inspection tracking view | Keep portal and passing components readable |
| Defect component focus | Show component, location, and evidence relationship |
| Exit wide | Resolve motion and reset |
| Completion control-room view | Connect inspection result to official review |

### 16.4 Movement controls

Desktop:

- W/A/S/D or arrow keys: move
- Mouse/pointer drag: orbit within limits
- E or Enter: inspect/select
- Escape: close panel or open pause menu
- Space: pause/resume guided mode when focus is not in a form control

Touch:

- Left virtual joystick: move
- Right-side drag: look
- Tap visible marker: inspect
- Large touch targets for pause, skip, and evidence

Gamepad is optional. If included, controls must be documented and remappable.

### 16.5 Collision and recovery

- Use a capsule-based character collider.
- Use simple environment colliders or a spatial acceleration structure.
- Prevent camera clipping with a ray or sphere cast from target to desired camera position.
- If the avatar leaves the valid nav area, restore the last safe transform and display no alarming error.

---

## 17. Inspectable objects and interaction rules

### 17.1 Inspectable object categories

- Portal camera/sensor housing
- Portal warning light
- Wheel
- Spring
- Brake assembly
- Bogie
- Control-room screen
- Evidence item
- Site information marker approved by the domain team

### 17.2 Interaction model

1. Proximity enables the object’s interaction proxy.
2. Pointer movement performs throttled raycasts against the interaction layer only.
3. Hover changes cursor, marker state, and accessible description.
4. Selection opens the associated card and optionally requests a camera focus.
5. Escape, close, or selecting another object clears the current selection.

### 17.3 Interaction requirements

- Use dedicated proxy meshes for small or complex components.
- Keep raycast target lists scoped; do not recursively test the entire scene every frame.
- Throttle hover raycasts and skip them while the pointer is stationary where possible.
- Provide visible keyboard focus and an ordered DOM object list.
- Ensure an object remains identifiable if bloom or outline is disabled.
- Never place critical information only in world-space text.

---

## 18. Portal activation and scanning sequence

### 18.1 Activation choreography

1. Approach trigger is crossed.
2. Portal status changes from Standby to Preparing.
3. Safety indicators pulse twice.
4. Camera/sensor housings wake in a physical top-to-bottom or side-to-side sequence.
5. Blue inspection LEDs reach active intensity.
6. A scan pulse confirms readiness.
7. Status becomes Portal active.
8. Train enters the inspection envelope.

### 18.2 Scan effect

The signature effect is a narrow inspection pulse that moves through portal space, briefly emphasizes the relevant train region, and continues into the evidence timeline.

Implementation options:

- Emissive portal strips animated by uniforms
- Transparent scan plane with soft alpha edges
- Component-local rim/emissive emphasis
- Selective bloom on inspection-only layers
- Lightweight particles used only at high quality

The scan must not resemble a harmful solid laser or imply that visible light is the actual sensing mechanism. A label may state “Inspection visualization.”

### 18.3 State mapping

| Portal state | Light | Motion | Audio | UI |
|---|---|---|---|---|
| Standby | Low blue/white | None | Ambient only | Portal: Standby |
| Preparing | Amber pulse | Camera wake sequence | Soft mechanism | Preparing inspection |
| Active | Stable inspection blue | Scan cycle | Controlled electronic cue | Portal: Active |
| Defect detected | Blue plus localized warning | Component pulse | Short alert cue | Review required |
| Resetting | Intensity falls | Reverse sequence | Power-down cue | Returning to standby |
| Fault | Amber/red with pattern | No scan | Distinct low-priority warning | Inspection unavailable |

---

## 19. Component inspection behavior

### 19.1 Inspection order

Inspection is synchronized to coach position at the portal:

1. Leading wheel and axle area
2. Front bogie
3. Suspension springs
4. Brake assemblies
5. Rear bogie
6. Trailing wheel and axle area

The exact sequence may overlap based on real camera coverage, but UI messaging must remain understandable.

### 19.2 Visual emphasis

- Clean component: brief blue/white edge or emissive lift, then return to base material.
- Component under review: amber pattern plus label.
- Confirmed simulated defect: red/amber emphasis plus icon and evidence link.
- Previously inspected component: no persistent glow; optional faint progress marker only.

The system should clone or layer temporary materials safely and restore original PBR materials after emphasis.

### 19.3 Progress UI

Display:

- Current coach
- Coaches inspected / total coaches
- Active component category
- Portal status
- Defects found

Avoid rapidly incrementing raw frame counts, confidence values, or model metrics in the main experience.

---

## 20. Defect simulation and visual treatment

### 20.1 Default scenario

- Defect: suspension spring anomaly
- Severity: Review required or an approved railway severity
- Location: configured coach, bogie, side, and spring position
- Evidence: at least one wide inspection image and one component crop
- Result: alert prepared for review

All details must come from scenario data.

### 20.2 Defect focus sequence

1. Inspection pulse reaches the configured component.
2. Component changes to review state.
3. HUD reports “Potential spring defect identified.”
4. Guided camera moves to the component anchor.
5. Locator line connects component to defect card.
6. Evidence becomes available.
7. Alert result is confirmed.
8. Camera returns to the train or exit shot.

### 20.3 Rules

- Do not deform a safety-critical component unless railway experts approve the depiction.
- A defect texture or controlled mesh variant is preferable to exaggerated damage.
- If the close-up is a replay, label it “Inspection replay.”
- Confidence scores are hidden by default and shown only in an approved technical mode.
- Severity wording must map to the official defect taxonomy before live deployment.

---

## 21. Evidence cards, alerts, and summary

### 21.1 Defect card

Required fields:

| Label | Example simulated value |
|---|---|
| Defect type | Suspension spring anomaly |
| Coach | B4 |
| Location | Front bogie · Left side |
| Severity | Review required |
| Inspection time | 14:32:18 IST |
| Evidence | 4 items |
| Review status | Alert prepared |

The card includes a visible “Simulated demonstration” label in mock mode.

### 21.2 Evidence gallery

| Evidence item | Purpose |
|---|---|
| Inspection image | Wider portal/camera view for context |
| Inspection snapshot | Coach-level view |
| Defect snapshot | Tight component crop |
| Inspection report | Structured summary suitable for review |

Images must preserve aspect ratio, support zoom, have descriptive alternative text, and display loading/error states. Evidence that is unavailable must explain why and offer retry where applicable.

### 21.3 Alert behavior

- In demonstration mode, show “Alert prepared for railway review.”
- Do not claim that a real official received an alert unless a verified integration confirms delivery.
- In future connected mode, the UI may receive a sanitized alert-delivery status.
- Delivery failure must not erase evidence; it changes the status to “Alert delivery pending.”

### 21.4 Completion summary

Show:

- Train identifier
- Inspection start and completion time
- Coaches inspected
- Component groups inspected
- Defects found
- Evidence items generated
- Alert status

Primary actions remain Explore, Review evidence, and Replay.

---

## 22. Control-room dashboard and UI content

### 22.1 Dashboard metrics

- Total trains inspected
- Defects found
- Today’s activity
- Latest alerts

Use large readable values, clear labels, and short trend or status indicators only where data supports them. Do not invent decorative charts.

### 22.2 Visual composition

Desktop layout:

```text
┌────────────────────────────────────────────────────────────────┐
│ MVIS · Portal status                  Pause  Audio  Settings    │
│                                                                │
│                        3D RAILWAY SITE                         │
│                                                                │
│ Coach B4 · 08/18       Inspecting: Springs       1 review item │
│                                                     ┌────────┐ │
│                                                     │ Defect │ │
│                                                     │ card   │ │
│                                                     └────────┘ │
│ Stage: Live inspection ━━━━━━━━━━━━━━━●━━━━━━━━━━━              │
└────────────────────────────────────────────────────────────────┘
```

Mobile layout:

```text
┌──────────────────────────┐
│ MVIS        Pause   Menu │
│                          │
│        3D SITE           │
│                          │
│ Coach B4 · Springs       │
│ ┌──────────────────────┐ │
│ │ Review item detected │ │
│ │ View evidence        │ │
│ └──────────────────────┘ │
│ [Move]          [Look]   │
└──────────────────────────┘
```

### 22.3 UI copy rules

- Use sentence case.
- Use active, direct labels: “View evidence,” “Replay inspection,” “Return to guide.”
- Keep operational terms consistent.
- Distinguish simulated from live data.
- Errors identify what failed and the available action.
- Avoid promotional filler during the inspection sequence.

---

## 23. Visual identity and typography

### 23.1 Palette

| Token | Hex | Use |
|---|---|---|
| Railway navy | #0B1F33 | Primary interface structure and dark equipment accents |
| Inspection blue | #2CBAE8 | Active portal, clean inspection, focus |
| Safety amber | #F2B544 | Preparing, caution, pending review |
| Defect red | #D94B3D | Confirmed defect emphasis and critical icon |
| Ballast grey | #73797D | Secondary text, site material reference |
| Evidence paper | #F2EFE6 | Evidence surfaces and high-readability cards |

Colours require contrast validation in their actual combinations.

### 23.2 Typography

- **Barlow Condensed:** restrained display titles, coach numbers, portal labels
- **Noto Sans:** body copy, controls, multilingual-ready interface
- **IBM Plex Mono:** timestamps, IDs, measurements, status metadata

Self-host approved WOFF2 subsets where licensing permits. Use system-font fallbacks and avoid delaying the 3D experience for nonessential font weights.

### 23.3 Signature design element

The portal scan pulse is the experience’s signature. It begins as a physical activation cue, follows inspected components, and resolves into the evidence progress line. Other UI remains quiet so this moment retains meaning.

### 23.4 Avoid

- Generic glassmorphism covering the scene
- Neon cyberpunk styling
- Continuous bloom
- Dense data walls
- Decorative grid overlays
- Unverified logos or official seals
- Excessive rounded cards and floating gradients

---

## 24. Audio, captions, and environmental scenarios

### 24.1 Audio layers

| Layer | Examples | Behavior |
|---|---|---|
| Environment | Wind, distant railway activity, birds where appropriate | Continuous low-level loop |
| Approach | Horn, rail rumble, increasing wheel rhythm | Distance and stage driven |
| Portal | Warning cue, camera mechanisms, activation tone | State driven |
| Inspection | Subtle scan cue and component confirmation | Synchronized, not repetitive |
| Defect | Short distinct alert | One controlled event |
| Completion | Soft completion tone | One event |

### 24.2 Audio requirements

- Start only after user interaction.
- Provide persistent mute and volume controls.
- Cap sudden peaks; the horn and warning alarm must not surprise users.
- Use positional audio selectively for approach and portal orientation.
- Duck ambience during important captions or alert cues.
- Pause synchronized audio with scenario time.
- Stop and dispose scenario audio on replay.

### 24.3 Captions and equivalents

Every meaningful audio cue has a text or visual equivalent:

- “[Train approaching from the north]”
- “[Inspection portal activating]”
- “[Potential defect identified]”
- “[Inspection complete]”

Captions are concise, optional by default where policy permits, and always available.

### 24.4 Scenario matrix

| Scenario | Light | Weather | Defect | Purpose |
|---|---|---|---|---|
| Clean inspection | Day | Clear | None | Explain normal flow |
| Spring defect | Day | Clear | One configured spring | Default value story |
| Night inspection | Night | Clear | Optional | Demonstrate portal illumination |
| Adverse weather | Overcast | Light rain or haze | Optional | Demonstrate robust visibility |

Night and weather modify shared scene systems. They must not duplicate the complete world.

### 24.5 Weather boundaries

- Rain is visually restrained and disabled at low quality.
- Wet surfaces use controlled roughness changes, not expensive full-scene reflections.
- Lightning, storms, flooding, and dramatic cinematic weather are excluded unless operationally required.
- Weather cannot obscure critical status UI or evidence.

---

## 25. Technical stack and architectural decisions

### 25.1 Recommended stack

| Concern | Recommendation |
|---|---|
| Build tooling | Vite |
| Language | TypeScript in strict mode |
| Application UI | React |
| 3D integration | React Three Fiber over Three.js |
| Common 3D helpers | Drei, selected deliberately |
| Scenario orchestration | XState finite-state machine |
| Validation | A runtime schema validator such as Zod |
| Styling | CSS Modules, vanilla CSS, or an approved token-based system |
| Testing | Unit runner, React Testing Library, Playwright, and visual-regression tooling |
| 3D format | GLB/glTF 2.0 |
| Geometry compression | Meshopt preferred for progressive decode; Draco where the pipeline requires it |
| Texture compression | KTX2/Basis Universal |

Pin and lock tested dependency versions. Upgrade only through a validated change, especially for Three.js, React Three Fiber, loaders, and post-processing packages.

### 25.2 Architectural layers

```text
React Application Shell
├── Routing / boot / error boundaries
├── DOM UI and accessibility narrative
├── Scenario machine and data adapters
└── React Three Fiber Canvas
    ├── Scene composition
    ├── Asset registry
    ├── Train and portal controllers
    ├── Camera and character systems
    ├── Interaction manager
    ├── Lighting / weather / effects
    └── Performance monitor
```

### 25.3 Core modules

| Module | Responsibility |
|---|---|
| ExperienceShell | Boot, mode selection, global controls, errors |
| ScenarioMachine | Authoritative stage and event transitions |
| ScenarioDirector | Converts state entry/exit into coordinated scene commands |
| AssetRegistry | Manifest, preload groups, cache, fallbacks, disposal |
| World | Site environment and spatial configuration |
| TrainController | Train path, coach indexing, wheel motion |
| InspectionDirector | Component schedule, highlight, defect trigger |
| CameraDirector | Guided shots, blends, focus anchors |
| CharacterController | Third-person movement and collision |
| InteractionManager | Proximity, raycasting, selection |
| AudioManager | User-gated playback, mix, captions |
| QualityManager | Initial tier, frame monitoring, adaptive changes |
| DataAdapter | Mock/live data normalization and validation |
| EvidenceUI | Defect, gallery, report, alert status |
| AccessibleNarrative | Structured non-canvas equivalent |

### 25.4 Data-flow rule

External data is validated and normalized before entering the scenario machine. The machine emits semantic state. Scene systems and UI subscribe to that state independently. UI must not infer business state from animation progress or mesh visibility.

---

## 26. Recommended source-code structure

```text
src/
├── app/
│   ├── App.tsx
│   ├── ExperienceShell.tsx
│   ├── ErrorBoundary.tsx
│   └── providers/
├── experience/
│   ├── machine/
│   │   ├── scenarioMachine.ts
│   │   ├── scenarioEvents.ts
│   │   └── scenarioSelectors.ts
│   ├── director/
│   └── scenarios/
├── scene/
│   ├── World.tsx
│   ├── environment/
│   ├── portal/
│   ├── train/
│   ├── visitor/
│   ├── control-room/
│   └── effects/
├── systems/
│   ├── assets/
│   ├── camera/
│   ├── character/
│   ├── inspection/
│   ├── interaction/
│   ├── audio/
│   └── quality/
├── data/
│   ├── schemas/
│   ├── adapters/
│   ├── mock/
│   └── types/
├── ui/
│   ├── hud/
│   ├── evidence/
│   ├── controls/
│   ├── fallback/
│   └── accessibility/
├── styles/
│   ├── tokens.css
│   └── globals.css
├── analytics/
├── test/
└── main.tsx

public/
├── assets/
│   ├── manifests/
│   ├── models/
│   ├── textures/
│   ├── audio/
│   ├── evidence/
│   └── fonts/
└── fallback/
```

### Structure rules

- Keep scenario logic outside visual components.
- Keep raw API payloads outside scene systems.
- Place asset URLs in manifests, not scattered imports.
- Co-locate tests with modules or follow one documented test convention.
- Keep mock scenarios valid against the same schemas used for live data.
- Separate debug/admin controls from visitor bundles when possible.

---

## 27. State, event, and timing architecture

### 27.1 Scenario context

The state machine context should contain only durable scenario information:

- scenarioId
- scenarioSeed
- trainRun
- inspectionSession
- currentCoachIndex
- currentComponent
- defects
- evidence
- alertStatus
- qualityTier
- userPreferences
- recoverableError

Three.js objects, loaders, materials, audio nodes, and DOM elements do not belong in serializable state-machine context.

### 27.2 Commands

State entry may invoke typed commands:

- preloadScenarioAssets
- moveCameraToShot
- beginTrainApproach
- activatePortal
- beginComponentSchedule
- focusDefect
- openEvidence
- resetPortal
- completeScenario

Commands return success, cancellation, or failure events. Every long-running command must support cancellation when the user skips, replays, or leaves the page.

### 27.3 Timing

- Maintain a scenario clock separate from wall-clock time.
- Drive train position and procedural motion from delta time with sensible clamping.
- Use a fixed or semi-fixed timestep where collision stability requires it.
- Never multiply absolute elapsed time by velocity to update a mutable position every frame.
- Suspend expensive updates when the page is hidden.
- Resume without a large delta-time jump.

### 27.4 URL and replay state

Optional, non-sensitive query parameters may select:

- scenario
- timeOfDay
- quality
- guided/autostart for controlled kiosk use

Validate every parameter and fall back safely. Do not put official train records, tokens, or signed evidence URLs in the browser address.

---

## 28. Asset production pipeline and naming

### 28.1 Preferred production path

1. Receive approved CAD, survey, photographs, and component references.
2. Create a clean production source in the agreed DCC tool.
3. Set world units to metres and apply transforms.
4. Remove invisible engineering internals not needed for the experience.
5. Retopologize or create web-specific meshes.
6. Author UVs, shared materials, and LOD variants.
7. Create inspection anchors, camera anchors, collision meshes, and interaction proxies.
8. Export GLB with stable node names and extras metadata.
9. Optimize geometry and textures.
10. Validate scale, normals, animation, materials, and required anchors.
11. Record the asset in the manifest with version and checksum.
12. Test the asset inside the target scene and quality tiers.

### 28.2 Naming convention

```text
mvis_portal_v003_high.glb
mvis_portal_v003_low.glb
coach_lhb_v005_high.glb
coach_lhb_v005_mobile.glb
rail_ballast_basecolor_2k.ktx2
rail_ballast_normal_2k.ktx2
portal_activate_v002.ogg
evidence_demo_12952_B4_spring_01.webp
```

Use lowercase snake case for files. Use PascalCase or an approved stable convention for scene nodes. Never use “final,” “final2,” or artist initials as version control.

### 28.3 GLB metadata contract

Each major asset should provide glTF extras or a companion manifest containing:

- assetId and semantic version
- coordinate and unit declaration
- LOD group
- required node names
- interaction proxies
- collision nodes
- inspection anchors
- material slots
- bounding dimensions
- source approval reference

### 28.4 Geometry rules

- Merge static geometry where it reduces draw calls without harming culling.
- Instance sleepers, poles, fence sections, fasteners, and repeated props.
- Preserve separate meshes for interactive components.
- Use smooth/flat shading intentionally and verify normals.
- Avoid unnecessary subdivision and hidden interior geometry.
- Generate at least high and low LODs for portal, train, and prominent structures.

### 28.5 Texture rules

- Colour/albedo and emissive colour maps use sRGB.
- Normal, roughness, metalness, AO, and masks remain data textures without sRGB conversion.
- Use KTX2/Basis for production delivery.
- Use mipmaps and appropriate anisotropy for rails and ground seen at shallow angles.
- Default maximum texture size is 2K; mobile variants are generally 512–1K.
- Use texture atlases or shared trim sheets for repeated site props.
- Dispose scenario-only textures when no longer used.

---

## 29. Loading, compression, caching, and deployment

### 29.1 Load groups

| Group | Contents | When |
|---|---|---|
| Shell | CSS, fonts subset, fallback image, minimal UI | Immediately |
| Essential site | Ground, nearby track, low portal, avatar, base light | Before Welcome |
| Guided core | High portal, locomotive, first coaches, audio core | During Welcome/Site arrival |
| Inspection | Component detail, scan effect, defect variant, evidence thumbnails | Before Activation |
| Exploration | Control-room detail, distant site props, optional information | After guided start |
| Scenario extras | Night/weather assets and optional train variants | On scenario request |

The user can begin once the essential site is ready. The application must not wait for every optional asset.

### 29.2 Asset manifest

```json
{
  "manifestVersion": "1.0",
  "buildId": "mvis-demo-2026-08",
  "groups": {
    "essential": [
      {
        "id": "portal-low",
        "url": "/assets/models/mvis_portal_v003_low.glb",
        "type": "gltf",
        "bytes": 1820000,
        "fallback": "portal-placeholder"
      }
    ]
  }
}
```

Production manifests include checksums or content-hashed filenames and are generated by the build pipeline.

### 29.3 Loading behavior

- Use one coordinated loading manager/registry.
- Provide real group progress when content length is available.
- Apply retry with capped exponential backoff for transient failures.
- Use a timeout and user-visible recovery action.
- Prefer a low-detail asset over no asset.
- Cache loaded assets and clone them safely for reuse.
- Revoke temporary object URLs and dispose replaced GPU resources.

### 29.4 Caching

- Fingerprinted static assets: long-lived immutable caching.
- HTML and manifest: short caching or revalidation.
- Evidence and live summaries: follow organizational retention and authorization policy.
- Do not cache private official evidence in a public service worker by default.
- A service worker is optional and must have an explicit update/recovery design.

### 29.5 Delivery

- HTTPS only.
- Brotli or gzip for JavaScript, JSON, SVG, and compatible assets.
- CDN or approved edge delivery for public static content.
- Correct CORS headers for asset and API origins.
- Preload only genuinely critical files.
- Include a static 2D fallback route in the deployment.

---

## 30. Materials, lighting, shadows, and post-processing

### 30.1 Materials

- Use MeshStandardMaterial for most surfaces.
- Use MeshPhysicalMaterial only where clearcoat, glass, or another advanced property visibly matters.
- Reuse materials and textures across repeated coaches and props.
- Avoid transparent materials where alpha test or opaque geometry works.
- Rail steel, painted portal steel, coach body, glass, rubber, concrete, ballast, and oily mechanical parts require distinct roughness/metalness responses.
- Inspection emphasis should use controlled emissive or overlay materials without destroying the underlying PBR look.

### 30.2 Daylight rig

- One directional sun with a tightly fitted shadow camera
- Hemisphere light for sky/ground fill
- Prefiltered environment map for PBR reflections
- Optional baked AO/lightmaps for static architecture
- Portal practical lights without shadows unless a specific shot requires them

### 30.3 Night rig

- Lower environment intensity and adjusted sky/background
- Portal and control-room practical lighting
- Limited shadow-casting lights
- Reflective safety markings remain readable
- No arbitrary cinematic spotlights disconnected from site fixtures

### 30.4 Shadows

- High: 2048 directional shadow map, tightly bounded
- Balanced: 1024 shadow map
- Low: 512 or contact/blob shadows
- Train, avatar, portal, and nearby major objects may cast.
- Small props, distant coaches, poles, and background objects generally do not cast.
- Tune bias and normal bias per scene; do not hide artifacts with excessive softness.

### 30.5 Post-processing

Recommended high-tier order:

1. Scene render
2. Optional restrained ambient-occlusion pass if profiling allows
3. Selective bloom for portal/defect layers
4. Minimal colour grading
5. Anti-aliasing suited to the renderer/device

Balanced tier uses selective bloom and anti-aliasing only. Low tier uses direct rendering or one inexpensive anti-aliasing pass. Depth of field, film grain, glitch, strong vignette, and chromatic aberration are excluded from normal use.

---

## 31. Data model and future API contracts

### 31.1 Core entities

| Entity | Purpose |
|---|---|
| Site | Portal identity, location label, spatial configuration |
| TrainRun | Train identity, direction, arrival, and coach list |
| Coach | Coach number/type and order |
| InspectionSession | Start/end, status, inspected counts |
| ComponentInspection | Component result and timing |
| Defect | Type, location, severity, and review status |
| EvidenceAsset | Image/report metadata and secure URL |
| AlertSummary | Prepared, sent, delivered, failed, or unknown |
| SiteMetrics | Simple control-room aggregate values |
| Scenario | Deterministic demonstration configuration |

### 31.2 TypeScript shape

```ts
type InspectionStatus =
  | "scheduled"
  | "approaching"
  | "inspecting"
  | "review_required"
  | "complete"
  | "unavailable";

type Severity = "information" | "review_required" | "urgent";

interface ComponentLocation {
  coachId: string;
  componentType: "wheel" | "spring" | "brake" | "bogie" | "axle_box";
  bogiePosition?: "front" | "rear";
  side?: "left" | "right";
  positionLabel?: string;
}

interface Defect {
  defectId: string;
  defectType: string;
  severity: Severity;
  location: ComponentLocation;
  detectedAt: string;
  reviewStatus: "new" | "prepared" | "under_review" | "resolved";
  evidenceIds: string[];
  simulated: boolean;
}

interface EvidenceAsset {
  evidenceId: string;
  kind: "inspection_image" | "inspection_snapshot" | "defect_snapshot" | "report";
  thumbnailUrl?: string;
  contentUrl?: string;
  mediaType: string;
  width?: number;
  height?: number;
  alt: string;
  capturedAt: string;
}
```

### 31.3 Mock scenario example

```json
{
  "scenarioId": "spring-defect-day",
  "scenarioSeed": 240826,
  "mode": "simulated",
  "environment": {
    "timeOfDay": "day",
    "weather": "clear"
  },
  "trainRun": {
    "trainId": "DEMO-12952",
    "direction": "positive_z",
    "coachCount": 18,
    "coaches": ["Loco", "B1", "B2", "B3", "B4", "B5"]
  },
  "defects": [
    {
      "defectId": "DEF-DEMO-001",
      "defectType": "Suspension spring anomaly",
      "severity": "review_required",
      "location": {
        "coachId": "B4",
        "componentType": "spring",
        "bogiePosition": "front",
        "side": "left",
        "positionLabel": "Primary spring 01"
      },
      "detectedAt": "2026-08-26T14:32:18+05:30",
      "reviewStatus": "prepared",
      "evidenceIds": ["EV-001", "EV-002", "EV-003", "EV-004"],
      "simulated": true
    }
  ]
}
```

The sample coach list is abbreviated for readability; production mock data must make coachCount and the list consistent.

### 31.4 Adapter boundary

Define:

```ts
interface InspectionDataAdapter {
  loadScenario(input: ScenarioRequest): Promise<Scenario>;
  loadEvidence(evidenceId: string): Promise<EvidenceAsset>;
  loadSiteMetrics(siteId: string): Promise<SiteMetrics>;
  subscribeToUpdates?(
    inspectionId: string,
    onEvent: (event: InspectionUpdate) => void
  ): () => void;
}
```

Provide MockInspectionDataAdapter first. A later LiveInspectionDataAdapter may use an approved HTTP API and SSE or WebSocket summary feed. Internal MQTT topics, service topology, model endpoints, and storage locations remain behind the backend boundary.

### 31.5 Validation and mapping

- Validate every response at runtime.
- Reject unknown critical enums or map them to a safe “Unknown” state.
- Normalize timestamps to ISO 8601 and render in the approved local timezone.
- Do not infer coach/component relationships from display labels.
- Missing optional evidence must not fail the entire inspection summary.
- Version the public summary schema.

---

## 32. Responsive behavior and input adaptation

### 32.1 Desktop and presentation display

- Full 3D canvas with side evidence panel.
- HUD stays within safe margins on 16:9 and ultrawide screens.
- Presentation mode supports a larger type scale and hidden pointer after inactivity.
- Do not rely on hover for required actions.

### 32.2 Tablet

- Bottom-sheet evidence rather than a permanent side panel.
- Touch and optional keyboard work simultaneously.
- Reduce distant environment detail before reducing train/component clarity.

### 32.3 Mobile

- Portrait and landscape are supported.
- Portrait uses bottom sheets and simplified HUD.
- Controls avoid system gesture zones.
- Virtual controls disappear during noninteractive guided shots.
- Mobile starts at Low or Balanced and promotes quality only after measurement.
- The fallback walkthrough remains one tap away.

### 32.4 Resize and orientation

On every meaningful resize:

- Update camera aspect and projection.
- Resize renderer and post-processing targets.
- Recalculate pixel ratio cap.
- Reposition DOM overlays.
- Preserve scenario stage and selected evidence.
- Pause briefly if the browser is reconfiguring orientation.

---

## 33. Accessibility requirements

### 33.1 Equivalent experience

The canvas is not the only source of information. A structured DOM region communicates:

- Current stage
- Portal status
- Train and coach progress
- Current component
- Defect details
- Evidence list
- Completion summary

Updates use restrained live-region announcements. Rapid coach/component updates are summarized to prevent screen-reader overload.

### 33.2 Keyboard

- Every control is reachable in logical order.
- Visible focus indicators meet contrast requirements.
- Focus moves into opened evidence dialogs and returns to the invoking control.
- Escape closes the topmost dismissible layer.
- Canvas interaction never traps focus.
- A “Skip 3D experience” link is first or near-first in the page order.

### 33.3 Motion and flashing

- Respect the operating-system reduced-motion preference.
- Provide an in-product reduced-motion control.
- Remove long camera travel, head movement, aggressive zooms, particle drift, and repeated pulses.
- Avoid flashes that could trigger photosensitive users.
- Pausing stops nonessential motion.

### 33.4 Visual and cognitive

- Do not use colour alone for state.
- Maintain readable contrast over changing 3D backgrounds with stable backing surfaces.
- Keep instructions short and persistent long enough to read.
- Use consistent icons and labels.
- Support browser zoom without losing essential controls.
- Evidence images include meaningful alternative text.

### 33.5 Audio

- All meaningful cues have captions or visual equivalents.
- Mute and volume are always available after audio starts.
- Do not autoplay before consent.

### 33.6 Accessibility acceptance

The release has no critical blocker in keyboard-only, reduced-motion, high zoom, common screen-reader, touch-target, and colour-independent status testing. Use the organization’s approved accessibility standard and test procedure at implementation time.

---

## 34. Performance budgets and adaptive quality

### 34.1 Rendering tiers

| Budget | High desktop | Balanced laptop/tablet | Mobile/low |
|---|---:|---:|---:|
| Target FPS | 55–60 | 40–60 | 30 minimum |
| Visible triangles | ≤1.5M | ≤900K | ≤600K |
| Draw calls | ≤250 | ≤180 | ≤150 |
| Typical max texture | 2K | 1K–2K | 512–1K |
| Pixel-ratio cap | 1.75 | 1.5 | 1.25 |
| Main shadow map | 2048 | 1024 | 512 or substitute |
| Post-processing | AO optional, bloom, AA | Bloom, AA | AA or direct |

Budgets are scene-wide peaks near the portal, not targets to consume. Measure on approved baseline hardware.

### 34.2 Network budgets

- Application shell JavaScript and CSS: aim below 1 MB compressed.
- Essential first-interaction asset group: aim below 8 MB compressed.
- Complete high-quality guided scenario: aim below 45 MB.
- Complete mobile scenario: aim below 25 MB.
- Evidence full-resolution images load only when opened.
- No blank screen while optional assets load.

### 34.3 Adaptive-quality controller

1. Choose a conservative initial tier from capability signals.
2. Measure frame time during a controlled scene.
3. Use a rolling window, not one slow frame.
4. Downgrade one feature group at a time:
   - pixel ratio
   - shadow resolution
   - post-processing
   - particles/weather
   - LOD distance
   - environment detail
5. Add hysteresis so quality does not oscillate.
6. Respect a user-selected locked tier unless stability is at risk.
7. Never remove defect labels, evidence, progress, or accessible content.

### 34.4 Runtime practices

- Reuse geometries and materials.
- Use instancing for repeated props.
- Frustum-cull and use LODs.
- Scope raycasting to proxies.
- Avoid React state updates every frame.
- Reuse vectors, matrices, and temporary objects in hot loops.
- Update only active animation mixers.
- Suspend rendering or lower cadence when hidden or fully paused.
- Track renderer memory, programs, triangles, and draw calls in development.

---

## 35. Loading and error-state UX

### 35.1 Loading states

| Condition | User message | Action |
|---|---|---|
| Initial load | Preparing railway site… | Show honest progress |
| Optional detail | Adding site detail… | Continue with low-detail world |
| Evidence load | Loading evidence… | Keep defect summary readable |
| Slow network | This is taking longer than expected. | Continue waiting or use walkthrough |

### 35.2 Error principles

- Identify what failed.
- Explain impact in plain language.
- Offer one or two useful actions.
- Preserve already loaded content.
- Record technical detail in logs, not in visitor copy.
- Never show raw stack traces, URLs with tokens, or internal service names.

### 35.3 Recovery matrix

| Failure | Recovery |
|---|---|
| Optional prop fails | Omit it and continue |
| High-detail model fails | Use low-detail or placeholder asset |
| Train model fails | Use simplified train silhouette and continue story |
| Evidence image fails | Keep metadata, show unavailable state, offer retry |
| Mock/live data fails | Retry, use approved demo scenario, or fallback |
| WebGL unsupported | Open 2D walkthrough |
| WebGL context lost | Pause, preserve state, attempt restore, then fallback |
| Persistent low FPS | Downgrade quality and notify only if necessary |
| Audio unavailable | Continue with captions and visual cues |

---

## 36. Two-dimensional fallback experience

The fallback is a first-class product mode, not an error page.

### 36.1 Structure

1. Site and portal introduction
2. Train approach
3. Portal activation
4. Components inspected
5. Spring defect identified
6. Evidence gallery
7. Alert and completion summary

Use optimized stills, short controlled clips, diagrams, and the same validated data. Avoid recreating expensive continuous video if a sequence of images communicates the story.

### 36.2 Requirements

- Fully keyboard and screen-reader accessible
- Same status and defect terminology as 3D mode
- Same evidence and completion data
- Replayable scenarios
- Deep link or visible entry from Welcome
- Available when reduced data usage is selected
- Does not download 3D bundles unless the visitor retries 3D

---

## 37. Analytics, logging, security, and privacy

### 37.1 Product analytics

If approved, collect low-risk events:

- experience_loaded
- guided_started
- stage_changed
- guided_paused
- guided_completed
- defect_viewed
- evidence_opened
- free_roam_started
- scenario_replayed
- quality_changed
- fallback_used
- recoverable_error

Record scenario type, quality tier, broad device class, and duration where permitted. Do not place official train numbers, evidence URLs, personnel data, authentication tokens, or precise operational details in public analytics.

### 37.2 Technical logging

- Use structured error categories and correlation IDs.
- Separate asset, rendering, data, and scenario errors.
- Rate-limit repeated client errors.
- Sample performance telemetry.
- Redact URLs and payload fields that may contain sensitive information.
- Provide a privacy-safe diagnostics export for controlled support.

### 37.3 Security boundary

- The browser is untrusted.
- No cloud, storage, API, or signing secret is included in client code.
- Live evidence uses short-lived authorized URLs or an approved proxy.
- Validate and sanitize all external text before rendering.
- Use a restrictive Content Security Policy compatible with the renderer.
- Restrict asset and API origins with CORS.
- Avoid arbitrary remote model loading.
- Validate manifests before loading URLs.
- Keep debug/presenter controls from granting operational permissions.

### 37.4 Privacy and official records

- Demonstration records must be synthetic or approved and de-identified.
- Live mode requires a documented lawful purpose, access control, audit approach, and retention policy.
- The website does not become the system of record merely because it displays official data.
- Screenshots and evidence downloads follow railway policy and authorization.

---

## 38. Testing matrix and quality assurance

### 38.1 Unit tests

Cover:

- State transitions and guards
- Pause, skip, replay, and reset behavior
- Scenario schema validation
- Coach/component identifier mapping
- Defect and evidence formatting
- Time and timezone formatting
- Quality-tier decisions and hysteresis
- Analytics redaction

### 38.2 Integration tests

Cover:

- Clean and defect scenarios
- Guided-to-free-roam transition
- Evidence loading and failure
- Asset fallback
- Live-adapter timeout to approved demo mode
- Context loss and restoration
- Reduced-motion substitutions
- Mobile orientation changes

### 38.3 End-to-end journeys

| Journey | Expected result |
|---|---|
| Default guided defect | Reaches evidence and completion with one spring defect |
| Clean replay | Completes with no defect and no warning evidence |
| Pause/resume | Train, camera, audio, and state remain synchronized |
| Skip defect focus | Cleanup runs and evidence remains reachable |
| Free roam | Portal and control-room objects are inspectable; track is blocked |
| Mobile touch | Complete journey without keyboard or hover |
| Keyboard-only | Complete journey and evidence review without pointer |
| WebGL unavailable | Accessible walkthrough opens |
| Slow/failing asset | Appropriate fallback appears without dead end |

### 38.4 Visual QA

Capture approved reference images for:

- Loading/welcome
- Site arrival
- Standby portal
- Train approach
- Portal active
- Wheel/spring/brake/bogie inspection
- Defect focus
- Evidence card
- Completion
- Control room
- Night mode
- Mobile portrait
- Low-quality mode

Visual review checks clipping, camera safety, UI overlap, asset scale, material consistency, shadows, colour meaning, and readability.

### 38.5 Browser/device matrix

Test the latest approved stable versions and the previous supported version where organizational policy requires:

- Chromium-based desktop browser on Windows
- Safari on macOS
- Safari on iOS
- Chromium-based Android browser
- Approved kiosk/presentation environment

Representative hardware:

- High presentation workstation
- Typical office laptop with integrated graphics
- Field laptop at the lower supported limit
- Mid-range Android phone
- iPhone/iPad if part of the supported estate

### 38.6 Railway-domain QA

Domain review must approve:

- Track and portal layout plausibility
- Train and component shapes
- Camera/sensor placement representation
- Inspection sequence
- Defect appearance
- Coach/bogie/side terminology
- Severity and alert wording
- Safety of visitor viewpoints
- Evidence and report labels

### 38.7 Performance QA

- Test cold and warm cache.
- Apply the 10 Mbps network profile and documented CPU throttling.
- Record median and worst-case frame time through the portal sequence.
- Record peak triangles, draw calls, textures, geometries, and GPU memory proxies.
- Run extended replay cycles to detect memory growth.
- Verify adaptive downgrades do not interrupt the scenario.

---

## 39. Implementation roadmap and milestone gates

### Phase 0 — Validation and content lock

**Work**

- Confirm site/CAD inputs, portal geometry, train type, component taxonomy, branding, disclaimer, sample evidence, and supported devices.
- Convert open assumptions into assigned decisions.
- Approve the visitor story and screen copy.

**Gate**

- Railway-domain owner approves terminology, placeholder policy, and spatial baseline.

### Phase 1 — Technical prototype

**Work**

- Initialize application shell and quality-safe Three.js scene.
- Implement state-machine skeleton.
- Add placeholder track, portal, train, avatar, follow camera, and movement boundary.
- Demonstrate train movement through the portal.
- Prove load/error/fallback foundations.

**Gate**

- Stable approach-to-exit loop on desktop and mobile baseline.

### Phase 2 — Vertical slice

**Work**

- Complete Standby through Evidence for one coach and one spring defect.
- Add portal activation, component anchor, guided camera, evidence card, audio cue, captions, and mock data.
- Establish target visual quality and performance instrumentation.

**Gate**

- Product, design, technical, and railway reviewers approve one complete inspection story.

### Phase 3 — World and content production

**Work**

- Produce optimized portal, train modules, track, control room, environment, materials, LODs, audio, and evidence assets.
- Add all inspected component categories.
- Build clean, night, and adverse-weather scenarios.

**Gate**

- Asset manifest passes technical validation and domain review.

### Phase 4 — Product integration

**Work**

- Complete dashboard, evidence gallery, scenario selector, presenter controls, accessible narrative, analytics boundary, and data adapter.
- Add optional approved live-summary integration behind a feature flag.

**Gate**

- All product journeys function against validated mock data; live integration is separately approved.

### Phase 5 — Optimization and accessibility

**Work**

- Optimize GLBs and KTX2 assets.
- Tune LODs, instancing, shadows, post-processing, and adaptive quality.
- Complete keyboard, touch, captions, reduced motion, 2D fallback, and screen-reader flow.

**Gate**

- Performance and accessibility acceptance criteria pass on baseline devices.

### Phase 6 — Verification and user acceptance

**Work**

- Execute test matrix, visual regression, memory/replay testing, railway-domain review, security checks, and pilot sessions.
- Resolve critical and high-severity findings.

**Gate**

- Named product, domain, design, technical, accessibility, and security owners approve release.

### Phase 7 — Release and operations

**Work**

- Deploy production artifacts.
- Verify caching, fallback, monitoring, and rollback.
- Document asset/scenario update workflow.
- Train presenters and support personnel.

**Gate**

- Production smoke test and rollback exercise pass.

---

## 40. Team roles and hand-offs

| Role | Responsibility | Key hand-off |
|---|---|---|
| Product owner | Scope, priority, acceptance | Approved requirements and release decision |
| Railway-domain expert | Accuracy and safety | Terminology, defect, layout, evidence approval |
| UX/design lead | Journey, UI, accessibility | Approved states, copy, responsive layouts |
| 3D/CAD lead | Models, LODs, anchors, materials | Validated GLBs and manifest metadata |
| Technical artist | Optimization and effects | Performance-compliant visual assets |
| Frontend/Three.js lead | Architecture and runtime | Tested application build |
| Integration engineer | API adapter and authorization | Versioned validated contract |
| QA lead | Functional, visual, device tests | Release-quality report |
| Accessibility reviewer | Equivalent interaction | Accessibility acceptance report |
| Security/operations | Hosting, CSP, monitoring, rollback | Production readiness approval |

### Hand-off checklist for every major 3D asset

- Source file and exported GLB
- Asset ID and semantic version
- Scale and coordinate declaration
- Screenshot/reference approval
- Triangle, mesh, material, and texture counts
- LODs
- Collision and interaction proxies
- Inspection/focus anchors
- Material and texture list
- License/source
- Known limitations

---

## 41. Acceptance criteria and definition of done

### 41.1 Product and journey

- [ ] A first-time visitor can complete the guided story without presenter assistance.
- [ ] The story covers standby, approach, activation, inspection, defect/evidence, exit, and completion.
- [ ] Clean and spring-defect scenarios produce correct, different outcomes.
- [ ] Free roam is available after completion.
- [ ] Presenter can pause, skip, replay, and select approved scenarios.
- [ ] Simulated information is clearly labelled.

### 41.2 Railway and visual accuracy

- [ ] Portal, site, train, component, and visitor viewpoints receive domain approval.
- [ ] Wheels, springs, brake assemblies, and bogies are correctly located and named.
- [ ] Inspection emphasis is subtle and contains no generic bounding boxes.
- [ ] Spring defect representation and severity wording are approved.
- [ ] Control-room metrics use simple operational language.
- [ ] CAD-dependent values are marked or replaced with approved data.

### 41.3 Interaction and camera

- [ ] Third-person movement works with keyboard and touch.
- [ ] First-person mode is absent.
- [ ] Active track and hazardous areas remain inaccessible.
- [ ] Camera does not clip through primary geometry in approved journeys.
- [ ] Defect focus keeps component and coach context readable.
- [ ] Skip/replay cannot leave orphaned lights, effects, audio, or panels.

### 41.4 Data and evidence

- [ ] Mock and live payloads, if used, pass runtime validation.
- [ ] Stable IDs connect coach, component, defect, and evidence.
- [ ] Inspection Image, Inspection Snapshot, Defect Snapshot, and Inspection Report are represented.
- [ ] Missing evidence degrades independently.
- [ ] Alert wording reflects actual delivery status.
- [ ] No secret or private URL appears in client logs or analytics.

### 41.5 Performance and resilience

- [ ] Interactive standby meets the approved load target.
- [ ] Baseline devices meet their sustained frame-rate target.
- [ ] Draw calls, visible triangles, and texture sizes remain within approved budgets.
- [ ] Adaptive quality reduces load without hiding operational meaning.
- [ ] Multiple scenario replays do not show unbounded memory growth.
- [ ] Asset, data, WebGL, and audio failures provide a useful recovery route.

### 41.6 Accessibility

- [ ] Complete keyboard-only journey works.
- [ ] Touch journey works without hover.
- [ ] Structured DOM narrative exposes all essential status and evidence.
- [ ] Reduced-motion mode removes disorienting movement.
- [ ] Captions or visual equivalents cover meaningful audio.
- [ ] Colour is never the sole status indicator.
- [ ] Dialog focus and Escape behavior are correct.
- [ ] The 2D fallback is complete and independently usable.

### 41.7 Release

- [ ] Automated tests and visual baselines pass.
- [ ] Railway-domain review passes.
- [ ] Security/privacy review passes for the selected deployment mode.
- [ ] Monitoring, rollback, and asset-version procedures are documented.
- [ ] Named owners approve release.

Definition of done means every applicable item above is satisfied or has a documented, approved exception with an owner and expiry.

---

## 42. Risks, mitigations, and open decisions

### 42.1 Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| CAD arrives late or changes | Rework to site, anchors, cameras | Isolate site configuration; validate a grey-box early |
| Train model is too heavy | Slow load and low FPS | Modular coaches, LODs, instancing, hidden-geometry removal |
| Visual effects imply inaccurate sensing | Loss of domain trust | Label visualization; obtain domain approval |
| Timer-driven sequence becomes fragile | Replay and pause defects | One state machine and cancellable commands |
| Mobile controls obscure evidence | Poor usability | Bottom-sheet layouts and device testing |
| Evidence appears live when simulated | Misrepresentation | Persistent simulated label and mode-aware copy |
| High-resolution evidence is large | Slow UI | Thumbnails first; full image on request |
| Dynamic shadows dominate GPU | Frame drops | Tight one-light shadows and tiered substitutes |
| Live API is unavailable | Demo failure | Validated local scenario with explicit demo mode |
| Browser/device fragmentation | Inconsistent output | Supported-device matrix and 2D fallback |
| Accessibility is added late | Expensive redesign | DOM narrative and reduced motion from vertical slice |
| Branding or imagery rights unclear | Release delay | Asset register and approval before production |

### 42.2 Decisions required before Phase 3

1. Exact site and portal geometry source
2. Train locomotive and coach family
3. Official spring-defect terminology and severity
4. Evidence image/report content
5. English-only or multilingual scope
6. Brand marks and legal disclaimer
7. Public, internal, or authenticated deployment
8. Supported baseline devices
9. Whether live summary data is included
10. Presenter/kiosk requirements

These are not implementation placeholders to ignore; each requires an owner and due date.

---

## 43. Future CAD and live-MVIS integration

### 43.1 CAD replacement strategy

The first release may use a validated grey-box. Production CAD integration should:

1. Establish an approved coordinate transform from survey/CAD space to web world space.
2. Preserve the portal origin and train direction convention.
3. Replace zone configuration rather than hard-coded transforms.
4. Map approved camera positions to semantic anchor IDs.
5. Regenerate collision, navigation, culling, and camera-safety volumes.
6. Retest every cinematic shot and inspection anchor.
7. Record source revision and dimensional validation.

Do not ship raw engineering CAD directly to the browser. Produce optimized web derivatives.

### 43.2 Live summary integration

The experience may later consume approved, sanitized events such as:

- train.approaching
- inspection.started
- coach.inspected
- defect.created
- evidence.ready
- alert.status_changed
- inspection.completed

These are semantic public-contract events. They do not reveal edge-node paths, MQTT topics, storage buckets, model internals, or infrastructure topology.

### 43.3 Live-mode guardrails

- Live mode is feature-flagged and authenticated where required.
- A visible Live or Simulation indicator is always present.
- Events include version, ID, timestamp, and ordering information.
- Out-of-order and duplicate events are handled idempotently.
- A disconnect changes status to “Updates paused”; it does not invent completion.
- The guided demonstration can remain deterministic even when the real system is unavailable.
- The 3D website never sends control commands to trackside equipment.

### 43.4 Mobile-alert relationship

The demonstration can show that an alert is prepared or delivered, but the operational mobile application remains a separate product. Both may consume the same sanitized defect and evidence-summary contract. Mobile push delivery, acknowledgement, escalation, and official audit behavior require their own product and security specification.

---

## 44. Appendices

### Appendix A — Minimum asset inventory

| Asset | Priority | Variants | Required metadata |
|---|---|---|---|
| Inspection portal | Critical | High, low/mobile | Camera, light, scan, collision, focus anchors |
| Locomotive | Critical | High, low/mobile | Bounds, wheel anchors, LOD |
| Coach module | Critical | High, low/mobile | Coach ID surface, bogies, inspection anchors |
| Bogie | Critical | High, low | Wheel, spring, brake anchors |
| Defect spring | Critical | Clean and approved defect | Component ID, focus anchor |
| Track/ballast | Critical | Near and distant | Scale, tiling, collision |
| Avatar | High | Desktop/mobile | Capsule dimensions, animation clips |
| Control room | High | Exterior/interior-lite | Screen and interaction anchors |
| Signals/traction | Medium | Instanced/LOD | Placement/config data |
| Site props | Medium | Atlas/instanced | LOD and source |
| Environment map | High | Day/night | Exposure and licence |
| Evidence images | Critical | Thumbnail/full | Alt text, capture time, simulated flag |
| Audio | High | Compressed web formats | Loop points, loudness, caption cue |
| 2D fallback media | Critical | Responsive sizes | Alt text and story stage |

### Appendix B — Semantic event catalogue

| Event | Producer | Primary consumers |
|---|---|---|
| START_GUIDE | UI | Scenario machine, analytics |
| TRAIN_APPROACHING | Scenario director | Train, audio, HUD |
| PORTAL_PREPARING | Scenario machine | Portal, audio, UI |
| PORTAL_READY | Portal controller | Scenario machine |
| COACH_ENTERED_PORTAL | Train controller | Inspection director, HUD |
| COMPONENT_INSPECTION_STARTED | Inspection director | Highlight, HUD |
| COMPONENT_INSPECTION_COMPLETED | Inspection director | HUD, progress |
| DEFECT_FOUND | Inspection director/data adapter | Machine, UI, camera, audio |
| EVIDENCE_READY | Data adapter | Evidence UI, machine |
| TRAIN_EXITED | Train controller | Machine, portal |
| EXPLORE | UI | Machine, character, camera |
| REPLAY | UI | Machine, cleanup systems |
| QUALITY_CHANGED | Quality manager/UI | Renderer, scene systems |
| WEBGL_CONTEXT_LOST | Canvas | Machine, UI |

### Appendix C — Required presenter scenarios

| ID | Defect | Time | Weather | Notes |
|---|---|---|---|---|
| clean-day | None | Day | Clear | Normal inspection flow |
| spring-defect-day | Spring | Day | Clear | Default scenario |
| clean-night | None | Night | Clear | Portal lighting demonstration |
| spring-defect-weather | Spring | Overcast | Light rain/haze | Visibility and resilience |

### Appendix D — Representative interface copy

| State | Heading | Supporting copy/action |
|---|---|---|
| Welcome | Trackside inspection, explained | Begin inspection |
| Standby | Portal ready | Waiting for the approaching train |
| Approach | Train approaching | Inspection will begin automatically |
| Active | Portal active | Inspecting wheels, springs, brakes, and bogies |
| Defect | Potential spring defect identified | View evidence |
| Evidence | Review required | Alert prepared for railway review |
| Complete | Inspection complete | Explore site · Review evidence · Replay |
| Slow load | This is taking longer than expected | Continue waiting · Use walkthrough |
| WebGL fallback | 3D view is unavailable on this device | Open accessible walkthrough |
| Offline live mode | Live updates are paused | Continue with approved demonstration |

### Appendix E — Terminology

| Term | Meaning in this product |
|---|---|
| MVIS | Machine Vision Inspection System |
| Portal | Trackside structure carrying the inspection equipment |
| Guided mode | Directed story with controlled camera and timing |
| Free roam | Third-person exploration after or outside the guide |
| Inspection anchor | Authored transform connecting a component to focus/evidence |
| Interaction proxy | Simplified invisible geometry used for selection |
| Evidence | Image or report supporting an inspection result |
| Review required | Visitor-facing state indicating official attention is needed |
| Adaptive quality | Runtime adjustment of visual cost to maintain usability |
| 2D fallback | Non-WebGL equivalent of the inspection story |
| Simulation mode | Demonstration using synthetic or approved sample records |
| Live mode | Approved connection to current operational summary data |

### Appendix F — Final pre-build checklist

- [ ] Named owners assigned
- [ ] CAD/site baseline approved
- [ ] Train type approved
- [ ] Defect taxonomy approved
- [ ] Evidence set approved
- [ ] Brand and disclaimer approved
- [ ] Device/browser baseline approved
- [ ] Deployment mode approved
- [ ] Mock scenarios validate
- [ ] Vertical-slice acceptance session scheduled

---

## Closing implementation directive

Build the spring-defect vertical slice before producing the entire world. It must prove the state machine, train motion, portal activation, component anchoring, camera focus, evidence UI, pause/replay behavior, mobile path, accessibility narrative, and performance instrumentation in one end-to-end sequence.

Once that slice is approved, expand the environment and scenario set without changing the core contracts. This sequence protects the product from becoming a visually impressive railway scene that cannot reliably explain or replay the inspection process.
