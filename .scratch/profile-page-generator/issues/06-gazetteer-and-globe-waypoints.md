# 06 — Gazetteer and globe waypoints

**What to build:** The feature that sells the page. As the visitor scrolls their own timeline, the globe flies between the cities of their own career, each dot labelled as it is reached, spinning slowly when they are anywhere else on the page.

Locations arrive from the archive as strings — `Valencia, Spain`, `Greater London, United Kingdom`, `Querétaro, Mexico`, `San Francisco Bay Area`. Coordinates come from a compact gazetteer shipped with the site. No network call, no API key, no rate limit, and no third party learning where a visitor has lived.

Matching is normalised: case, accents and punctuation folded, and LinkedIn's "Greater X Area" and "X Metropolitan Area" phrasings stripped. Where the string names a country, matching is scoped to it. Where a city name is ambiguous within that country, the largest-population candidate wins.

Coverage is deliberately partial — cities above a population threshold plus every capital. That makes the unresolved path the normal path, not the error path: anything unmatched is recorded on the profile document as an unresolved place, ready for the visitor to fix in a later ticket. It is never silently dropped, and it never breaks the globe. An entry whose only place is unresolved stays on the timeline and stays out of the waypoint list, exactly as a project with no place does.

The globe's own behaviour is not rewritten. Its idle spin, its scroll scan and its interpolation already work off generic data.

**Blocked by:** 05 — needs real entries with real location strings to place.

**Status:** ready-for-agent

- [ ] A gazetteer ships with the site; no network request and no API key is involved in resolving a location.
- [ ] The globe flies between the visitor's own cities as they scroll their timeline, labelling each as it is reached.
- [ ] The globe spins slowly whenever the viewport centre is outside the timeline, and entering or leaving the timeline never snaps.
- [ ] Matching folds case, accents and punctuation, and strips "Greater X Area" and "X Metropolitan Area" phrasings.
- [ ] Where the location string names a country, matching is scoped to it.
- [ ] An ambiguous city name within a country resolves to the largest-population candidate.
- [ ] An unresolved location is recorded on the profile document as unresolved, never silently dropped.
- [ ] An entry whose only place is unresolved appears on the timeline and not in the waypoint list.
- [ ] A single entry spanning two cities with declared sub-ranges moves the globe at the right scroll offsets, and a city whose real share is a sliver still gets enough scroll to be readable.
- [ ] Turning the globe off in settings removes it without affecting the timeline.
- [ ] The author's globe flight path from ticket 01's snapshot is unchanged.
