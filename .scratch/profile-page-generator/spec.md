# Profile page generator — reproduce the CV page for any profile

**Status:** ready-for-agent

A new section of the site that turns a visitor's own LinkedIn data export into their own copy of this CV page — About summary, one timeline, skills, languages, projects, and the timeline-synced globe — generated entirely in their browser and downloadable as one self-contained HTML file.

## Problem Statement

Everyone who sees this CV page asks the same thing: "how do I get one?" Today the answer is "fork the repo, hand-edit a 976-line `index.html`, hand-write four language blocks, and hand-look-up latitude/longitude for every city you've lived in." Nobody does that. The page's distinguishing features — a single to-scale timeline with folded dead time, and a globe that flies between the cities of your career as you scroll — are exactly the parts that are most painful to author by hand, because they need structured dates and coordinates, not prose.

Meanwhile the visitor's career data already exists in structured form. They just have no way to get it from where it lives into this page.

## Solution

A `/generate` section on the same static site.

The visitor requests their data archive from LinkedIn ("Settings → Data privacy → Get a copy of your data"), drops the resulting ZIP onto the page, and immediately sees their own version of the CV page: hero, About summary, Work/Projects cards, toolkit and skills, the full to-scale timeline with Education / Experience / Volunteering / Projects lanes, and the globe tracking their own cities. They fix anything the importer got wrong — unmatched cities, a summary they'd rather rewrite, entries they'd rather hide — and download a single `index.html` they can host anywhere.

The ZIP never leaves their machine. There is no account, no upload, no server, no stored copy of anyone's employment history.

### Why not LinkedIn SSO

The original ask was LinkedIn OAuth. That was investigated and rejected on hard grounds, recorded here so it isn't re-litigated:

- Sign In with LinkedIn using OpenID Connect returns only `sub`, `name`, `given_name`, `family_name`, `picture`, `locale`, `email`, `email_verified`. It returns no positions, no education, no skills, no summary, no dates — i.e. none of the data this page is made of.
- The scopes that do return profile substance require LinkedIn Partner Program approval (Talent Solutions / Marketing Developer Platform). A personal CV site does not qualify.
- Scraping a profile violates LinkedIn's terms of service and is not an option.
- OAuth also requires a server to hold the client secret, which would end this repo's `output: "export"` static-only architecture for zero data gain.

The GDPR data export is first-party, complete, structured, and needs no backend. It is strictly better for this feature. The tradeoff the visitor pays is latency: LinkedIn takes anywhere from ten minutes to 24 hours to prepare the archive.

## User Stories

### Getting data in

1. As a visitor who liked this CV page, I want a clearly signposted section that explains how to make my own, so that I don't have to read the repo to find out it's possible.
2. As a visitor, I want step-by-step instructions for requesting my LinkedIn data archive, including where in LinkedIn's settings that lives, so that I'm not hunting through menus.
3. As a visitor, I want to be told up front that LinkedIn can take up to 24 hours to prepare the archive, so that I don't think the page is broken when I have nothing to upload yet.
4. As a visitor, I want to know exactly why the page can't just log me in with LinkedIn and fetch this itself, so that the extra step feels like a constraint rather than laziness.
5. As a visitor, I want to drag my ZIP onto the page or pick it with a file dialog, so that it works however I prefer to interact.
6. As a visitor, I want the ZIP read in my own browser with nothing transmitted anywhere, so that I can hand over my complete employment history without trusting a stranger's server.
7. As a privacy-conscious visitor, I want that guarantee stated plainly on the page and verifiable in the network tab, so that I don't have to take it on faith.
8. As a visitor who uploads the wrong ZIP, I want to be told which expected files were missing, so that I know whether I grabbed the wrong download or requested the wrong export type.
9. As a visitor whose export is partial, I want the page to build from whatever it did find and tell me what was absent, so that a missing `Skills.csv` doesn't cost me the whole page.
10. As a visitor whose export contains files I don't care about (messages, connections, ad data), I want those silently ignored, so that I'm not asked about irrelevant things.
11. As a visitor, I want to reload the page and pick up where I left off without re-uploading, so that a refresh doesn't cost me my edits.
12. As a visitor, I want an explicit way to wipe everything the page is holding about me, so that I can clear my data from a shared computer.

