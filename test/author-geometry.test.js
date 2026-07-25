// The regression net for the timeline engine.
//
// Everything the later tickets do to buildTimeline — taking entries as an
// argument, deriving the axis floor, turning the date-literal stretch windows
// into entry properties — has to leave the author's own page drawing exactly as
// it does today. These assertions are what says so.
//
// They claim only things a visitor would notice: which gaps fold, that the
// contract years run at a wider scale than plain, where the globe goes and in
// what order, and that no two cards sit on top of each other. Raw pixel arrays
// are deliberately not asserted — any legitimate design tweak would churn them.

import { test } from 'node:test';
import assert from 'node:assert/strict';

// Both files are plain blocking scripts in the browser and merge themselves into
// globalThis, so they are imported for their side effect rather than for named
// exports. See the header comment in public/cv-logic.js.
import '../public/i18n/en.js';
import '../public/cv-logic.js';

const { buildTimeline } = globalThis.CV_LOGIC;
const EN = globalThis.CV_I18N.en;

// The two-column desktop layout at the default time scale — the geometry the
// hand-authored page was tuned against.
const wide = () => buildTimeline({ vw: 1440, yearScale: 180, showGrid: true, cardH: {}, lang: 'en', goTo: () => {} }, EN);
// One full-width column, below NARROW_PX.
const narrow = () => buildTimeline({ vw: 390, yearScale: 180, showGrid: true, cardH: {}, lang: 'en', goTo: () => {} }, EN);

test('every lane the author has is drawn', () => {
  const tl = wide();
  assert.equal(tl.edu.length, 4);
  assert.equal(tl.exp.length, 4);
  assert.equal(tl.vol.length, 2);
  assert.equal(tl.proj.length, 4);
});

test('the author page has nothing left to fold', () => {
  const tl = wide();
  // Recorded rather than desired. Since the projects were redated to run
  // 2024-2026, every remaining gap in the author's history is either under the
  // two-year fold threshold or covered by a no-fold rule: the lycée window keeps
  // the 2010-2013 years visible, and everything from Sep 2022 on is stretched.
  // So the "time folded" marker and its legend item are absent from `/` today.
  //
  // Ticket 01's brief says this test should assert the 2016-2017 gap folds. It
  // does not fold and cannot — 2015.67 to 2016.5 is ten months. Whoever
  // parameterises the builder needs a fixture with a genuinely long gap to
  // exercise the folding path; the author's own history no longer does.
  assert.deepEqual(tl.skips, []);
  assert.equal(tl.hasFolds, false);
});

test('the 2020-2022 contract runs at a wider scale than plain time', () => {
  const tl = wide();
  // Jul 2020 – Sep 2022 is 2.17 years. At plain 180px/yr that is ~390px; the
  // stretch is what makes the globe's Querétaro-to-London travel readable.
  const contract = tl.exp[2];
  const plain = (2022.67 - 2020.5) * 180;
  assert.ok(contract.hPx > plain * 1.2,
    `contract ${contract.hPx}px should exceed plain ${plain.toFixed(0)}px`);
});

test('the lycée years are never folded, so every year tick back to 2010 shows', () => {
  const tl = wide();
  const years = tl.years.map(y => y.label);
  ['2010', '2011', '2012', '2013', '2014', '2015'].forEach(y =>
    assert.ok(years.includes(y), `year ${y} is on the axis`));
});

test('the axis starts at the round year below the earliest entry', () => {
  const tl = wide();
  assert.equal(tl.years[0].label, '2010');
});

test('the open-ended current role reads as Present', () => {
  const tl = wide();
  assert.ok(tl.exp[3].meta.endsWith('Present'), tl.exp[3].meta);
});

test('a single-month entry reads as one date, not a range', () => {
  const tl = wide();
  // Feb 2017, the 4L Trophy
  assert.equal(tl.vol[1].meta, 'Feb 2017');
  // and it still has visible height rather than collapsing to nothing
  assert.ok(tl.vol[1].hPx > 8, `${tl.vol[1].hPx}px is a readable pill`);
});

