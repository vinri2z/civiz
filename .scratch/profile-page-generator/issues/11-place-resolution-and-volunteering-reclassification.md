# 11 — Place resolution and volunteering reclassification

**What to build:** The two corrections that unlock downstream behaviour rather than just fixing text.

**Place resolution.** The gazetteer's coverage is partial by design, so some locations arrive unresolved. The visitor sees exactly which of their locations could not be placed on the globe — no silent omissions — and for each one can supply or correct coordinates, or drop it from the globe entirely. That last option matters more than it sounds: a remote role whose office city is meaningless will otherwise drag the camera somewhere irrelevant, and the visitor is the only one who knows that.

The visitor can also declare, for a single entry that spanned two cities, which dates belonged to which. That is what makes the globe move at the right scroll position instead of splitting the role evenly — the feature the author's own page already relies on for the Querétaro-to-London stretch.

**Volunteering reclassification.** LinkedIn's export has no volunteering file; volunteer roles are folded into positions or omitted altogether. So the volunteering lane is only reachable if the visitor can reclassify an entry into it. Without this, that lane and its amber legend item are dead code for every imported profile.

**Blocked by:** 06 and 10 — needs unresolved places recorded on the document, and needs the editing surface to correct them in.

**Status:** ready-for-agent

- [ ] Every location the gazetteer could not place is listed for the visitor; none is silently omitted.
- [ ] Coordinates can be supplied or corrected for an unresolved location, and the globe then visits it.
- [ ] Any place can be dropped from the globe while its entry stays on the timeline.
- [ ] An entry with two places can have a date sub-range declared per place, and the globe moves at the declared offsets rather than an even split.
- [ ] A city whose declared share is a sliver still gets enough scroll to be readable.
- [ ] Any entry can be reclassified between education, experience, volunteering and project.
- [ ] Reclassifying an entry to volunteering makes the volunteering lane and its legend item appear, with the correct colour and column.
- [ ] Reclassifying the last volunteering entry away makes the lane and its legend item disappear.
- [ ] All of these persist across a reload and are reflected in the download.
