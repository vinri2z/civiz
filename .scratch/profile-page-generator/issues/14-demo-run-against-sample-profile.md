# 14 — Demo run against a sample profile

**What to build:** A visitor who arrives curious can see the thing work right now, without requesting anything from LinkedIn.

This is the highest-leverage small ticket in the set. The feature's real risk is not engineering, it is that a visitor lands excited and immediately hits "come back in up to 24 hours" — and never comes back. A one-click demo turns that dead end into a working preview they can play with while their real archive is being prepared.

It is nearly free: the fixture archives already exist as test fixtures. One button loads one of them through the same seam a real archive goes through, and the visitor gets a full preview — timeline, globe, skills, the lot — plus the editor to poke at.

The demo must be unmistakably a demo. A visitor who forgets they are looking at a sample and downloads it has been actively misled, so the sample profile is obviously fictional and the preview says so while it is loaded.

**Blocked by:** 08 — needs the route and preview.

**Status:** ready-for-agent

- [ ] A single control on the `/generate` route loads a sample profile and produces a full preview.
- [ ] The demo goes through the same seam a real archive does — no separate code path.
- [ ] The sample reuses committed test fixtures rather than introducing a second set of sample data.
- [ ] The sample exercises the interesting cases: multiple lanes, a folded gap, an overlap, a currently-held role, an entry spanning two cities.
- [ ] The sample profile is obviously fictional.
- [ ] While the demo is loaded, the preview states that this is sample data.
- [ ] Loading the demo does not overwrite a visitor's own persisted document without warning.
- [ ] Clearing the demo returns the route to its initial state.
