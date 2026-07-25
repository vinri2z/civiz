// The builder drawing somebody who is not the author.
//
// The author's own history exercises none of the paths that matter most for an
// imported profile: it has no folds left, all four lanes, and hand-tuned
// fractional-year ranges. These entries are deliberately nothing like it.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import '../public/i18n/en.js';
import '../public/cv-logic.js';

const { buildTimeline } = globalThis.CV_LOGIC;
const EN = globalThis.CV_I18N.en;

// `now` is passed rather than read from the clock so an open-ended entry lands
// somewhere the assertions can name.
const build = (entries, o) => buildTimeline({
  entries, vw: 1440, yearScale: 180, showGrid: true, cardH: {}, now: 2026.5, ...o,
}, EN);

const job = (o) => ({ kind: 'experience', role: 'Engineer', org: 'Acme', ...o });
const school = (o) => ({ kind: 'education', name: 'A University', sub: 'BSc', ...o });

test('a profile with only experience gets one lane and one legend item', () => {
  const tl = build([job({ from: [2021, 3], to: [2023, 8] })]);
  assert.equal(tl.exp.length, 1);
  assert.deepEqual(tl.edu, []);
  assert.deepEqual(tl.vol, []);
  assert.deepEqual(tl.proj, []);
  assert.deepEqual(tl.legend.map(l => l.label), [EN.tl.expLegend]);
});

test('lanes that exist decide the legend, in legend order not input order', () => {
  const tl = build([
    { kind: 'project', title: 'A side project', from: [2024, 1], to: [2024, 3] },
    job({ from: [2021, 3], to: [2023, 8] }),
    school({ from: [2016, 9], to: [2020, 6] }),
  ]);
  assert.deepEqual(tl.legend.map(l => l.label),
    [EN.tl.eduLegend, EN.tl.expLegend, EN.tl.projLegend]);
  // no volunteering, so no amber item and no volunteering bars
  assert.equal(tl.legend.some(l => l.label === EN.tl.volLegend), false);
  assert.deepEqual(tl.vol, []);
});

test('an entry reclassified as volunteering brings its lane and legend item back', () => {
  const paid = build([job({ from: [2021, 3], to: [2023, 8] })]);
  assert.deepEqual(paid.legend.map(l => l.label), [EN.tl.expLegend]);

  const unpaid = build([{ ...job({ from: [2021, 3], to: [2023, 8] }), kind: 'volunteering' }]);
  assert.deepEqual(unpaid.legend.map(l => l.label), [EN.tl.volLegend]);
  assert.equal(unpaid.vol.length, 1);
  assert.deepEqual(unpaid.exp, []);
});

test('the project legend swatch is the narrow one', () => {
  const tl = build([{ kind: 'project', title: 'P', from: [2024, 1], to: [2024, 3] }]);
  assert.equal(tl.legend[0].w, '8px');
  const other = build([job({ from: [2024, 1], to: [2024, 3] })]);
  assert.equal(other.legend[0].w, '14px');
});

test('a profile with no entries at all renders without a timeline and without crashing', () => {
  const tl = build([]);
  assert.deepEqual(tl.years, []);
  assert.deepEqual(tl.legend, []);
  assert.deepEqual(tl.bars, []);
  assert.deepEqual(tl.geoItems, []);
  assert.equal(tl.hasFolds, false);
  assert.ok(tl.totalPx > 0, 'the wrapper still has a height');
});

test('the axis floor is the round year below the earliest entry, whatever that is', () => {
  const nineties = build([school({ from: [1994, 9], to: [1997, 6] })]);
  assert.equal(nineties.years[0].label, '1994');

  const recent = build([job({ from: [2023, 4], to: [2024, 4] })]);
  assert.equal(recent.years[0].label, '2023');
});

test('the top year tick follows the latest entry', () => {
  const tl = build([job({ from: [2019, 1], to: [2021, 6] })]);
  assert.equal(tl.years[tl.years.length - 1].label, '2021');
});

test('an entry with no end runs to now and reads as Present', () => {
  const tl = build([job({ from: [2024, 2], to: null })]);
  assert.ok(tl.exp[0].meta.endsWith(EN.tl.present), tl.exp[0].meta);
  // and the axis reaches the year `now` falls in rather than stopping at 2024
  assert.equal(tl.years[tl.years.length - 1].label, '2026');
});

test('a long empty stretch folds, and the page height stays bounded', () => {
  const gapped = build([
    school({ from: [1998, 9], to: [2002, 6] }),
    job({ from: [2019, 1], to: [2024, 6] }),
  ]);
  assert.ok(gapped.hasFolds, 'the 2002-2019 gap is folded');
  assert.equal(gapped.skips.length, 1);
  // Jun 2002 to Jan 2019 drawn to scale would be nearly 3000px; a fold is one
  // marker of roughly one year's height, and it says how much it swallowed
  assert.ok(gapped.skips[0].hPx < 180 * 2,
    `fold is ${gapped.skips[0].hPx}px, not sixteen years to scale`);
  assert.equal(gapped.skips[0].label, '16 yr 6 mo');

  // the folded years get no gridline, since they are not drawn
  const years = gapped.years.map(y => y.label);
  assert.equal(years.includes('2010'), false);
  assert.ok(years.includes('1998') && years.includes('2019'));
});

test('an entry longer than the fold threshold is never folded away', () => {
  // a six-year degree with nothing else on the timeline: the gap-folding rule
  // would otherwise swallow the entry's own duration
  const tl = build([school({ from: [2014, 9], to: [2020, 6] })]);
  assert.deepEqual(tl.skips, []);
  assert.equal(tl.hasFolds, false);
  assert.ok(tl.edu[0].hPx > 180 * 5, `${tl.edu[0].hPx}px is drawn to scale`);
});

