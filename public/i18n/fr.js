// Localized copy for the CV page (fr). Loaded before the dc-runtime script in
// index.html, which reads the merged blocks back out of window.CV_I18N.
// Language-invariant data (city coordinates, date ranges, tech stacks) stays in
// index.html — do not duplicate it here.
(function (w) {
  (w.CV_I18N = w.CV_I18N || {}).fr = {
    code: "FR", label: "Français",
    nav: { about: "à propos", work: "projets", skills: "compétences", timeline: "historique", contact: "contact", theme: "Thème clair ou sombre", menu: "Menu" },
    hero: { loc: "Valence, Espagne", pron: "Il/Lui", title: "Senior Data Scientist · Ingénieur IA", tag: "Applications LLM", email: "E-mail", scroll: "SCROLL",
      summary: "Ingénieur machine learning et logiciel, plus de 6 ans passés à transformer de vastes corpus de textes — réglementations, rapports annuels, publications extra-financières — en données structurées et interrogeables. Je construis toute la chaîne : filtre classique, extracteur LLM et le framework d'évaluation qui le mesure." },
    about: { label: "// usage éthique de l'IA", h1: "Un usage éthique de l'", hAcc: "IA", h2: ".", stat: "ans en Machine Learning et logiciel",
      body: "Je travaille pour que nous tirions le meilleur des LLM là où c'est pertinent, en gardant toujours des garde-fous, des métriques strictes et une supervision humaine." },
    tl: { label: "// expérience et formation", h: "Historique", p: "Tout ce que j'ai étudié et construit, du plus récent au plus ancien, tracé à l'échelle.",
      eduLegend: "Formation", expLegend: "Expérience", volLegend: "Bénévolat", projLegend: "Projets", foldLegend: "Temps replié",
      yr1: "an", yrN: "ans", mo1: "mois", moN: "mois", present: "Aujourd'hui", workLink: "Détails du projet",
      months: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."] },
    work: { label: "// projets sélectionnés", h: "Ce que j'ai construit", p: "Des systèmes qui lisent des documents à grande échelle. Ouvrez un projet pour le détail technique.", show: "Voir le détail ▾", hide: "Masquer le détail ▴", deck: "Voir la présentation sur slideshare.net", timelineLink: "Voir sur la frise" },
    tk: { label: "// boîte à outils", h: "Comment je construis" },
    sk: { label: "// compétences", h: "Langues et au-delà", langs: "Langues", beyond: "Façons de travailler" },
    ct: { label: "// contactez moi", h1: "Vous développez une application IA native ?", h2: "", p: "J'aimerais en discuter, écrivez-moi - je suis basé à Valence et peux travailler à distance.", copied: "Adresse e-mail copiée", copy: "Copier l'adresse e-mail", footer: "© 2026 Vincent Rizzo · Valence, Espagne" },
    edu: [
      { name: "Lycée Militaire d'Aix-en-Provence", sub: "Baccalauréat scientifique, sciences de l'ingénieur · Félicitations du jury", place: "Aix-en-Provence, FR" },
      { name: "Lycée Sainte-Geneviève", sub: "CPGE · Mathématiques et Physique", place: "Versailles, FR" },
      { name: "CentraleSupélec", sub: "Diplôme d'ingénieur, génie industriel · Université Paris-Saclay", place: "Paris-Saclay, FR" },
      { name: "Universitat Politècnica de València", sub: "Double diplôme, génie industriel", place: "Valence, ES" },
    ],
    vol: [
      { name: "Les Enfants du Soleil", sub: "Bénévole · association pour l'enfance", place: "Toamasina, MG" },
      { name: "4L Trophy — Les Enfants du Désert", sub: "Équipage · rallye étudiant, livraison de fournitures scolaires", place: "Boulaajoul, MA" },
    ],
    exp: [
      { role: "Stagiaire automatisation QA", org: "Selectra", place: "Madrid, ES", note: "Automatisation des tests avec Katalon, Selenium et Groovy." },
      { role: "Stagiaire data science", org: "Datamaran", place: "Valence, ES", note: "Python et inférence ML serverless ; premiers modèles NLP mis en production." },
      { role: "Product data scientist", org: "Datamaran · Freelance", place: "Londres, UK", note: "Mise en production de pipelines d'extraction documentaire ; back-ends FastAPI." },
      { role: "Data scientist senior", org: "Datamaran", place: "Valence, ES", note: "Responsable des fonctionnalités GenAI assistées par LLM et pilotées par l'évaluation." },
    ],
    projects: [
      { tag: "Ingénierie IA · projet principal", title: "Pipeline d'extraction d'objectifs ESG",
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
      { tag: "GenAI · application MCP", title: "Explorateur du graphe de connaissances réglementaire",
        blurb: "Une application MCP qui ouvre à la recherche en langage naturel un corpus de près de 20 000 réglementations dans plus de 190 pays. Un LLM lit la question ; le graphe y répond en contexte — les réglementations liées, les thèmes qu'elles traitent et l'ontologie autour d'eux. Livré comme serveur MCP protégé par Cognito pour Claude et ChatGPT, plus une SPA Vue 3, tous deux sur un même back-end FastAPI.",
        bullets: [
          "Interprétation de la requête par LLM : le texte libre devient un arbre de filtres booléen (statut, force contraignante, juridiction, dates), une requête sémantique résiduelle et une décision d'aiguillage recherche précise / exploration large — restituée pour que le lecteur voie comment sa question a été comprise.",
          "Deux modes de recherche sur MongoDB Atlas : une porte lexicale sensible aux synonymes avec bonus de phrase quand un texte précis est visé, et un hybride paginé utilisant le $rankFusion natif sur une branche plein-texte et une branche $vectorSearch auto-embarquée pour l'exploration thématique.",
          "Résultats assemblés en graphe plutôt qu'en liste : arêtes réglementation→thème, →secteur et →émetteur→pays, plus des liens réglementation→réglementation curés pour qu'un résultat arrive avec son second saut.",
          "Relations inter-thèmes de l'ontologie superposées (drives, mitigates, impacts), reliées des noms de thèmes aux codes de taxonomie qui indexent le graphe — la taxonomie ESG se lit comme un graphe, pas comme une échelle.",
        ] },
    ],
    toolkit: [
      { group: "IA / ML", items: ["Orchestration de LLM (GPT, Claude, modèles ouverts)", "DSPy (GEPA, MIPROv2)", "RAG et recherche sémantique", "XGBoost / scikit-learn", "sentence-transformers / embeddings", "Résolution d'entités et clustering", "Évaluation et métriques"] },
      { group: "Ingénierie / MLOps", items: ["Python", "Airflow", "FastAPI", "AWS", "Postgres · S3", "Argilla (annotation de données)", "OpenTelemetry", "uv · ruff", "Serveurs MCP"] },
    ],
    languages: [
      { name: "Français", level: "Langue maternelle", flag: "fr" }, { name: "English", level: "Courant · C2", flag: "en" },
      { name: "Español", level: "Courant · C2", flag: "es" }, { name: "Català", level: "Conversationnel · B1", flag: "ca" },
    ],
    beyond: ["Remote-first, équipes distribuées", "Livraison guidée par l'évaluation", "Conférences et ateliers internes", "Mentorat et revue de code"],
  };
})(window);
