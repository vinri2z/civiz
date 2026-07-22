#!/usr/bin/env node
// deai: a tiny linter that flags (and optionally fixes) the most obvious
// signs of AI-generated writing in this repo's content.
//
//   node scripts/deai.mjs          report tells, exit 1 if any found
//   node scripts/deai.mjs --fix    auto-fix the mechanical ones, then report
//
// See https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
//
// Auto-fixable (mechanical, meaning-preserving):
//   - em-dash      ->  hyphen
//   - curly quotes ->  straight quotes
// Report-only (need a human rewrite, not a regex):
//   - antithesis padding: "not X, but Y", "isn't just X", "not vibes"
//   - rule-of-three triads, editorializing, puffery

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const FIX = process.argv.includes("--fix");

// Where content lives. Skip build output, deps, and generated bundles.
const INCLUDE_DIRS = ["app", "src", "data"];
const INCLUDE_ROOT_FILES = ["README.md", "index.html"];
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "out", "public"]);
const EXTS = new Set([".js", ".jsx", ".ts", ".tsx", ".md", ".html", ".css"]);

// Mechanical fixes: [pattern, replacement].
const FIXES = [
  [/—/g, "-"],   // em dash -> hyphen
  [/[‘’]/g, "'"], // curly single quotes -> '
  [/[“”]/g, '"'], // curly double quotes -> "
];

// Report-only tells: [label, regex]. Kept deliberately loose; a human decides.
const TELLS = [
  ["antithesis: 'not X / not vibes'", /\bnot (?:vibes|the model'?s|generic|just)\b/gi],
  ["antithesis: 'isn't / aren't just'", /\b(?:isn'?t|aren'?t|not) just\b/gi],
  ["puffery: 'unglamorous/seamless/robust/trustworthy'", /\b(?:unglamorous|seamless|robust|cutting-edge|state-of-the-art|game-chang\w+)\b/gi],
  ["editorializing: 'it's worth noting / that proves it'", /\b(?:it'?s worth noting|that proves it|the scarce \w+ that)\b/gi],
];

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (EXTS.has(extname(name))) out.push(p);
  }
}

const files = [...INCLUDE_ROOT_FILES.map((f) => join(ROOT, f))];
for (const d of INCLUDE_DIRS) {
  try {
    walk(join(ROOT, d), files);
  } catch {
    /* dir may not exist */
  }
}

let fixedCount = 0;
let tellCount = 0;

for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const rel = file.replace(ROOT + "/", "");

  if (FIX) {
    let next = text;
    for (const [pat, rep] of FIXES) next = next.replace(pat, rep);
    if (next !== text) {
      // count changed chars roughly by re-matching the original
      const n = FIXES.reduce((a, [pat]) => a + (text.match(pat)?.length || 0), 0);
      writeFileSync(file, next);
      fixedCount += n;
      console.log(`fixed ${n} in ${rel}`);
      text = next;
    }
  } else {
    for (const [pat] of FIXES) {
      const m = text.match(pat);
      if (m) {
        tellCount += m.length;
        console.log(`${rel}: ${m.length} mechanical tell(s) [${pat.source}] - run --fix`);
      }
    }
  }

  // Report-only tells (both modes).
  const lines = text.split("\n");
  for (const [label, re] of TELLS) {
    lines.forEach((line, i) => {
      if (re.test(line)) {
        tellCount++;
        console.log(`${rel}:${i + 1}: ${label} :: ${line.trim().slice(0, 80)}`);
      }
      re.lastIndex = 0;
    });
  }
}

if (FIX) console.log(`\ndone: ${fixedCount} mechanical fix(es) applied.`);
else console.log(`\n${tellCount} tell(s) found.`);

// Non-zero exit when report mode still finds something, so CI can gate on it.
process.exit(!FIX && tellCount > 0 ? 1 : 0);
