// Localized copy for the CV page (ca). Loaded before the dc-runtime script in
// index.html, which reads the merged blocks back out of window.CV_I18N.
// Language-invariant data (city coordinates, date ranges, tech stacks) stays in
// index.html — do not duplicate it here.
(function (w) {
  (w.CV_I18N = w.CV_I18N || {}).ca = {
    code: "CA", label: "Català",
    nav: { about: "sobre mi", work: "treballs", skills: "aptituds", timeline: "trajectòria", contact: "contacte" },
    hero: { loc: "València, Espanya", pron: "Ell", title: "Data Scientist Sènior · Enginyer d'IA", tag: "Aplicacions GenAI i LLM", email: "Correu", scroll: "DESPLAÇA",
      summary: "Enginyer de machine learning i programari amb més de 6 anys convertint grans corpus de text —regulacions, informes anuals i divulgacions corporatives— en dades estructurades i consultables. Construeixo tot el camí: filtre clàssic, extractor amb LLM i l'arnès d'avaluació que el mesura." },
    about: { label: "// ús ètic de la IA", h1: "Ús ètic de la ", hAcc: "IA", h2: ".", stat: "anys en ML i programari",
      body: "Treballo per treure el màxim partit als LLM on té sentit, mantenint sempre baranes de seguretat, mètriques estrictes i una persona dins el bucle." },
    tl: { label: "// experiència i formació", h: "Una sola línia", p: "Tot el que he estudiat i construït, del més recent al més antic i a escala.",
      eduLegend: "Formació", expLegend: "Experiència", foldLegend: "Temps plegat",
      yr1: "any", yrN: "anys", mo1: "mes", moN: "mesos", present: "Actualitat",
      months: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des."] },
    work: { label: "// treballs seleccionats", h: "El que he construït", p: "Sistemes que llegeixen documents a escala. Obre qualsevol projecte per veure el detall tècnic.", show: "Veure detall ▾", hide: "Amagar detall ▴", deck: "Veure la presentació" },
    tk: { label: "// eines", h: "Com construeixo" },
    sk: { label: "// aptituds", h: "Idiomes i més", langs: "Idiomes", beyond: "Maneres de treballar" },
    ct: { label: "// parlem-ne", h1: "Construeixes alguna cosa que llegeix", h2: "documents tot el dia?", p: "M'encantaria saber-ne més. Escriu-me: visc a València i treballo en remot.", footer: "© 2026 Vincent Rizzo · València, Espanya" },
    edu: [
      { name: "Lycée Militaire d'Aix-en-Provence", sub: "Batxillerat científic, ciències de l'enginyeria · Felicitacions del jurat", place: "Aix-en-Provence, FR" },
      { name: "Lycée Sainte-Geneviève", sub: "CPGE · Matemàtiques i Física", place: "Versalles, FR" },
      { name: "CentraleSupélec", sub: "Màster en Enginyeria Industrial · Université Paris-Saclay", place: "Paris-Saclay, FR" },
      { name: "Universitat Politècnica de València", sub: "Doble màster en Enginyeria Industrial", place: "València, ES" },
    ],
    exp: [
      { role: "Becari d'automatització QA", org: "Selectra", place: "Madrid, ES", note: "Automatització de proves amb Katalon, Selenium i Groovy." },
      { role: "Becari de Data Science", org: "Datamaran", place: "València, ES", note: "Python i inferència ML serverless; primers models de NLP en producció." },
      { role: "Product Data Scientist", org: "Datamaran · Contractista", place: "Londres, UK", note: "Pipelines d'extracció documental al producte; back-ends amb FastAPI." },
      { role: "Data Scientist Sènior", org: "Datamaran", place: "València, ES", note: "Responsable de funcionalitats GenAI assistides per LLM i guiades per l'avaluació." },
    ],
    projects: [
      { tag: "Enginyeria d'IA · projecte estrella", title: "Pipeline d'extracció d'objectius ESG",
        blurb: "Un pipeline d'Airflow que llegeix informes ESG i anuals d'empreses i emet objectius de sostenibilitat deduplicats i etiquetats per tema. Cinc components apresos: models clàssics on guanyen, LLM on el llenguatge és difícil.",
        bullets: [
          "Prefiltre XGBoost / TF-IDF orientat al recall (ajustat amb F2 i llindar de decisió baix) per sobreadmetre frases candidates. Una pèrdua aquí és irrecuperable; un fals positiu s'atrapa més endavant.",
          "Extractor LLM construït amb DSPy; prompts optimitzats amb GEPA contra una recompensa a nivell de camp aparellada amb l'algorisme hongarès (KPI, valor, unitat, termini).",
          "Clustering d'enllaç simple sobre embeddings per a la resolució d'entitats (sense K predefinit) i després un resumidor DSPy/MIPROv2 col·lapsa cada clúster en un objectiu canònic.",
          "Etiquetatge semàntic de temes en dos passos: la recuperació densa preselecciona temes ESG i un LLM desambigua l'encaix.",
        ] },
      { tag: "GenAI · CSRD / doble materialitat", title: "Generació d'IRO per a la doble materialitat CSRD",
        blurb: "Generació d'Impactes, Riscos i Oportunitats (IRO) candidats per ajudar les empreses a redactar les divulgacions de doble materialitat que la CSRD ja exigeix a uns 50.000 declarants. Ancorada en el llenguatge dels informes dels seus parells, no en els biaixos del model.",
        bullets: [
          "Topic modeling sobre frases d'informes de l'empresa i dels seus parells, perquè els IRO generats reflecteixin l'abast de l'anàlisi i no el coneixement genèric del LLM.",
          "Frases dels parells agrupades i resumides per encabir el context de tot un tema en un sol prompt: HDBSCAN sobre embeddings Matryoshka (2000→100 dimensions), UMAP a 5, tot unit amb BERTopic.",
          "Passada de qualitat: la NER amb SpanMarker anonimitza dates, nombres, organitzacions i productes perquè els clústers es formin pel significat, i la deduplicació per Levenshtein per parelles elimina els quasi duplicats.",
          "Avaluació amb humà dins el bucle a Argilla, amb anotadors ESG del domini el criteri dels quals marca el llistó d'un IRO utilitzable.",
        ] },
      { tag: "GenAI · baranes de seguretat", title: "Intel·ligència regulatòria assistida per LLM",
        blurb: "Impulsor dels fluxos assistits per LLM a tota l'empresa: disseny, avaluació i posada en producció de funcionalitats d'IA generativa amb baranes de seguretat sobre gairebé 20.000 regulacions de més de 190 països.",
        bullets: [
          "Recuperació i extracció sobre un corpus regulatori ampli i multijurisdiccional.",
          "Lliurament guiat per l'avaluació: cada funcionalitat generativa es publica amb un arnès de proves puntuat.",
          "Orquestració agnòstica al model entre GPT, Claude i models oberts via Bedrock.",
        ] },
      { tag: "MLOps · plataforma", title: "Plataforma ML i infraestructura d'avaluació",
        blurb: "La infraestructura de la qual depenen els models: inferència serverless, conjunts d'avaluació i etiquetatge amb humà dins el bucle.",
        bullets: [
          "Inferència ML serverless a AWS i serveis back-end en Python (FastAPI).",
          "MLOps amb humà dins el bucle amb Argilla; conjunts de referència curats per entrenar filtres i avaluar el pipeline.",
          "Estat en JSON sobre emmagatzematge d'objectes (S3 / Postgres), instrumentat d'extrem a extrem.",
        ] },
    ],
    toolkit: [
      { group: "IA / ML", items: ["Orquestració de LLM (GPT, Claude, models oberts)", "DSPy (GEPA, MIPROv2)", "RAG i cerca semàntica", "XGBoost / scikit-learn", "sentence-transformers / embeddings", "Resolució d'entitats i clustering", "Avaluació i mètriques"] },
      { group: "Enginyeria / MLOps", items: ["Python", "Airflow", "FastAPI", "AWS (serverless)", "Postgres · S3", "Argilla (humà dins el bucle)", "OpenTelemetry", "uv · ruff"] },
    ],
    languages: [
      { name: "Francès", level: "Natiu" }, { name: "Anglès", level: "Fluid · C2" },
      { name: "Espanyol", level: "Fluid · C2" }, { name: "Català", level: "Conversacional · B1" },
    ],
    beyond: ["Remote-first, equips distribuïts", "Lliurament guiat per l'avaluació", "Xerrades i tallers interns", "Mentoria i revisió de codi"],
  };
})(window);
