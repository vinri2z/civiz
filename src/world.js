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

  // Polar ice caps for a touch of realism
  const capMat = mat(0xeaf4ff, { flatShading: true, roughness: 0.4 });
  const capN = new THREE.Mesh(new THREE.SphereGeometry(4.4, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.26), capMat);
  const capS = new THREE.Mesh(new THREE.SphereGeometry(4.8, 16, 12, 0, Math.PI * 2, Math.PI * 0.8, Math.PI * 0.2), capMat);
  g.add(capN, capS);

  // Orbiting low-poly moon
  const moon = new THREE.Group();
  const moonBody = new THREE.Mesh(jitterVertices(new THREE.IcosahedronGeometry(2.4, 2), 0.35), mat(0x9aa0a8, { flatShading: true }));
  moon.add(moonBody);
  g.add(moon);

  // A few satellites tracing tilted orbits, solar panels catching light
  const sats = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.3), mat(0xd0d4da, { metalness: 0.6, roughness: 0.3 }));
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.6), mat(0x2b4a8a, { emissive: 0x14203f, emissiveIntensity: 0.6, flatShading: true }));
    s.add(panel);
    s.userData.a = i * 2.1;
    s.userData.r = 17 + i * 1.6;
    s.userData.tilt = 2 + i * 1.5;
    sats.add(s);
  }
  g.add(sats);

  g.userData.update = (dt) => {
    ocean.rotation.y += dt * 0.05;
    land.rotation.y += dt * 0.05;
    marker.rotation.y += dt * 0.05;
    clouds.rotation.y += dt * 0.07;
    const s = 1 + Math.sin(performance.now() * 0.004) * 0.12;
    marker.scale.setScalar(s);
    const mt = performance.now() * 0.0002;
    moon.position.set(Math.cos(mt) * 26, Math.sin(mt * 0.6) * 6, Math.sin(mt) * 26);
    moonBody.rotation.y += dt * 0.05;
    sats.children.forEach((sat) => {
      sat.userData.a += dt * 0.5;
      const a = sat.userData.a, r = sat.userData.r;
      sat.position.set(Math.cos(a) * r, Math.sin(a * 0.8) * sat.userData.tilt, Math.sin(a) * r);
      sat.rotation.y += dt;
    });
  };
  return g;
}

