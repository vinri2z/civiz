# 15 — Thin end-to-end pair

**What to build:** Two browser tests, and deliberately only two.

Everything with real logic in it — parsing, column aliasing, lane assignment, geocoding, timeline geometry, globe waypoint construction, i18n selection, inlining — is already covered at the seam by fast pure-function tests over fixture archives. Duplicating that in a browser buys nothing and costs a brittle suite, especially for the date and geometry maths.

What the seam genuinely cannot cover is browser behaviour, and there are exactly two things worth asserting:

**The drop zone works.** A ZIP dropped on `/generate` produces a preview showing the profile's data. This covers the wiring between a real file input, a real client-side unzip, and a real render — none of which the pure seam exercises.

**The download opens from disk.** The generated file, opened over `file://`, renders and draws its globe. This is the claim the self-containment work exists to make, and it is unfalsifiable without a real browser and a real file. It is also the assertion most likely to catch a regression, since any accidentally reintroduced origin-relative path or cross-origin fetch breaks it silently.

Keep the pair thin. Resist growing it into a general UI suite — the pressure to add "just one more" browser test is how a fast suite becomes a slow one nobody runs.

**Blocked by:** 09 — needs a real download to open.

**Status:** ready-for-agent

- [ ] A browser test drops a fixture archive on `/generate` and asserts the preview shows that profile's data.
- [ ] A browser test opens a generated file over `file://` and asserts the page renders and the globe draws.
- [ ] Both run from an npm script and are separable from the fast seam tests, so the fast suite stays the default.
- [ ] Neither test asserts on pixel values, internal geometry or intermediate helpers — the seam tests own that.
- [ ] The suite stays at two tests; there is a note recording why it is deliberately thin.
- [ ] The `file://` test fails if any origin-relative path or cross-origin fetch is reintroduced into the download.
