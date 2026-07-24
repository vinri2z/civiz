// Localized copy for the CV page (fr). Loaded before the dc-runtime script in
// index.html, which reads the merged blocks back out of window.CV_I18N.
// Language-invariant data (city coordinates, date ranges, tech stacks) stays in
// index.html — do not duplicate it here.
(function (w) {
  (w.CV_I18N = w.CV_I18N || {}).fr = {
    code: "FR", label: "Français",
    nav: { about: "à propos", work: "travaux", skills: "compétences", timeline: "frise", contact: "contact" },
    hero: { loc: "Valence, Espagne", pron: "Il/Lui", title: "Data scientist senior · Ingénieur IA", tag: "Applications GenAI et LLM", email: "E-mail", scroll: "DÉFILER",
      summary: "Ingénieur machine learning et logiciel, plus de 6 ans passés à transformer de vastes corpus de textes — réglementations, rapports annuels, publications extra-financières — en données structurées et interrogeables. Je construis toute la chaîne : filtre classique, extracteur LLM et le harnais d'évaluation qui le mesure." },
    about: { label: "// usage éthique de l'IA", h1: "Un usage éthique de l'", hAcc: "IA", h2: ".", stat: "ans en ML et logiciel",
      body: "Je travaille pour que nous tirions le meilleur des LLM là où c'est pertinent, en gardant toujours des garde-fous, des métriques strictes et un humain dans la boucle." },
    tl: { label: "// expérience et formation", h: "Une seule frise", p: "Tout ce que j'ai étudié et construit, du plus récent au plus ancien, tracé à l'échelle.",
      eduLegend: "Formation", expLegend: "Expérience", foldLegend: "Temps replié",
      yr1: "an", yrN: "ans", mo1: "mois", moN: "mois", present: "Aujourd'hui",
      months: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."] },
    work: { label: "// travaux sélectionnés", h: "Ce que j'ai construit", p: "Des systèmes qui lisent des documents à grande échelle. Ouvrez un projet pour le détail technique.", show: "Voir le détail ▾", hide: "Masquer le détail ▴", deck: "Voir la présentation" },
    tk: { label: "// boîte à outils", h: "Comment je construis" },
    sk: { label: "// compétences", h: "Langues et au-delà", langs: "Langues", beyond: "Façons de travailler" },
    ct: { label: "// parlons-en", h1: "Vous construisez quelque chose qui lit", h2: "des documents à longueur de journée ?", p: "J'aimerais en entendre parler. Écrivez-moi — je suis basé à Valence et travaille à distance.", footer: "© 2026 Vincent Rizzo · Valence, Espagne" },
    edu: [
      { name: "Lycée Sainte-Geneviève", sub: "CPGE · Mathématiques et Physique", place: "Versailles, FR" },
      { name: "CentraleSupélec", sub: "Diplôme d'ingénieur, génie industriel · Université Paris-Saclay", place: "Paris-Saclay, FR" },
      { name: "Universitat Politècnica de València", sub: "Double diplôme, génie industriel", place: "Valence, ES" },
    ],
    exp: [
      { role: "Stagiaire automatisation QA", org: "Selectra", place: "Madrid, ES", note: "Automatisation des tests avec Katalon, Selenium et Groovy." },
      { role: "Stagiaire data science", org: "Datamaran", place: "Valence, ES", note: "Python et inférence ML serverless ; premiers modèles NLP mis en production." },
      { role: "Product data scientist", org: "Datamaran · Freelance", place: "Londres, UK", note: "Mise en production de pipelines d'extraction documentaire ; back-ends FastAPI." },
      { role: "Data scientist senior", org: "Datamaran", place: "Valence, ES", note: "Responsable des fonctionnalités GenAI assistées par LLM et pilotées par l'évaluation." },
    ],
    projects: [
      { tag: "Ingénierie IA · projet phare", title: "Pipeline d'extraction d'objectifs ESG",
        blurb: "Un pipeline Airflow qui lit les rapports ESG et annuels des entreprises et en extrait des objectifs de durabilité dédupliqués et étiquetés par thème. Cinq composants appris : des modèles classiques là où ils gagnent, des LLM là où la langue est difficile.",
        bullets: [
          "Pré-filtre XGBoost / TF-IDF orienté rappel (optimisé sur F2, seuil de décision bas) pour sur-admettre les phrases candidates. Un oubli ici est irrécupérable ; un faux positif est rattrapé plus loin.",
          "Extracteur LLM construit avec DSPy ; prompts optimisés par GEPA sur une récompense au niveau des champs, appariée par l'algorithme hongrois (KPI, valeur, unité, échéance).",
          "Clustering par lien simple sur embeddings pour la résolution d'entités (sans K prédéfini), puis un résumeur DSPy/MIPROv2 réduit chaque cluster à un objectif canonique.",
          "Étiquetage thématique sémantique en deux temps : la recherche dense présélectionne les thèmes ESG, un LLM tranche.",
        ] },
      { tag: "GenAI · CSRD / double matérialité", title: "Génération d'IRO pour la double matérialité CSRD",
        blurb: "Génération d'Impacts, Risques et Opportunités (IRO) candidats pour aider les entreprises à rédiger les informations de double matérialité que la CSRD impose désormais à environ 50 000 déclarants. Ancrée dans le langage des rapports des pairs plutôt que dans les a priori du modèle.",
        bullets: [
          "Topic modeling sur les phrases des rapports de l'entreprise et de ses pairs, pour que les IRO générés reflètent le périmètre d'analyse et non la culture générale du LLM.",
          "Phrases des pairs regroupées et résumées afin de faire tenir le contexte d'un thème entier dans un seul prompt : HDBSCAN sur embeddings Matryoshka (2000→100 dimensions), UMAP vers 5, orchestré avec BERTopic.",
          "Passe qualité : la NER SpanMarker anonymise dates, nombres, organisations et produits pour que les clusters se forment sur le sens, et une déduplication Levenshtein par paires élimine les quasi-doublons.",
          "Évaluation avec humain dans la boucle sur Argilla, par des annotateurs ESG du domaine dont le jugement fixe la barre d'un IRO utilisable.",
        ] },
      { tag: "GenAI · garde-fous", title: "Intelligence réglementaire assistée par LLM",
        blurb: "Promoteur des workflows assistés par LLM dans toute l'entreprise : conception, évaluation et mise en production de fonctionnalités d'IA générative avec garde-fous sur près de 20 000 réglementations dans plus de 190 pays.",
        bullets: [
          "Recherche et extraction sur un vaste corpus réglementaire multi-juridictions.",
          "Livraison guidée par l'évaluation : chaque fonctionnalité générative arrive avec son harnais de test noté.",
          "Orchestration agnostique du modèle entre GPT, Claude et modèles ouverts via Bedrock.",
        ] },
      { tag: "MLOps · plateforme", title: "Plateforme ML et infrastructure d'évaluation",
        blurb: "L'infrastructure dont dépendent les modèles : inférence serverless, jeux de données d'évaluation et annotation avec humain dans la boucle.",
        bullets: [
          "Inférence ML serverless sur AWS et services back-end Python (FastAPI).",
          "MLOps avec humain dans la boucle via Argilla ; jeux de référence curatés pour l'entraînement des filtres et l'évaluation du pipeline.",
          "État transmis en JSON sur stockage objet (S3 / Postgres), instrumenté de bout en bout.",
        ] },
    ],
    toolkit: [
      { group: "IA / ML", items: ["Orchestration de LLM (GPT, Claude, modèles ouverts)", "DSPy (GEPA, MIPROv2)", "RAG et recherche sémantique", "XGBoost / scikit-learn", "sentence-transformers / embeddings", "Résolution d'entités et clustering", "Évaluation et métriques"] },
      { group: "Ingénierie / MLOps", items: ["Python", "Airflow", "FastAPI", "AWS (serverless)", "Postgres · S3", "Argilla (humain dans la boucle)", "OpenTelemetry", "uv · ruff"] },
    ],
    languages: [
      { name: "Français", level: "Langue maternelle" }, { name: "Anglais", level: "Courant · C2" },
      { name: "Espagnol", level: "Courant · C2" }, { name: "Catalan", level: "Conversationnel · B1" },
    ],
    beyond: ["Remote-first, équipes distribuées", "Livraison guidée par l'évaluation", "Conférences et ateliers internes", "Mentorat et revue de code"],
  };
})(window);
