// Single source of truth for the resume content.
// Facts sourced from Vincent's LinkedIn, his own CV copy, and the
// "Targets Pipeline" onboarding console.

export const profile = {
  name: "Vincent Rizzo",
  pronouns: "He/Him",
  title: "Senior Data Scientist · AI Engineer",
  tagline: "GenAI & LLM applications",
  location: "Valencia, Spain",
  summary:
    "Machine-learning and software engineer with 6+ years turning large text corpora such as regulations, annual reports and corporate disclosures into structured, queryable data. I build the whole path: classical filter, LLM extractor, and the evaluation harness that measures it.",
  links: {
    email: "vincnt.rizz@gmail.com",
    linkedin: "https://www.linkedin.com/in/vincent-rizzo-ba043a109/",
    github: "https://github.com/vinri2z",
    site: "https://vinri2z.github.io",
  },
};

export const projects = [
  {
    tag: "AI engineering · flagship",
    title: "ESG Targets Extraction Pipeline",
    blurb:
      "An Airflow pipeline that reads corporate ESG and annual reports and emits deduplicated, topic-tagged sustainability targets. Five learned components: classical models where they win, LLMs where the language is hard.",
    bullets: [
      "Recall-first XGBoost / TF-IDF pre-filter (tuned on F2, low decision threshold) to over-admit candidate sentences. A miss here is unrecoverable; a false positive is caught downstream.",
      "LLM extractor built with DSPy; prompts optimized by GEPA against a Hungarian-matched, field-level reward (KPI, value, unit, timeline).",
      "Embedding-based single-linkage clusterer for entity resolution (no preset K), then a DSPy/MIPROv2 summarizer collapses each cluster into one canonical target.",
      "Two-step semantic topic tagger: dense retrieval shortlists ESG topics, an LLM disambiguates the fit.",
    ],
    stack: ["Airflow", "DSPy · GEPA / MIPROv2", "XGBoost", "sentence-transformers", "OpenTelemetry"],
  },
  {
    tag: "GenAI · CSRD / double materiality",
    title: "IRO Generation for CSRD Double Materiality",
    blurb:
      "Generating candidate Impacts, Risks & Opportunities (IROs) to help companies draft the double-materiality disclosures the EU's CSRD now demands of ~50,000 reporters. Grounded in peers' own report language rather than the model's priors.",
    bullets: [
      "Topic modeling over company and peer report sentences so generated IROs reflect disclosures from the analysis scope rather than generic LLM knowledge.",
      "Peer sentences clustered and summarized to fit a whole topic's context into one prompt: HDBSCAN on Matryoshka embeddings cut 2000→100 dims, UMAP to 5, wired together with BERTopic.",
      "Quality pass: SpanMarker NER anonymizes dates, numbers, orgs and products so clusters form on meaning, and pairwise-Levenshtein dedup drops the quasi-duplicates companies repeat.",
      "Human-in-the-loop evaluation in Argilla with in-domain ESG annotators, whose judgement sets the bar for a usable IRO.",
    ],
    stack: ["LLMs · RAG", "BERTopic", "HDBSCAN · UMAP", "Matryoshka embeddings", "SpanMarker NER", "Argilla"],
    link: "https://docs.google.com/presentation/d/1WIWDQmjLTOFRfDwWneReXC0gO98pvPi2hPIbSuEhp_I/preview",
    linkLabel: "View the talk deck",
  },
  {
    tag: "GenAI · guardrails",
    title: "LLM-Assisted Regulatory Intelligence",
    blurb:
      "Championed LLM-assisted workflows company-wide: designing, evaluating and shipping generative-AI features with guardrails over nearly 20,000 regulations across 190+ countries.",
    bullets: [
      "Retrieval and extraction over a large, multi-jurisdiction regulatory corpus.",
      "Evaluation-first delivery: every generative feature ships with a scored test harness.",
      "Model-agnostic orchestration across GPT, Claude and open models via Bedrock.",
    ],
    stack: ["RAG", "LLM orchestration", "Bedrock", "Evaluation harnesses"],
  },
  {
    tag: "MLOps · platform",
    title: "ML Platform & Evaluation Infrastructure",
    blurb:
      "The infrastructure the models depend on: serverless inference, evaluation datasets, and human-in-the-loop labeling.",
    bullets: [
      "Serverless ML inference on AWS and Python (FastAPI) backend services.",
      "Human-in-the-loop MLOps with Argilla; curated gold sets for filter training and pipeline evaluation.",
      "State passed as object-storage JSON (S3 / Postgres), instrumented end-to-end.",
    ],
    stack: ["AWS serverless", "FastAPI", "Argilla", "Postgres", "S3"],
  },
];

export const experience = [
  {
    role: "Senior Data Scientist",
    org: "Datamaran",
    period: "Jan 2020 – Present",
    place: "London, UK · Valencia, Spain",
    note:
      "Joined as a data scientist and grew into a senior IC role. Progressed from Python/FastAPI backend and serverless ML inference to owning LLM-assisted, evaluation-driven GenAI features shipped across the product.",
    tags: ["Python", "LLMs / GenAI", "MLOps", "NLP", "AWS", "Backend", "Software Engineering", "FastAPI"],
  },
  {
    role: "QA Automation Intern",
    org: "Selectra",
    period: "Jan 2018 – Jun 2018",
    place: "Madrid, Spain",
    tags: ["QA Automation", "Katalon", "Groovy", "Selenium"],
  },
];

export const skills = [
  {
    group: "AI / ML",
    items: [
      "LLM orchestration (GPT, Claude, open models)",
      "DSPy (GEPA, MIPROv2)",
      "RAG & semantic search",
      "XGBoost / scikit-learn",
      "sentence-transformers / embeddings",
      "Entity resolution & clustering",
      "Evaluation & metrics",
    ],
  },
  {
    group: "Engineering / MLOps",
    items: [
      "Python",
      "Airflow",
      "FastAPI",
      "AWS (serverless)",
      "Postgres · S3",
      "Argilla (human-in-the-loop)",
      "OpenTelemetry",
      "uv · ruff",
    ],
  },
];

export const education = [
  {
    school: "CentraleSupélec - Université Paris-Saclay",
    degree: "MSc, Industrial Engineering",
    period: "2015 – 2020",
    note: "French 'Grande école' for engineering"
  },
  {
    school: "Universitat Politècnica de València",
    degree: "Double MSc, Industrial Engineering",
    period: "2018 – 2020",
    note: "French–Spanish double-diploma programme.",
  },
  {
    school: "CPGE - Lycée Sainte Geneviève",
    degree: "Mathematics & Physics",
    period: "2013 - 2015",
    note: "",
  },
];