### Seeing the result

13. As a visitor, I want the preview to be the real page — same fonts, same colours, same motion — not a mockup, so that I know what I'm actually going to get.
14. As a visitor, I want my name, headline and location in the hero exactly as my export records them, so that the top of the page is immediately mine.
15. As a visitor, I want my LinkedIn "About" text used as the About section body, so that I'm not rewriting prose I already wrote.
16. As a visitor with no About text, I want a sensible fallback rather than an empty section, so that the page doesn't look broken.
17. As a visitor, I want my years-of-experience stat computed from my own earliest professional position, so that the number is right without me doing arithmetic.
18. As a visitor, I want my email and profile links wired into the hero and contact buttons, so that the page is actually contactable.
19. As a visitor, I want my profile photo used if my export includes one, so that the page isn't anonymous.

### Timeline

20. As a visitor, I want every position from my export placed on the to-scale timeline in the Experience lane, so that my career reads at a glance.
21. As a visitor, I want every school from my export placed in the Education lane, so that both halves of my history show.
22. As a visitor, I want overlapping entries — a double degree, a contract alongside a job — laid out without their cards colliding, so that the timeline stays readable.
23. As a visitor, I want long empty stretches folded with a "time folded" marker instead of scrolling through blank space, so that a twenty-year career doesn't make an unreadably tall page.
24. As a visitor, I want a currently-held role rendered as open-ended ("Present") rather than ending today, so that it reads correctly.
25. As a visitor, I want a role I held for one month to render as a readable pill rather than collapsing to nothing, so that short entries survive.
26. As a visitor with volunteering entries in my export, I want them in their own lane with their own colour and legend item, so that they're not confused with paid work.
27. As a visitor with no volunteering entries, I want that lane and its legend item to disappear rather than sit empty, so that the legend only describes what's on screen.
28. As a visitor with projects in my export, I want them anchored on the timeline at their own dates, so that what I built lines up against where I was.
29. As a visitor, I want each timeline entry's organisation logo shown when one can be resolved, and a clean typographic fallback when it can't, so that missing logos never leave holes.
30. As a visitor, I want to control the timeline's pixels-per-year, so that I can trade height for detail.
31. As a visitor, I want to turn year gridlines on or off, so that I can pick between precision and calm.

### Globe

32. As a visitor, I want the globe to fly between the cities of my own career as I scroll the timeline, so that the feature that sold me on this page is the feature I get.
33. As a visitor, I want each city's dot labelled with its name as I reach it, so that I know where the globe is looking.
34. As a visitor, I want the globe to spin slowly when I'm not on the timeline, so that it doesn't sit frozen on one point for most of the page.
35. As a visitor whose single role spanned two cities, I want to say which dates belonged to which city, so that the globe moves at the right point instead of splitting the role evenly.
36. As a visitor, I want to see which of my locations the importer could not place on the globe, so that I'm not surprised by a city silently missing.
37. As a visitor, I want to correct or supply coordinates for an unplaced location, so that one obscure town doesn't break the globe.
38. As a visitor, I want to drop a location from the globe entirely, so that a remote role with a meaningless office city doesn't drag the camera somewhere irrelevant.
39. As a visitor, I want to turn the globe off, so that I can have the page without it.

### Skills and languages

40. As a visitor, I want my skills from the export shown in the skills section, so that I don't retype them.
41. As a visitor with a hundred skills, I want them grouped rather than dumped as one wall of chips, so that the section stays readable.
42. As a visitor, I want to reorder, rename, group or delete skills, so that the grouping the importer guessed isn't final.
43. As a visitor, I want my languages and proficiency levels from the export in the languages column, so that that block fills itself in.
44. As a visitor with certifications in my export, I want them surfaced somewhere sensible rather than dropped, so that credentials I earned aren't lost.

