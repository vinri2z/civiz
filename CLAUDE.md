# civiz — project instructions

Personal resume site: a Next.js professional site plus a scroll-driven 3D journey in `/immersive`.

## Writing rule: no AI tells

All user-facing copy and code comments must read as written by a person, not a model.
Reference: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing

When you add or edit any prose (resume copy in `data/resume.js`, chapter text in
`src/content.js`, headings/labels in `app/page.jsx`, `README.md`, HTML titles), avoid:

- **Em-dashes** (`—`). Use a hyphen, colon, or a full stop instead.
- **Curly quotes** (`‘ ’ “ ”`). Use straight quotes.
- **Antithesis padding**: "not X, but Y", "isn't just X", "not vibes", "not the model's
  imagination". State the positive claim on its own.
- **Rule-of-three triads** stacked for rhythm ("designing, evaluating, and shipping" is
  fine once; don't chain them everywhere).
- **Puffery / editorializing**: "unglamorous foundation", "seamless", "robust",
  "cutting-edge", "it's worth noting", "that proves it".
- **Inflated summaries** and invented metrics. Facts come from Vincent's CV only.

Keep the author's voice. The 3D journey in `src/content.js` is deliberately narrative —
trim the tells, don't flatten the prose.

## Linter

`scripts/deai.mjs` enforces the mechanical part.

```bash
npm run lint:ai       # report tells, non-zero exit if any (CI-gate friendly)
npm run lint:ai:fix   # auto-fix em-dashes + curly quotes, then report the rest
```

Auto-fix only touches mechanical, meaning-preserving swaps. Antithesis/puffery are
reported for a human to rewrite; the regexes are intentionally loose, so a flagged code
comment may be a false positive — use judgement.

## Build

```bash
npm install && npm run build
```
