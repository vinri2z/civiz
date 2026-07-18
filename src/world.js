import * as THREE from "three";

// Distance between chapter sets along the -Z axis.
export const SPACING = 60;
export const CHAPTER_Z = (i) => -i * SPACING;

// Small material helpers ----------------------------------------------------
const mat = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...opts });

function jitterVertices(geo, amount) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(
      i,
      p.getX(i) + (Math.random() - 0.5) * amount,
      p.getY(i) + (Math.random() - 0.5) * amount,
      p.getZ(i) + (Math.random() - 0.5) * amount
    );
  }
  geo.computeVertexNormals();
  return geo;
}

// ---------------------------------------------------------------------------
// 1. EARTH — a stylized low-poly planet with continents and clouds
// ---------------------------------------------------------------------------
function buildEarth() {
  const g = new THREE.Group();

  const ocean = new THREE.Mesh(
    new THREE.IcosahedronGeometry(12, 4),
    mat(0x1b4f72, { roughness: 0.5, metalness: 0.1, flatShading: true })
  );
  g.add(ocean);

  // Continent blobs scattered on the surface
  const landMat = mat(0x3f8f4f, { flatShading: true });
  const land = new THREE.Group();
  const rng = mulberry(42);
  for (let i = 0; i < 22; i++) {
    const size = 1.6 + rng() * 3.2;
    const blob = new THREE.Mesh(jitterVertices(new THREE.IcosahedronGeometry(size, 1), size * 0.35), landMat);
    const phi = Math.acos(2 * rng() - 1);
    const theta = rng() * Math.PI * 2;
    const r = 12.05;
    blob.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    blob.lookAt(0, 0, 0);
    blob.scale.z = 0.35;
    land.add(blob);
  }
  g.add(land);

  // A soft "France" marker glow so the zoom has a target
  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x6fd39b })
  );
  const phi = THREE.MathUtils.degToRad(90 - 46);
  const theta = THREE.MathUtils.degToRad(5 + 180);
  marker.position.set(
    12.2 * Math.sin(phi) * Math.cos(theta),
    12.2 * Math.cos(phi),
    12.2 * Math.sin(phi) * Math.sin(theta)
  );
  g.add(marker);

  const clouds = new THREE.Mesh(
    new THREE.IcosahedronGeometry(12.7, 3),
    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.28, flatShading: true })
  );
  g.add(clouds);

  const atmos = new THREE.Mesh(
    new THREE.SphereGeometry(13.6, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x6fb6ff, transparent: true, opacity: 0.12, side: THREE.BackSide })
  );
  g.add(atmos);

  g.userData.update = (dt) => {
    ocean.rotation.y += dt * 0.05;
    land.rotation.y += dt * 0.05;
    marker.rotation.y += dt * 0.05;
    clouds.rotation.y += dt * 0.07;
    const s = 1 + Math.sin(performance.now() * 0.004) * 0.12;
    marker.scale.setScalar(s);
  };
  return g;
}

