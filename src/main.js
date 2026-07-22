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
// Camera keyframes - a keyframe per beat of the journey. `t` is scroll progress.
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

const iconMail = `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
const iconGlobe = `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
const iconLinkedIn = `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
const iconGitHub = `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;

const cardEls = chapters.map((ch, i) => {
  const el = document.createElement("article");
  el.className = "card";
  const links =
    i === chapters.length - 1
      ? `<div class="links">
           <a href="mailto:${contact.email}">${iconMail}<span>${contact.email}</span></a>
           <a href="https://${contact.site}" target="_blank" rel="noopener">${iconGlobe}<span>${contact.site}</span></a>
           <a href="${contact.linkedin}" target="_blank" rel="noopener">${iconLinkedIn}<span>LinkedIn</span></a>
           <a href="${contact.github}" target="_blank" rel="noopener">${iconGitHub}<span>GitHub</span></a>
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

  // Per-chapter animations (only near the camera, for perf).
  // `local` is 0→1 scroll progress *within* this chapter's visible window,
  // so scenes react to scroll position rather than elapsed time.
  groups.forEach((g, i) => {
    if (g.userData.update && Math.abs(g.position.z - camera.position.z) < 140) {
      const r = chapters[i]?.range;
      let local = 0;
      if (r) local = Math.min(1, Math.max(0, (currentP - r[0]) / (r[1] - r[0] || 1)));
      g.userData.update(dt, t, local);
    }
  });

  updateOverlay(currentP);
  renderer.render(scene, camera);
}
animate();
