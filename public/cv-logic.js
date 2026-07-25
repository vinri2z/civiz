// Page logic for the CV, factored out of index.html so a Node process can call
// the timeline builder and the render-values function without a DOM.
//
// Loaded as a plain blocking script, exactly like public/i18n/*.js, and read
// back off `globalThis.CV_LOGIC`. It deliberately carries no `import`/`export`:
// the dc-runtime evaluates `<script data-dc-script>` through `new Function`,
// which cannot host ESM syntax, and this file has to be readable from both that
// function body and a `node --test` process. Being import-for-side-effect from
// Node works because the source is valid ESM either way.
//
// The pure functions below are the whole of the page's logic. The class that
// `makeComponent` returns holds only what genuinely needs a browser: state,
// lifecycle, observers, and the globe's animation loop.
(function (g) {

  // Below this viewport width the timeline lays out as a single column: the
  // two-sided layout is 840px wide plus padding, so anything narrower would have
  // to be scrolled sideways to be read.
  const NARROW_PX = 900;
  // where the stylesheet's phone media query kicks in, which is also where the
  // sections switch to the tighter horizontal padding
  const PHONE_PX = 760;

  // Everything about a Work-section project that doesn't get translated. Like
  // eduBase/expBase further down, this list is index-parallel to its localized
  // half (L.projects) and shares the Work cards' own top-to-bottom order — the
  // localized copy carries no key of its own to join on.
  // `key` is how anywhere *else* on the page names a project, so the timeline can
  // order and date the projects independently of that card order.
  const PROJECTS = [
    { key: "targets",
      stack: ["Airflow", "DSPy · GEPA / MIPROv2", "XGBoost", "sentence-transformers", "OpenTelemetry"] },
    { key: "iro",
      stack: ["LLMs · RAG", "BERTopic", "HDBSCAN · UMAP", "Matryoshka embeddings", "SpanMarker NER", "Argilla"],
      deck: "https://docs.google.com/presentation/d/1WIWDQmjLTOFRfDwWneReXC0gO98pvPi2hPIbSuEhp_I/preview",
      // the talk this work was presented at, shown wherever the project appears
      logoId: "logo-pycones-vigo", logoSrc: "assets/pycon-es-vigo-logo.png", logoLabel: "PyCon España 2024 · Vigo" },
    { key: "regintel",
      stack: ["RAG", "LLM orchestration", "Bedrock", "Evaluation harnesses"] },
    { key: "platform",
      stack: ["AWS serverless", "FastAPI", "Argilla", "Postgres", "S3"] },
  ];

  function projectIndex(key) {
    const i = PROJECTS.findIndex(p => p.key === key);
    if (i < 0) throw new Error("unknown project key: " + key);
    return i;
  }

  // What an <image-slot> needs from an entry that may or may not carry a logo.
  // `logoLabel` feeds the slot's `placeholder`, its empty-state caption — the
  // education and experience rows pass a name there instead.
  function logoFields(entry) {
    return {
      logoId: entry.logoId || "", logoSrc: entry.logoSrc || "",
      logoLabel: entry.logoLabel || "", showLogo: !!entry.logoSrc,
    };
  }

  // A section anchor that carries enough state to reopen a shared link the
  // same way the sender saw it: current language, plus whatever else (e.g. an
  // expanded project key) the caller passes in `extra`.
  function sectionHref(lang, id, extra) {
    const params = new URLSearchParams({ lang });
    if (extra) Object.entries(extra).forEach(([k, v]) => { if (v) params.set(k, v); });
    return '#' + id + '?' + params.toString();
  }

  // Which language code to render in, given the loaded string blocks and the
  // visitor's and the props' preferences.
  function pickLang(strings, stateLang, propsLang) {
    const c = stateLang || propsLang || 'en';
    return strings[c] ? c : 'en';
  }

  // ctx: { vw, yearScale, showGrid, cardH, lang, goTo }
  // Returns the geometry the template renders, plus `geoItems` — the globe's
  // waypoint list, which used to be stashed on the component as `_geoItems`.
  function buildTimeline(ctx, L) {
    const viewportW = () => ctx.vw || 1200;
    // Phones get a different geometry, not a scaled-down one: the axis moves to
    // the left edge and every card sits to its right in a single column, because
    // 840px of two-sided layout can't be read on a 360px screen.
    const narrow = viewportW() < NARROW_PX;
    // Narrow runs at a coarser time scale on purpose: one column of taller,
    // wrapped cards needs more vertical room per year, or `spread` pushes cards
    // so far from their own bars that the leader lines stop meaning anything.
    const SCALE = narrow ? Math.max(ctx.yearScale ?? 180, 270) : (ctx.yearScale ?? 180);
    const showGrid = ctx.showGrid ?? true;
    const PAD = 30, C = 420, MAXGAP = 2, SKIPPX = 46;
    const BW = narrow ? 12 : 16;
    // Narrow lanes, left to right: education, experience + volunteering, and the
    // one education entry (UPV) that overlaps another. Three lanes is the minimum
    // that keeps every bar visible, since edu/exp/vol all overlap in 2016-2020.
    const EDU_C0 = narrow ? 8 : C - 22, EDU_C1 = narrow ? 40 : C - 48, EXP_L = narrow ? 24 : C + 6;
    // CARD_W mirrors the width the card blocks are given in the markup below —
    // keep the two in step
    const SIDE_PAD = viewportW() < PHONE_PX ? 18 : 32; // the section's own padding
    const innerW = Math.max(276, viewportW() - SIDE_PAD * 2);
    const EDU_CARD_LEFT = narrow ? 56 : 62;
    const EXP_CARD_LEFT = narrow ? 56 : 486;
    // capped so a tablet doesn't get 700px-long lines of card text
    const CARD_W = narrow ? Math.min(innerW - EDU_CARD_LEFT, 520) : 290;
    // where the left-hand column's leader lines start, just clear of those cards
    const LEFT_LEADER_X = EDU_CARD_LEFT + CARD_W + 4;
    // Projects sit on the left, in Education's own lane: a slimmer bar centred on
    // the same line, labels in the same right-aligned card column. The two never
    // overlap vertically — education ends in 2020, the projects start in 2024 —
    // so they share the column instead of each needing one.
    const PROJ_BW = 8, PROJ_L = EDU_C0 + (BW - PROJ_BW) / 2, PROJ_CARD_LEFT = EDU_CARD_LEFT;
    // Each category's minimum vertical footprint, used to push colliding cards
    // apart. Narrow cards wrap into more lines so they need more room than the
    // two-column ones, but only just: every pixel of slack here becomes drift
    // between a card and the bar it belongs to. Volunteering gets its own gap
    // rather than borrowing Experience's — its cards are three short lines, and
    // billing them for a full job card's height pushed them furthest of all.
    const EDU_GAP = narrow ? 180 : 196;
    const EXP_GAP = narrow ? 188 : 172;
    const VOL_GAP = narrow ? 124 : 172;
    const PROJ_GAP = narrow ? 116 : 56;
    // In one column the gap is the card's measured height plus a little air, so a
    // card is only ever pushed off its own bar by as much as its neighbour truly
    // needs. The constants above are the first-paint fallback, before
    // measureCards has run. The two-column layout keeps its fixed gaps: there the
    // cards alternate sides and collisions are rare.
    const H = ctx.cardH || {};
    const BREATH = 18;
    const gapFor = (ck, fallback) => (narrow && H[ck]) ? H[ck] + BREATH : fallback;
    // Cards are right-aligned against the axis only in the two-sided layout; in
    // one column everything reads left-aligned.
    const RIGHT_TEXT = { align: 'right', logoML: 'auto', logoJust: 'flex-end' };
    const LEFT_TEXT = { align: 'left', logoML: '0', logoJust: 'flex-start' };
    const leftColText = narrow ? LEFT_TEXT : RIGHT_TEXT;
    const teal0 = "oklch(0.68 0.085 205)", teal1 = "oklch(0.6 0.1 210)";

    const CITY = {
      valencia: { n: 'València', c: [-0.3763, 39.4699] },
      madrid: { n: 'Madrid', c: [-3.7038, 40.4168] },
      london: { n: 'London', c: [-0.1276, 51.5072] },
      queretaro: { n: 'Querétaro', c: [-100.3899, 20.5888] },
      saclay: { n: 'Paris-Saclay', c: [2.1657, 48.7100] },
      versailles: { n: 'Versailles', c: [2.1301, 48.8014] },
      aix: { n: 'Aix-en-Provence', c: [5.4474, 43.5297] },
      toamasina: { n: 'Toamasina', c: [49.4023, -18.1492] },
      boulajoul: { n: 'Boulajoul', c: [-4.9625, 32.8811] },
    };

    const rawEdu = [
      { a: 2010.67, b: 2013.5 }, { a: 2013.67, b: 2015.5 }, { a: 2015.67, b: 2020.5 }, { a: 2018.67, b: 2020.5 },
    ];
    const rawExp = [
      { a: 2018.0, b: 2018.5 }, { a: 2020.0, b: 2020.5 }, { a: 2020.5, b: 2022.67 }, { a: 2022.67, b: 2026.55 },
    ];
    // the 4L Trophy is a single event: it spans its month so the bar reads as a
    // pill rather than collapsing to zero height
    const rawVol = [
      { a: 2016.5, b: 2016.667 }, { a: 2017.083, b: 2017.167 },
    ];

    // The axis floor is a round year below the earliest entry (Sep 2010) so the
    // 2010 gridline can sit at its true position. Without it, posOf clamps
    // everything at or below the first entry to the same pixel and the 2010 tick
    // lands on top of the 2010.67 one.
    const AXIS_FLOOR = 2010;
    const stops = Array.from(new Set([AXIS_FLOOR].concat(rawEdu.concat(rawExp).concat(rawVol).flatMap(s => [s.a, s.b])))).sort((x, z) => x - z);
    const nodes = [{ d: stops[0], p: 0 }];
    const rawSkips = [];
    let acc = 0;
    for (let i = 1; i < stops.length; i++) {
      const a = stops[i - 1], b = stops[i], span = b - a;
      // the Product Data Scientist stretch (2020.5–2022.67) and everything after
      // it run at 1.3x so the globe travel reads smoothly
      const stretched = (a >= 2020.4 && b <= 2022.75) || a >= 2022.6;
      // the lycée years (2010.67–2013.5) stay at plain scale but are never
      // folded, so the year ticks back to 2010 all stay visible
      const noFold = stretched || (a >= 2010.6 && b <= 2013.55);
      if (span > MAXGAP && !noFold) {
        const h = SCALE * 1.05 + SKIPPX;
        rawSkips.push({ a, b, span });
        acc += h;
      } else {
        acc += span * SCALE * (stretched ? 1.3 : 1);
      }
      nodes.push({ d: b, p: acc });
    }
    const total = acc;

    const posOf = (d) => {
      if (d <= nodes[0].d) return 0;
      for (let i = 1; i < nodes.length; i++) {
        if (d <= nodes[i].d) {
          const n0 = nodes[i - 1], n1 = nodes[i];
          return n0.p + ((d - n0.d) / (n1.d - n0.d)) * (n1.p - n0.p);
        }
      }
      return total;
    };
    const y = (d) => +(PAD + (total - posOf(d))).toFixed(1);
    const seg = (a, b) => ({
      topPx: y(b),
      hPx: +(posOf(b) - posOf(a)).toFixed(1),
      midPx: +(((y(a) + y(b)) / 2)).toFixed(1),
    });

    const fold = (yrs) => {
      const m = Math.round(yrs * 12), Y = Math.floor(m / 12), M = m % 12;
      let out = Y + " " + (Y === 1 ? L.tl.yr1 : L.tl.yrN);
      if (M) out += " " + M + " " + (M === 1 ? L.tl.mo1 : L.tl.moN);
      return out;
    };
    const skips = rawSkips.map(s => ({
      topPx: y(s.b), hPx: +(posOf(s.b) - posOf(s.a)).toFixed(1), label: fold(s.span),
    }));

    const meta = (from, to) => {
      const M = L.tl.months;
      const a = M[from[1] - 1] + " " + from[0];
      // a one-month entry reads as a single date, not as a range or as open-ended
      if (to && to[0] === from[0] && to[1] === from[1]) return a;
      const b = to ? M[to[1] - 1] + " " + to[0] : L.tl.present;
      return a + " – " + b;
    };

    const eduBase = [
      { logoId: "logo-lma", logoSrc: "assets/lycee-militaire-aix-logo.png", showLogo: true, color: teal0, barLeft: EDU_C0,
        from: [2010, 9], to: [2013, 6], cities: [CITY.aix], ...seg(2010.67, 2013.5) },
      { logoId: "logo-ginette", logoSrc: "assets/sainte-genevieve-logo.png", showLogo: true, color: teal0, barLeft: EDU_C0,
        from: [2013, 9], to: [2015, 6], cities: [CITY.versailles], ...seg(2013.67, 2015.5) },
      { logoId: "logo-centrale", logoSrc: "assets/centralesupelec-logo.svg", showLogo: true, color: teal0, barLeft: EDU_C0,
        from: [2015, 9], to: [2020, 6], cities: [CITY.saclay], nudge: 140, ...seg(2015.67, 2020.5) },
      { logoId: "logo-upv", logoSrc: "assets/upv-logo.png", showLogo: true, color: teal1, barLeft: EDU_C1,
        from: [2018, 9], to: [2020, 6], cities: [CITY.valencia], ...seg(2018.67, 2020.5) },
    ];
    const edu = eduBase.map((e, i) => ({
      ...e, ...L.edu[i], meta: meta(e.from, e.to), cardLeft: EDU_CARD_LEFT, cardW: CARD_W,
      ...leftColText, bw: BW, ck: 'edu-' + i, gap: gapFor('edu-' + i, EDU_GAP), i,
      // in one column the CentraleSupélec card no longer has to dodge UPV's
      nudge: narrow ? 0 : e.nudge,
    }));

    const g1 = "oklch(0.75 0.05 150)", g2 = "oklch(0.71 0.09 152)", g3 = "oklch(0.62 0.12 150)", g4 = "oklch(0.53 0.13 150)";
    const expBase = [
      { logoId: "logo-selectra", logoSrc: "assets/selectra-logo.png", showLogo: true, color: g1, barLeft: EXP_L,
        from: [2018, 1], to: [2018, 6], cities: [CITY.madrid], ...seg(2018.0, 2018.5) },
      { logoId: "logo-dm", logoSrc: "assets/datamaran-logo.svg", showLogo: true, color: g2, barLeft: EXP_L,
        from: [2020, 1], to: [2020, 7], cities: [CITY.valencia], ...seg(2020.0, 2020.5) },
      // two cities in one entry, newest first, each with the slice of the entry
      // it actually covers: Querétaro Jul 2020 - Aug 2022, London the tail
      { logoId: "logo-dm", logoSrc: "assets/datamaran-logo.svg", showLogo: true, color: g3, barLeft: EXP_L,
        from: [2020, 7], to: [2022, 9], range: [2020.5, 2022.67],
        cities: [{ ...CITY.london, r: [2022.583, 2022.667] }, { ...CITY.queretaro, r: [2020.5, 2022.583] }],
        ...seg(2020.5, 2022.67) },
      { logoId: "logo-dm", logoSrc: "assets/datamaran-logo.svg", showLogo: true, color: g4, barLeft: EXP_L,
        from: [2022, 9], to: null, cities: [CITY.valencia], ...seg(2022.67, 2026.55) },
    ];
    const exp = expBase.map((e, i) => ({
      ...e, ...L.exp[i], meta: meta(e.from, e.to), cardLeft: EXP_CARD_LEFT, cardW: CARD_W,
      ...LEFT_TEXT, bw: BW, ck: 'exp-' + i, gap: gapFor('exp-' + i, EXP_GAP), i,
    }));

    // Volunteering shares the right-hand column with Experience — nothing else
    // sits there in 2016-2017 — but carries its own amber and its own legend.
    const amber = "oklch(0.72 0.14 62)";
    const volBase = [
      { color: amber, barLeft: EXP_L,
        from: [2016, 7], to: [2016, 8], cities: [CITY.toamasina], ...seg(2016.5, 2016.667) },
      { color: amber, barLeft: EXP_L,
        from: [2017, 2], to: [2017, 2], cities: [CITY.boulajoul], ...seg(2017.083, 2017.167) },
    ];
    const vol = volBase.map((e, i) => ({
      ...e, ...L.vol[i], meta: meta(e.from, e.to), cardLeft: EXP_CARD_LEFT, cardW: CARD_W,
      ...LEFT_TEXT, bw: BW, ck: 'vol-' + i, gap: gapFor('vol-' + i, VOL_GAP), i,
    }));

    // The four Work-section projects, each at the half-year it was built in.
    // That order is the projects' own — it doesn't track the Work section's card
    // order and it leaves a gap in H2 2024 — so every slot names its project by
    // key. Copy still comes from the Work cards (L.projects), which stay the
    // single source of truth for titles; only dates and assets live here.
    const violet = "oklch(0.58 0.15 300)";
    const projBase = [
      { key: "iro", from: [2024, 1], to: [2024, 6], ...seg(2024.0, 2024.5) },
      { key: "platform", from: [2025, 1], to: [2025, 6], ...seg(2025.0, 2025.5) },
      { key: "targets", from: [2025, 7], to: [2025, 12], ...seg(2025.5, 2026.0) },
      { key: "regintel", from: [2026, 1], to: [2026, 6], ...seg(2026.0, 2026.5) },
    ];
    const proj = projBase.map((p, i) => {
      const at = projectIndex(p.key);
      return {
        ...p, title: L.projects[at].title, meta: meta(p.from, p.to),
        ...logoFields(PROJECTS[at]),
        workHref: sectionHref(ctx.lang, 'projects', { p: p.key }),
        onWorkLink: (e) => ctx.goTo(e, 'projects', { p: p.key }),
        color: violet, barLeft: PROJ_L, cardLeft: PROJ_CARD_LEFT, cardW: CARD_W,
        ...leftColText, ck: 'proj-' + i, gap: gapFor('proj-' + i, PROJ_GAP), i,
        // H1 and H2 2025 are adjacent, so inset each bar to leave a visible seam
        topPx: +(p.topPx + 2).toFixed(1), hPx: +(p.hPx - 4).toFixed(1),
      };
    });

    // Cards are placed at their entry's midpoint, then pushed down where they
    // would collide — by the gap the card above needs, since that's the height
    // that has to clear.
    const spread = (arr) => {
      const order = arr.slice().sort((a, b) => a.midPx - b.midPx);
      order.forEach((e, i) => {
        e.cardY = e.midPx + (e.nudge || 0);
        if (i === 0) return;
        const above = order[i - 1];
        if (e.cardY - above.cardY < above.gap) e.cardY = above.cardY + above.gap;
      });
    };
    // Education and Projects share the left-hand column, Experience and
    // Volunteering the right, so each side lays out as one group and cards from
    // different categories can't land on top of each other.
    const leftCol = edu.concat(proj);
    const rightCol = exp.concat(vol);
    // every place-bearing entry, in no particular order — a project carries no
    // city of its own, so it stays out of the globe's waypoint list
    const entries = edu.concat(rightCol);

    // A leader is one 1px div rotated about its left end, which is what lets it
    // slope. It always runs between the same two points: the edge of the bar
    // facing the card, at the bar's own midpoint, and the edge of the card facing
    // the bar, at the card's centre — wherever `spread` (or a nudge) had to move
    // that card to. Both layouts use this: a card that had to be pushed off its
    // own dates is the normal case in one column and the exception in two, but a
    // horizontal rule drawn at the card's height would point at nothing either
    // way. `fromX` may sit to the right of `toX` — for the left-hand column the
    // line runs backwards, and atan2 handles that.
    const leader = (e, fromX, toX, flat, sloped) => {
      const dx = toX - fromX, dy = e.cardY - e.midPx;
      e.leaderLeft = fromX;
      e.leaderTop = e.midPx;
      e.leaderW = +Math.sqrt(dx * dx + dy * dy).toFixed(1);
      e.leaderTf = 'rotate(' + (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(2) + 'deg)';
      // a long diagonal hairline reads much fainter than a short flat one
      e.leaderCol = Math.abs(dy) > 6 ? sloped : flat;
    };
    const HAIR = 'oklch(0.86 0.02 150)', HAIR_SLOPE = 'oklch(0.78 0.03 150)';
    const PHAIR = 'oklch(0.86 0.03 300)', PHAIR_SLOPE = 'oklch(0.76 0.07 300)';

    if (narrow) {
      // one column: every card competes with every other for vertical room, and
      // every leader points rightward out of its lane
      spread(leftCol.concat(rightCol));
      edu.concat(rightCol).forEach(e => leader(e, e.barLeft + BW, EDU_CARD_LEFT - 2, HAIR, HAIR_SLOPE));
      proj.forEach(p => leader(p, PROJ_L + PROJ_BW, PROJ_CARD_LEFT - 2, PHAIR, PHAIR_SLOPE));
    } else {
      // two columns: the left-hand ones point back leftward to their own cards
      spread(leftCol);
      spread(rightCol);
      edu.forEach(e => leader(e, e.barLeft, LEFT_LEADER_X, HAIR, HAIR_SLOPE));
      rightCol.forEach(e => leader(e, EXP_L + BW, EXP_CARD_LEFT - 2, HAIR, HAIR_SLOPE));
      proj.forEach(p => leader(p, PROJ_L, LEFT_LEADER_X, PHAIR, PHAIR_SLOPE));
    }

    // Where each of an entry's cities sits inside the entry's slice of globe
    // scroll, newest first. Entries with no declared sub-ranges keep the old
    // even split. A city whose real sub-range is a sliver of the entry would
    // flash past unreadably, so every city is floored at MIN_CITY_SHARE and the
    // deficit is billed to the cities that have room.
    const MIN_CITY_SHARE = 0.25;
    const cityOffsets = (e) => {
      const n = e.cities.length;
      if (!e.range || n < 2 || e.cities.some(c => !c.r)) return e.cities.map((_, k) => k / n);
      const total = e.range[1] - e.range[0] || 1;
      let shares = e.cities.map(c => Math.max(0, (c.r[1] - c.r[0]) / total));
      const sum = shares.reduce((a, b) => a + b, 0) || 1;
      shares = shares.map(s => s / sum);
      const deficit = shares.reduce((d, s) => d + Math.max(0, MIN_CITY_SHARE - s), 0);
      const spare = shares.reduce((t, s) => t + Math.max(0, s - MIN_CITY_SHARE), 0);
      if (deficit > 0 && spare > 0) {
        shares = shares.map(s => s < MIN_CITY_SHARE ? MIN_CITY_SHARE : s - (s - MIN_CITY_SHARE) * (deficit / spare));
      }
      let at = 0;
      return shares.map(s => { const o = at; at += s; return o; });
    };

    // visual order, newest at top → globe waypoint order
    const all = entries.slice().sort((a, b) => a.cardY - b.cardY);
    all.forEach((e, k) => { e.geoI = k; });
    const geoItems = all.map(e => ({ cities: e.cities, cityOffs: cityOffsets(e) }));

    const marks = entries.map(e => ({ topPx: e.topPx, leftPx: e.barLeft + BW / 2, color: e.color }));

    const inFold = (yr) => rawSkips.some(s => yr > s.a + 0.08 && yr < s.b - 0.08);
    const years = [];
    for (let yr = AXIS_FLOOR; yr <= 2026; yr++) if (!inFold(yr)) years.push({ label: String(yr), topPx: y(yr) });

    const lowest = Math.max(y(stops[0]), ...entries.concat(proj).map(e => e.cardY));
    // every category's bar is drawn the same way, so they render from one list
    return {
      totalPx: +(lowest + 110).toFixed(1), showGrid, years, bars: entries, edu, exp, vol, proj, marks, skips,
      hasFolds: skips.length > 0,
      // geometry the markup can't derive on its own
      wrapW: narrow ? '100%' : '840px',
      axisLeft: narrow ? '1px' : '50%', axisML: narrow ? '0' : '-1px',
      yearLeft: narrow ? '0px' : '50%', yearTf: narrow ? 'translate(0,-50%)' : 'translate(-50%,-50%)',
      // in one column a full-width gridline would strike through the card text,
      // so it stops at the lanes it labels
      gridW: narrow ? (EDU_CARD_LEFT - 8) + 'px' : '100%',
      // the globe's waypoints, ordered by the visual position `spread` settled on
      geoItems,
    };
  }

  const FLAG = {
    en: [
      "linear-gradient(to bottom, transparent 40%, #C8102E 40%, #C8102E 60%, transparent 60%)",
      "linear-gradient(to right, transparent 37%, #C8102E 37%, #C8102E 63%, transparent 63%)",
      "linear-gradient(to bottom, transparent 31%, #fff 31%, #fff 69%, transparent 69%)",
      "linear-gradient(to right, transparent 27%, #fff 27%, #fff 73%, transparent 73%)",
      "linear-gradient(45deg, transparent 45%, #C8102E 45%, #C8102E 55%, transparent 55%)",
      "linear-gradient(-45deg, transparent 45%, #C8102E 45%, #C8102E 55%, transparent 55%)",
      "linear-gradient(45deg, transparent 38%, #fff 38%, #fff 62%, transparent 62%)",
      "linear-gradient(-45deg, transparent 38%, #fff 38%, #fff 62%, transparent 62%)",
    ].join(","),
    fr: "linear-gradient(to right, #002395 0 33.33%, #fff 33.33% 66.66%, #ED2939 66.66% 100%)",
    es: "linear-gradient(to bottom, #AA151B 0 25%, #F1BF00 25% 75%, #AA151B 75% 100%)",
    ca: "repeating-linear-gradient(to bottom, #FCDD09 0 11.11%, #DA121A 11.11% 22.22%)",
  };
  const flagStyle = (c) => ({
    width: "100%", height: "100%", display: "block",
    backgroundColor: c === "en" ? "#012169" : "transparent",
    backgroundImage: FLAG[c],
  });

  const LINKS = {
    email: "vincnt.rizz@gmail.com",
    linkedin: "https://www.linkedin.com/in/vincent-rizzo-ba043a109/",
    github: "https://github.com/vinri2z",
  };

  // ctx: { strings, stateLang, propsLang, expanded, langOpen, vw, yearScale,
  //        showGrid, cardH, toggle, setLang, goTo, onLangToggle }
  // The flat object the template renders against. `tl.geoItems` is the globe's
  // waypoint list; the component copies it onto itself for the animation loop.
  function renderVals(ctx) {
    const S = ctx.strings;
    const code = pickLang(S, ctx.stateLang, ctx.propsLang);
    const t = S[code];

    const profile = { links: { ...LINKS } };

    const expanded = ctx.expanded || {};
    const projects = t.projects.map((p, i) => {
      const open = !!expanded[i];
      const card = PROJECTS[i];
      return {
        ...p,
        stack: card.stack,
        open,
        link: card.deck || "",
        linkLabel: card.deck ? t.work.deck : "",
        ...logoFields(card),
        toggleLabel: open ? t.work.hide : t.work.show,
        onToggle: () => ctx.toggle(i),
        timelineHref: sectionHref(code, 'experience', { p: card.key }),
        onTimelineLink: (e) => ctx.goTo(e, 'experience', { p: card.key }),
      };
    });

    const langs = ["en", "fr", "es", "ca"].map(c => ({
      code: S[c].code,
      label: S[c].label,
      mark: c === code ? "●" : "○",
      flag: flagStyle(c),
      onPick: () => ctx.setLang(c),
    }));

    const tl = buildTimeline({
      vw: ctx.vw, yearScale: ctx.yearScale, showGrid: ctx.showGrid,
      cardH: ctx.cardH, lang: code, goTo: ctx.goTo,
    }, t);

    // Shareable permalinks for the nav bar and each section's own header —
    // clicking either copies/navigates to a link that restores this language.
    const hrefAbout = sectionHref(code, 'about');
    const hrefWork = sectionHref(code, 'projects');
    const hrefSkills = sectionHref(code, 'skills');
    const hrefExperience = sectionHref(code, 'experience');
    const hrefContact = sectionHref(code, 'contact');
    const onNavAbout = (e) => ctx.goTo(e, 'about');
    const onNavWork = (e) => ctx.goTo(e, 'projects');
    const onNavSkills = (e) => ctx.goTo(e, 'skills');
    const onNavExperience = (e) => ctx.goTo(e, 'experience');
    const onNavContact = (e) => ctx.goTo(e, 'contact');

    return {
      profile, t, projects, tl, langs, curFlag: flagStyle(code),
      toolkit: t.toolkit,
      languages: t.languages,
      beyond: t.beyond,
      langOpen: !!ctx.langOpen,
      onLangToggle: ctx.onLangToggle,
      hrefAbout, hrefWork, hrefSkills, hrefExperience, hrefContact,
      onNavAbout, onNavWork, onNavSkills, onNavExperience, onNavContact,
    };
  }

  // The browser half. Everything here needs a document, a window, or the
  // dc-runtime's own state machine; the logic it draws on lives above.
  function makeComponent(DCLogic) {
    return class Component extends DCLogic {
      NARROW_PX = NARROW_PX;
      PHONE_PX = PHONE_PX;
      PROJECTS = PROJECTS;

      state = {
        expanded: {},
        langOpen: false,
        lang: (typeof localStorage !== 'undefined' && localStorage.getItem('cv-lang')) || null,
        vw: typeof window !== 'undefined' ? window.innerWidth : 1200,
        cardH: {},
      };

      viewportW() {
        return this.state.vw || 1200;
      }

      // How far apart the single-column timeline has to hold two cards is just how
      // tall they are, which depends on the language and on how narrowly the text
      // wraps. Rather than guess per category, measure the rendered cards and feed
      // the heights back into the next layout pass; the constants in buildTimeline
      // are only the fallback for the first paint.
      measureCards() {
        if (this._dead) return;
        const next = {};
        document.querySelectorAll('[data-card-h]').forEach(el => {
          next[el.dataset.cardH] = Math.round(el.getBoundingClientRect().height);
        });
        const cur = this.state.cardH || {};
        const keys = Object.keys(next);
        const same = keys.length === Object.keys(cur).length && keys.every(k => cur[k] === next[k]);
        if (!same) this.setState({ cardH: next });
      }

      logoFields(entry) {
        return logoFields(entry);
      }

      toggle(i) {
        this.setState(s => ({ expanded: { ...s.expanded, [i]: !s.expanded[i] } }));
      }

      sectionHref(id, extra) {
        return sectionHref(this.lang(), id, extra);
      }

      // The fragment isn't a bare id (it carries a query string too), so the
      // browser won't auto-scroll to it — every section link goes through here
      // instead of relying on native anchor navigation.
      goTo(e, id, extra) {
        if (e) e.preventDefault();
        history.pushState(null, '', this.sectionHref(id, extra));
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Restores a shared link's state on load: `#<section>?lang=..&p=<projectKey>`.
      applySharedHash() {
        const raw = location.hash.slice(1);
        if (!raw) return;
        const qi = raw.indexOf('?');
        const id = qi >= 0 ? raw.slice(0, qi) : raw;
        const params = new URLSearchParams(qi >= 0 ? raw.slice(qi + 1) : '');
        const lang = params.get('lang');
        if (lang && this.getStrings()[lang]) this.setLang(lang);
        const key = params.get('p');
        const i = key ? PROJECTS.findIndex(p => p.key === key) : -1;
        if (i >= 0) this.setState(s => ({ expanded: { ...s.expanded, [i]: true } }));
        if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 60);
      }

      setLang(code) {
        try { localStorage.setItem('cv-lang', code); } catch (e) {}
        document.documentElement.lang = code === 'en' ? 'en-GB' : code;
        this.setState({ lang: code, langOpen: false });
      }

      lang() {
        return pickLang(this.getStrings(), this.state.lang, this.props.lang);
      }

      componentDidMount() {
        document.documentElement.lang = this.lang() === 'en' ? 'en-GB' : this.lang();

        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              const el = e.target;
              const d = (parseFloat(el.dataset.i) || 0) * 75;
              el.style.transitionDelay = d + 'ms';
              el.style.opacity = '1';
              el.style.transform = 'none';
              io.unobserve(el);
            }
          });
        }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

        const wire = () => document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
        wire();
        this._io = io;

        const secs = ['about', 'projects', 'skills', 'experience', 'contact'];
        const onScroll = () => {
          const h = document.documentElement;
          const max = h.scrollHeight - h.clientHeight || 1;
          const p = Math.min(1, Math.max(0, h.scrollTop / max));
          const bar = document.getElementById('cv-progress');
          if (bar) bar.style.transform = 'scaleX(' + p + ')';
          document.querySelectorAll('[data-parallax]').forEach(el => {
            const s = parseFloat(el.dataset.parallax) || 0.1;
            const base = el.dataset.baseX ? 'translateX(' + el.dataset.baseX + ') ' : '';
            el.style.transform = base + 'translateY(' + (window.scrollY * s) + 'px)';
          });
          let cur = 'top';
          secs.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top < 220) cur = id;
          });
          document.querySelectorAll('[data-nav]').forEach(a => {
            const on = a.dataset.nav === cur;
            if (a.dataset.nav === 'top') return;
            a.style.color = on ? 'oklch(0.44 0.11 150)' : 'oklch(0.5 0.02 150)';
            a.style.opacity = on ? '1' : '0.7';
          });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        this._onScroll = onScroll;
        onScroll();

        const onDoc = (e) => {
          if (!this.state.langOpen) return;
          if (e.target.closest && e.target.closest('[data-lang-menu]')) return;
          this.setState({ langOpen: false });
        };
        document.addEventListener('click', onDoc);
        this._onDoc = onDoc;

        // The timeline is laid out in pixels from the viewport width, so a resize or
        // a rotation has to re-render it. Coalesced to one setState per frame.
        const onVW = () => {
          if (this._vwRaf) return;
          this._vwRaf = requestAnimationFrame(() => {
            this._vwRaf = 0;
            if (!this._dead && window.innerWidth !== this.state.vw) this.setState({ vw: window.innerWidth });
          });
        };
        window.addEventListener('resize', onVW);
        this._onVW = onVW;

        this._t = setTimeout(wire, 400);
        if (this.props.showGlobe ?? true) this.initGlobe();

        this.measureCards();

        this.applySharedHash();
        const onHash = () => this.applySharedHash();
        window.addEventListener('hashchange', onHash);
        this._onHash = onHash;
      }

      // A language switch or a resize re-wraps the cards, so their heights — and the
      // gaps derived from them — have to be taken again.
      componentDidUpdate() {
        this.measureCards();
      }

      componentWillUnmount() {
        this._dead = true;
        if (this._io) this._io.disconnect();
        if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
        if (this._onResize) window.removeEventListener('resize', this._onResize);
        if (this._onVW) window.removeEventListener('resize', this._onVW);
        if (this._vwRaf) cancelAnimationFrame(this._vwRaf);
        if (this._onDoc) document.removeEventListener('click', this._onDoc);
        if (this._onHash) window.removeEventListener('hashchange', this._onHash);
        if (this._raf) cancelAnimationFrame(this._raf);
        if (this._t) clearTimeout(this._t);
      }

      // Globe locked to the timeline: the card nearest the viewport centre owns the dot.
      async initGlobe() {
        const canvas = document.getElementById('globe-canvas');
        if (!canvas || !window.requestAnimationFrame) return;

        const ready = await new Promise(res => {
          if (window.d3 && window.topojson) return res(true);
          const iv = setInterval(() => { if (window.d3 && window.topojson) { clearInterval(iv); res(true); } }, 80);
          setTimeout(() => { clearInterval(iv); res(!!(window.d3 && window.topojson)); }, 15000);
        });
        if (!ready || this._dead) return;

        let land;
        try {
          const r = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json');
          const topo = await r.json();
          land = window.topojson.feature(topo, topo.objects.countries);
        } catch (err) { return; }
        if (this._dead) return;

        const d3 = window.d3;
        const ctx = canvas.getContext('2d');
        const graticule = d3.geoGraticule10();
        const projection = d3.geoOrthographic().clipAngle(90).precision(0.3);
        const path = d3.geoPath(projection, ctx);
        const ease = t => t * t * (3 - 2 * t);

        let W = 0, H = 0, dpr = 1;
        const resize = () => {
          dpr = Math.min(window.devicePixelRatio || 1, 2);
          W = canvas.clientWidth; H = canvas.clientHeight;
          canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          // NARROW_PX: wherever the timeline is one full-width column, its cards sit
          // right on top of the globe, so the globe centres up and recedes
          const nar = W < this.NARROW_PX;
          const R = Math.max(240, Math.min(W, H) * (nar ? 0.52 : 0.46));
          projection.scale(R).translate([nar ? W * 0.5 : W * 0.68, H * 0.52]);
          canvas.style.opacity = nar ? '0.34' : '0.62';
        };
        resize();
        window.addEventListener('resize', resize);
        this._onResize = resize;

        // flat waypoint list: item i owns [i, i+1), its cities placed inside it at
        // the offsets buildTimeline worked out from their date sub-ranges
        const flat = () => {
          const items = this._geoItems || [];
          const out = [];
          items.forEach((it, i) => {
            const n = it.cities.length;
            it.cities.forEach((c, k) => out.push({ t: i + ((it.cityOffs && it.cityOffs[k]) ?? k / n), c: c.c, n: c.n }));
          });
          return out;
        };

        // continuous position (in item index space) of the card nearest the viewport centre
        const scan = () => {
          const nodes = Array.from(document.querySelectorAll('[data-geo-i]')).map(el => {
            const r = el.getBoundingClientRect();
            return { i: +el.dataset.geoI, y: r.top + r.height / 2 };
          }).sort((a, b) => a.i - b.i);
          if (!nodes.length) return 0;
          const c = window.innerHeight * 0.5;
          if (c <= nodes[0].y) return nodes[0].i;
          const last = nodes[nodes.length - 1];
          if (c >= last.y) return last.i;
          for (let i = 1; i < nodes.length; i++) {
            if (c <= nodes[i].y) {
              const a = nodes[i - 1], b = nodes[i];
              return a.i + (c - a.y) / (b.y - a.y || 1) * (b.i - a.i);
            }
          }
          return last.i;
        };

        const target = () => {
          const pts = flat();
          if (!pts.length) return { pt: [-0.3763, 39.4699], idx: 0, pts };
          const s = scan();
          if (s <= pts[0].t) return { pt: pts[0].c, idx: 0, pts };
          const L = pts.length - 1;
          if (s >= pts[L].t) return { pt: pts[L].c, idx: L, pts };
          for (let i = 1; i <= L; i++) {
            if (s <= pts[i].t) {
              const a = pts[i - 1], b = pts[i];
              const u = (s - a.t) / (b.t - a.t || 1);
              return { pt: d3.geoInterpolate(a.c, b.c)(ease(u)), idx: u > 0.5 ? i : i - 1, pts };
            }
          }
          return { pt: pts[L].c, idx: L, pts };
        };

        let cur = (this._geoItems && this._geoItems[0] ? this._geoItems[0].cities[0].c.slice() : [-0.3763, 39.4699]);
        let lastIdx = -1, settled = 0;
        const nameEl = document.getElementById('globe-place-name');
        const placeEl = document.getElementById('globe-place');
        resize(); // also sets the canvas opacity, which is what fades the globe in
        if (placeEl) placeEl.style.opacity = '1';

        // The globe only tracks the timeline while the viewport centre is inside it.
        // Everywhere else — hero, about, work, skills above it, contact below — it
        // spins slowly instead of sitting locked on one waypoint.
        const IDLE_SPIN = 0.045; // deg/frame ≈ one turn every two minutes at 60fps
        const onTimeline = () => {
          const sec = document.getElementById('experience');
          if (!sec) return false;
          const r = sec.getBoundingClientRect(), c = window.innerHeight * 0.5;
          return r.top <= c && r.bottom >= c;
        };

        const frame = () => {
          if (this._dead) return;
          const idle = !onTimeline();
          let idx = lastIdx, pts = null;

          if (idle) {
            // carry on from wherever the globe is, so entering and leaving the
            // timeline never snaps
            cur[0] += IDLE_SPIN;
            if (cur[0] > 180) cur[0] -= 360;
            settled = 0;
          } else {
            const t = target();
            pts = t.pts; idx = t.idx;
            let dl = t.pt[0] - cur[0];
            while (dl > 180) dl -= 360;
            while (dl < -180) dl += 360;
            const dp = t.pt[1] - cur[1];
            cur[0] += dl * 0.055; cur[1] += dp * 0.055;
            const moving = Math.abs(dl) > 0.02 || Math.abs(dp) > 0.02;
            if (moving) settled = 0; else settled++;

            if (idx !== lastIdx) {
              lastIdx = idx;
              if (nameEl && pts[idx]) nameEl.textContent = pts[idx].n;
            }
          }

          // the place name means nothing while the globe is free-spinning
          if (placeEl) placeEl.style.opacity = idle ? '0' : '1';

          if (settled < 3) {
            projection.rotate([-cur[0], -cur[1]]);
            ctx.clearRect(0, 0, W, H);

            ctx.beginPath(); path({ type: 'Sphere' });
            ctx.fillStyle = 'oklch(0.955 0.022 190)'; ctx.fill();

            ctx.beginPath(); path(graticule);
            ctx.lineWidth = 0.6; ctx.strokeStyle = 'oklch(0.87 0.03 195)'; ctx.stroke();

            ctx.beginPath(); path(land);
            ctx.fillStyle = 'oklch(0.885 0.055 152)'; ctx.fill();
            ctx.lineWidth = 0.7; ctx.strokeStyle = 'oklch(0.79 0.06 155)'; ctx.stroke();

            ctx.beginPath(); path({ type: 'Sphere' });
            ctx.lineWidth = 1.2; ctx.strokeStyle = 'oklch(0.82 0.05 175)'; ctx.stroke();

            const center = [-projection.rotate()[0], -projection.rotate()[1]];
            const waypoints = pts || flat();
            const active = pts ? waypoints[Math.max(0, Math.min(idx, waypoints.length - 1))] : null;
            const seen = {};
            waypoints.forEach(p => {
              const key = p.c.join(',');
              if (seen[key]) return;
              seen[key] = 1;
              if (d3.geoDistance(p.c, center) > 1.52) return;
              const xy = projection(p.c);
              if (!xy) return;
              const on = active && key === active.c.join(',');
              ctx.beginPath(); ctx.arc(xy[0], xy[1], on ? 5.5 : 3, 0, 6.2832);
              ctx.fillStyle = on ? 'oklch(0.58 0.14 150)' : 'oklch(0.74 0.07 155)'; ctx.fill();
              if (on) {
                ctx.beginPath(); ctx.arc(xy[0], xy[1], 13, 0, 6.2832);
                ctx.lineWidth = 1.4; ctx.strokeStyle = 'oklch(0.62 0.13 150 / 0.5)'; ctx.stroke();
              }
            });
          }
          this._raf = requestAnimationFrame(frame);
        };
        this._raf = requestAnimationFrame(frame);
      }

      buildTimeline(L) {
        return buildTimeline({
          vw: this.viewportW(), yearScale: this.props.yearScale,
          showGrid: this.props.showGrid, cardH: this.state.cardH,
          lang: this.lang(), goTo: (e, id, extra) => this.goTo(e, id, extra),
        }, L);
      }

      getStrings() {
        if (this._STR) return this._STR;
        // Localized copy lives in public/i18n/<lang>.js, loaded as plain blocking
        // scripts from <head>; each file merges its block into window.CV_I18N.
        this._STR = (typeof window !== "undefined" && window.CV_I18N) || {};
        return this._STR;
      }

      renderVals() {
        const vals = renderVals({
          strings: this.getStrings(),
          stateLang: this.state.lang, propsLang: this.props.lang,
          expanded: this.state.expanded, langOpen: this.state.langOpen,
          vw: this.viewportW(), yearScale: this.props.yearScale,
          showGrid: this.props.showGrid, cardH: this.state.cardH,
          toggle: (i) => this.toggle(i),
          setLang: (c) => this.setLang(c),
          goTo: (e, id, extra) => this.goTo(e, id, extra),
          onLangToggle: (e) => {
            if (e) e.stopPropagation();
            this.setState(s => ({ langOpen: !s.langOpen }));
          },
        });
        // the globe's animation loop reads its waypoints off the component
        this._geoItems = vals.tl.geoItems;
        return vals;
      }
    };
  }

  g.CV_LOGIC = {
    NARROW_PX, PHONE_PX, PROJECTS,
    projectIndex, logoFields, sectionHref, pickLang,
    buildTimeline, renderVals, flagStyle, makeComponent,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
