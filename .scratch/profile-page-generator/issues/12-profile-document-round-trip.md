# 12 — Profile document export and re-import round trip

**What to build:** The visitor downloads their structured profile document alongside their HTML, and can upload that document instead of a ZIP next time.

This kills the feature's worst friction. Without it, wanting to change one date months later means requesting a fresh LinkedIn archive and waiting up to 24 hours again, then redoing every edit. With it, iterating is instant, and the document is something a visitor can keep in version control next to the HTML they host.

The round trip has to be exact: export the document, re-import it, generate again, and the HTML is identical. Anything less means a visitor's edits quietly decay each time they come back.

Because this file lives on disk across months, its version matters. An older document is migrated forward and still generates. An unknown future version is refused with a clear message rather than producing a subtly wrong page.

**Blocked by:** 09 and 11 — the document must be complete, including edits, place corrections and reclassifications, before it is worth exporting.

**Status:** ready-for-agent

- [ ] The structured profile document can be downloaded on its own.
- [ ] That document can be uploaded in place of a LinkedIn archive, and produces the same page.
- [ ] Export, re-import and regenerate yields byte-identical HTML.
- [ ] Edits, hidden entries, corrected dates, corrected and dropped places, per-place sub-ranges, reclassifications, skill grouping and settings all survive the round trip.
- [ ] An older document version is migrated forward and generates correctly.
- [ ] An unknown future version is refused with a clear message rather than generating something subtly wrong.
- [ ] The document is human-readable and diffable, so a visitor can keep it in version control.
- [ ] The `/generate` route explains that this file is the fast path for returning, so the 24-hour wait is a one-time cost.