### Editing and correcting

45. As a visitor, I want to edit any imported text before downloading, so that the export's wording isn't binding.
46. As a visitor, I want to hide any entry — a job I'd rather not list, a school that doesn't matter — so that the generated page is what I want to show, not everything LinkedIn holds.
47. As a visitor, I want to correct a date the export got wrong or recorded only to the year, so that the timeline geometry is right.
48. As a visitor, I want my edits to survive a page reload, so that a long editing session isn't fragile.
49. As a visitor, I want to reset back to the raw import, so that I can undo a run of bad edits.

### Getting the page out

50. As a visitor, I want to download one self-contained HTML file, so that hosting it is a single-file copy with no build step.
51. As a visitor, I want that file to work when opened directly from disk over `file://`, so that I can check it before hosting.
52. As a visitor, I want the downloaded page to behave identically to the preview — reveal animations, timeline, globe, expandable cards — so that the download isn't a degraded copy.
53. As a visitor, I want the download to carry my name in its title and metadata, so that a browser tab and a search result show me and not the template's author.
54. As a visitor, I want the downloaded page to contain only my own data, so that nothing of the original author's leaks into mine.
55. As a visitor, I want to also download the structured profile data on its own, so that I can regenerate or version-control it later without re-requesting a LinkedIn export.
56. As a returning visitor, I want to re-upload that structured file instead of the ZIP, so that iterating doesn't mean waiting on LinkedIn again.
57. As a visitor, I want guidance on where to host the file, so that I'm not stuck holding an HTML file with nowhere to put it.

### Language

58. As a visitor, I want the generator's own interface available in the four languages the site already supports, so that the tool isn't English-only on a multilingual site.
59. As a visitor, I want my generated page's structural copy — section labels, "Show details", month names, "Present" — in the language I pick, so that the page's furniture matches its content.
60. As a visitor, I want to be told that only that furniture is translated and my own profile prose stays in the language I wrote it in, so that I don't expect machine translation of my career.

### The existing page

61. As the site's owner, I want my own page's appearance and behaviour completely unchanged by this feature, so that shipping a generator doesn't risk the CV it's built from.
62. As the site's owner, I want my own page's content eventually expressible in the same structured profile format, so that there's one renderer rather than a hand-written page plus a generated one drifting apart.
63. As the site's owner, I want the whole thing to stay a static export deployable to Vercel with no runtime, so that the deployment story doesn't change.

## Implementation Decisions

### Data acquisition — LinkedIn data export, not OAuth

The only supported LinkedIn input is the member data archive from "Get a copy of your data". Rationale in the Solution section above. No OAuth flow, no client secret, no callback route, no serverless function. The repo keeps `output: "export"`.

The importer reads these archive members, all optional except `Profile`:

| Archive file | Feeds |
| --- | --- |
| `Profile.csv` | name, headline, location, About summary, industry |
| `Positions.csv` | Experience lane, years-of-experience stat |
| `Education.csv` | Education lane |
| `Skills.csv` | skills chips |
| `Languages.csv` | languages column |
| `Projects.csv` | Projects lane on the timeline and Work cards |
| `Certifications.csv` | certifications block |
| `Email Addresses.csv` | contact links |
| photo asset, if present | hero portrait |

LinkedIn changes these filenames and column headers without notice. The reader matches archive members case-insensitively on a basename pattern rather than an exact path, and maps columns by header name with a per-file alias list, so a renamed column degrades that one field rather than failing the import. Unknown archive members are ignored without comment.

A second accepted input is the generator's own exported profile document, so a returning visitor can iterate without a fresh archive.

### Profile document — the one contract

A single JSON-shaped **profile document** is the boundary between "reading LinkedIn's export" and "rendering a page". Everything downstream of the importer knows only this shape, so a future importer for a different source plugs in at the same point.

