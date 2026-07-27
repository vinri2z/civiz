# 08 — The `/generate` route: drop zone to live preview

**What to build:** The first thing a visitor actually sees. A `/generate` section on the same static site where they drop their LinkedIn archive and immediately see their own version of this page.

The route carries the whole explanation, because the flow is unavoidably a two-step one and a visitor who does not understand why will bounce:

- Step-by-step instructions for requesting the archive, naming where in LinkedIn's settings it lives.
- An up-front warning that LinkedIn takes between ten minutes and 24 hours to prepare it, so nobody thinks the page is broken while they have nothing to upload.
- A plain explanation of why the page cannot just log them in with LinkedIn and fetch this itself — LinkedIn's sign-in returns a name, a photo and an email and nothing else; the scopes that return career data need partner approval a personal site will not get. Framed as a constraint, not an omission.
- A statement that the archive is read in their own browser and nothing is transmitted anywhere, phrased so it is verifiable in the network tab rather than taken on faith.

The drop zone accepts a dragged file or a file picked from a dialog. Parsing runs client-side through the existing seam. The preview is the real page — same fonts, same colours, same motion, same globe — not a mockup, because a visitor deciding whether to bother needs to see what they will get.

When the archive is wrong or partial, the page says which expected files were missing and builds from whatever it did find.

The route stays inside the static export. No server, no runtime, no secret.

**Blocked by:** 04 — needs the seam. Works with whatever lanes and sections later tickets have taught the seam to read.

**Status:** ready-for-agent

- [ ] A `/generate` section exists, is reachable from the main page, and is part of the static export with no server or runtime.
- [ ] The archive can be dragged onto the page or chosen through a file dialog.
- [ ] Parsing happens client-side; no network request carries any of the visitor's data.
- [ ] The nothing-is-transmitted claim is stated on the page and holds when checked in the network tab.
- [ ] Instructions name where in LinkedIn's settings the data export lives.
- [ ] The up-to-24-hour preparation delay is stated before the visitor goes looking for their ZIP.
- [ ] The page explains why LinkedIn sign-in cannot supply this data.
- [ ] The preview is the real page — real fonts, real colours, real reveal animations, real timeline, real globe.
- [ ] A wrong or partial archive is reported by naming the missing files, and the page builds from what was found.
- [ ] A visitor who liked the main CV page can find this section without reading the repo.
