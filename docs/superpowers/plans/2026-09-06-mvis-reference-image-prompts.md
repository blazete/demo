# MVIS Reference Image Prompts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce paste-ready Nano Banana and GPT Image prompts for technically credible Blender reference images of the Indian Railways MVIS installation from every useful presentation angle.

**Architecture:** Create one human-readable Markdown deliverable with shared reference-input and scene-lock blocks plus reusable angle prompts. The pack covers aerial, top, end, trackside, approach, exit, CAM-5, equipment, office, night, and rain views while preserving one consistent railway layout.

**Tech Stack:** Markdown, Nano Banana image generation, GPT Image.

## Global Constraints

- Use the supplied MVIS top-view and cross-section drawings as geometry references.
- Use the existing WAP-7, LHB coach, CAM-5, field engineer, track, and portacabin images or renders as appearance references when the generator supports multiple inputs.
- Generate a 16:9 engineering-photorealistic presentation image.
- Show exactly four parallel broad-gauge railway tracks.
- Use an open MVIS installation with no overhead gate, gantry, arch, platform, tunnel, or roof.
- Keep the project-office portacabin outside the fence and parallel to the tracks.
- Make CAM-5's upward-facing lens visible between the active rails.
- Treat the generated image as Blender art direction, not verified CAD geometry.

---

### Task 1: Create and verify the two generator prompts

**Files:**
- Create: `docs/MVIS_IMAGE_GENERATION_PROMPTS.md`
- Modify: `docs/superpowers/plans/2026-09-06-mvis-reference-image-prompts.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-09-06-mvis-reference-image-prompt-design.md` and the supplied drawing/model references.
- Produces: two independently paste-ready prompts plus recommended generation settings.

- [x] **Step 1: Write the shared reference-input instructions**

List the two engineering drawings first, followed by optional appearance references. Explicitly state that drawings control layout while model images control materials and appearance.

- [x] **Step 2: Write the Nano Banana prompt**

Use clearly separated `GOAL`, `REFERENCE PRIORITY`, `SCENE`, `MVIS EQUIPMENT`, `COMPOSITION`, `VISUAL QUALITY`, and `DO NOT INCLUDE` blocks. Require four tracks, WAP-7/LHB rolling stock, realistic 25 kV OHE, CAM-1 through CAM-5, eight side lamps, six under-track strips, sensors, relay cabinet, maintenance path, fence, and safely positioned portacabin.

- [x] **Step 3: Write the GPT Image prompt**

Use one cohesive descriptive prompt followed by a compact `Avoid:` paragraph. Preserve the same component counts, spatial relationships, daylight treatment, official-presentation tone, and Blender-reference disclaimer.

- [x] **Step 4: Add generation settings and iteration instructions**

Specify 16:9 landscape, highest available quality, elevated three-quarter view, low stylization, and three initial variants. Add a correction prompt for common failures: gate added, wrong track count, hidden CAM-5 lens, disconnected OHE, or cabin on railway infrastructure.

- [x] **Step 4a: Add the complete presentation-angle pack**

Provide reusable angle blocks for: official aerial hero, high drone overview, engineering top view, cross-section end view, trackside side elevation, train approach, train exit, CAM-5 macro, paired camera/lamp detail, office safety context, night operation, and rain operation.

- [x] **Step 5: Verify required prompt coverage**

Run:

```bash
rg -n "Nano Banana|GPT Image|four parallel|WAP-7|LHB|CAM-1|CAM-5|eight|six|25 kV|portacabin|outside the fence|no overhead|Blender" docs/MVIS_IMAGE_GENERATION_PROMPTS.md
```

Expected: every required concept appears in the completed deliverable.

Run:

```bash
git diff --check -- docs/MVIS_IMAGE_GENERATION_PROMPTS.md docs/superpowers/plans/2026-09-06-mvis-reference-image-prompts.md
```

Expected: no output and exit 0.

- [x] **Step 6: Commit the prompt deliverable**

```bash
git add docs/MVIS_IMAGE_GENERATION_PROMPTS.md docs/superpowers/plans/2026-09-06-mvis-reference-image-prompts.md
git commit -m "docs: add MVIS reference image prompts"
```