// ---------------------------------------------------------------------------
// 2. GAULOIS VILLAGE — Asterix-style thatched huts + palisade + menhir
// ---------------------------------------------------------------------------
function buildVillage() {
  const g = new THREE.Group();

  const ground = new THREE.Mesh(new THREE.CylinderGeometry(24, 26, 2, 40), mat(0x6a8f3c, { flatShading: true }));
  ground.position.y = -1;
  g.add(ground);

  function hut(x, z, scale = 1) {
    const h = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.3, 3.4, 12), mat(0xd9c8a6, { flatShading: true }));
    wall.position.y = 1.7;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.4, 3.6, 12), mat(0x9c6b2f, { flatShading: true }));
    roof.position.y = 5.2;
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, 0.3), mat(0x5a3d1e));
    door.position.set(0, 0.9, 3.1);
    h.add(wall, roof, door);
    h.position.set(x, 0, z);
    h.scale.setScalar(scale);
    h.rotation.y = Math.random() * Math.PI;
    return h;
  }
  g.add(hut(-8, 4, 1.1), hut(7, 6, 0.9), hut(2, -8, 1.0), hut(-10, -6, 0.85), hut(11, -3, 0.95));

  // Wooden palisade ring
  const pal = new THREE.Group();
  const logMat = mat(0x7a5230, { flatShading: true });
  for (let i = 0; i < 46; i++) {
    const a = (i / 46) * Math.PI * 2;
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4.2, 6), logMat);
    log.position.set(Math.cos(a) * 21, 1.4, Math.sin(a) * 21);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1, 6), logMat);
    tip.position.y = 2.6;
    log.add(tip);
    pal.add(log);
  }
  g.add(pal);

  // Menhir (Obelix would approve)
  const menhir = new THREE.Mesh(jitterVertices(new THREE.CylinderGeometry(1.6, 2.4, 8, 7), 0.5), mat(0x8b8f93, { flatShading: true }));
  menhir.position.set(-3, 4, 10);
  menhir.rotation.z = 0.08;
  g.add(menhir);

  // Campfire with flickering light
  const fire = new THREE.Mesh(new THREE.ConeGeometry(1, 2.2, 8), new THREE.MeshBasicMaterial({ color: 0xff7a1a }));
  fire.position.set(0, 1.2, 0);
  g.add(fire);
  const fireLight = new THREE.PointLight(0xff8a2a, 3, 30, 2);
  fireLight.position.set(0, 3, 0);
  g.add(fireLight);

  // A couple of pointy Provence cypress trees
  const pine = (x, z) => {
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2, 6), mat(0x5a3d1e));
    trunk.position.y = 1;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.6, 6, 8), mat(0x2f6b3f, { flatShading: true }));
    cone.position.y = 5;
    t.add(trunk, cone);
    t.position.set(x, 0, z);
    return t;
  };
  g.add(pine(16, 10), pine(-16, 8));

  g.userData.update = (dt, t) => {
    fire.scale.y = 1 + Math.sin(t * 12) * 0.18;
    fireLight.intensity = 2.6 + Math.sin(t * 14) * 0.9;
  };
  return g;
}

// ---------------------------------------------------------------------------
// 3. PARIS RENAISSANCE — sandstone palace, mansard roofs, obelisk
// ---------------------------------------------------------------------------
function buildParis() {
  const g = new THREE.Group();

  const plaza = new THREE.Mesh(new THREE.BoxGeometry(50, 1, 40), mat(0xcbb994));
  plaza.position.y = -0.5;
  g.add(plaza);

  function palace(x, z, w, d, h, rot = 0) {
    const b = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(0xe3d5b0, { flatShading: true }));
    body.position.y = h / 2;
    // mansard roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.72, h * 0.5, 4), mat(0x556070, { flatShading: true }));
    roof.rotation.y = Math.PI / 4;
    roof.position.y = h + h * 0.25;
    b.add(body, roof);
    // window rows
    const winMat = new THREE.MeshStandardMaterial({ color: 0x2a3550, emissive: 0x1a2540, emissiveIntensity: 0.6 });
    for (let iy = 0; iy < Math.floor(h / 3); iy++) {
      for (let ix = -1; ix <= 1; ix++) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.2), winMat);
        win.position.set(ix * (w / 3.2), 2 + iy * 3, d / 2 + 0.05);
        b.add(win);
      }
    }
    b.position.set(x, 0, z);
    b.rotation.y = rot;
    return b;
  }

  g.add(palace(0, -6, 16, 12, 14));
  g.add(palace(-16, 6, 10, 10, 9, 0.15));
  g.add(palace(16, 6, 10, 10, 9, -0.15));

  // Central dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(4.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x9fb0c3, { metalness: 0.4, roughness: 0.3 }));
  dome.position.set(0, 21, -6);
  g.add(dome);

  // Obelisk in the plaza
  const obelisk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.1, 12, 4), mat(0xdcc9a0, { flatShading: true }));
  obelisk.position.set(0, 6, 12);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.6, 4), mat(0xc9a24b, { metalness: 0.6, roughness: 0.3 }));
  cap.position.y = 6.8;
  obelisk.add(cap);
  g.add(obelisk);

  // Warm lantern light
  const lamp = new THREE.PointLight(0xffd9a0, 2, 60, 2);
  lamp.position.set(0, 14, 14);
  g.add(lamp);

  return g;
}

