# 04 — The seam: LinkedIn archive bytes to page HTML, minimal archive

**What to build:** The feature's one seam. A single call takes the members of a LinkedIn data archive as bytes plus a settings object and returns finished page HTML. This ticket gets it working for the smallest real case: an archive containing only `Profile.csv`.

That produces a valid page — the visitor's name, headline and location in the hero, their About text as the About body, their links wired into the contact buttons — with no timeline lanes, no skills, no languages, and no crash. The sections that have nothing to show are absent, not empty.

The two robustness behaviours that make this importer survive contact with reality live here, because they apply to every file read afterwards:

**Archive members are matched loosely.** LinkedIn nests files under a changing directory and renames them without notice. Matching is case-insensitive on a basename pattern, not an exact path. Members the generator does not understand — messages, connections, ad data, invitations — are ignored silently.

**Columns are matched by header name with a per-file alias list.** A renamed column degrades that one field, not the import.

When a required member is genuinely absent, the failure names what was missing so the visitor can tell whether they grabbed the wrong download or requested the wrong export type. No exception escapes the seam.

The seam is a pure function over bytes with no DOM, so it runs identically in the browser at generate time and in a test process.

**Blocked by:** 03 — the importer's output is a profile document, which the renderer already turns into HTML.

**Status:** ready-for-agent

- [ ] One call takes archive member bytes plus settings and returns page HTML.
- [ ] The call is pure, needs no DOM, and runs in a Node test process.
- [ ] An archive with `Profile.csv` alone produces a valid page with hero and About populated and no timeline.
- [ ] Sections with no data are absent rather than rendered empty.
- [ ] Archive members are matched case-insensitively by basename pattern, not by exact path.
- [ ] Unrecognised archive members are ignored without comment.
- [ ] Columns are matched by header with aliases; a renamed or reordered column still lands, or degrades only that field.
- [ ] A non-LinkedIn ZIP and a malformed ZIP are both reported by naming what was missing, with no exception escaping.
- [ ] An archive whose `Profile.csv` has no About text yields a sensible fallback rather than an empty section.
- [ ] Fixture archives are hand-authored CSVs committed as fixtures, not real people's exports.