// ---------------------------------------------------------------------------
// 2. GAULOIS VILLAGE — Asterix-style thatched huts + palisade + menhir
// ---------------------------------------------------------------------------
function buildVillage() {
  const g = new THREE.Group();

  // Grassy island the village sits on, ringed by a sandy beach
  const beach = new THREE.Mesh(new THREE.CylinderGeometry(30, 32, 1.6, 44), mat(0xe4d5a1, { flatShading: true }));
  beach.position.y = -1.4;
  g.add(beach);
  const ground = new THREE.Mesh(new THREE.CylinderGeometry(24, 26, 2, 40), mat(0x6a8f3c, { flatShading: true }));
  ground.position.y = -1;
  g.add(ground);

  // Smoke puffs collected here so the update loop can drift them upward
  const smokers = [];
  function hut(x, z, scale = 1) {
    const h = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.3, 3.4, 12), mat(0xe7ddc4, { flatShading: true }));
    wall.position.y = 1.7;
    // Golden thatched roof (Asterix village), overhanging the walls
    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.6, 4.2, 12), mat(0xe0af43, { flatShading: true, roughness: 0.9 }));
    roof.position.y = 5.4;
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, 0.3), mat(0x5a3d1e));
    door.position.set(0, 0.9, 3.1);
    // Rough stone chimney poking through the thatch
    const chimney = new THREE.Mesh(jitterVertices(new THREE.CylinderGeometry(0.5, 0.65, 2.6, 7), 0.12), mat(0x9a9188, { flatShading: true }));
    chimney.position.set(1.3, 6.4, 0.6);
    h.add(wall, roof, door, chimney);
    // Smoke: a tiny stack of translucent puffs that recycle upward
    const smoke = new THREE.Group();
    const puffMat = new THREE.MeshStandardMaterial({ color: 0xcfd3d6, transparent: true, opacity: 0.5, flatShading: true });
    for (let i = 0; i < 4; i++) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4 + i * 0.12, 0), puffMat);
      puff.position.y = i * 0.9;
      puff.userData.o = i * 0.9;
      smoke.add(puff);
    }
    smoke.position.copy(chimney.position).add(new THREE.Vector3(0, 1.6, 0));
    h.add(smoke);
    smokers.push(smoke);
    h.position.set(x, 0, z);
    h.scale.setScalar(scale);
    h.rotation.y = Math.random() * Math.PI;
    return h;
  }
  g.add(hut(-8, 4, 1.1), hut(7, 6, 0.9), hut(2, -8, 1.0), hut(-10, -6, 0.85), hut(11, -3, 0.95));

  // Central treehouse: tall oak with a little thatched cabin in its crown
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 10, 8), mat(0x6b4a2a, { flatShading: true }));
  trunk.position.y = 5;
  const crown = new THREE.Mesh(jitterVertices(new THREE.IcosahedronGeometry(4.2, 1), 1), mat(0x2f7a3f, { flatShading: true }));
  crown.position.y = 11;
  const cabin = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 2, 10), mat(0xe7ddc4, { flatShading: true }));
  cabin.position.y = 9.2;
  const cabinRoof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 2.2, 10), mat(0xe0af43, { flatShading: true, roughness: 0.9 }));
  cabinRoof.position.y = 11.3;
  tree.add(trunk, cabin, cabinRoof, crown);
  tree.position.set(0, 0, 2);
  g.add(tree);

  // Seagulls wheeling over the village
  const gulls = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const gull = new THREE.Group();
    const w = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.4), mat(0xf3f3f0));
    const w2 = w.clone();
    w.rotation.z = 0.35; w2.rotation.z = -0.35;
    gull.add(w, w2);
    gull.userData.a = i * 1.05;
    gull.userData.r = 16 + (i % 3) * 4;
    gulls.add(gull);
  }
  gulls.position.set(0, 16, 0);
  g.add(gulls);

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

  // Roasting boar on a spit over the fire (banquet incoming)
  const boar = new THREE.Group();
  const boarBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 1.8, 6, 10), mat(0x6e4326, { flatShading: true }));
  boarBody.rotation.z = Math.PI / 2;
  boarBody.position.y = 2.6;
  const spit = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.4, 6), mat(0x3a2a18));
  spit.rotation.z = Math.PI / 2;
  spit.position.y = 2.6;
  boar.add(spit, boarBody);
  [-1.6, 1.6].forEach((x) => {
    const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2, 5), mat(0x3a2a18));
    fork.position.set(x, 1.3, 0);
    boar.add(fork);
  });
  g.add(boar);

  // Long banquet table with benches
  const table = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 2.4), mat(0xb5895a, { flatShading: true }));
  top.position.y = 2;
  table.add(top);
  [-3.6, 3.6].forEach((x) => [-1, 1].forEach((z) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2, 0.4), mat(0x7a5230));
    leg.position.set(x, 1, z);
    table.add(leg);
  }));
  [-1.8, 1.8].forEach((z) => {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, 0.9), mat(0x8a6a3a, { flatShading: true }));
    bench.position.set(0, 1.1, z);
    table.add(bench);
  });
  table.position.set(9, 0, 12);
  table.rotation.y = 0.3;
  g.add(table);

  // A stone well with a little roof
  const well = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.6, 16, 1, true), mat(0x8b8f93, { flatShading: true, side: THREE.DoubleSide }));
  ring.position.y = 0.8;
  const wwater = new THREE.Mesh(new THREE.CircleGeometry(1.4, 16), new THREE.MeshStandardMaterial({ color: 0x2b6fa3, metalness: 0.6, roughness: 0.2 }));
  wwater.rotation.x = -Math.PI / 2;
  wwater.position.y = 1.35;
  [-1.7, 1.7].forEach((x) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3, 6), mat(0x7a5230));
    post.position.set(x, 2.2, 0);
    well.add(post);
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.6, 6), mat(0x7a5230));
  beam.rotation.z = Math.PI / 2;
  beam.position.y = 3.6;
  const wroof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.4, 4), mat(0x9c6b2f, { flatShading: true }));
  wroof.rotation.y = Math.PI / 4;
  wroof.position.y = 4.5;
  well.add(ring, wwater, beam, wroof);
  well.position.set(-12, 0, 2);
  g.add(well);

  // Painted shields hung along the palisade
  const shieldColors = [0xc0392b, 0x2980b9, 0xf1c40f];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const sh = new THREE.Mesh(new THREE.CircleGeometry(0.9, 16), mat(shieldColors[i % 3], { flatShading: true }));
    sh.position.set(Math.cos(a) * 20.3, 2.4, Math.sin(a) * 20.3);
    sh.lookAt(0, 2.4, 0);
    g.add(sh);
  }

  g.userData.update = (dt, t, local = 0) => {
    fire.scale.y = 1 + Math.sin(t * 12) * 0.18;
    fireLight.intensity = 2.6 + Math.sin(t * 14) * 0.9;
    boarBody.rotation.x += dt * 0.7; // turn the spit
    // Chimney smoke rises and fades; wind picks up as you scroll through
    const rise = 1 + local * 1.6;
    smokers.forEach((smoke) => {
      smoke.children.forEach((puff) => {
        puff.userData.o += dt * rise;
        if (puff.userData.o > 4) puff.userData.o = 0;
        puff.position.y = puff.userData.o;
        puff.position.x = Math.sin(puff.userData.o * 1.4 + t) * 0.3 * local;
        puff.material.opacity = 0.5 * (1 - puff.userData.o / 4);
      });
    });
    // Gulls circle; the flock tightens and lifts as the chapter advances
    gulls.children.forEach((gu) => {
      gu.userData.a += dt * 0.4;
      const a = gu.userData.a, r = gu.userData.r - local * 4;
      gu.position.set(Math.cos(a) * r, Math.sin(a * 2) * 1.6 + local * 3, Math.sin(a) * r);
      gu.rotation.y = -a;
      gu.children[0].rotation.z = 0.35 + Math.sin(t * 6 + a) * 0.25;
      gu.children[1].rotation.z = -0.35 - Math.sin(t * 6 + a) * 0.25;
    });
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

  // Formal parterre hedges flanking the plaza
  const hedgeMat = mat(0x2f6b3f, { flatShading: true });
  [-1, 1].forEach((sx) => {
    const hedge = new THREE.Mesh(new THREE.BoxGeometry(6, 1.2, 10), hedgeMat);
    hedge.position.set(sx * 18, 0.6, 14);
    g.add(hedge);
  });

  // Topiary trees lining the approach
  const topiary = (x, z) => {
    const t = new THREE.Group();
    const tk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.6, 6), mat(0x5a3d1e));
    tk.position.y = 0.8;
    const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 1), mat(0x357a45, { flatShading: true }));
    ball.position.y = 2.4;
    t.add(tk, ball);
    t.position.set(x, 0, z);
    return t;
  };
  for (let i = 0; i < 4; i++) {
    const z = 16 - i * 8;
    g.add(topiary(-22, z), topiary(22, z));
  }

  // Gas lampposts with a warm glow
  const lamppost = (x, z) => {
    const l = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 5, 8), mat(0x2b2b2b, { metalness: 0.5 }));
    pole.position.y = 2.5;
    const glob = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffe6a8 }));
    glob.position.y = 5.2;
    const gl = new THREE.PointLight(0xffd9a0, 0.8, 18, 2);
    gl.position.y = 5.2;
    l.add(pole, glob, gl);
    l.position.set(x, 0, z);
    return l;
  };
  g.add(lamppost(-10, 16), lamppost(10, 16));

  // Central fountain with a shimmering jet
  const fountain = new THREE.Group();
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 1, 24), mat(0xcbb994, { flatShading: true }));
  basin.position.y = 0.5;
  const waterF = new THREE.Mesh(new THREE.CircleGeometry(3.2, 24), new THREE.MeshStandardMaterial({ color: 0x3a7fb5, metalness: 0.7, roughness: 0.15 }));
  waterF.rotation.x = -Math.PI / 2;
  waterF.position.y = 1.02;
  const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 3, 8), new THREE.MeshStandardMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.5 }));
  jet.position.y = 2.4;
  fountain.add(basin, waterF, jet);
  fountain.position.set(0, 0, 6);
  g.add(fountain);

  // Tricolore flags atop the main palace
  [0x0055a4, 0xffffff, 0xef4135].forEach((c, i) => {
    const px = -4 + i * 4;
    const fpole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4, 6), mat(0x777777));
    fpole.position.set(px, 20, -6);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.2), new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, flatShading: true }));
    flag.position.set(px + 1, 21.4, -6);
    g.add(fpole, flag);
  });

  g.userData.update = (dt, t) => {
    jet.scale.y = 1 + Math.sin(t * 3) * 0.15;
    jet.position.y = 2.4 + Math.sin(t * 3) * 0.2;
  };
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

  // Calatrava-style ribbed arches (half torus). At night the Ciutat de les
  // Arts glows blue — each arch has its own emissive material so we can light
  // them up one by one as the visitor scrolls through.
  const arches = [];
  for (let i = 0; i < 5; i++) {
    const r = 6 + i * 2.4;
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f2, roughness: 0.4, metalness: 0.05, flatShading: true,
      emissive: 0x2a6fb0, emissiveIntensity: 0,
    });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(r, 0.5, 8, 40, Math.PI), archMat);
    arch.rotation.z = 0;
    arch.position.set(0, 0.2, -6 - i * 0.1);
    arches.push(arch);
    g.add(arch);
  }

  // Cool blue wash so the reflecting pool reads as night water
  const nightGlow = new THREE.PointLight(0x3a7fd0, 0, 90, 2);
  nightGlow.position.set(0, 8, 6);
  g.add(nightGlow);

  // Valencia coat-of-arms mosaic set into the lawn (as on the UPV campus):
  // a pale disc with the red-and-gold Senyera stripes across a shield.
  const seal = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CircleGeometry(4.4, 40), mat(0xece7d6, { roughness: 0.8 }));
  seal.add(disc);
  const shield = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.34), new THREE.MeshBasicMaterial({ color: 0xd21f26 }));
    stripe.position.set(0, 1.05 - i * 0.52, 0.02);
    shield.add(stripe);
  }
  const gold = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.3), new THREE.MeshBasicMaterial({ color: 0xf2c53d }));
  gold.position.z = 0.01;
  shield.add(gold);
  shield.position.z = 0.03;
  seal.add(shield);
  seal.rotation.x = -Math.PI / 2;
  seal.position.set(0, 0.05, 14);
  g.add(seal);

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
  g.userData.update = (dt, t, local = 0) => {
    gear.rotation.z += dt * 0.4;
    // Light the arches on, one after another, as the chapter scrolls past.
    arches.forEach((arch, i) => {
      const on = Math.min(1, Math.max(0, local * arches.length - i));
      arch.material.emissiveIntensity = on * (0.7 + Math.sin(t * 3 + i) * 0.12);
    });
    nightGlow.intensity = local * 2.4;
  };

  const sun = new THREE.PointLight(0xfff2cc, 2.2, 120, 2);
  sun.position.set(10, 30, 20);
  g.add(sun);

  // L'Assut de l'Or — a leaning white pylon with harp cables
  const bridge = new THREE.Group();
  const lean = 0.32;
  const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 20, 12), white);
  pylon.position.y = 10;
  pylon.rotation.z = lean;
  bridge.add(pylon);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(24, 0.6, 3), mat(0xdadedb, { flatShading: true }));
  deck.position.set(6, 0.6, 0);
  bridge.add(deck);
  const tip = new THREE.Vector3(-Math.sin(lean) * 20, Math.cos(lean) * 20, 0);
  for (let i = 0; i < 9; i++) {
    const anchor = new THREE.Vector3(-2 + i * 2.2, 0.9, 0);
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 4), mat(0xf0f0ee));
    cable.position.copy(anchor.clone().add(tip).multiplyScalar(0.5));
    cable.scale.y = anchor.distanceTo(tip);
    cable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tip.clone().sub(anchor).normalize());
    bridge.add(cable);
  }
  bridge.position.set(20, 0, 10);
  bridge.scale.setScalar(0.7);
  g.add(bridge);

  // Palms around the reflecting pool
  const palm = (x, z) => {
    const pm = new THREE.Group();
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 7, 7), mat(0x7a5a3a, { flatShading: true }));
    tr.position.y = 3.5;
    pm.add(tr);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.5, 4, 4), mat(0x3f8f4f, { flatShading: true }));
      frond.position.set(Math.cos(a) * 1.6, 6.8, Math.sin(a) * 1.6);
      frond.rotation.z = Math.cos(a) * 0.9;
      frond.rotation.x = Math.sin(a) * 0.9;
      pm.add(frond);
    }
    pm.position.set(x, 0, z);
    return pm;
  };
  g.add(palm(-24, 12), palm(24, 12), palm(-24, -12));

  // Ghost reflections of the arches in the pool
  for (let i = 0; i < 5; i++) {
    const r = 6 + i * 2.4;
    const refl = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.5, 8, 40, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xf3f4f2, roughness: 0.4, transparent: true, opacity: 0.22, flatShading: true })
    );
    refl.rotation.z = Math.PI;
    refl.position.set(0, -0.6, -6 - i * 0.1);
    g.add(refl);
  }

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

  // A slowly rotating wireframe globe overhead — data drawn from everywhere
  const globe = new THREE.Group();
  const globeWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3, 2),
    new THREE.MeshBasicMaterial({ color: 0x6fd39b, wireframe: true, transparent: true, opacity: 0.6 })
  );
  const globeCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.6, 1),
    mat(0x0e5c42, { emissive: 0x0e5c42, emissiveIntensity: 0.5, flatShading: true, transparent: true, opacity: 0.5 })
  );
  globe.add(globeWire, globeCore);
  globe.position.set(14, 22, 6);
  globe.scale.setScalar(1.1);
  g.add(globe);

  const light = new THREE.PointLight(0x6fd39b, 2.5, 80, 2);
  light.position.set(0, 24, 12);
  g.add(light);

  // Secondary glass towers forming a small skyline
  const skyMat = new THREE.MeshStandardMaterial({
    color: 0x1f9e78, metalness: 0.6, roughness: 0.2,
    transparent: true, opacity: 0.5, emissive: 0x08301f, emissiveIntensity: 0.4,
  });
  [[-14, 16, 18], [13, 20, -12], [-16, 14, -14]].forEach(([x, h, z]) => {
    const t = new THREE.Mesh(new THREE.BoxGeometry(6, h, 6), skyMat);
    t.position.set(x, h / 2, z);
    g.add(t);
  });

  // A lit workstation at the base — the human in the loop
  const desk = new THREE.Group();
  const dtop = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 2.4), mat(0x1a1d22, { metalness: 0.4 }));
  dtop.position.y = 1.4;
  const screen = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 0.15), new THREE.MeshStandardMaterial({ color: 0x0e1116, emissive: 0x2fd39b, emissiveIntensity: 0.8 }));
  screen.position.set(0, 2.7, -0.8);
  desk.add(dtop, screen);
  [-2.2, 2.2].forEach((x) => [-1, 1].forEach((z) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 0.2), mat(0x14171b));
    leg.position.set(x, 0.7, z);
    desk.add(leg);
  }));
  desk.position.set(-12, 0, 14);
  desk.rotation.y = 0.5;
  g.add(desk);

  // Data streams rising from the desk into the data cloud
  const streamMat = new THREE.LineBasicMaterial({ color: 0x6fd39b, transparent: true, opacity: 0.45 });
  for (let i = 0; i < 10; i++) {
    const geoL = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-12, 3, 14),
      new THREE.Vector3((Math.random() - 0.5) * 24, 6 + Math.random() * 18, (Math.random() - 0.5) * 20),
    ]);
    g.add(new THREE.Line(geoL, streamMat));
  }

  g.userData.update = (dt, t, local = 0) => {
    cubes.children.forEach((c, i) => {
      c.rotation.x += dt * c.userData.spin;
      c.rotation.y += dt * c.userData.spin * 0.7;
      c.position.y += Math.sin(t + i) * dt * 0.4;
      // As you scroll in, scattered cubes converge toward the tower — data
      // becoming structured intelligence.
      c.scale.setScalar(0.6 + local * 0.7);
    });
    globe.rotation.y += dt * 0.5;
    globe.rotation.x += dt * 0.2;
    globe.position.y = 22 + Math.sin(t * 0.8) * 1.5;
    globe.scale.setScalar(1.1 + local * 0.3);
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

  // Serpent heads (Kukulcán) guarding the stairway foot
  const stairFoot = -6 + (16 - 6) / 2 + 1.4;
  const serpMat = mat(0x8a6a45, { flatShading: true });
  [-1.8, 1.8].forEach((x) => {
    const head = new THREE.Mesh(jitterVertices(new THREE.BoxGeometry(1.4, 1.4, 2.4), 0.2), serpMat);
    head.position.set(x, 0.8, stairFoot);
    const snout = new THREE.Mesh(new THREE.BoxGeometry(1, 0.7, 1.2), serpMat);
    snout.position.set(x, 0.5, stairFoot + 1.6);
    g.add(head, snout);
  });

  // Spiky agave plants
  const agave = (x, z, s = 1) => {
    const a = new THREE.Group();
    const am = mat(0x6b8f3c, { flatShading: true });
    for (let i = 0; i < 9; i++) {
      const ang = (i / 9) * Math.PI * 2;
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.6, 4), am);
      blade.position.set(Math.cos(ang) * 0.6, 1.1, Math.sin(ang) * 0.6);
      blade.rotation.z = Math.cos(ang) * 0.8;
      blade.rotation.x = Math.sin(ang) * 0.8;
      a.add(blade);
    }
    a.position.set(x, 0, z);
    a.scale.setScalar(s);
    return a;
  };
  g.add(agave(-20, -4, 1.1), agave(20, -2, 0.9), agave(8, 12, 1));

  // Scattered desert rocks
  const rockMat = mat(0x9c7a52, { flatShading: true });
  for (let i = 0; i < 10; i++) {
    const rr = new THREE.Mesh(jitterVertices(new THREE.IcosahedronGeometry(0.6 + Math.random() * 0.8, 0), 0.3), rockMat);
    rr.position.set((Math.random() - 0.5) * 48, 0.3, (Math.random() - 0.5) * 30 + 8);
    g.add(rr);
  }

  // --- Querétaro colonial quarter (Jardín Zenea): the Mexico Vincent lived in ---
  // Terracotta arcade building with a portico of rounded arches
  const arcade = new THREE.Group();
  const arcadeBody = new THREE.Mesh(new THREE.BoxGeometry(20, 7, 5), mat(0xd66a2e, { flatShading: true }));
  arcadeBody.position.y = 3.5;
  arcade.add(arcadeBody);
  const arcRoof = new THREE.Mesh(new THREE.BoxGeometry(21, 0.8, 6), mat(0xb04f22, { flatShading: true }));
  arcRoof.position.y = 7.4;
  arcade.add(arcRoof);
  for (let i = 0; i < 6; i++) {
    const x = -8.5 + i * 3.4;
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 5, 0.7), mat(0xe9d9b8, { flatShading: true }));
    pillar.position.set(x, 2.5, 2.6);
    arcade.add(pillar);
    const archTop = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.35, 6, 16, Math.PI), mat(0xe9d9b8, { flatShading: true }));
    archTop.position.set(x + 1.7, 5, 2.6);
    arcade.add(archTop);
  }
  arcade.position.set(-16, 0, 16);
  arcade.rotation.y = 0.35;
  g.add(arcade);

  // Baroque church: tiered stone bell tower topped by a coppery dome + cross
  const church = new THREE.Group();
  const churchStone = mat(0xc9a37a, { flatShading: true });
  const nave = new THREE.Mesh(new THREE.BoxGeometry(9, 9, 12), churchStone);
  nave.position.y = 4.5;
  church.add(nave);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(3.4, 14, 3.4), churchStone);
  tower.position.set(-4.5, 7, 4);
  church.add(tower);
  const belfry = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), mat(0xdcc39c, { flatShading: true }));
  belfry.position.set(-4.5, 15.2, 4);
  church.add(belfry);
  const towerDome = new THREE.Mesh(new THREE.SphereGeometry(1.9, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xb07038, { metalness: 0.4, roughness: 0.4, flatShading: true }));
  towerDome.position.set(-4.5, 16.7, 4);
  church.add(towerDome);
  const bigDome = new THREE.Mesh(new THREE.SphereGeometry(3.6, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xba7a42, { metalness: 0.4, roughness: 0.4, flatShading: true }));
  bigDome.position.set(1.5, 9, 0);
  church.add(bigDome);
  [[-4.5, 18.6, 4], [1.5, 12.9, 0]].forEach(([cx, cy, cz]) => {
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.2, 0.16), mat(0x6a4a2a));
    v.position.set(cx, cy, cz);
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, 0.16), mat(0x6a4a2a));
    h.position.set(cx, cy + 0.2, cz);
    church.add(v, h);
  });
  church.position.set(15, 0, 14);
  church.rotation.y = -0.4;
  g.add(church);

  // Manicured round topiaries of the Jardín, framing a stone fountain
  const topiary = (x, z, s = 1) => {
    const tp = new THREE.Group();
    const tk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 2, 6), mat(0x5a3d1e));
    tk.position.y = 1;
    const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), mat(0x2f7a3f, { flatShading: true }));
    ball.position.y = 3;
    tp.add(tk, ball);
    tp.position.set(x, 0, z); tp.scale.setScalar(s);
    return tp;
  };
  g.add(topiary(-4, 20, 1.1), topiary(4, 20, 0.9), topiary(-7, 24, 1), topiary(7, 24, 1));

  const fountain = new THREE.Group();
  const fBasin = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3, 1.2, 20), mat(0xb8a382, { flatShading: true }));
  fBasin.position.y = 0.6;
  const fWater = new THREE.Mesh(new THREE.CircleGeometry(2.4, 20), new THREE.MeshStandardMaterial({ color: 0x3a7fb5, metalness: 0.6, roughness: 0.2 }));
  fWater.rotation.x = -Math.PI / 2; fWater.position.y = 1.22;
  const fStem = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.6, 10), mat(0xcbb994, { flatShading: true }));
  fStem.position.y = 2;
  const fJet = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.35, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.55 }));
  fJet.position.y = 3.4;
  fountain.add(fBasin, fWater, fStem, fJet);
  fountain.position.set(0, 0, 22);
  g.add(fountain);

  // Hazy sierra on the horizon
  const sierra = new THREE.Mesh(jitterVertices(new THREE.ConeGeometry(14, 8, 5), 2), mat(0x6f5a78, { flatShading: true }));
  sierra.position.set(-6, 3, -34);
  sierra.scale.set(2.4, 1, 1);
  g.add(sierra);

  // Vultures circling overhead
  const birds = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Group();
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.5), mat(0x2b2b2b));
    const wing2 = wing.clone();
    wing.rotation.z = 0.3;
    wing2.rotation.z = -0.3;
    b.add(wing, wing2);
    b.userData.a = i * 1.6;
    birds.add(b);
  }
  birds.position.set(0, 20, -6);
  g.add(birds);

  g.userData.update = (dt, t, local = 0) => {
    sun.scale.setScalar(1 + Math.sin(t) * 0.03);
    birds.children.forEach((b) => {
      const a = t * 0.4 + b.userData.a;
      b.position.set(Math.cos(a) * 14, Math.sin(a * 2) * 1.5, Math.sin(a) * 14);
      b.rotation.y = -a;
    });
    // Fountain jet swells as you arrive in the plaza
    fJet.scale.y = (0.4 + local) * (1 + Math.sin(t * 3) * 0.12);
    fJet.position.y = 3.4 + Math.sin(t * 3) * 0.15;
  };
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

  // Balloons drifting up on loop
  const balloons = new THREE.Group();
  const bPal = [0x6fd39b, 0xf1c40f, 0xe74c3c, 0x3498db, 0xe056fd];
  for (let i = 0; i < 12; i++) {
    const bl = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), mat(bPal[i % 5], { roughness: 0.3, metalness: 0.1 }));
    bl.scale.y = 1.2;
    bl.userData.base = Math.random() * 30;
    bl.userData.x = (Math.random() - 0.5) * 24;
    bl.userData.z = (Math.random() - 0.5) * 16 - 4;
    bl.userData.sp = 1.5 + Math.random() * 2;
    const str = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2, 4), mat(0xdddddd));
    str.position.y = -1.4;
    bl.add(str);
    balloons.add(bl);
  }
  g.add(balloons);

  // Twin poles holding a celebratory banner
  [-8, 8].forEach((x) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 12, 8), mat(0xbbbbbb, { metalness: 0.5 }));
    pole.position.set(x, 6, -6);
    g.add(pole);
  });
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(14, 3), new THREE.MeshStandardMaterial({ color: 0x8e44ad, side: THREE.DoubleSide, emissive: 0x2a0d33, emissiveIntensity: 0.3, flatShading: true }));
  banner.position.set(0, 10, -6);
  g.add(banner);

  // Laurel wreath framing the medal
  const laurel = new THREE.Group();
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.7, 4), mat(0x2f8f4f, { flatShading: true }));
    leaf.position.set(Math.cos(a) * 2.7, Math.sin(a) * 2.7, 0);
    leaf.rotation.z = a + Math.PI / 2;
    laurel.add(leaf);
  }
  laurel.position.set(0, 8, -0.2);
  g.add(laurel);

  // Sweeping celebration spotlights
  const beamL = new THREE.SpotLight(0x9fd0ff, 3, 60, 0.5, 0.4);
  beamL.position.set(-14, 20, 10);
  const beamR = new THREE.SpotLight(0xffd9a0, 3, 60, 0.5, 0.4);
  beamR.position.set(14, 20, 10);
  const tgtL = new THREE.Object3D();
  tgtL.position.set(0, 4, 0);
  const tgtR = new THREE.Object3D();
  tgtR.position.set(0, 4, 0);
  beamL.target = tgtL;
  beamR.target = tgtR;
  g.add(beamL, beamR, tgtL, tgtR);

  g.userData.update = (dt, t, local = 0) => {
    medal.rotation.z += dt * 0.8;
    star.rotation.z -= dt * 0.8;
    star.position.y = 8 + Math.sin(t * 2) * 0.3;
    // The medal swells and the confetti thickens as the finale scrolls in
    medal.scale.setScalar(1 + local * 0.25 + Math.sin(t * 3) * 0.03);
    confetti.material.opacity = 0.35 + local * 0.6;
    confetti.material.size = 0.4 + local * 0.4;
    spot.intensity = 2 + local * 2.5;
    laurel.rotation.z += dt * 0.8;
    balloons.children.forEach((bl) => {
      bl.userData.base += dt * bl.userData.sp;
      if (bl.userData.base > 34) bl.userData.base = 0;
      bl.position.set(bl.userData.x, bl.userData.base, bl.userData.z);
    });
    banner.rotation.z = Math.sin(t * 1.5) * 0.03;
    banner.position.y = 10 + Math.sin(t) * 0.15;
    tgtL.position.x = Math.sin(t * 0.7) * 8;
    tgtR.position.x = -Math.sin(t * 0.7) * 8;
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
