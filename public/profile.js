// The profile document: the one contract between reading somebody's data and
// drawing their page.
//
// Everything downstream of an importer knows only this shape, so a future
// importer for a different source plugs in here. It is versioned because it is a
// file real people keep on disk and re-upload months later.
//
// Two decisions in the shape are load-bearing:
//
//   * Dates are year-and-month, never a timestamp. The timeline works in
//     fractional years and labels month-year; a full date would be precision the
//     source data does not have.
//   * A place is a name plus coordinates plus an optional date sub-range within
//     its entry. The sub-range is what makes one role spanning two cities move
//     the globe at the right scroll position instead of splitting the role
//     evenly.
//
// Loaded the same way as cv-logic.js — a plain blocking script that merges into
// globalThis — so the browser and a Node test process read the same file.
(function (g) {

  const { buildTimeline, sectionHref, pickLang, flagStyle } = g.CV_LOGIC;

  // Bump when a change would make an older document render wrongly rather than
  // just incompletely, and add a step to MIGRATIONS below.
  const PROFILE_VERSION = 1;

  // version N -> N+1. A document from before versioning carried no `version` at
  // all; that is treated as 0.
  const MIGRATIONS = {
    // 0 -> 1: the first shape that was ever written down. Earlier drafts stored a
    // single `location` string per entry instead of a places list, and a `date`
    // string instead of year-and-month.
    0: (doc) => ({
      ...doc,
      version: 1,
      entries: (doc.entries || []).map(e => {
        const out = { ...e };
        if (out.location && !out.places) {
          out.places = out.coords
            ? [{ name: out.location, coords: out.coords }]
            : [];
        }
        delete out.location;
        delete out.coords;
        return out;
      }),
    }),
  };

  class ProfileError extends Error {}

  // Accepts this version, migrates known older ones forward, and refuses an
  // unknown future one rather than producing a subtly wrong page.
  function migrateProfile(doc) {
    if (!doc || typeof doc !== 'object') {
      throw new ProfileError('That is not a profile document.');
    }
    let v = doc.version ?? 0;
    if (typeof v !== 'number' || !Number.isInteger(v) || v < 0) {
      throw new ProfileError(`Profile version "${doc.version}" is not a version number.`);
    }
    if (v > PROFILE_VERSION) {
      throw new ProfileError(
        `This profile was written by a newer version of the generator ` +
        `(document version ${v}, this build understands up to ${PROFILE_VERSION}). ` +
        `Update the page, or export again from the version that made it.`);
    }
    let out = doc;
    while (v < PROFILE_VERSION) {
      const step = MIGRATIONS[v];
      if (!step) throw new ProfileError(`No migration from profile version ${v}.`);
      out = step(out);
      v = out.version;
    }
    return out;
  }

  // year-and-month to the fractional year the timeline works in. A start is the
  // first instant of its month, an end the last.
  const startOf = (d) => d.y + (d.m - 1) / 12;
  const endOf = (d) => d.y + d.m / 12;

  // A place's optional sub-range, as the fractional-year pair the globe's
  // city-offset maths wants. Absent means "this place covers the whole entry",
  // which is the even-split case.
  function placeRange(p) {
    if (!p.range || !p.range.start || !p.range.end) return null;
    return [startOf(p.range.start), endOf(p.range.end)];
  }

  // How each lane's card names things. The document is uniform — every entry has
  // a title and an organisation — but the markup reads different fields per lane,
  // because a school card leads with the school and a job card leads with the
  // role.
  const CARD_FIELDS = {
    education: (e) => ({ name: e.org, sub: e.title }),
    volunteering: (e) => ({ name: e.org, sub: e.title }),
    experience: (e) => ({ role: e.title, org: e.org, note: e.note || '' }),
    project: (e) => ({ title: e.title }),
  };

  // The document's entries in the shape buildTimeline takes. Hidden entries are
  // dropped here, which is what makes them vanish from the timeline, the globe
  // and the year-tick range in one place rather than three.
  function profileEntries(doc, opts) {
    const lang = opts?.lang || 'en';
    const goTo = opts?.goTo || (() => {});
    const workByKey = {};
    (doc.work || []).forEach(w => { workByKey[w.key] = w; });

    return (doc.entries || []).filter(e => !e.hidden).map(e => {
      const places = e.places || [];
      const card = (CARD_FIELDS[e.kind] || CARD_FIELDS.experience)(e);
      const out = {
        kind: e.kind,
        from: [e.start.y, e.start.m],
        to: e.end ? [e.end.y, e.end.m] : null,
        // Places carry their own sub-ranges, so the globe's offsets come from the
        // document rather than being guessed by the renderer.
        cities: places
          .filter(p => Array.isArray(p.coords) && p.coords.length === 2)
          .map(p => {
            const r = placeRange(p);
            return r ? { n: p.name, c: p.coords, r } : { n: p.name, c: p.coords };
          }),
        // the label under a card, which names every place whether or not it could
        // be put on the globe
        place: e.placeLabel || places.map(p => p.name).join(' · '),
        ...card,
        hidden: false,
        stretch: !!e.stretch,
        noFoldBefore: !!e.noFoldBefore,
        sublane: e.sublane || 0,
      };
      // An entry declaring two or more places by sub-range needs its own span on
      // record for the offsets to be shares of something.
      if (out.cities.some(c => c.r)) {
        out.range = [startOf(e.start), e.end ? endOf(e.end) : (opts?.now ?? startOf(e.start))];
      }
      const logo = e.logo || workByKey[e.key]?.logo;
      if (logo) {
        out.logoId = logo.id || ('logo-' + (e.key || e.org || '').toLowerCase().replace(/\W+/g, '-'));
        out.logoSrc = logo.src;
        out.logoLabel = logo.label || e.org || '';
        out.showLogo = true;
      }
      if (e.kind === 'project') {
        const w = workByKey[e.key] || {};
        out.key = e.key;
        out.title = w.title || e.title || '';
        out.workHref = sectionHref(lang, 'projects', { p: e.key });
        out.onWorkLink = (ev) => goTo(ev, 'projects', { p: e.key });
      }
      if (e.nudge) out.nudge = e.nudge;
      return out;
    });
  }

  // The structural copy a page needs from the i18n block, with the visitor's own
  // prose laid over it. Their About text, role titles and notes are passed
  // through untranslated — picking a language changes the page's furniture, not
  // the visitor's words.
  function pageStrings(doc, strings, code) {
    const base = strings[code];
    const id = doc.identity || {};
    return {
      ...base,
      hero: {
        ...base.hero,
        loc: id.location ?? base.hero.loc,
        pron: id.pronouns ?? base.hero.pron,
        title: id.headline ?? base.hero.title,
        tag: id.tag ?? base.hero.tag,
        summary: id.summary ?? id.about ?? base.hero.summary,
      },
      about: {
        ...base.about,
        h1: id.aboutLead ?? base.about.h1,
        hAcc: id.aboutAccent ?? base.about.hAcc,
        h2: id.aboutTail ?? base.about.h2,
        stat: id.statLabel ?? base.about.stat,
        body: id.about ?? base.about.body,
      },
      ct: {
        ...base.ct,
        ...(id.contact || {}),
      },
    };
  }

  // A name split for the hero's two lines. Everything after the first word goes
  // on the second line, so a double-barrelled surname stays together.
  function splitName(name) {
    const parts = (name || '').trim().split(/\s+/);
    if (parts.length < 2) return { nameLine1: name || '', nameLine2: '' };
    return { nameLine1: parts[0], nameLine2: parts.slice(1).join(' ') };
  }

  // The flat object the page template renders against, built from a profile
  // document instead of from the author's own data. Same shape as
  // CV_LOGIC.renderVals returns, so one template draws both.
  function profileRenderVals(doc, strings, opts) {
    const d = migrateProfile(doc);
    const settings = d.settings || {};
    const code = pickLang(strings, settings.lang, 'en');
    const t = pageStrings(d, strings, code);
    const id = d.identity || {};
    const expanded = opts?.expanded || {};
    const goTo = opts?.goTo || (() => {});
    const now = settings.now ?? opts?.now;

    const projects = (d.work || []).map((w, i) => {
      const open = !!expanded[i];
      return {
        tag: w.tag || '',
        title: w.title || '',
        blurb: w.blurb || '',
        bullets: w.bullets || [],
        stack: w.stack || [],
        open,
        link: w.link || '',
        linkLabel: w.link ? (w.linkLabel || t.work.deck) : '',
        logoId: w.logo?.id || '',
        logoSrc: w.logo?.src || '',
        logoLabel: w.logo?.label || '',
        showLogo: !!w.logo?.src,
        toggleLabel: open ? t.work.hide : t.work.show,
        onToggle: () => opts?.toggle?.(i),
        timelineHref: sectionHref(code, 'experience', { p: w.key }),
        onTimelineLink: (e) => goTo(e, 'experience', { p: w.key }),
      };
    });

    const tl = buildTimeline({
      entries: profileEntries(d, { lang: code, goTo, now }),
      vw: opts?.vw ?? 1440,
      yearScale: settings.yearScale,
      showGrid: settings.showGrid,
      cardH: opts?.cardH || {},
      now,
    }, t);

    const langs = ['en', 'fr', 'es', 'ca'].filter(c => strings[c]).map(c => ({
      code: strings[c].code,
      label: strings[c].label,
      mark: c === code ? '●' : '○',
      flag: flagStyle(c),
      onPick: () => opts?.setLang?.(c),
    }));

    return {
      identity: {
        fullName: id.name || '',
        ...splitName(id.name),
        stat: id.stat ?? '',
        photo: id.photo || '',
      },
      profile: { links: { email: '', linkedin: '', github: '', ...(id.links || {}) } },
      t, projects, tl, langs, curFlag: flagStyle(code),
      toolkit: (d.skills || []).map(s => ({ group: s.group, items: s.items || [] })),
      languages: d.languages || [],
      beyond: d.beyond || [],
      langOpen: !!opts?.langOpen,
      onLangToggle: opts?.onLangToggle || (() => {}),
      hrefAbout: sectionHref(code, 'about'),
      hrefWork: sectionHref(code, 'projects'),
      hrefSkills: sectionHref(code, 'skills'),
      hrefExperience: sectionHref(code, 'experience'),
      hrefContact: sectionHref(code, 'contact'),
      onNavAbout: (e) => goTo(e, 'about'),
      onNavWork: (e) => goTo(e, 'projects'),
      onNavSkills: (e) => goTo(e, 'skills'),
      onNavExperience: (e) => goTo(e, 'experience'),
      onNavContact: (e) => goTo(e, 'contact'),
      // whether the page draws a globe at all
      showGlobe: settings.showGlobe ?? true,
      // the globe's pill before the first frame runs
      firstPlaceName: tl.geoItems[0]?.cities[0]?.n || '',
    };
  }

  g.CV_PROFILE = {
    PROFILE_VERSION, ProfileError, migrateProfile,
    profileEntries, profileRenderVals, pageStrings, splitName,
    startOf, endOf,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
