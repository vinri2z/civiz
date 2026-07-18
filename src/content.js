// Chapter content — pulled from Vincent's CV, mapped to the 3D journey.
// `range` is the scroll-progress window [start, end] where each card is visible.
// `anchor` is the world Z where the chapter's 3D set lives (see world.js).

export const chapters = [
  {
    id: "earth",
    kicker: "The map",
    title: "A journey across a career",
    where: "Earth → France",
    year: "",
    body:
      "Machine Learning &amp; software engineer with 5+ years turning large, messy text " +
      "corpora — regulations, corporate disclosures — into reliable, structured intelligence. " +
      "Scroll down to travel through it.",
    tags: ["GenAI", "NLP", "MLOps", "Python"],
    range: [0.03, 0.13],
  },
  {
    id: "village",
    kicker: "Where it starts",
    title: "A small Gaulois village",
    where: "Aix-en-Provence, France",
    year: "…before Paris",
    body:
      "Somewhere near Marseille, in a village that never quite surrendered. Prep for the " +
      "grandes écoles begins here — the stubborn habit of solving hard problems with whatever " +
      "is at hand.",
    tags: ["CPGE preparatory classes", "Foundations", "Provence"],
    range: [0.14, 0.29],
  },
  {
    id: "paris",
    kicker: "Education",
    title: "MSc, Industrial Engineering",
    where: "CentraleSupélec — Paris-Saclay",
    year: "2015 – 2020",
    body:
      "The Renaissance of the mind: engineering, systems thinking, and the tools to model " +
      "the world. Master's thesis on detecting trends in non-financial (ESG) risk factors — " +
      "awarded the Torrecid Foundation prize.",
    tags: ["CentraleSupélec", "Systems", "Torrecid prize"],
    range: [0.30, 0.46],
  },
  {
    id: "valencia-uni",
    kicker: "Double degree",
    title: "Industrial Engineering (double MSc)",
    where: "Universitat Politècnica de València",
    year: "2018 – 2020",
    body:
      "South to Valencia and the Ciutat de les Arts i les Ciències — white arches, water, " +
      "and industry. A double degree bridging French and Spanish engineering.",
    tags: ["UPV", "Ciutat de les Arts", "Industrial"],
    range: [0.47, 0.63],
  },
  {
    id: "datamaran-2020",
    kicker: "First role",
    title: "Product Data Scientist — Datamaran",
    where: "Valencia, Spain",
    year: "2020 – 2022",
    body:
      "2020: joining Datamaran. Backend engineering in Python (FastAPI), serverless ML " +
      "inference on AWS, evaluation datasets, and human-in-the-loop MLOps with Argilla. " +
      "Then the world shut down.",
    tags: ["FastAPI", "AWS serverless", "Argilla", "MLOps"],
    range: [0.64, 0.77],
  },
  {
    id: "mexico",
    kicker: "The pandemic detour",
    title: "Data Scientist — remotely, from Mexico",
    where: "Mexico",
    year: "2020 – 2022",
    body:
      "The pandemic redraws the map. Same mission at Datamaran, a new hemisphere: building " +
      "evaluation datasets and NLP models over corporate disclosures and legal text.",
    tags: ["Remote", "NLP", "Information extraction"],
    range: [0.78, 0.88],
  },
  {
    id: "valencia-senior",
    kicker: "Today",
    title: "Senior Data Scientist II — Datamaran",
    where: "Back in Valencia",
    year: "2022 – Present",
    body:
      "2022: back to Valencia, promoted to Senior. Championing LLM-assisted workflows " +
      "company-wide — designing, evaluating, and shipping generative-AI features with " +
      "guardrails, over nearly 20,000 regulations across 190+ countries.",
    tags: ["LLMs", "RAG", "Evaluation", "190+ countries"],
    range: [0.89, 1.0],
  },
];

export const contact = {
  name: "Vincent Rizzo",
  email: "vincnt.rizz@gmail.com",
  site: "vinri2z.github.io",
  linkedin: "https://www.linkedin.com/in/vincent-rizzo-ba043a109/",
  github: "https://github.com/vinri2z",
};
