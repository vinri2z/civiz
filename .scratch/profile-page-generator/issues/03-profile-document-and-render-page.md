# 03 — Profile document v1 and rendering a page from one

**What to build:** A hand-written profile document for somebody who is not the author produces a complete, correct page — hero with their name and headline, About section with their summary, work cards, toolkit and skills, languages, the full to-scale timeline across whichever lanes they have, and the globe flying between their cities.

This is the contract everything downstream depends on, so it gets defined here and proven immediately against a profile with a genuinely different shape from the author's: different date range, different lane mix, different number of entries, at least one entry with two places and at least one with none.

The document is versioned, because real people will keep it on disk and re-upload it months later. The renderer accepts its own version and migrates older ones forward.

Two decisions inside the shape are load-bearing and must not be softened:

- **Dates are year-and-month, never a timestamp.** The timeline works in fractional years and labels month-year. A full date would be precision the source data does not have.
- **A place is a name plus coordinates plus an optional date sub-range within its entry.** The sub-range is what makes a single role spanning two cities move the globe at the right scroll position rather than splitting the role evenly.

The `/` page is not migrated onto this document. That is deliberate and out of scope — it stays hand-written for now so this ticket cannot break it.

**Blocked by:** 02 — the renderer feeds entries into the parameterised timeline builder.

**Status:** done

- [ ] A versioned profile document shape covers identity, entries, skills, languages and settings.
- [ ] Every entry carries a kind of education, experience, volunteering or project, a start as year-and-month, an optional end whose absence means present, a hidden flag, and a places list.
- [ ] A place carries a name, coordinates and an optional date sub-range within its entry.
- [ ] Given a fixture profile document, a single call returns complete page HTML with every section populated.
- [ ] The fixture profile is not the author's and differs in date range, lane mix and entry count.
- [ ] An entry with no end date renders as open-ended, not as ending today.
- [ ] An entry with two places, each carrying a sub-range, produces globe waypoints at the right offsets rather than an even split.
- [ ] An entry with no place appears on the timeline and does not appear in the globe waypoint list.
- [ ] A hidden entry appears nowhere — not on the timeline, not in the globe, not in the year-tick range.
- [ ] Settings for pixels-per-year, gridlines and globe on/off take effect.
- [ ] The renderer rejects an unknown future document version with a clear message and migrates a known older one forward.
- [ ] `/` is untouched and ticket 01's snapshots still pass.

## Comments

**Implemented** on branch `worktree-profile-page-generator` (commit `29a1255`).

Three new modules, all loaded the same way as `cv-logic.js` so the browser and a
Node test process read the same files:

- `public/profile.js` — the document shape, `PROFILE_VERSION`, `migrateProfile`,
  and the mapping from document entries to builder entries. Hidden entries are
  dropped here, which is what makes one flag remove an entry from the timeline,
  the globe and the year-tick range at once.
- `public/render-page.js` — a static renderer for the subset of the x-dc template
  the page uses: `{{ path }}`, `sc-if`, `sc-for`, style objects, `image-slot`.
  Expressions are dotted paths and nothing else, so there is no eval. The runtime
  does this in the DOM at boot; a file somebody hosts needs it done ahead of time,
  and a test needs to assert on what a visitor would see.
- `public/generate.js` — the single call: document in, page HTML out.

`test/fixtures/hydrologist.profile.json` is the non-author fixture: starts in 1996
rather than 2010, no volunteering lane, three projects, one role spanning two
cities by declared sub-range, one role with no place at all, one hidden entry.

**Three values had to come out of the markup**, because one template drawing two
people cannot hold one person's name: the hero name, the About stat, and the
globe's initial place label. That last one was a real leak — the template hardcoded
`València`, so it would have appeared in every page the generator ever produced.
Caught by the output-isolation test, which is exactly the test the spec asks for.
`/` is not migrated onto the document; it still gets its content from
`cv-logic.js` and the i18n blocks, and its rendered geometry and text are
unchanged (verified element by element in a browser).

**Two things recorded rather than fixed, both belonging to ticket 09.**

1. A generated page renders blank without JavaScript, because every `data-reveal`
   element starts at `opacity: 0` waiting for the runtime's IntersectionObserver,
   which a generated file does not yet carry. The generator emits a narrow
   `[data-reveal]{opacity:1 !important}` override so the file is readable. Ticket
   09 should drop that override once the runtime is inlined and the motion is real
   again.
2. A work card's detail bullets are collapsed in the static render, because the
   renderer drops event handlers a file has nothing to bind. Story 52 — the
   download behaving identically to the preview — depends on ticket 09 inlining
   the runtime.

The globe layer is now behind the `showGlobe` setting rather than unconditional.

59 tests pass, including ticket 01's author-geometry snapshot.
