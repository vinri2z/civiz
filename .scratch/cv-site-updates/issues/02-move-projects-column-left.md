# 02 — Move the projects column to the left side of the timeline

**What to build:** The four project markers/labels currently hang off the right edge of the Experience bar (nested inside the Senior Data Scientist bar, sharing the right-hand column with Experience/Volunteering). Move them to the left side of the timeline instead, alongside Education, so the timeline reads as: projects on the left, education on the left (or as its own left sub-column), experience/volunteering on the right.

**Blocked by:** 01 (verifying correct placement needs the corrected H1 2024 / H1 2025 / H2 2025 / H1 2026 dates from that ticket, not the old consecutive-slot dates).

**Status:** done

- [x] Project markers, leader lines, and one-line labels render on the left side of the timeline instead of the right.
- [x] Layout doesn't collide with the Education column — spacing/`spread` accounts for both left-side categories sharing that side.
- [~] ~~Project markers still appear correctly in the globe waypoint order (top-to-bottom chronological sort) alongside Education/Experience/Volunteering.~~ **Withdrawn — not applicable.** Projects have never been globe waypoints and still aren't: a waypoint needs a city, and `projBase` entries carry no `cities`, so they stay out of `entries` (and out of `_geoItems`/`marks`). Verified the waypoint order for Education/Experience/Volunteering is byte-identical after the move: València → London+Querétaro → València → València → Madrid → Paris-Saclay → Boulajoul → Toamasina → Versailles → Aix-en-Provence. Giving the projects waypoints would mean four more València stops, parking the globe — raise it as its own ticket if that's wanted.
- [x] Visual check across viewport widths used elsewhere on the timeline (no overlap or clipping at the left edge).