// ---------------------------------------------------------------------------
// 4. VALENCIA — Ciutat de les Arts white arches over a reflecting pool
// ---------------------------------------------------------------------------
function buildValenciaUni() {
  const g = new THREE.Group();

  const pool = new THREE.Mesh(
    new THREE.BoxGeometry(60, 0.4, 34),
    new THREE.MeshStandardMaterial({ color: 0x2b6fa3, metalness: 0.6, roughness: 0.15 })
  );
  pool.position.y = -0.4;
  g.add(pool);

  const white = mat(0xf3f4f2, { roughness: 0.4, metalness: 0.05, flatShading: true });

  // Calatrava-style ribbed arches (half torus)
  for (let i = 0; i < 5; i++) {
    const r = 6 + i * 2.4;
    const arch = new THREE.Mesh(new THREE.TorusGeometry(r, 0.5, 8, 40, Math.PI), white);
    arch.rotation.z = 0;
    arch.position.set(0, 0.2, -6 - i * 0.1);
    g.add(arch);
  }

  // The "eye" — a big shell (half ellipsoid) like the Hemisfèric
  const shell = new THREE.Mesh(new THREE.SphereGeometry(7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), white);
  shell.scale.set(1.6, 1, 1);
  shell.position.set(-16, 0.2, 4);
  g.add(shell);

  // Spiky white ribs building (Palau/Àgora feel)
  const spike = new THREE.Group();
  for (let i = 0; i < 14; i++) {
    const rib = new THREE.Mesh(new THREE.ConeGeometry(0.4, 10 - Math.abs(i - 7) * 0.9, 6), white);
    rib.position.set(-9 + i * 1.4, 4, -14);
    spike.add(rib);
  }
  g.add(spike);

  // A slow-turning industrial gear to nod to Industrial Engineering
  const gear = buildGear(0x9aa4ad);
  gear.position.set(17, 6, -4);
  gear.rotation.x = Math.PI / 2;
  g.add(gear);
  g.userData.update = (dt) => { gear.rotation.z += dt * 0.4; };

  const sun = new THREE.PointLight(0xfff2cc, 2.2, 120, 2);
  sun.position.set(10, 30, 20);
  g.add(sun);

  return g;
}

function buildGear(color) {
  const gear = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 1.2, 24), mat(color, { metalness: 0.7, roughness: 0.3 }));
  body.rotation.x = Math.PI / 2;
  gear.add(body);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 1.2), mat(color, { metalness: 0.7, roughness: 0.3 }));
    tooth.position.set(Math.cos(a) * 4.4, Math.sin(a) * 4.4, 0);
    tooth.rotation.z = a;
    gear.add(tooth);
  }
  const hole = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.4, 16), mat(0x333a40));
  hole.rotation.x = Math.PI / 2;
  gear.add(hole);
  return gear;
}

