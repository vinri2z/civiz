# 13 — Four languages, interface and generated furniture

**What to build:** The generator is not English-only on a site that already speaks four languages.

Two separate things get translated, and the distinction has to be visible to the visitor:

**The generator's own interface** — the instructions, the drop zone, the error messages, the editor's labels, the download prompts — uses the site's existing i18n mechanism with a new namespace for generator copy, in English, French, Spanish and Catalan.

**The generated page's structural copy** — section labels, "Show details" and "Hide details", month names, "Present", the legend items, the "time folded" marker, the year and month abbreviations — ships in whichever language the visitor picks, so the page's furniture matches its content.

What is *not* translated is the visitor's own prose. Their About text, their role titles, their entry notes stay in the language they wrote them in. The interface says so plainly, because a visitor who picks French and sees their English summary unchanged will otherwise assume a bug. No machine translation.

**Blocked by:** 08 — needs the route and preview to translate.

**Status:** ready-for-agent

- [ ] The generator interface is available in English, French, Spanish and Catalan through the site's existing i18n mechanism.
- [ ] Generator copy lives in its own namespace, separate from the CV page's strings.
- [ ] The generated page's structural copy ships in the visitor's chosen language: section labels, show/hide details, month names, "Present", legend items, "time folded", year and month abbreviations.
- [ ] The visitor's own prose is passed through untranslated.
- [ ] The interface states that only structural copy is translated, so the pass-through does not read as a bug.
- [ ] The chosen language is recorded in the profile document's settings and survives the round trip.
- [ ] The downloaded page's `lang` attribute matches the chosen language.
- [ ] No machine translation is involved.
