# 03 — Add the PyCon Spain 2024 (Vigo) logo to the IRO Generation project

**What to build:** Show a PyCon Spain 2024 (Vigo) logo next to the "IRO Generation for CSRD Double Materiality" project, in both places it appears:

- On its timeline entry.
- On its card in the Work section.

Neither location currently supports a logo for projects (Education entries already do this — reuse that pattern rather than inventing a new one). A suitable logo asset needs to be sourced/added (e.g. as a local file under `public/`, following the existing precedent of `public/sainte-genevieve-logo.png` for education logos) as part of this ticket.

**Blocked by:** None — can start immediately (targets a project by title, independent of its position or exact dates).

**Status:** done

- [x] A PyCon Spain 2024 (Vigo) logo asset exists under `public/` and is wired into the relevant data for the IRO Generation project.
- [x] The logo renders next to the IRO Generation entry on the timeline.
- [x] The logo renders on the IRO Generation card in the Work section.
- [x] Logo rendering degrades gracefully (e.g. placeholder/no broken image) if the asset fails to load, consistent with existing logo handling.
