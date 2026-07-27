# 05 — Positions and education become the timeline

**What to build:** A full LinkedIn archive produces the page's centrepiece: every job from `Positions.csv` in the Experience lane, every school from `Education.csv` in the Education lane, drawn to scale on one timeline with dead time folded.

This is where the messy reality of real career data gets handled, and the acceptance criteria are mostly a list of the ways real profiles differ from a tidy one:

A role held right now must read as open-ended, not as ending today. A role held for one month must render as a visible pill rather than collapsing to zero height. A double degree overlapping a job, or a contract running alongside a staff role, must lay out without the cards colliding. A career with a five-year gap must fold that gap with the "time folded" marker rather than scrolling through blank space. Dates recorded only to the year — LinkedIn permits this — must position and label without inventing a month.

The years-of-experience stat in the About section is computed from the earliest professional position rather than being a literal.

Organisation logos are resolved where possible and fall back to the existing typographic placeholder where not. No logo is fetched from a third party.

**Blocked by:** 04 — extends the seam to read two more archive members.

**Status:** ready-for-agent

- [ ] Every position from the archive appears in the Experience lane; every school in the Education lane.
- [ ] A currently-held role renders as open-ended, not as ending on today's date.
- [ ] A one-month role renders as a readable pill, not zero height.
- [ ] Overlapping entries lay out with no two cards claiming the same vertical space.
- [ ] A long empty stretch folds with the "time folded" marker and the page height stays bounded.
- [ ] Year-only dates are accepted, positioned, and labelled without a phantom month.
- [ ] A multi-decade career and a two-year career both produce a readable timeline.
- [ ] The years-of-experience stat is derived from the earliest professional position.
- [ ] Entries with no resolvable logo fall back to the typographic placeholder with no visual hole.
- [ ] No logo, font or geometry is fetched from a third party during generation.
- [ ] Positions and education both round-trip through the profile document — the importer writes it, the renderer reads it, nothing bypasses it.
