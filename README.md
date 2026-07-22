# civiz - Vincent Rizzo, a scroll-driven 3D resume

A creative-coding personal resume. One continuous 3D scene; the camera flies a
keyframed path as you scroll - **down moves forward, up moves back**. Each beat
of the journey maps to a chapter of the CV, with an HTML card fading in over the
3D set.

## The journey

| Scroll | Scene | CV |
|--------|-------|----|
| 0 | Earth in space, zooming toward France | Profile |
| 1 | Gaulois village, Aix-en-Provence (Asterix style) | Origins / CPGE prep |
| 2 | Paris, Renaissance palace + obelisk | MSc, CentraleSupélec |
| 3 | Valencia, Ciutat de les Arts white arches | Double MSc, UPV |
| 4 | Datamaran glass tower + data cubes + pandemic virus | Product Data Scientist, 2020–22 |
| 5 | Mexico step pyramid + cactus + hot sun | Data Scientist, remote |
| 6 | Back in Valencia, podium + gold medal + confetti | Senior Data Scientist II, 2022– |

## Stack

- [Three.js](https://threejs.org) - all scenes are procedural, built from
  primitives (no external 3D assets).
- [Vite](https://vitejs.dev) - dev server + build.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

> Note: `.npmrc` pins the public npm registry so installs don't hit a private
> corporate registry.

## Layout

- `src/main.js` - renderer, camera keyframes, scroll → progress, overlay + fog.
- `src/world.js` - one builder function per chapter, laid out along the −Z axis.
- `src/content.js` - CV copy and the scroll window for each chapter card.
- `src/style.css` - cards, timeline dots, progress bar.

Timeline dots (right edge) let you jump to any chapter; the progress bar tracks
position in the journey.