// ---------------------------------------------------------------------------
// 5. DATAMARAN 2020 — glass office tower, floating data, pandemic virus
// ---------------------------------------------------------------------------
function buildDatamaran2020() {
  const g = new THREE.Group();

  const plaza = new THREE.Mesh(new THREE.BoxGeometry(46, 1, 36), mat(0x2b2f36));
  plaza.position.y = -0.5;
  g.add(plaza);

  const glass = new THREE.MeshStandardMaterial({
    color: 0x2fd39b, metalness: 0.6, roughness: 0.15,
    transparent: true, opacity: 0.55, emissive: 0x0b3b2a, emissiveIntensity: 0.5,
  });
  const tower = new THREE.Mesh(new THREE.BoxGeometry(10, 26, 10), glass);
  tower.position.set(0, 13, -4);
  g.add(tower);
  // floor lines
  for (let i = 1; i < 9; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.15, 10.2), mat(0x0e5c42, { emissive: 0x0e5c42, emissiveIntensity: 0.4 }));
    line.position.set(0, i * 2.8, -4);
    g.add(line);
  }

  // Floating "data" cubes (structured intelligence)
  const cubes = new THREE.Group();
  const cubeMat = new THREE.MeshStandardMaterial({ color: 0x6fd39b, emissive: 0x2f6b4f, emissiveIntensity: 0.5 });
  for (let i = 0; i < 40; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), cubeMat);
    c.position.set((Math.random() - 0.5) * 34, 2 + Math.random() * 24, (Math.random() - 0.5) * 24);
    c.userData.spin = Math.random() * 2;
    cubes.add(c);
  }
  g.add(cubes);

  // The pandemic: a virus (spiky icosahedron) drifting overhead
  const virus = new THREE.Group();
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1), mat(0xc0392b, { flatShading: true, emissive: 0x400000, emissiveIntensity: 0.4 }));
  virus.add(core);
  const spikeGeo = new THREE.CylinderGeometry(0.15, 0.4, 1.6, 6);
  const spikeMat = mat(0xe74c3c, { flatShading: true });
  const pos = core.geometry.attributes.position;
  const seen = new Set();
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(1)},${pos.getY(i).toFixed(1)},${pos.getZ(i).toFixed(1)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    spike.position.copy(v.clone().multiplyScalar(1.15));
    spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), spikeMat);
    knob.position.y = 1;
    spike.add(knob);
    virus.add(spike);
  }
  virus.position.set(14, 22, 6);
  virus.scale.setScalar(1.1);
  g.add(virus);

  const light = new THREE.PointLight(0x6fd39b, 2.5, 80, 2);
  light.position.set(0, 24, 12);
  g.add(light);

  g.userData.update = (dt, t) => {
    cubes.children.forEach((c, i) => {
      c.rotation.x += dt * c.userData.spin;
      c.rotation.y += dt * c.userData.spin * 0.7;
      c.position.y += Math.sin(t + i) * dt * 0.4;
    });
    virus.rotation.y += dt * 0.5;
    virus.rotation.x += dt * 0.2;
    virus.position.y = 22 + Math.sin(t * 0.8) * 1.5;
  };
  return g;
}

// ---------------------------------------------------------------------------
// 6. MEXICO — step pyramid, cactus, hot sun
// ---------------------------------------------------------------------------
function buildMexico() {
  const g = new THREE.Group();

  const ground = new THREE.Mesh(new THREE.CylinderGeometry(30, 32, 2, 6), mat(0xc98b3a, { flatShading: true }));
  ground.position.y = -1;
  g.add(ground);

  // Step pyramid (Chichén Itzá-ish)
  const stoneMat = mat(0xb5906a, { flatShading: true });
  const steps = 6;
  for (let i = 0; i < steps; i++) {
    const s = 16 - i * 2.4;
    const layer = new THREE.Mesh(new THREE.BoxGeometry(s, 2.2, s), stoneMat);
    layer.position.set(0, 1 + i * 2.2, -6);
    g.add(layer);
  }
  // Temple on top
  const temple = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), mat(0x9a744f, { flatShading: true }));
  temple.position.set(0, 1 + steps * 2.2 + 1.5, -6);
  g.add(temple);
  // Central stairway
  for (let i = 0; i < steps * 2; i++) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(3, 0.6, 0.8), stoneMat);
    st.position.set(0, 0.6 + i * 1.1, -6 + (16 - 6) / 2 - i * 0.55);
    g.add(st);
  }

  // Cactus (saguaro)
  function cactus(x, z, s = 1) {
    const c = new THREE.Group();
    const cm = mat(0x3f7d3f, { flatShading: true });
    const trunk = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 5, 4, 8), cm);
    trunk.position.y = 3.5;
    const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 2, 4, 8), cm);
    armL.position.set(-1.2, 3.6, 0); armL.rotation.z = 0.9;
    const armR = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 2, 4, 8), cm);
    armR.position.set(1.2, 4.2, 0); armR.rotation.z = -0.9;
    c.add(trunk, armL, armR);
    c.position.set(x, 0, z); c.scale.setScalar(s);
    return c;
  }
  g.add(cactus(-18, 6, 1.1), cactus(17, 8, 0.9), cactus(-14, -8, 0.8));

  // Hot sun disc
  const sun = new THREE.Mesh(new THREE.CircleGeometry(6, 32), new THREE.MeshBasicMaterial({ color: 0xffd23f }));
  sun.position.set(20, 26, -30);
  g.add(sun);
  const sunLight = new THREE.PointLight(0xffb14a, 2.6, 160, 2);
  sunLight.position.set(18, 26, -6);
  g.add(sunLight);

  g.userData.update = (dt, t) => { sun.scale.setScalar(1 + Math.sin(t) * 0.03); };
  return g;
}