test('noFoldBefore keeps the gap ahead of an entry at plain scale', () => {
  const start = { from: [1998, 9], to: [2002, 6] };
  const later = { from: [2019, 1], to: [2024, 6] };
  const folded = build([school(start), job(later)]);
  const kept = build([school(start), job({ ...later, noFoldBefore: true })]);

  assert.equal(folded.skips.length, 1);
  assert.deepEqual(kept.skips, []);
  assert.ok(kept.totalPx > folded.totalPx * 2,
    'unfolded, seventeen years of dead time is drawn to scale');
});

test('stretch runs one entry at a wider scale than its neighbours', () => {
  const plain = build([job({ from: [2020, 1], to: [2022, 1] })]);
  const wider = build([job({ from: [2020, 1], to: [2022, 1], stretch: true })]);
  assert.ok(wider.exp[0].hPx > plain.exp[0].hPx * 1.25,
    `${wider.exp[0].hPx} vs ${plain.exp[0].hPx}`);
});

test('dates recorded only to the year position without inventing a month', () => {
  // LinkedIn permits a year with no month; January is the honest reading of a
  // bare year and the label says January rather than a blank
  const tl = build([job({ from: [2015, 1], to: [2018, 1] })]);
  assert.equal(tl.exp[0].meta, 'Jan 2015 – Jan 2018');
  assert.equal(tl.years[0].label, '2015');
});

test('a one-month entry survives as a visible pill', () => {
  const tl = build([job({ from: [2022, 5], to: [2022, 5] })]);
  assert.equal(tl.exp[0].meta, 'May 2022');
  assert.ok(tl.exp[0].hPx > 8, `${tl.exp[0].hPx}px is readable`);
});

test('overlapping entries in the same column do not claim the same space', () => {
  const tl = build([
    school({ name: 'Degree', from: [2016, 9], to: [2020, 6] }),
    school({ name: 'Second degree', from: [2018, 9], to: [2020, 6], sublane: 1 }),
    job({ from: [2018, 1], to: [2019, 6] }),
    job({ role: 'Contractor', from: [2019, 1], to: [2020, 6] }),
  ]);
  for (const col of [tl.edu, tl.exp]) {
    const order = col.slice().sort((a, b) => a.cardY - b.cardY);
    for (let i = 1; i < order.length; i++) {
      assert.ok(order[i].cardY - order[i - 1].cardY >= order[i - 1].gap - 0.01,
        `${order[i - 1].ck} and ${order[i].ck} overlap`);
    }
  }
  // and the two overlapping degrees take different bar columns
  assert.notEqual(tl.edu[0].barLeft, tl.edu[1].barLeft);
});

test('an entry with no resolvable place stays on the timeline and off the globe', () => {
  const tl = build([
    job({ from: [2021, 1], to: [2022, 1], cities: [{ n: 'Lisbon', c: [-9.14, 38.72] }] }),
    job({ role: 'Remote role', from: [2022, 1], to: [2023, 1] }),
  ]);
  assert.equal(tl.exp.length, 2, 'both entries are drawn');
  assert.equal(tl.geoItems.length, 1, 'only the placed one is a waypoint');
  assert.deepEqual(tl.geoItems[0].cities.map(c => c.n), ['Lisbon']);
});

test('an imported entry gets its lane colour without having to state one', () => {
  const tl = build([
    school({ from: [2016, 9], to: [2020, 6] }),
    job({ from: [2021, 1], to: [2023, 1] }),
    { kind: 'volunteering', name: 'A charity', from: [2019, 6], to: [2019, 8] },
    { kind: 'project', title: 'P', from: [2024, 1], to: [2024, 3] },
  ]);
  const colours = [tl.edu[0].color, tl.exp[0].color, tl.vol[0].color, tl.proj[0].color];
  assert.equal(new Set(colours).size, 4, 'each lane reads differently: ' + colours);
  colours.forEach(c => assert.match(c, /^oklch\(/));
});

test('input order within a lane is the reveal order', () => {
  const tl = build([
    job({ role: 'First', from: [2021, 1], to: [2022, 1] }),
    job({ role: 'Second', from: [2022, 1], to: [2023, 1] }),
  ]);
  assert.deepEqual(tl.exp.map(e => [e.role, e.i]), [['First', 0], ['Second', 1]]);
  assert.deepEqual(tl.exp.map(e => e.ck), ['exp-0', 'exp-1']);
});

test('a fourteen-job career lays out without cards colliding', () => {
  const many = Array.from({ length: 14 }, (_, i) =>
    job({ role: 'Role ' + i, from: [2012 + i, 1], to: [2013 + i, 1] }));
  for (const vw of [1440, 390]) {
    const tl = build(many, { vw });
    const order = tl.exp.slice().sort((a, b) => a.cardY - b.cardY);
    for (let i = 1; i < order.length; i++) {
      assert.ok(order[i].cardY - order[i - 1].cardY >= order[i - 1].gap - 0.01,
        `${order[i - 1].ck} and ${order[i].ck} overlap at vw=${vw}`);
    }
    assert.equal(tl.geoItems.length, 0, 'no cities, so no waypoints');
  }
});

test('a two-year career is not stretched to fill a page', () => {
  const tl = build([job({ from: [2024, 1], to: [2026, 1] })]);
  // two years at 180px/yr plus the wrapper's own padding, and nothing else
  assert.ok(tl.totalPx < 180 * 2 + 400, `${tl.totalPx}px for two years`);
  assert.deepEqual(tl.years.map(y => y.label), ['2024', '2025', '2026']);
});