test('the globe visits the author cities in visual order, newest first', () => {
  const tl = wide();
  const names = tl.geoItems.flatMap(it => it.cities.map(c => c.n));
  assert.deepEqual(names, [
    'València',        // Senior Data Scientist, Sep 2022 – present
    'London',          // the tail of the Product Data Scientist contract
    'Querétaro',       // the bulk of it
    'València',        // Data Scientist, Jan – Jul 2020
    'València',        // UPV, the double degree
    'Madrid',          // Selectra — its card sits above CentraleSupélec's,
    'Paris-Saclay',    //   which carries a +140 nudge to clear UPV
    'Boulajoul',       // 4L Trophy, Feb 2017
    'Toamasina',       // Jul – Aug 2016
    'Versailles',      // Sainte-Geneviève
    'Aix-en-Provence', // Lycée militaire
  ]);
});

test('a project carries no city, so it stays out of the globe waypoints', () => {
  const tl = wide();
  // four projects, and none of them contributes a waypoint
  assert.equal(tl.geoItems.length, tl.edu.length + tl.exp.length + tl.vol.length);
});

test('the two cities of one role are placed by their own date sub-ranges', () => {
  const tl = wide();
  const twoCity = tl.geoItems.find(it => it.cities.length === 2);
  assert.ok(twoCity, 'the Querétaro/London role is one entry with two cities');
  const [londonOff, queretaroOff] = twoCity.cityOffs;
  assert.equal(londonOff, 0);
  // London is a two-month tail of a 26-month role, so an even split would put
  // Querétaro at 0.5. The declared sub-ranges push it much later — but not past
  // the floor that keeps London readable.
  assert.ok(queretaroOff > 0.2 && queretaroOff <= 0.75,
    `Querétaro at ${queretaroOff} is placed by its sub-range, not an even split`);
});

test('no two cards in a column claim the same vertical space', () => {
  for (const tl of [wide(), narrow()]) {
    const columns = tl.wrapW === '100%'
      // one column: everything competes with everything
      ? [tl.edu.concat(tl.proj, tl.exp, tl.vol)]
      : [tl.edu.concat(tl.proj), tl.exp.concat(tl.vol)];
    for (const col of columns) {
      const order = col.slice().sort((a, b) => a.cardY - b.cardY);
      for (let i = 1; i < order.length; i++) {
        const above = order[i - 1];
        assert.ok(order[i].cardY - above.cardY >= above.gap - 0.01,
          `${above.ck} and ${order[i].ck} overlap at ${tl.wrapW}: ` +
          `${above.cardY} vs ${order[i].cardY}, gap ${above.gap}`);
      }
    }
  }
});

test('the narrow layout is one column at a coarser scale', () => {
  const n = narrow(), w = wide();
  assert.equal(w.wrapW, '840px');
  assert.equal(n.wrapW, '100%');
  // every card in one column, all at the same left edge
  const lefts = new Set(n.edu.concat(n.exp, n.vol, n.proj).map(e => e.cardLeft));
  assert.equal(lefts.size, 1);
  // and taller overall, because one column of wrapped cards needs more room
  assert.ok(n.totalPx > w.totalPx, `${n.totalPx} > ${w.totalPx}`);
});

test('the page is tall enough for the axis and for every card', () => {
  const tl = wide();
  const lowestCard = Math.max(...tl.edu.concat(tl.exp, tl.vol, tl.proj).map(e => e.cardY));
  const axisFoot = Math.max(...tl.years.map(y => y.topPx));
  assert.ok(tl.totalPx >= lowestCard + 110, 'the lowest card is not clipped');
  assert.ok(tl.totalPx >= axisFoot, 'the 2010 gridline is not clipped');
});

test('gridlines can be turned off', () => {
  const off = buildTimeline({ vw: 1440, yearScale: 180, showGrid: false, cardH: {}, lang: 'en', goTo: () => {} }, EN);
  assert.equal(off.showGrid, false);
});

test('the time scale is honoured', () => {
  const a = buildTimeline({ vw: 1440, yearScale: 120, showGrid: true, cardH: {}, lang: 'en', goTo: () => {} }, EN);
  const b = buildTimeline({ vw: 1440, yearScale: 240, showGrid: true, cardH: {}, lang: 'en', goTo: () => {} }, EN);
  assert.ok(b.exp[3].hPx > a.exp[3].hPx * 1.5, 'doubling px/yr roughly doubles a bar');
});

test('project cards link back to their Work-section card in the current language', () => {
  const tl = buildTimeline({ vw: 1440, yearScale: 180, showGrid: true, cardH: {}, lang: 'fr', goTo: () => {} }, EN);
  tl.proj.forEach(p => {
    assert.match(p.workHref, /^#projects\?lang=fr&p=/);
  });
});
