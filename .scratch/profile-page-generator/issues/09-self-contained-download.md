# 09 — Self-contained download

**What to build:** The visitor clicks download and gets one HTML file that is theirs. Hosting it is a single-file copy with no build step. Opening it straight off disk works.

Everything the page needs is inlined: the `x-dc` template, the dc-runtime, the image-slot component, the chosen language's structural strings, and their profile document.

Two external dependencies have to be resolved, and one of them costs fidelity:

**Geometry.** The globe currently loads d3 and topojson from unpkg and fetches the world atlas from jsDelivr. A page opened over `file://` cannot fetch cross-origin, so a globe-bearing download has to carry its own geometry. It embeds a simplified world outline sized for a single file rather than the full atlas, plus the projection code it needs. This is a knowing trade of fidelity for self-containment and it is the only place the download is deliberately worse than the original. It is also the whole reason opening from disk is possible at all.

**Fonts.** The download keeps the remote Google Fonts link and degrades to the existing system-font fallbacks offline, rather than embedding several hundred kilobytes of woff2 into every generated file.

Logos are embedded as data URIs where the visitor supplied them, and fall back to the typographic placeholder otherwise.

The file carries the visitor's name in its title and metadata so a browser tab and a search result show them, not the template's author. And it contains no trace of the author's data — no leftover fixture strings, no fallback copy naming Valencia or Datamaran.

The route also tells the visitor where they might host the file, so they are not left holding an HTML file with nowhere to put it.

**Blocked by:** 08 — the download is what the preview leads to.

**Status:** ready-for-agent

- [ ] Downloading yields a single HTML file with no sidecar assets.
- [ ] Opening that file directly over `file://` renders the full page with the globe drawing.
- [ ] Runtime, template, image-slot component, structural strings and profile document are all inlined.
- [ ] A simplified world outline and the projection code are embedded; no geometry is fetched at view time.
- [ ] Fonts load remotely when online and fall back to system fonts offline without layout breaking.
- [ ] Behaviour matches the preview: reveal animations, scroll progress, timeline geometry, globe flight and idle spin, expandable cards, language menu.
- [ ] The file's title and metadata carry the visitor's name.
- [ ] No string from the author's own data or from any test fixture appears in a generated page.
- [ ] No reference to an origin-relative asset path survives in the download.
- [ ] Visitor-supplied logos are embedded as data URIs; missing ones fall back to the typographic placeholder.
- [ ] The route suggests where to host the file.
