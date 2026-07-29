// Localized copy for the CV page (ca). Loaded before the dc-runtime script in
// index.html, which reads the merged blocks back out of window.CV_I18N.
// Language-invariant data (city coordinates, date ranges, tech stacks) stays in
// index.html — do not duplicate it here.
(function (w) {
  (w.CV_I18N = w.CV_I18N || {}).ca = {
    code: "CA", label: "Català",
    nav: { about: "sobre mi", work: "treballs", skills: "aptituds", timeline: "trajectòria", contact: "contacte", theme: "Tema clar o fosc", menu: "Menú" },
    hero: { loc: "València, Espanya", pron: "Ell", title: "Data Scientist Sènior · Enginyer d'IA", tag: "Aplicacions LLM", email: "Correu", scroll: "DESPLAÇA", spin: "DESPLAÇA DE COSTAT PER GIRAR",
      summary: "Enginyer de machine learning i programari amb més de 6 anys convertint grans corpus de text —regulacions, informes anuals i divulgacions corporatives— en dades estructurades i consultables. Construeixo tot el camí: filtre clàssic, extractor amb LLM i l'arnès d'avaluació que el mesura." },
    about: { label: "// sobre mi", h1: "Ús ètic de la ", hAcc: "IA", h2: ".", stat: "anys en ML i programari",
      body: "Treballo per treure el màxim partit als LLM on té sentit, mantenint sempre baranes de seguretat, mètriques estrictes i una persona dins el bucle." },
    tl: { label: "// experiència i formació", h: "Una sola línia", p: "Tot el que he estudiat i construït, del més recent al més antic i a escala.",
      eduLegend: "Formació", expLegend: "Experiència", volLegend: "Voluntariat", projLegend: "Projectes", foldLegend: "Temps plegat",
      yr1: "any", yrN: "anys", mo1: "mes", moN: "mesos", present: "Actualitat", workLink: "Detalls del projecte",
      months: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des."] },
    work: { label: "// projectes seleccionats", h: "El que he construït", p: "Sistemes que llegeixen documents a escala. Obre qualsevol projecte per veure el detall tècnic.", show: "Veure detall ▾", hide: "Amagar detall ▴", deck: "Veure la presentació a slideshare.net", timelineLink: "Veure a la trajectòria" },
    tk: { label: "// eines", h: "Com construeixo" },
    sk: { label: "// aptituds", h: "Idiomes i més", langs: "Idiomes", beyond: "Maneres de treballar" },
    ct: { label: "// parlem-ne", h1: "Estàs construint una aplicació nativa d'IA?", h2: "", p: "M'encantaria saber-ho, escriu-me: visc a València i treballo en remot.", copied: "Adreça de correu copiada", copy: "Copiar l'adreça de correu", footer: "© 2026 Vincent Rizzo · València, Espanya" },
    edu: [
      { name: "Lycée Militaire d'Aix-en-Provence", sub: "Batxillerat científic, ciències de l'enginyeria · Felicitacions del jurat", place: "Aix-en-Provence, FR" },
      { name: "Lycée Sainte-Geneviève", sub: "CPGE · Matemàtiques i Física", place: "Versalles, FR" },
      { name: "CentraleSupélec", sub: "Màster en Enginyeria Industrial · Université Paris-Saclay", place: "Paris-Saclay, FR" },
      { name: "Universitat Politècnica de València", sub: "Doble màster en Enginyeria Industrial", place: "València, ES" },
    ],
    vol: [
      { name: "Les Enfants du Soleil", sub: "Voluntari · ONG d'infància", place: "Toamasina, MG" },
      { name: "4L Trophy — Les Enfants du Désert", sub: "Tripulació · ral·li estudiantil de repartiment de material escolar", place: "Boulaajoul, MA" },
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
      { tag: "GenAI · aplicació MCP", title: "Explorador del graf de coneixement regulatori",
        blurb: "Una aplicació MCP que obre a la cerca en llenguatge natural un corpus de gairebé 20.000 regulacions de més de 190 països. Un LLM llegeix la pregunta; el graf la respon en context: les regulacions relacionades, els temes que tracten i l'ontologia al seu voltant. Publicat com a servidor MCP protegit per Cognito per a Claude i ChatGPT, més una SPA en Vue 3, tots dos sobre un mateix back-end FastAPI.",
        bullets: [
          "Interpretació de la consulta amb LLM: el text lliure esdevé un arbre de filtres booleà (estat, obligatorietat, jurisdicció, dates), una consulta semàntica residual i una decisió d'encaminament entre cerca específica i exploració àmplia — retornada al lector perquè vegi com s'ha llegit la seva pregunta.",
          "Dos modes de recuperació sobre MongoDB Atlas: una porta lèxica sensible als sinònims amb reforç de frases quan es busca una norma concreta, i un híbrid paginat amb $rankFusion natiu sobre una branca de text complet i una branca $vectorSearch auto-incrustada per a l'exploració temàtica.",
          "Resultats acoblats com a graf i no com a llista: arestes regulació→tema, →indústria i →emissor→país, més enllaços regulació→regulació curats perquè cada resultat arribi amb el seu segon salt.",
          "Relacions entre temes de l'ontologia superposades (drives, mitigates, impacts), pontades des dels noms de tema als codis de taxonomia que indexen el graf: la taxonomia ESG es llegeix com un graf, no com una escala.",
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
      { group: "Enginyeria / MLOps", items: ["Python", "Airflow", "FastAPI", "AWS (serverless)", "Postgres", "S3", "Argilla (humà dins el bucle)", "OpenTelemetry", "uv · ruff", "Servidors MCP"] },
    ],
    languages: [
      { name: "Français", level: "Natiu", flag: "fr" }, { name: "English", level: "Fluid · C2", flag: "en" },
      { name: "Español", level: "Fluid · C2", flag: "es" }, { name: "Català", level: "Conversacional · B1", flag: "ca" },
    ],
    beyond: ["Remote-first, equips distribuïts", "Lliurament guiat per l'avaluació", "Xerrades i tallers interns", "Mentoria i revisió de codi"],
  };
})(window);