It is versioned, because it is a file real people will keep on disk and re-upload months later. The renderer accepts its own version and migrates older ones forward.

The shape, in prose because the field list will drift: a `version`; an `identity` block (name, headline, location string, pronouns, About text, links, optional photo); a flat `entries` array where every entry carries a `kind` of `education` / `experience` / `volunteering` / `project`, a title, an organisation, a start as year-and-month, an optional end (absent meaning present), a free-text note, an optional logo reference, a `hidden` flag, and a `places` array; a `skills` structure of named groups; a `languages` list of name and level; and a `settings` block for pixels-per-year, gridlines, globe on/off, and interface language.

Two decisions inside that shape matter enough to state explicitly:

- **Dates are year-and-month, never a timestamp.** The existing timeline maths works in fractional years and formats month-year labels; a full date would be false precision the export doesn't have.
- **A place is a name plus coordinates plus an optional date sub-range within its entry.** The sub-range is what makes the London/Querétaro case work and it belongs in the contract, not in the renderer.

### Reusing the existing timeline and globe, not reimplementing them

`buildTimeline()` already solves everything hard here: fractional-year positioning, dead-time folding, collision-avoiding card spread, per-lane columns and leader lines, globe waypoint ordering, and minimum-share city offsets. It is currently entangled with one person's data because the entries are literal arrays inside it.

The change is to make it take entries as input instead of holding them. Same maths, same constants, same output shape — the four lanes, the bars, the marks, the skips, the year ticks, the `_geoItems` waypoint list. It stops caring whose career it is drawing.

Two behaviours that are currently hardcoded to this author's history have to become derived, because they were tuned by eye for one CV:

- **The axis floor** is presently the literal `2010`. It becomes the round year below the earliest entry.
- **The stretch and no-fold rules** are presently date-literal conditions (`a >= 2020.4 && b <= 2022.75`, the lycée window). They become properties an entry can carry — "don't fold the gap before this entry", "run this entry at a wider scale" — defaulting to off. An imported profile folds by the generic rule; the author's page keeps its hand-tuned look by setting those properties on the entries that had them.

The globe is untouched apart from reading its waypoints from the profile document's places. Its idle-spin behaviour, its `[data-geo-i]` scan, and its interpolation all already work off generic data.

### Lane assignment

`Positions.csv` maps to the Experience lane. `Education.csv` to Education. `Projects.csv` to Projects. Volunteering has no dedicated export file — LinkedIn folds volunteer roles into positions or omits them — so volunteering entries are ones the visitor reclassifies in the editor, and the lane plus its legend item appear only when at least one exists. The same conditional-legend rule applies to Projects.

Left and right column assignment stays as it is today: Education and Projects share the left column, Experience and Volunteering the right. That works because of how those categories distribute in time, and the collision spread handles the cases where it doesn't.

### Geocoding — bundled gazetteer

Locations arrive as strings like `Valencia, Spain` or `Greater London, United Kingdom`. Coordinates come from a compact gazetteer shipped with the site: no network call, no API key, no rate limit, and no third party learning where a visitor has lived.

Matching is normalised — case, accents, punctuation, and LinkedIn's "Greater X Area" / "X Metropolitan Area" phrasings folded away — and scoped by country where the string names one. Ambiguous names resolve to the largest-population candidate within the named country. Coverage is deliberately partial: cities above a population threshold plus every capital. Anything unmatched is not silently dropped — it surfaces in the editor as an unresolved place the visitor can pin, correct, or exclude. An entry with no resolvable place stays on the timeline and stays out of the globe's waypoint list, exactly as projects do today.

### Generation — in-browser, self-contained download

Generation runs client-side on the `/generate` route. There is no build step for the visitor and no server.

The download is one HTML file with the same architecture as the existing page: the `x-dc` template, the dc-runtime, the profile document, and the structural i18n strings all inlined. That means inlining what the current page loads separately — `support.js`, `image-slot.js`, the relevant i18n block — and resolving the two remaining external dependencies:

