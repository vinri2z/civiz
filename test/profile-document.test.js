// The profile document contract, proven against somebody who is not the author.
//
// The fixture differs from the author's history in every way that matters: it
// starts in 1996 rather than 2010, has no volunteering lane, carries a folded gap,
// spans one role across two cities by declared sub-range, has one role with no
// place at all, and has an entry marked hidden.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import '../public/i18n/en.js';
import '../public/i18n/fr.js';
import '../public/cv-logic.js';
import '../public/profile.js';
import '../public/render-page.js';
import '../public/generate.js';

const { migrateProfile, profileEntries, profileRenderVals, ProfileError, PROFILE_VERSION } = globalThis.CV_PROFILE;
const { renderProfilePage } = globalThis.CV_GENERATE;
const STRINGS = globalThis.CV_I18N;
const EN = STRINGS.en;

const here = new URL('.', import.meta.url);
const read = (p) => readFileSync(new URL(p, here), 'utf-8');
const DOC = () => JSON.parse(read('fixtures/hydrologist.profile.json'));
const TEMPLATE = read('../public/index.html');

const page = (doc, opts) => renderProfilePage(doc ?? DOC(), {
  template: TEMPLATE, strings: STRINGS, ...opts,
});
const vals = (doc, opts) => profileRenderVals(doc ?? DOC(), STRINGS, { now: 2026.5, ...opts });

test('the document shape covers identity, entries, work, skills, languages and settings', () => {
  const d = DOC();
  for (const k of ['version', 'identity', 'entries', 'work', 'skills', 'languages', 'settings']) {
    assert.ok(d[k] !== undefined, `document has ${k}`);
  }
  assert.equal(d.version, PROFILE_VERSION);
});

test('every entry carries a kind, a year-and-month start, an optional end and a places list', () => {
  for (const e of DOC().entries) {
    assert.ok(['education', 'experience', 'volunteering', 'project'].includes(e.kind), e.kind);
    assert.equal(typeof e.start.y, 'number');
    assert.equal(typeof e.start.m, 'number');
    assert.ok(e.end === null || (typeof e.end.y === 'number' && typeof e.end.m === 'number'));
    // no timestamps anywhere: a date is exactly two numbers
    assert.deepEqual(Object.keys(e.start).sort(), ['m', 'y']);
    if (e.end) assert.deepEqual(Object.keys(e.end).sort(), ['m', 'y']);
    if (e.kind !== 'project') assert.ok(Array.isArray(e.places), 'places is a list');
  }
});

test('a place is a name, coordinates and an optional sub-range', () => {
  const twoCity = DOC().entries.find(e => (e.places || []).length === 2);
  assert.ok(twoCity, 'the fixture has a role spanning two cities');
  for (const p of twoCity.places) {
    assert.equal(typeof p.name, 'string');
    assert.equal(p.coords.length, 2);
    assert.deepEqual(Object.keys(p.range).sort(), ['end', 'start']);
    assert.equal(typeof p.range.start.y, 'number');
  }
});

test('one call returns a complete page with every section populated', () => {
  const html = page();
  assert.match(html, /^<!DOCTYPE html>/);
  // hero
  assert.match(html, /Marisol/);
  assert.match(html, /Coastal Hydrologist · Flood Risk Modelling/);
  assert.match(html, /Porto, Portugal/);
  // about
  assert.match(html, /unglamorous half of climate adaptation/);
  assert.match(html, /24\+/);
  assert.match(html, /years modelling water/);
  // work cards, their stacks and their bullets
  assert.match(html, /An open flood atlas for the Iberian Atlantic coast/);
  assert.match(html, /HEC-RAS/);
  assert.match(html, /published with its uncertainty band/);
  // skills and languages
  assert.match(html, /Tide gauge installation/);
  assert.match(html, /Igbo/);
  assert.match(html, /Conversational · B1/);
  // beyond
  assert.match(html, /Uncertainty published, never hidden/);
  // timeline cards
  assert.match(html, /Universidade do Porto/);
  assert.match(html, /Principal Hydrologist/);
  assert.match(html, /Foz Institute/);
  // contact
  assert.match(html, /marisol@example\.org/);
  // structural copy still comes from the i18n block
  assert.match(html, new RegExp(EN.tl.eduLegend));
  assert.match(html, new RegExp(EN.nav.contact));
});