// ---------------------------------------------------------------------------
// 7. VALENCIA SENIOR — podium, badge, confetti burst
// ---------------------------------------------------------------------------
function buildValenciaSenior() {
  const g = new THREE.Group();

  const ground = new THREE.Mesh(new THREE.CylinderGeometry(26, 28, 2, 40), mat(0xe8c07d, { flatShading: true }));
  ground.position.y = -1;
  g.add(ground);

  // A revisited white arch (Valencia, home)
  const white = mat(0xf3f4f2, { roughness: 0.4, flatShading: true });
  const arch = new THREE.Mesh(new THREE.TorusGeometry(9, 0.7, 8, 40, Math.PI), white);
  arch.position.set(0, 0.2, -10);
  g.add(arch);

  // Podium
  const podium = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 4, 24), mat(0xcaa15a, { metalness: 0.4, roughness: 0.3 }));
  podium.position.set(0, 2, 0);
  g.add(podium);

  // "Senior" badge — a gold star medallion floating above
  const medal = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.4, 32), mat(0xf1c40f, { metalness: 0.8, roughness: 0.2, emissive: 0x5a4600, emissiveIntensity: 0.4 }));
  medal.rotation.x = Math.PI / 2;
  medal.position.set(0, 8, 0);
  const star = makeStar(0xfff2b0);
  star.position.set(0, 8, 0.3);
  g.add(medal, star);

  const spot = new THREE.PointLight(0xffe08a, 3, 80, 2);
  spot.position.set(0, 16, 8);
  g.add(spot);

  // Confetti particle system
  const N = 600;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const vel = [];
  const palette = [0x6fd39b, 0xf1c40f, 0xe74c3c, 0x3498db, 0xffffff, 0xe056fd];
  for (let i = 0; i < N; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = Math.random() * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
    const col = new THREE.Color(palette[(Math.random() * palette.length) | 0]);
    colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b;
    vel.push((Math.random() - 0.5) * 2, -1 - Math.random() * 3, (Math.random() - 0.5) * 2);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const confetti = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ size: 0.6, vertexColors: true, transparent: true, opacity: 0.95 })
  );
  g.add(confetti);

  g.userData.update = (dt, t) => {
    medal.rotation.z += dt * 0.8;
    star.rotation.z -= dt * 0.8;
    star.position.y = 8 + Math.sin(t * 2) * 0.3;
    const p = geo.attributes.position;
    for (let i = 0; i < N; i++) {
      let y = p.getY(i) + vel[i * 3 + 1] * dt;
      let x = p.getX(i) + vel[i * 3] * dt;
      let z = p.getZ(i) + vel[i * 3 + 2] * dt;
      if (y < 0) { y = 26 + Math.random() * 6; x = (Math.random() - 0.5) * 30; }
      p.setXYZ(i, x, y, z);
    }
    p.needsUpdate = true;
  };
  return g;
}

function makeStar(color) {
  const shape = new THREE.Shape();
  const spikes = 5, outer = 1.6, inner = 0.7;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: false });
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.25, emissive: 0x6a5500, emissiveIntensity: 0.4 }));
}

// Deterministic PRNG so Earth continents look the same each load
function mulberry(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Assemble the whole world, each chapter positioned along -Z
// ---------------------------------------------------------------------------
export function buildWorld(scene) {
  const builders = [
    buildEarth,
    buildVillage,
    buildParis,
    buildValenciaUni,
    buildDatamaran2020,
    buildMexico,
    buildValenciaSenior,
  ];
  const groups = builders.map((b, i) => {
    const grp = b();
    grp.position.z = CHAPTER_Z(i);
    scene.add(grp);
    return grp;
  });

  // Starfield backdrop
  const starGeo = new THREE.BufferGeometry();
  const starN = 1500;
  const sp = new Float32Array(starN * 3);
  for (let i = 0; i < starN; i++) {
    sp[i * 3] = (Math.random() - 0.5) * 600;
    sp[i * 3 + 1] = (Math.random() - 0.5) * 600;
    sp[i * 3 + 2] = (Math.random() - 0.5) * 600;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true }));
  scene.add(stars);

  return { groups, stars };
}
