// Localized copy for the CV page (es). Loaded before the dc-runtime script in
// index.html, which reads the merged blocks back out of window.CV_I18N.
// Language-invariant data (city coordinates, date ranges, tech stacks) stays in
// index.html — do not duplicate it here.
(function (w) {
  (w.CV_I18N = w.CV_I18N || {}).es = {
    code: "ES", label: "Español",
    nav: { about: "sobre mí", work: "trabajo", skills: "aptitudes", timeline: "trayectoria", contact: "contacto" },
    hero: { loc: "Valencia, España", pron: "Él", title: "Data Scientist Senior · Ingeniero de IA", tag: "Aplicaciones GenAI y LLM", email: "Correo", scroll: "DESLIZA",
      summary: "Ingeniero de machine learning y software con más de 6 años convirtiendo grandes corpus de texto —regulaciones, informes anuales y divulgaciones corporativas— en datos estructurados y consultables. Construyo el camino completo: filtro clásico, extractor con LLM y el arnés de evaluación que lo mide." },
    about: { label: "// uso ético de la IA", h1: "Uso ético de la ", hAcc: "IA", h2: ".", stat: "años en ML y software",
      body: "Trabajo para sacar el máximo partido a los LLM donde tiene sentido, manteniendo siempre barreras de seguridad, métricas estrictas y una persona en el bucle." },
    tl: { label: "// experiencia y formación", h: "Una sola línea", p: "Todo lo que he estudiado y construido, de lo más reciente a lo más antiguo y a escala.",
      eduLegend: "Formación", expLegend: "Experiencia", volLegend: "Voluntariado", foldLegend: "Tiempo plegado",
      yr1: "año", yrN: "años", mo1: "mes", moN: "meses", present: "Actualidad",
      months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"] },
    work: { label: "// trabajos seleccionados", h: "Lo que he construido", p: "Sistemas que leen documentos a escala. Abre cualquier proyecto para ver el detalle técnico.", show: "Ver detalle ▾", hide: "Ocultar detalle ▴", deck: "Ver la presentación" },
    tk: { label: "// herramientas", h: "Cómo construyo" },
    sk: { label: "// aptitudes", h: "Idiomas y más", langs: "Idiomas", beyond: "Formas de trabajar" },
    ct: { label: "// hablemos", h1: "¿Construyes algo que lee", h2: "documentos todo el día?", p: "Me encantaría saber más. Escríbeme: vivo en Valencia y trabajo en remoto.", footer: "© 2026 Vincent Rizzo · Valencia, España" },
    edu: [
      { name: "Lycée Militaire d'Aix-en-Provence", sub: "Bachillerato científico, ciencias de la ingeniería · Felicitaciones del jurado", place: "Aix-en-Provence, FR" },
      { name: "Lycée Sainte-Geneviève", sub: "CPGE · Matemáticas y Física", place: "Versalles, FR" },
      { name: "CentraleSupélec", sub: "Máster en Ingeniería Industrial · Université Paris-Saclay", place: "Paris-Saclay, FR" },
      { name: "Universitat Politècnica de València", sub: "Doble máster en Ingeniería Industrial", place: "Valencia, ES" },
    ],
    vol: [
      { name: "Les Enfants du Soleil", sub: "Voluntario · ONG de infancia", place: "Toamasina, MG" },
      { name: "4L Trophy — Les Enfants du Désert", sub: "Tripulación · rally estudiantil de reparto de material escolar", place: "Boulajoul, MA" },
    ],
    exp: [
      { role: "Becario de automatización QA", org: "Selectra", place: "Madrid, ES", note: "Automatización de pruebas con Katalon, Selenium y Groovy." },
      { role: "Becario de Data Science", org: "Datamaran", place: "Valencia, ES", note: "Python e inferencia ML serverless; primeros modelos de NLP en producción." },
      { role: "Product Data Scientist", org: "Datamaran · Contratista", place: "Londres, UK", note: "Pipelines de extracción documental en producto; back-ends con FastAPI." },
      { role: "Data Scientist Senior", org: "Datamaran", place: "Valencia, ES", note: "Responsable de funcionalidades GenAI asistidas por LLM y guiadas por evaluación." },
    ],
    projects: [
      { tag: "Ingeniería de IA · proyecto estrella", title: "Pipeline de extracción de objetivos ESG",
        blurb: "Un pipeline de Airflow que lee informes ESG y anuales de empresas y emite objetivos de sostenibilidad deduplicados y etiquetados por tema. Cinco componentes aprendidos: modelos clásicos donde ganan, LLM donde el lenguaje es difícil.",
        bullets: [
          "Prefiltro XGBoost / TF-IDF orientado a recall (ajustado con F2 y umbral de decisión bajo) para sobreadmitir frases candidatas. Una pérdida aquí es irrecuperable; un falso positivo se atrapa más adelante.",
          "Extractor LLM construido con DSPy; prompts optimizados con GEPA contra una recompensa a nivel de campo emparejada con el algoritmo húngaro (KPI, valor, unidad, plazo).",
          "Clustering de enlace simple sobre embeddings para resolución de entidades (sin K predefinido) y luego un resumidor DSPy/MIPROv2 colapsa cada clúster en un objetivo canónico.",
          "Etiquetado semántico de temas en dos pasos: la recuperación densa preselecciona temas ESG y un LLM desambigua el encaje.",
        ] },
      { tag: "GenAI · CSRD / doble materialidad", title: "Generación de IRO para la doble materialidad CSRD",
        blurb: "Generación de Impactos, Riesgos y Oportunidades (IRO) candidatos para ayudar a las empresas a redactar las divulgaciones de doble materialidad que la CSRD exige ya a unos 50.000 declarantes. Anclada en el lenguaje de los informes de sus pares, no en los sesgos del modelo.",
        bullets: [
          "Topic modeling sobre frases de informes de la empresa y de sus pares, para que los IRO generados reflejen el alcance del análisis y no el conocimiento genérico del LLM.",
          "Frases de pares agrupadas y resumidas para meter el contexto de todo un tema en un solo prompt: HDBSCAN sobre embeddings Matryoshka (2000→100 dimensiones), UMAP a 5, todo unido con BERTopic.",
          "Pase de calidad: NER con SpanMarker anonimiza fechas, números, organizaciones y productos para que los clústeres se formen por significado, y la deduplicación por Levenshtein por pares elimina los casi duplicados.",
          "Evaluación con humano en el bucle en Argilla, con anotadores ESG del dominio cuyo criterio marca el listón de un IRO utilizable.",
        ] },
      { tag: "GenAI · barreras de seguridad", title: "Inteligencia regulatoria asistida por LLM",
        blurb: "Impulsor de los flujos asistidos por LLM en toda la empresa: diseño, evaluación y puesta en producción de funcionalidades de IA generativa con barreras de seguridad sobre casi 20.000 regulaciones en más de 190 países.",
        bullets: [
          "Recuperación y extracción sobre un corpus regulatorio amplio y multijurisdiccional.",
          "Entrega guiada por evaluación: cada funcionalidad generativa se publica con un arnés de pruebas puntuado.",
          "Orquestación agnóstica al modelo entre GPT, Claude y modelos abiertos vía Bedrock.",
        ] },
      { tag: "MLOps · plataforma", title: "Plataforma ML e infraestructura de evaluación",
        blurb: "La infraestructura de la que dependen los modelos: inferencia serverless, conjuntos de evaluación y etiquetado con humano en el bucle.",
        bullets: [
          "Inferencia ML serverless en AWS y servicios back-end en Python (FastAPI).",
          "MLOps con humano en el bucle usando Argilla; conjuntos de referencia curados para entrenar filtros y evaluar el pipeline.",
          "Estado en JSON sobre almacenamiento de objetos (S3 / Postgres), instrumentado de extremo a extremo.",
        ] },
    ],
    toolkit: [
      { group: "IA / ML", items: ["Orquestación de LLM (GPT, Claude, modelos abiertos)", "DSPy (GEPA, MIPROv2)", "RAG y búsqueda semántica", "XGBoost / scikit-learn", "sentence-transformers / embeddings", "Resolución de entidades y clustering", "Evaluación y métricas"] },
      { group: "Ingeniería / MLOps", items: ["Python", "Airflow", "FastAPI", "AWS (serverless)", "Postgres · S3", "Argilla (humano en el bucle)", "OpenTelemetry", "uv · ruff"] },
    ],
    languages: [
      { name: "Francés", level: "Nativo" }, { name: "Inglés", level: "Fluido · C2" },
      { name: "Español", level: "Fluido · C2" }, { name: "Catalán", level: "Conversacional · B1" },
    ],
    beyond: ["Remote-first, equipos distribuidos", "Entrega guiada por evaluación", "Charlas y talleres internos", "Mentoría y revisión de código"],
  };
})(window);
