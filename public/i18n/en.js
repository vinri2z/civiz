// Localized copy for the CV page (en). Loaded before the dc-runtime script in
// index.html, which reads the merged blocks back out of window.CV_I18N.
// Language-invariant data (city coordinates, date ranges, tech stacks) stays in
// index.html — do not duplicate it here.
(function (w) {
  (w.CV_I18N = w.CV_I18N || {}).en = {
    code: "EN", label: "English (UK)",
    nav: { about: "about", work: "work", skills: "skills", timeline: "timeline", contact: "contact" },
    hero: { loc: "Valencia, Spain", pron: "He/Him", title: "Senior Data Scientist · AI Engineer", tag: "GenAI & LLM applications", email: "Email", scroll: "SCROLL",
      summary: "Machine-learning and software engineer with 6+ years turning large text corpora such as regulations, annual reports and corporate disclosures into structured, queryable data. I build the whole path: classical filter, LLM extractor, and the evaluation harness that measures it." },
    about: { label: "// ethical use of AI", h1: "Ethical use of ", hAcc: "AI", h2: ".", stat: "years in ML & software",
      body: "I work to help us make the most out of LLMs where it applies, and keep always guardrails, strict metrics and a human in the loop." },
    tl: { label: "// experience & education", h: "One timeline", p: "Everything I've studied and built, newest first and drawn to scale.",
      eduLegend: "Education", expLegend: "Experience", foldLegend: "Time folded",
      yr1: "yr", yrN: "yr", mo1: "mo", moN: "mo", present: "Present",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
    work: { label: "// selected work", h: "What I've built", p: "Systems that read documents at scale. Expand any project for the engineering detail.", show: "Show details ▾", hide: "Hide details ▴", deck: "View the talk deck" },
    tk: { label: "// toolkit", h: "How I build" },
    sk: { label: "// skills", h: "Languages & beyond", langs: "Languages", beyond: "Ways of working" },
    ct: { label: "// let's talk", h1: "Building something that reads", h2: "documents for a living?", p: "I'd love to hear about it. Reach out - I'm based in Valencia and work remotely.", footer: "© 2026 Vincent Rizzo · Valencia, Spain" },
    edu: [
      { name: "Lycée Sainte-Geneviève", sub: "CPGE · Mathematics & Physics", place: "Versailles, FR" },
      { name: "CentraleSupélec", sub: "MSc, Industrial Engineering · Université Paris-Saclay", place: "Paris-Saclay, FR" },
      { name: "Universitat Politècnica de València", sub: "Double MSc, Industrial Engineering", place: "València, ES" },
    ],
    exp: [
      { role: "QA Automation Intern", org: "Selectra", place: "Madrid, ES", note: "Test automation with Katalon, Selenium & Groovy." },
      { role: "Data Science Intern", org: "Datamaran", place: "València, ES", note: "Python & serverless ML inference; first NLP models shipped." },
      { role: "Product Data Scientist", org: "Datamaran · Contractor", place: "London, UK", note: "Shipped document-extraction pipelines into the product; FastAPI backends." },
      { role: "Senior Data Scientist", org: "Datamaran", place: "València, ES", note: "Owns LLM-assisted, evaluation-driven GenAI features across the product." },
    ],
    projects: [
      { tag: "AI engineering · flagship", title: "ESG Targets Extraction Pipeline",
        blurb: "An Airflow pipeline that reads corporate ESG and annual reports and emits deduplicated, topic-tagged sustainability targets. Five learned components: classical models where they win, LLMs where the language is hard.",
        bullets: [
          "Recall-first XGBoost / TF-IDF pre-filter (tuned on F2, low decision threshold) to over-admit candidate sentences. A miss here is unrecoverable; a false positive is caught downstream.",
          "LLM extractor built with DSPy; prompts optimized by GEPA against a Hungarian-matched, field-level reward (KPI, value, unit, timeline).",
          "Embedding-based single-linkage clusterer for entity resolution (no preset K), then a DSPy/MIPROv2 summarizer collapses each cluster into one canonical target.",
          "Two-step semantic topic tagger: dense retrieval shortlists ESG topics, an LLM disambiguates the fit.",
        ] },
      { tag: "GenAI · CSRD / double materiality", title: "IRO Generation for CSRD Double Materiality",
        blurb: "Generating candidate Impacts, Risks & Opportunities (IROs) to help companies draft the double-materiality disclosures the EU's CSRD now demands of ~50,000 reporters. Grounded in peers' own report language rather than the model's priors.",
        bullets: [
          "Topic modeling over company and peer report sentences so generated IROs reflect disclosures from the analysis scope rather than generic LLM knowledge.",
          "Peer sentences clustered and summarized to fit a whole topic's context into one prompt: HDBSCAN on Matryoshka embeddings cut 2000→100 dims, UMAP to 5, wired together with BERTopic.",
          "Quality pass: SpanMarker NER anonymizes dates, numbers, orgs and products so clusters form on meaning, and pairwise-Levenshtein dedup drops the quasi-duplicates companies repeat.",
          "Human-in-the-loop evaluation in Argilla with in-domain ESG annotators, whose judgement sets the bar for a usable IRO.",
        ] },
      { tag: "GenAI · guardrails", title: "LLM-Assisted Regulatory Intelligence",
        blurb: "Championed LLM-assisted workflows company-wide: designing, evaluating and shipping generative-AI features with guardrails over nearly 20,000 regulations across 190+ countries.",
        bullets: [
          "Retrieval and extraction over a large, multi-jurisdiction regulatory corpus.",
          "Evaluation-first delivery: every generative feature ships with a scored test harness.",
          "Model-agnostic orchestration across GPT, Claude and open models via Bedrock.",
        ] },
      { tag: "MLOps · platform", title: "ML Platform & Evaluation Infrastructure",
        blurb: "The infrastructure the models depend on: serverless inference, evaluation datasets, and human-in-the-loop labeling.",
        bullets: [
          "Serverless ML inference on AWS and Python (FastAPI) backend services.",
          "Human-in-the-loop MLOps with Argilla; curated gold sets for filter training and pipeline evaluation.",
          "State passed as object-storage JSON (S3 / Postgres), instrumented end-to-end.",
        ] },
    ],
    toolkit: [
      { group: "AI / ML", items: ["LLM orchestration (GPT, Claude, open models)", "DSPy (GEPA, MIPROv2)", "RAG & semantic search", "XGBoost / scikit-learn", "sentence-transformers / embeddings", "Entity resolution & clustering", "Evaluation & metrics"] },
      { group: "Engineering / MLOps", items: ["Python", "Airflow", "FastAPI", "AWS (serverless)", "Postgres · S3", "Argilla (human-in-the-loop)", "OpenTelemetry", "uv · ruff"] },
    ],
    languages: [
      { name: "French", level: "Native" }, { name: "English", level: "Fluent · C2" },
      { name: "Spanish", level: "Fluent · C2" }, { name: "Catalan", level: "Conversational · B1" },
    ],
    beyond: ["Remote-first, distributed teams", "Evaluation-driven delivery", "Talks & internal workshops", "Mentoring & code review"],
  };
})(window);
