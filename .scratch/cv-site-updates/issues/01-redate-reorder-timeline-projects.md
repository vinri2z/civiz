# 01 — Redate & reorder the four timeline projects

**What to build:** On the timeline, the four Work-section projects currently sit in Work-section order across four consecutive half-years (H1 2024 → H2 2025): Targets Extraction, IRO Generation, LLM-Assisted Regulation, ML Platform. Change this so each project anchors to its actual half-year, in this new (non-consecutive) order:

- H1 2024 — IRO Generation for CSRD Double Materiality
- H1 2025 — ML Platform & Evaluation Infrastructure
- H2 2025 — ESG Targets Extraction Pipeline
- H1 2026 — LLM-Assisted Regulatory Intelligence

Today, each timeline project's title is read from `L.projects[i]` purely by array index, which only works because the timeline order and the Work-section card order happen to match. That assumption breaks with the new order/gap (no project in H2 2024), so the mapping from timeline slot → Work-section project needs to become explicit (e.g. by project key/title) rather than positional — a small prefactor, not a rewrite.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Timeline shows the four projects at H1 2024, H1 2025, H2 2025, H1 2026 respectively, each labeled with the correct title from the list above.
- [x] The Work-section project cards remain the single source of truth for titles/copy — no duplicated title strings between the Work section and the timeline data.
- [x] Reordering or re-dating a project again in the future doesn't require re-deriving index math — the mapping is explicit and legible.
- [x] Existing timeline behavior (spacing/`spread`, leader lines, globe waypoint order) still works correctly with the new, non-consecutive date ranges.