- **d3 and topojson**, today loaded from unpkg, and the world atlas TopoJSON fetched from jsDelivr. A `file://` page cannot fetch cross-origin, so a globe-bearing download must carry its own geometry. The download therefore embeds a simplified world outline sized for a single file rather than the full 110m atlas, and embeds the projection code it needs. Fidelity is traded for self-containment; this is a deliberate choice and the reason story 51 is satisfiable at all.
- **Google Fonts**, today loaded from a stylesheet link. The download keeps the remote link and degrades to the existing system-font fallbacks offline, rather than embedding several hundred kilobytes of woff2 per file.

Logos are embedded as data URIs when the visitor supplies them and fall back to the existing typographic placeholder otherwise. No logo is fetched from a third party at generate time.

The generated page carries the visitor's name in its title and metadata and contains no trace of the template author's data.

### Editing and persistence

The editor operates on the profile document, and the preview re-renders from it. Every correction story above is one edit to that document — there is no separate editing model.

The working document persists in browser local storage under a versioned key so a reload restores it. A visible control clears it. The raw ZIP is never persisted; only the parsed document is.

### Interface language

The generator's own interface uses the site's existing four-language i18n mechanism, with a new namespace for generator copy. The generated page's structural copy ships in the visitor's chosen language. Profile prose is passed through untranslated, and the interface says so. No machine translation.

### The author's own page

This spec does not rewrite the existing page. The generator is additive, and story 61 is a hard constraint: `/` renders byte-comparably before and after, including the hand-tuned stretch and no-fold behaviour.

Migrating the author's own content into a profile document so one renderer serves both is the obvious follow-up and is called out in Out of Scope. Whoever does the `buildTimeline()` parameterisation should leave that door open — the author's entries as data passed in, not a second code path — without walking through it in this spec.

## Testing Decisions

### What a good test looks like here

A good test in this repo asserts on what a visitor would observe and nothing else. It feeds a fixture archive in one end and makes claims about the profile document or the generated HTML that comes out. It does not reach for `buildTimeline`'s internal constants, does not assert on a particular pixel value that a design tweak would legitimately change, and does not assert on the shape of intermediate helpers.

The distinction that matters for this feature: asserting "the 2016–2017 gap is folded" is behaviour; asserting "`skips[0].hPx === 235.0`" is implementation. Asserting "an entry with no end date renders as Present" is behaviour; asserting "`meta()` returned a two-element array" is not.

### The seam

One seam: **archive files in, generated HTML out.**

A single entry point takes the archive's member files as bytes and a settings object, and returns the finished HTML string. Tests call it with fixture archives and assert on the result. This one call covers CSV parsing, column aliasing, lane assignment, geocoding, timeline geometry, globe waypoint construction, i18n selection, and inlining — the whole chain, no mocks, no test doubles, no DOM.

It is one seam rather than two because the failure modes worth catching are cross-cutting. A date parsed correctly but positioned wrongly, or a city geocoded correctly but excluded from the waypoint list, are the bugs this feature will actually have, and they only appear when parsing and rendering are exercised together. Splitting parse from render would let both halves pass while the pair is broken.

The seam is a pure function over bytes, so it runs identically in the browser at generate time and in a test process. No browser automation is needed for the parts that carry real logic.

### Coverage

Against fixture archives, the seam is tested for:

- A minimal archive with `Profile.csv` only — produces a valid page, no timeline lanes, no crash.
- A full archive with all supported members — every section populated.
- The author's own history as a fixture, asserting the timeline and globe waypoints come out as the hand-authored page has them. This is the regression net for the `buildTimeline()` parameterisation and the strongest single test in the suite.
- A currently-held position — renders open-ended, not ended today.
- A one-month position — renders as a visible pill.
- Overlapping entries — no two cards claim the same vertical space.
- A multi-decade career with a long gap — the gap folds and the page height stays bounded.
- Year-only dates — accepted, positioned, and labelled without a phantom month.
- Locations that geocode, locations that don't, and locations that geocode ambiguously — resolved, surfaced as unresolved, and resolved by population respectively.
- An entry whose only place is unresolved — stays on the timeline, absent from the waypoint list.
- Renamed and reordered CSV columns — the aliased fields still land.
- A malformed and a non-LinkedIn ZIP — reported by name of what was missing, no exception escapes.
- Absent optional members — the corresponding section and its legend item disappear rather than rendering empty.
- Each of the four interface languages — structural copy switches, profile prose does not.
- Output self-containment — no reference to any origin-relative asset survives in the download.
- Output isolation — no string from the author's own data appears in a generated page.

