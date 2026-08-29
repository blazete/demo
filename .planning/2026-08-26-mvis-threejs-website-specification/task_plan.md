# Task Plan: MVIS Three.js Interactive Website Specification

## Goal
Create a comprehensive, implementation-ready Markdown specification for an interactive Three.js MVIS website, grounded in the PDFs in this folder and improved through system and experience design review.

## Next Step
Team review of the verified Indian Railways asset-integrated build; follow-up performance splitting can be scheduled separately.

## Current Phase
Phase 8

## Phases

### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Extract both PDFs
- [x] Identify functional, visual, data, and technical constraints
- [x] Document discoveries in findings.md
- **Status:** complete

### Phase 2: Clarification & Approaches
- [x] Ask one focused clarification
- [x] Propose 2-3 experience approaches with trade-offs
- [x] Recommend one direction
- **Status:** complete

### Phase 3: Design & Outline Approval
- [x] Present architecture, UX flow, interactions, data model, failures, and testing approach
- [x] Present detailed Markdown outline
- [x] Obtain user approval
- **Status:** complete

### Phase 4: Specification Authoring
- [x] Write the approved start-to-end Markdown specification in the requested folder
- [x] Incorporate source requirements without copying source wording unnecessarily
- [x] Add implementation phases and acceptance criteria
- **Status:** complete

### Phase 5: Self-Review, Verification & Delivery
- [x] Scan for placeholders, contradictions, ambiguity, and scope gaps
- [x] Verify the file exists and covers the approved outline
- [x] Deliver the file path for user review
- **Status:** complete

### Phase 6: Implementation Audit & Improvement
- [x] Inspect current implementation, dependency setup, and project changes
- [x] Run build and server smoke test (browser automation remains blocked by unavailable local browser tooling)
- [ ] Compare implemented behavior with the approved specification
- [x] Present a focused remediation design for approval before modifying code
- [x] Write and self-review the approved remediation design
- [x] Obtain user review of the written remediation design
- **Status:** complete

### Phase 7: Targeted Remediation & Verification
- [x] Apply approved core fixes
- [x] Re-run build and server/unit validation
- [x] Run desktop/mobile Playwright smoke validation
- [x] Report current compliance and remaining gaps
- **Status:** complete

### Phase 9: Indian Railways Asset Integration
- [x] Optimize and bundle the five user-supplied CC BY GLB assets
- [x] Replace the procedural gated portal with the open cross-track camera/lighting array
- [x] Integrate WAP-7, LHB coaches, generator car, track detail and Indian person
- [x] Record creator/source/licence attribution
- [x] Verify desktop/mobile rendering and the complete defect flow
- **Status:** complete

### Phase 8: Implementation Planning
- [x] Create a bite-sized, file-specific implementation plan
- [x] Select inline execution
- **Status:** complete

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Use the user-specified folder for the final specification | Explicit user preference overrides the brainstorming skill's default docs path |
| Treat the document as an implementation specification/reference | The requested artifact must guide a team from requirements through delivery rather than teach Three.js from scratch |
| Do not implement the website in this task | The user requested a Markdown specification only |
| Default document framing is implementation specification/reference for a Three.js team | This captures the full product, UX, 3D, data, quality, and delivery contract while leaving tutorial content out of scope |
| Default experience is a guided cinematic inspection followed by optional free-roam exploration | User approved the recommended balance between narrative clarity and interactivity |
| Selected product direction: Guided Digital Twin | User chose approach 1 over executive showcase and operational simulator alternatives |
| Approved experience journey | Guided arrival, standby, train approach, portal activation, inspection, defect focus, evidence, completion, and optional free roam/replay |
| Approved technical architecture | React/TypeScript with React Three Fiber over Three.js, an explicit scenario state machine, modular scene systems, compressed progressive assets, responsive controls, and graceful fallbacks |
| Approved visual and quality direction | Indian railway inspection visual language, adaptive rendering tiers, purposeful audio, accessible alternatives, and multi-layer QA |
| Current implementation task | Audit and improve the user-created React/R3F vertical slice against the approved specification; do not expand scope beyond discovered blockers and compliance gaps without approval |
| Remediation direction | User approved the spec-first remediation approach: state machine, coherent train contract, functional controls, data-driven defect/evidence, safe free roam, fallback, and targeted test coverage |
| Implementation plan | Saved at `docs/superpowers/plans/2026-08-26-mvis-remediation.md`; execution mode is the next decision |

## Errors Encountered
| Error | Resolution |
|-------|------------|
| Spotlight metadata/text extraction unavailable | Used direct stream decoding and rendered-page inspection |
| Quick Look sandbox initialization failed | Re-ran the read-only render with approved system access |
| Findings patch context mismatch | Re-read and normalized findings before continuing |
| Phase-transition patch context mismatch | Re-read planning files and applied a smaller targeted patch |
| Browser runtime unavailable | In-app Browser reported no browser available; use permitted Playwright fallback if installed |
| Local browser-test tooling missing | Neither Playwright nor agent-browser CLI is installed; complete server/static checks and request approval before adding a testing dependency |
| In-app Browser unavailable | Used the approved Playwright fallback after installing Chromium; local browser smoke completed |
