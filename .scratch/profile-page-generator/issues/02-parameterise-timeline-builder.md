# 02 — Parameterise the timeline builder: entries in, geometry out

**What to build:** The timeline stops being a drawing of one person's career and becomes a drawing of whatever career it is handed. Same maths, same visual result for the author, but the entries arrive as an argument instead of sitting as literal arrays inside the builder.

Three things are currently tuned by eye for one CV and have to stop being hardcoded:

**The axis floor** is the literal year `2010`, chosen so the 2010 gridline sits at its true position rather than being clamped onto the first entry. It becomes the round year below the earliest entry, whatever that is.

**The stretch and no-fold rules** are date-literal conditions — one window around the Datamaran contract years, one around the lycée years. A profile that never touched those years gets no stretching and folds by the generic rule. So they become properties an entry can carry: "run this entry at a wider scale", "never fold the gap before this entry". Both default to off. The author's entries set them and the author's page looks unchanged.

**Lane presence** is currently assumed — Education, Experience, Volunteering and Projects all exist because the author has all four. A lane with no entries must contribute no bar, no card column, and no legend item. An empty legend describing an absent lane is a bug.

The upper bound of the year ticks is also currently a literal. It follows the latest entry instead.

Everything else stays: the fractional-year positioning, the dead-time folding with its "time folded" marker, the collision-avoiding card spread by per-category gap, the left/right column assignment, the leader lines, the marks, the minimum-share city offsets, and the globe waypoint ordering by visual position.

**Blocked by:** 01 — needs the builder callable from tests and the author's geometry snapshotted.

**Status:** done

- [ ] The timeline builder takes its entries as input and holds no person's data.
- [ ] Ticket 01's snapshots pass unchanged — the author's page renders identically, including the stretched contract years and the unfolded lycée years.
- [ ] The axis floor is derived from the earliest entry; a profile starting in 1994 or 2021 gets a correct floor with no clamping artefact.
- [ ] The latest year tick follows the latest entry.
- [ ] Stretch and no-fold are per-entry properties defaulting to off; a profile that sets neither folds and scales by the generic rule.
- [ ] A lane with no entries produces no bar, no card, no leader line and no legend item.
- [ ] A profile with only education renders a valid one-lane timeline.
- [ ] A profile with a single entry renders without dividing by zero or collapsing to zero height.
- [ ] Card collision spread still holds for a profile with many overlapping entries.

## Comments

**Implemented** on branch `worktree-profile-page-generator` (commit `17d2b20`).

`buildTimeline` takes `ctx.entries`, a flat list where each entry carries its
`kind`, a from/to month pair (null `to` meaning present), an optional explicit
fractional-year `range`, its cities, and its own copy. The author's history moved
to `AUTHOR_ENTRIES` in `cv-logic.js` and goes in through the same door — data
passed in, not a second code path, as the spec asked.

- Axis floor is the round year below the earliest entry; the top tick follows the
  latest.
- `stretch` and `noFoldBefore` are entry properties defaulting to off.
- Lane presence is derived: an empty lane contributes no bar, no card column, no
  mark and no legend item. The four hardcoded legend spans became one loop over
  `tl.legend`.
- Lane geometry, gaps, colours and leader directions come from one `LANE_DEFS`
  table instead of four parallel code paths.

**One deviation from the brief, and it is a correction.** The brief frames the
no-fold rule as "never fold the gap before this entry". That is not what the
lycée date literal encoded. It was stopping the builder from folding *the entry's
own duration*: a 2.83-year entry with no other entry's date inside it is one
segment longer than the two-year fold threshold, so the generic rule would replace
it with a "time folded" marker. So occupied time is now never folded as a general
rule, which reproduces the literal exactly and fixes the same bug for any imported
profile with a long unbroken entry. `noFoldBefore` still exists for the case the
brief names; the author needs neither flag.

**Two things found while doing this.**

1. The worktree branched from `5009442`, but `origin/main` was one commit ahead at
   `276faca`, which unified the two leader functions and changed the wide layout's
   left-column geometry. The extraction was built on the older commit and would
   have reverted it. Rebased onto `276faca` and ported the fix; the equivalence
   harness now runs against `276faca`. Worth knowing that local `main` is behind
   `origin/main` by two commits.
2. `git show > file` in this shell picks up a `Using git-me` line from a hook,
   which silently corrupted an extracted baseline copy of the i18n blocks and made
   a comparison page fail to boot. Anything extracting files with `git show`
   should filter that line.

**Verification.** The builder's output matches `276faca`'s across 38
viewport × scale × gridline configurations, including the narrow layout's
measured-card-height second pass. The rendered page is identical element for
element in a real browser — the only difference in the whole body is the
`data-dc-script` element's own text.

`test/arbitrary-entries.test.js` adds 20 cases over profiles nothing like the
author's: a folded sixteen-year gap, a six-year entry that must not fold itself
away, a fourteen-job career, a two-year career, year-only dates, lane presence and
reclassification, and an unplaced location.