A profile-document round trip is tested at the same seam: export the document, re-import it, generate again, and assert the HTML is identical.

Two things are tested in a browser rather than at the seam, because they are genuinely browser behaviour: that the drop zone accepts a ZIP and produces a preview, and that the downloaded file opens over `file://` with its globe drawing. These are a thin end-to-end pair, not where the logic lives.

### Prior art

There is none — this repo has no tests and no test infrastructure. That is itself a decision to make: this feature introduces the first test runner. It should be whatever runs a pure function over fixture files with the least ceremony, on Node's own test runner unless something the feature needs argues otherwise, and it must not pull a bundler or a transform step into a repo whose entire build is `next build` over a static export.

Fixture archives are hand-authored CSVs committed as fixtures, not real people's exports. The author's own history is the exception and is already public on the site.

## Out of Scope

- **LinkedIn OAuth or any LinkedIn API call.** Ruled out on the grounds recorded above. If LinkedIn Partner access ever materialises, it is a new importer behind the same profile document, not a change to this spec.
- **Scraping LinkedIn profiles**, by URL or otherwise.
- **Importers for other sources** — résumé PDF, JSON Resume, GitHub, ORCID. The profile document exists so these are cheap later; none is built now.
- **Hosting generated pages.** No public URLs, no accounts, no server-side storage of anyone's career data. The output is a file the visitor takes away.
- **Migrating the author's own page onto the profile document.** The follow-up that gives one renderer instead of two. Deliberately deferred so this feature cannot break `/`.
- **Machine translation of profile prose.**
- **Theming.** Colour, typography and layout are the template's, not the visitor's. Only pixels-per-year, gridlines and globe on/off are exposed.
- **Editing on mobile.** The preview is responsive because the page is; the editor targets a desktop viewport.
- **PDF or print output.**
- **Embedding webfonts in the download.** The download links Google Fonts and degrades to system fonts offline.
- **Full-fidelity globe geometry in the download.** The single-file constraint forces a simplified outline.

## Further Notes

**The latency is the feature's real risk, not the engineering.** A visitor arrives excited and hits "come back in up to 24 hours." Anything that keeps them — a demo run against a sample profile, a way to bookmark the flow — is worth more than any code decision in this spec. The demo profile is cheap: the fixture archives already exist for tests.

**LinkedIn's export format is undocumented and unversioned.** It has changed before and will change again. The alias-and-degrade approach limits the blast radius, but the honest expectation is that this importer needs occasional maintenance, and the surfaced-unmatched-fields path is what makes that maintenance discoverable instead of silent.

**`buildTimeline()`'s hand-tuned constants are a real hazard.** Values like the stretch windows and the per-lane gaps were chosen by looking at one CV. They will look wrong on someone with fourteen jobs or a two-year career. The parameterisation should make them adjustable rather than assume the defaults generalise, and the author's-history fixture test is what stops the tuning from regressing the page it came from.

**Volunteering has no export file.** Story 26 depends on the visitor reclassifying entries in the editor. If that reclassification isn't built, the volunteering lane is unreachable for imported profiles — worth knowing when the work is sliced.

**Self-containment fights the globe.** The download's simplified geometry is the one place where the generated page is knowingly not as good as the original. If that lands badly, the alternative is a globe-bearing download that requires hosting and CDN access, which costs story 51. That is the tradeoff to revisit, not the implementation.
