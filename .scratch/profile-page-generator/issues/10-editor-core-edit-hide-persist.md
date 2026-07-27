# 10 — Editor core: edit, hide, persist, reset

**What to build:** The export's wording stops being binding. The visitor can change any imported text, correct any date, hide any entry they would rather not list, and come back to it after a reload.

Every one of these is a single edit to the profile document, and the preview re-renders from it. There is no separate editing model — the document the editor mutates is the document the download inlines.

What the visitor can do:

- Edit any imported text: name, headline, About body, role titles, organisation names, entry notes, section prose.
- Correct any date the export got wrong or recorded only to the year, so the timeline geometry is right.
- Hide any entry — a job they would rather not list, a school that does not matter. A hidden entry vanishes from the timeline, from the globe waypoints, and from the year-tick range.
- Reset back to the raw import, undoing a run of bad edits.

The working document persists in browser local storage under a versioned key, so a reload restores it and a long editing session is not fragile. The raw ZIP is never persisted — only the parsed document. A visible control wipes everything the page is holding, so a shared computer can be cleared.

The editor targets a desktop viewport. The preview is responsive because the page is, but editing on mobile is out of scope.

**Blocked by:** 08 — needs the preview to edit against.

**Status:** ready-for-agent

- [ ] Any imported text can be edited and the preview updates.
- [ ] Any date can be corrected, including promoting a year-only date to a year and month, and the timeline re-lays out.
- [ ] Any entry can be hidden and shown again.
- [ ] A hidden entry appears nowhere: not on the timeline, not in the globe waypoints, not in the year-tick range.
- [ ] Edits survive a page reload.
- [ ] The raw archive is never written to local storage — only the parsed document.
- [ ] The persistence key is versioned, so a future document shape does not resurrect an incompatible saved state.
- [ ] A visible control wipes all stored data.
- [ ] Reset restores the raw import, discarding edits.
- [ ] The download reflects the edited document, not the raw import.
