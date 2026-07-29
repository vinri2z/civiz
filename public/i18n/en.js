// Localized copy for the CV page (en). Loaded before the dc-runtime script in
// index.html, which reads the merged blocks back out of window.CV_I18N.
// Language-invariant data (city coordinates, date ranges, tech stacks) stays in
// index.html — do not duplicate it here.
(function (w) {
  (w.CV_I18N = w.CV_I18N || {}).en = {
    code: "EN", label: "English",
    nav: { about: "about", work: "work", skills: "skills", timeline: "timeline", contact: "contact", theme: "Light or dark theme", menu: "Menu" },
    hero: { loc: "Valencia, Spain", pron: "He/Him", title: "Senior Data Scientist · AI Engineer", tag: "LLM applications", email: "Email", scroll: "SCROLL", spin: "SCROLL SIDEWAYS TO SPIN",
      summary: "Machine-learning and software engineer with 6+ years turning large text corpora such as regulations, annual reports and corporate disclosures into structured, queryable data. I build the whole path: classical filter, LLM extractor, and the evaluation harness that measures it." },
    about: { label: "// about", h1: "Ethical use of ", hAcc: "AI", h2: ".", stat: "years in ML & software",
      body: "I work to help us make the most out of LLMs where it applies, and keep always guardrails, strict metrics and a human in the loop." },
    tl: { label: "// experience & education", h: "One timeline", p: "Everything I've studied and built, newest first and drawn to scale.",
      eduLegend: "Education", expLegend: "Experience", volLegend: "Volunteering", projLegend: "Projects", foldLegend: "Time folded",
      yr1: "yr", yrN: "yr", mo1: "mo", moN: "mo", present: "Present", workLink: "Project details",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
    work: { label: "// selected projects", h: "What I've built", p: "Systems that read documents at scale. Expand any project for the engineering detail.", show: "Show details ▾", hide: "Hide details ▴", deck: "View the talk deck on slideshare.net", timelineLink: "See on timeline" },
    tk: { label: "// toolkit", h: "How I build" },
    sk: { label: "// skills", h: "Languages & beyond", langs: "Languages", beyond: "Ways of working" },
    ct: { label: "// let's talk", h1: "Building an AI-native application?", h2: "", p: "I'd like to hear about it, contact me - I'm based in Valencia and work remotely.", copied: "Email address copied", copy: "Copy email address", footer: "© 2026 Vincent Rizzo · Valencia, Spain" },
    edu: [
      { name: "Lycée Militaire d'Aix-en-Provence", sub: "Baccalauréat Scientifique, Engineering Sciences · Jury's commendation", place: "Aix-en-Provence, FR" },
      { name: "Lycée Sainte-Geneviève", sub: "CPGE · Mathematics & Physics", place: "Versailles, FR" },
      { name: "CentraleSupélec", sub: "MSc, Industrial Engineering · Université Paris-Saclay", place: "Paris-Saclay, FR" },
      { name: "Universitat Politècnica de València", sub: "Double MSc, Industrial Engineering", place: "València, ES" },
    ],
    vol: [
      { name: "Les Enfants du Soleil", sub: "Volunteer · children's charity", place: "Toamasina, MG" },
      { name: "4L Trophy — Les Enfants du Désert", sub: "Crew · student rally delivering school supplies", place: "Boulaajoul, MA" },
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
      { tag: "GenAI · MCP app", title: "Regulatory Knowledge-Graph Explorer",
        blurb: "An MCP app that opens a corpus of nearly 20,000 regulations across 190+ countries to plain-language search. An LLM reads the question; the graph answers it in context — the related regulations, the topics they address, and the ontology around them. Shipped as a Cognito-gated MCP server for Claude and ChatGPT plus a Vue 3 SPA, both on one FastAPI backend.",
        bullets: [
          "LLM query interpretation: free text becomes a boolean filter tree (status, enforcement, jurisdiction, dates), a residual semantic query, and a specific-vs-broad routing decision — echoed back so the reader sees how their question was read.",
          "Two retrieval modes on MongoDB Atlas: a synonym-aware lexical gate with phrase boosts when one named instrument is wanted, and a paginated hybrid using native $rankFusion over a full-text leg and an auto-embedded $vectorSearch leg for thematic exploration.",
          "Results assembled as a graph rather than a list: regulation→topic, →industry and →issuer→country edges, plus curated regulation→regulation links so a hit arrives with its second hop.",
          "Cross-topic ontology relations layered on top (drives, mitigates, impacts), bridged from topic names to the taxonomy codes the graph is keyed by — so the ESG taxonomy reads as a graph, not a ladder.",
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
      { group: "Engineering / MLOps", items: ["Python", "Airflow", "FastAPI", "AWS (serverless)", "Postgres", "S3", "Argilla (human-in-the-loop)", "OpenTelemetry", "uv · ruff", "MCP servers"] },
    ],
    languages: [
      { name: "Français", level: "Native", flag: "fr" }, { name: "English", level: "Fluent · C2", flag: "en" },
      { name: "Español", level: "Fluent · C2", flag: "es" }, { name: "Català", level: "Conversational · B1", flag: "ca" },
    ],
    beyond: ["Remote-first, distributed teams", "Evaluation-driven delivery", "Talks & internal workshops", "Mentoring & code review"],
  };
})(window);
