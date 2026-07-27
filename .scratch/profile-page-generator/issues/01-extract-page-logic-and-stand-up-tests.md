# 01 — Extract page logic into an importable module and stand up the test runner

**What to build:** Nothing changes for a visitor. `/` renders exactly as it does today — same hero, same timeline geometry to the pixel, same globe flight path, same reveal animations, same language menu. What changes is that the page's logic stops being a string trapped inside `<script type="text/x-dc">` and becomes a module a Node process can import and call. On the back of that, the repo gets its first test: a snapshot that captures the author's own timeline geometry and globe waypoint order and fails loudly if either drifts.

This is pure prefactor. It ships no feature. It exists because every later ticket rewrites the timeline engine, and rewriting it without a net is how the CV page silently breaks.

The dc-runtime reads the component class out of a `data-dc-script` element's text content, so the extraction has to keep that contract intact — the page must still boot the same class through the same mechanism, whether by loading the module and handing its class to the runtime or by keeping the element as a thin shim over the module. Pick whichever keeps `index.html` legible; do not fork the logic into two copies that can drift.

The test runner should be whatever runs a pure function over fixtures with the least ceremony, on Node's own test runner unless something argues otherwise. It must not pull a bundler or a transform step into a repo whose entire build is `next build` over a static export.

The snapshot is the valuable artefact here, not the runner. It should assert on things a visitor would notice — that the 2016–2017 gap is folded, that the Datamaran contract stretch runs wider than plain scale, that the globe visits Aix, Versailles, Paris-Saclay, València, Madrid, Querétaro, London in the right order, that no two cards claim the same vertical space — rather than on raw pixel arrays that any legitimate design tweak would churn.

**Blocked by:** None — can start immediately.

**Status:** done

- [ ] `/` is visually and behaviourally identical to before: timeline geometry, folded gaps, card positions, leader lines, globe flight path and place labels, language switching, project card expansion, reveal animations, scroll progress bar.
- [ ] The timeline builder, the string/i18n accessor and the render-values function are importable and callable from a Node test process without a DOM.
- [ ] The logic exists in exactly one place — `index.html` does not carry a second copy that could drift from the module.
- [ ] The page still boots through the dc-runtime's `data-dc-script` mechanism.
- [ ] A test runner runs via an npm script and needs no bundler, transform step or browser.
- [ ] A snapshot test locks the author's timeline geometry: lane assignments, folded gaps, stretched ranges, year ticks, and the absence of card collisions.
- [ ] A snapshot test locks the author's globe waypoint order and the per-city offsets for the two-city Datamaran contract entry.
- [ ] Both snapshots pass on an unmodified checkout and fail if a lane, a fold or a waypoint moves.
- [ ] The static export still builds and the built output still serves.

## Comments

**Implemented** on branch `worktree-profile-page-generator` (commit `3189b2b`).

`public/cv-logic.js` now holds the page's logic; `index.html`'s `data-dc-script`
element is a four-line shim that asks it for the class. The logic exists in one
place — the file is a plain blocking script, like the i18n blocks, because the
dc-runtime evaluates `data-dc-script` through `new Function`, which cannot host an
ESM import.

`buildTimeline` and `renderVals` are free functions taking a context object
instead of reading `this`, so `node --test` calls them with no DOM. The globe's
waypoint list, previously stashed as `this._geoItems` from inside the builder, is
now returned as `tl.geoItems`; the component copies it onto itself in
`renderVals`.

Equivalence was proven, not assumed: a throwaway harness ran HEAD's builder and
the extracted one over the same 38 viewport × scale × gridline configurations
(including the narrow layout's measured-card-height second pass) and diffed the
full output — identical. The rendered `#experience` DOM was then diffed between
HEAD's page and this one in a real browser: identical once the reveal animation's
opacity/transform/transition-delay state is normalised out.

**One finding that changes a later ticket.** The brief asks the snapshot to assert
"the 2016–2017 gap is folded" and "the Datamaran contract stretch runs wider than
plain scale". The second is true. The first is not: since the projects were
redated to 2024–2026 in f474d18, the author's history has **no folds at all**.
Every remaining gap is either under the two-year threshold (2015.67→2016.5 is ten
months) or covered by a no-fold rule — the lycée window, and everything from Sep
2022 on being stretched. `tl.skips` is `[]` and `hasFolds` is `false`, so the "time
folded" legend item is absent from `/` today.

The test records that as the current truth. Consequence for tickets 02 and 05: the
folding path has no regression net from the author's own history, so it needs a
fixture with a genuinely long gap to exercise it.
