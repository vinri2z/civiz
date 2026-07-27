# 07 — Skills, languages, projects and certifications

**What to build:** The remaining sections fill themselves in from the archive, so the generated page is complete rather than a timeline with empty blocks under it.

Skills come from `Skills.csv`. LinkedIn permits fifty or a hundred, and dumping them as one wall of chips is unreadable — they arrive grouped. The grouping the importer guesses is a first pass, not a verdict; the visitor overrides it in the editor later, so this ticket only owes a sensible default.

Languages and proficiency levels come from `Languages.csv` and fill the languages column directly.

Projects come from `Projects.csv` and do double duty: work cards in the projects section, and their own lane anchored at their own dates on the timeline. Like every other lane, that lane and its legend item exist only if there is at least one project.

Certifications come from `Certifications.csv`. They are credentials the visitor earned and should not be dropped on the floor, so they surface somewhere sensible rather than being discarded.

Every one of these files is optional. An absent file means an absent section, not an empty one.

**Blocked by:** 05 — extends the seam to read four more archive members alongside positions and education.

**Status:** ready-for-agent

- [ ] Skills from the archive appear in the skills section, grouped rather than dumped as one undifferentiated wall.
- [ ] A profile with a hundred skills stays readable.
- [ ] Languages and proficiency levels from the archive fill the languages column.
- [ ] Projects appear as work cards and as their own timeline lane at their own dates.
- [ ] The projects lane and its legend item appear only when at least one project exists.
- [ ] Certifications from the archive are surfaced rather than dropped.
- [ ] Each of these archive members is optional; an absent one yields an absent section and no legend item, not an empty block.
- [ ] Project titles are not duplicated between the work cards and the timeline data — one source of truth.
- [ ] All four flow through the profile document; nothing bypasses the contract.