test('the generated page is readable without JavaScript running', () => {
  // Every revealed element starts at opacity 0 and is brought in by the runtime's
  // observer, which a generated file does not carry yet. Without an override the
  // page would be correct markup that renders blank.
  const html = page();
  assert.match(html, /\[data-reveal\]\{opacity:1 !important/);
});

test('a work card’s detail bullets are collapsed in the static render', () => {
  // Recorded, not desired. The static renderer drops event handlers because a
  // file has nothing to bind them to, so the "Show details" button is inert and
  // the bullets behind it are not emitted. Ticket 09 inlines the runtime, which is
  // what makes the download behave like the preview; until then a generated page
  // is a snapshot of the collapsed state.
  const html = page();
  assert.match(html, new RegExp(EN.work.show.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.equal(html.includes('median error 6cm'), false);
  assert.equal(/onclick=/i.test(html), false, 'no dead handler attributes survive');
});

test('the page carries the visitor name in its title and description', () => {
  const html = page();
  assert.match(html, /<title>Marisol Okonkwo-Reyes — Coastal Hydrologist · Flood Risk Modelling<\/title>/);
  assert.match(html, /<meta name="description" content="Hydrologist with twenty-four years/);
});

test('the rendered page contains no placeholder syntax and no unresolved expression', () => {
  const html = page();
  assert.equal(html.includes('{{'), false, 'every expression was substituted');
  assert.equal(html.includes('sc-for'), false);
  assert.equal(html.includes('sc-if'), false);
  assert.equal(html.includes('<x-dc'), false);
  assert.equal(html.includes('hint-placeholder'), false);
});

test('the lane mix is the profile’s own: no volunteering, three projects', () => {
  const tl = vals().tl;
  assert.equal(tl.edu.length, 2);
  assert.equal(tl.exp.length, 4, 'four visible jobs — the fifth is hidden');
  assert.deepEqual(tl.vol, []);
  assert.equal(tl.proj.length, 3);
  assert.deepEqual(tl.legend.map(l => l.label),
    [EN.tl.eduLegend, EN.tl.expLegend, EN.tl.projLegend]);
});

test('the date range is the profile’s own', () => {
  const tl = vals().tl;
  assert.equal(tl.years[0].label, '1996');
  assert.equal(tl.years[tl.years.length - 1].label, '2026');
});

test('an entry with no end renders open-ended, not as ending today', () => {
  const tl = vals().tl;
  const current = tl.exp.find(e => e.org === 'Foz Institute');
  assert.ok(current.meta.endsWith(EN.tl.present), current.meta);
  assert.equal(current.meta.includes('2026'), false, 'no end date is printed');
});

test('two places with sub-ranges give globe offsets, not an even split', () => {
  const tl = vals().tl;
  const twoCity = tl.geoItems.find(it => it.cities.length === 2);
  assert.ok(twoCity);
  assert.deepEqual(twoCity.cities.map(c => c.n), ['Recife', 'Lisbon']);
  const [recife, lisbon] = twoCity.cityOffs;
  assert.equal(recife, 0);
  // Lisbon is Apr 2011 – Dec 2016 of an Apr 2011 – Feb 2019 role, so it owns most
  // of the entry; an even split would have put it at 0.5
  assert.ok(lisbon > 0.2 && lisbon < 0.4, `Lisbon at ${lisbon}, not an even 0.5`);
});

test('an entry with no place is on the timeline and off the globe', () => {
  const tl = vals().tl;
  const remote = tl.exp.find(e => e.org === 'Self-employed');
  assert.ok(remote, 'the remote consultancy is drawn');
  assert.ok(remote.hPx > 0);
  const names = tl.geoItems.flatMap(it => it.cities.map(c => c.n));
  assert.equal(names.includes('Self-employed'), false);
  // Porto twice, Delft twice, Recife, Lisbon — and nothing from the placeless role
  assert.deepEqual(names, ['Porto', 'Recife', 'Lisbon', 'Delft', 'Delft', 'Porto']);
});

test('a hidden entry appears nowhere at all', () => {
  const v = vals();
  const html = page();
  assert.equal(v.tl.exp.some(e => e.org === 'A bar in Porto'), false, 'not on the timeline');
  assert.equal(html.includes('A bar in Porto'), false, 'not in the page');
  assert.equal(html.includes('Not part of the story'), false);
  // and its 2001-2003 dates do not stretch the axis: the axis floor is still the
  // degree's 1996 and nothing was added for it
  const shown = DOC();
  const withIt = { ...shown, entries: shown.entries.map(e => ({ ...e, hidden: false })) };
  const wide = profileRenderVals(withIt, STRINGS, { now: 2026.5 });
  assert.ok(wide.tl.exp.length > v.tl.exp.length, 'unhiding it does add a bar');
});

test('a hidden entry cannot drag the year-tick range', () => {
  const d = DOC();
  d.entries.push({
    kind: 'experience', title: 'Ancient history', org: 'Somewhere',
    hidden: true, start: { y: 1974, m: 1 }, end: { y: 1975, m: 1 }, places: [],
  });
  assert.equal(profileRenderVals(d, STRINGS, { now: 2026.5 }).tl.years[0].label, '1996');
});

test('the settings take effect', () => {
  const d = DOC();
  const base = vals(d).tl;

  d.settings.yearScale = 300;
  const taller = vals(d).tl;
  assert.ok(taller.totalPx > base.totalPx, 'pixels-per-year changes the height');

  d.settings.yearScale = 180;
  d.settings.showGrid = false;
  assert.equal(vals(d).tl.showGrid, false);
  assert.equal(page(d).includes('id="globe-canvas"'), true, 'the globe is still on');

  d.settings.showGlobe = false;
  assert.equal(page(d).includes('id="globe-canvas"'), false, 'globe off removes its canvas');
  assert.equal(page(d).includes('id="globe-place"'), false);
});

test('the interface language switches the furniture but not the prose', () => {
  const d = DOC();
  d.settings.lang = 'fr';
  const html = page(d);
  assert.match(html, new RegExp(STRINGS.fr.tl.eduLegend));
  assert.equal(html.includes(EN.tl.eduLegend + '<'), false, 'no English legend left');
  // the visitor's own words are untouched
  assert.match(html, /unglamorous half of climate adaptation/);
  assert.match(html, /Coastal Hydrologist/);
});

test('an unknown future version is refused with a clear message', () => {
  const d = DOC();
  d.version = PROFILE_VERSION + 5;
  assert.throws(() => migrateProfile(d), (err) => {
    assert.ok(err instanceof ProfileError);
    assert.match(err.message, /newer version of the generator/);
    assert.match(err.message, new RegExp('document version ' + (PROFILE_VERSION + 5)));
    return true;
  });
  // and the refusal happens before any page is produced
  assert.throws(() => page(d), ProfileError);
});

test('a known older version is migrated forward and still generates', () => {
  // the pre-versioning shape: a location string and coordinates on the entry
  // itself instead of a places list
  const old = {
    identity: { name: 'Ana Vieira', headline: 'Surveyor', links: {} },
    entries: [{
      kind: 'experience', title: 'Surveyor', org: 'A firm',
      start: { y: 2015, m: 1 }, end: { y: 2020, m: 1 },
      location: 'Braga', coords: [-8.4265, 41.5454],
    }],
    settings: { lang: 'en' },
  };
  const migrated = migrateProfile(old);
  assert.equal(migrated.version, PROFILE_VERSION);
  assert.deepEqual(migrated.entries[0].places, [{ name: 'Braga', coords: [-8.4265, 41.5454] }]);
  assert.equal('location' in migrated.entries[0], false);

  const html = page(old);
  assert.match(html, /Ana Vieira/);
  assert.match(html, /Braga/);
  const v = profileRenderVals(old, STRINGS, { now: 2026.5 });
  assert.deepEqual(v.tl.geoItems[0].cities.map(c => c.n), ['Braga']);
});

test('something that is not a profile document is refused, not rendered', () => {
  assert.throws(() => migrateProfile(null), ProfileError);
  assert.throws(() => migrateProfile('a string'), ProfileError);
  assert.throws(() => migrateProfile({ version: 'one' }), ProfileError);
});

test('a project card and its timeline entry are joined on the key', () => {
  const v = vals();
  assert.deepEqual(v.projects.map(p => p.title), [
    'An open flood atlas for the Iberian Atlantic coast',
    'Rescuing sixty years of paper tide records',
    'A drainage twin for a city with no drainage survey',
  ]);
  // the timeline slot shows the card's title, and links back to that card
  assert.equal(v.tl.proj[0].title, v.projects[0].title);
  assert.match(v.tl.proj[0].workHref, /^#projects\?lang=en&p=flood-atlas$/);
});

test('the author’s own data does not leak into a generated page', () => {
  const html = page();
  for (const s of ['Vincent', 'Rizzo', 'Datamaran', 'València', 'Querétaro',
    'CentraleSupélec', 'vincnt.rizz', 'Selectra', '4L Trophy', 'PyCon']) {
    assert.equal(html.includes(s), false, `"${s}" leaked into the generated page`);
  }
});

test('the generated page names only the assets the profile supplied', () => {
  const html = page();
  // no logo was supplied, so no author asset is referenced
  assert.equal(/assets\/[a-z-]+\.(svg|png)/.test(html), false);
});
