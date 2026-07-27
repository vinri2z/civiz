# CV site updates (2026-07)

Batch of content and behavior updates to the static CV site (`public/index.html` + `public/support.js`), plus a content-extraction refactor to make future edits cheaper.

## Context

The site is a single `x-dc` component in `public/index.html`. `buildTimeline()` holds language-invariant structural data (dates, lat/lon coordinates, colors) for the education/experience timeline; `getStrings()` holds 4 full language blocks (en/fr/es/ca) with translated copy — including place names, which genuinely differ per language (e.g. "Versailles"/"Versalles", "València"/"Valence"/"Valencia", "London"/"Londres"), so the duplication across languages is real localization, not copy-paste waste.

## Slices

1. Extract per-language content into 4 JS files, keep single `index.html` — foundational, recommended first to avoid merge collisions on the monolith.
2. Lycée Sainte-Geneviève logo → local asset (`public/Lycee Sainte Genevieve Logo.png`)
3. Contact nav label lowercase
4. Add Lycée Militaire d'Aix-en-Provence education entry (2010-2013)
5. Add Volunteering as new timeline category (Madagascar 2016, 4L Trophy Morocco 2017)
6. Mexico (Querétaro) globe-sync: per-city date sub-range (Jul 2020 - Aug 2022)
7. Anchor the 4 existing Work-section projects on the timeline (2024-2026, spread evenly in Work-section order)
8. Earth animation: slow idle rotation when scrolled off the timeline section

## Decisions so far

- Slice 1 is not a hard blocker for 2-7, but should land first in practice — every other slice edits the same regions of `index.html` (`getStrings()` blocks, `buildTimeline()`), so landing the split first avoids conflicts.
- Timeline projects (slice 7) = the 4 existing Work-section cards, anchored with dates — not new/undrafted projects.
- Lycée Militaire slot = 4th education entry, reuses existing teal styling (no new category).
- Volunteering entries = new 3rd timeline category with its own color + legend item (distinct from Education/Experience).
- Project dates (slice 7): no exact dates supplied — spread evenly across 2024-2026 in the Work section's existing top-to-bottom order (ESG Targets Extraction → IRO Generation → LLM-Assisted Regulatory Intelligence → ML Platform & Evaluation Infrastructure), ~6 months each.
- Idle rotation (slice 8): today the globe stays pinned to the nearest timeline waypoint everywhere on the page, including hero/about/work/skills sections above the timeline (no `[data-geo-i]` nodes exist there yet, so it just locks to the first waypoint) and the contact section below it (explicit home-position fallback). Slice 8 replaces that pinned behavior with a slow continuous rotation whenever the viewport center is outside the `#experience` section.
