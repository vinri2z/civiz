# Chip icons

Two kinds of file, one grid (24×24) and one render path — every icon is painted
as a CSS mask (`.cv-ic` in `index.html`), so it takes the chip's own ink colour
and reads in both themes.

**Brand marks** — the projects' official single-path logos, taken from
[Simple Icons](https://github.com/simple-icons/simple-icons) (the collection is
CC0; each mark remains the trademark of its owner and is used here only to name
the tool it stands for):

`python` `fastapi` `apacheairflow` `postgresql` `huggingface` `opentelemetry`
(v15) · `amazonwebservices` `amazons3` `awslambda` (v13 — Amazon's marks were
removed from later releases).

**Concept marks** — drawn for this page, for techniques with no logo of their
own: `llm` `dspy` `rag` `bertopic` `cluster` `embeddings` `ner` `eval` `argilla`
`entityres` `boost` `tooling` `remote` `talks` `review`.

Two brand marks are deliberately *not* used: scikit-learn's carries micro-text
and uv's is a solid block, and both collapse into a smudge at 15px. Those chips
show a concept mark and let the link carry the attribution — see the `TECH`
table in `index.html`, which is the one place that maps a name to its icon and
its reference page.
