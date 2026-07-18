import * as THREE from "three";
import { buildWorld } from "./world.js";
import { chapters, contact } from "./content.js";

// ---------------------------------------------------------------------------
// Renderer + scene + camera
// ---------------------------------------------------------------------------
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070c);
scene.fog = new THREE.Fog(0x05070c, 60, 170);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);

// Lighting
scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x20160c, 0.6));
scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const sun = new THREE.DirectionalLight(0xffffff, 1.1);
sun.position.set(30, 50, 30);
scene.add(sun);

const { groups } = buildWorld(scene);

// ---------------------------------------------------------------------------
// Camera keyframes — a keyframe per beat of the journey. `t` is scroll progress.
// ---------------------------------------------------------------------------
const keys = [
  { t: 0.00, pos: [0, 10, 95],   look: [0, 1, 0] },     // deep space
  { t: 0.10, pos: [0, 4, 32],    look: [0, 0, 0] },     // earth close-up
  { t: 0.21, pos: [16, 9, -34],  look: [0, 3, -60] },   // gaulois village
  { t: 0.38, pos: [-18, 12, -92], look: [0, 6, -120] }, // paris
  { t: 0.55, pos: [18, 11, -150], look: [0, 4, -180] }, // valencia uni
  { t: 0.70, pos: [-16, 12, -208], look: [0, 8, -240] },// datamaran 2020
  { t: 0.83, pos: [16, 12, -270], look: [0, 8, -300] }, // mexico
  { t: 1.00, pos: [0, 10, -326],  look: [0, 5, -360] }, // valencia senior
];

const smoothstep = (a) => a * a * (3 - 2 * a);
const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

function sampleCamera(p) {
  p = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < keys.length - 1 && p > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const span = b.t - a.t || 1;
  const local = smoothstep((p - a.t) / span);
  _pos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], local),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], local),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], local)
  );
  _look.set(
    THREE.MathUtils.lerp(a.look[0], b.look[0], local),
    THREE.MathUtils.lerp(a.look[1], b.look[1], local),
    THREE.MathUtils.lerp(a.look[2], b.look[2], local)
  );
}

// ---------------------------------------------------------------------------
// Overlay cards + timeline dots
// ---------------------------------------------------------------------------
const overlay = document.getElementById("overlay");
const timeline = document.getElementById("timeline");
const intro = document.getElementById("intro");
const progressBar = document.querySelector("#progress span");

const cardEls = chapters.map((ch, i) => {
  const el = document.createElement("article");
  el.className = "card";
  const links =
    i === chapters.length - 1
      ? `<div class="links">
           <a href="mailto:${contact.email}">${contact.email}</a>
           <a href="https://${contact.site}" target="_blank" rel="noopener">${contact.site}</a>
           <a href="${contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
           <a href="${contact.github}" target="_blank" rel="noopener">GitHub</a>
         </div>`
      : "";
  el.innerHTML = `
    <p class="kicker">${ch.kicker}</p>
    <h2>${ch.title}</h2>
    <p class="meta"><span class="where">${ch.where}</span>${ch.year ? `<span class="year">${ch.year}</span>` : ""}</p>
    <p class="body">${ch.body}</p>
    <div class="tags">${ch.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    ${links}
  `;
  overlay.appendChild(el);
  return el;
});

const dotEls = chapters.map((ch, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.innerHTML = `<span class="label">${ch.where}</span>`;
  b.setAttribute("aria-label", ch.where);
  b.addEventListener("click", () => {
    const center = (ch.range[0] + ch.range[1]) / 2;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: center * max, behavior: "smooth" });
  });
  timeline.appendChild(b);
  return b;
});

function updateOverlay(p) {
  let activeIdx = 0;
  chapters.forEach((ch, i) => {
    const inRange = p >= ch.range[0] && p <= ch.range[1];
    cardEls[i].classList.toggle("active", inRange);
    if (inRange) activeIdx = i;
  });
  dotEls.forEach((d, i) => d.classList.toggle("active", i === activeIdx));
  intro.style.opacity = String(Math.max(0, 1 - p / 0.03));
  progressBar.style.width = (p * 100).toFixed(1) + "%";
}

// ---------------------------------------------------------------------------
// Scroll + mouse parallax
// ---------------------------------------------------------------------------
let targetP = 0;
let currentP = 0;
function readScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  targetP = max > 0 ? window.scrollY / max : 0;
}
window.addEventListener("scroll", readScroll, { passive: true });
readScroll();

const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  readScroll();
});

// ---------------------------------------------------------------------------
// Render loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // Ease scroll progress for a buttery, reversible camera
  currentP += (targetP - currentP) * Math.min(1, dt * 4);

  // Dynamic fog: wide open in space (so Earth reads from afar), tight on the
  // ground so the next chapter doesn't bleed into the current one.
  const inSpace = currentP < 0.13;
  const targetNear = inSpace ? 60 : 42;
  const targetFar = inSpace ? 170 : 92;
  scene.fog.near += (targetNear - scene.fog.near) * Math.min(1, dt * 3);
  scene.fog.far += (targetFar - scene.fog.far) * Math.min(1, dt * 3);

  sampleCamera(currentP);
  // subtle mouse parallax
  _pos.x += mouse.x * 2.2;
  _pos.y += -mouse.y * 1.4;
  camera.position.lerp(_pos, 0.15);
  camera.lookAt(_look);

  // Per-chapter animations (only near the camera, for perf)
  groups.forEach((g) => {
    if (g.userData.update && Math.abs(g.position.z - camera.position.z) < 140) {
      g.userData.update(dt, t);
    }
  });

  updateOverlay(currentP);
  renderer.render(scene, camera);
}
animate();
