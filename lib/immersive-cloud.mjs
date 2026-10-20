const TAU = Math.PI * 2;
const signedPower = (v, p) => Math.sign(v) * Math.abs(v) ** p;
export function createHeadsetCloud(count = 6800) {
  let seed = 37;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  const front = (x, y) => 68 + 17 * Math.max(0, 1 - (x / 148) ** 2) * Math.max(0, 1 - (y / 83) ** 2);
  return Array.from({ length: count }, (_, i) => {
    const u = random(), v = random();
    let x, y, z, light;
    if (i < count * .34) {
      // Continuous convex faceplate with rounded corners, as in the supplied headset.
      const angle = u * TAU, radius = Math.sqrt(v);
      x = 148 * signedPower(Math.cos(angle), .57) * radius;
      y = 83 * signedPower(Math.sin(angle), .57) * radius;
      z = front(x,y);
      light = .34 + .22 * (1 - x / 148) + .2 * Math.max(0, -y / 83);
    } else if (i < count * .64) {
      const angle = u * TAU;
      const taper = .88 + .12 * Math.sin(v * Math.PI / 2);
      x = 148 * signedPower(Math.cos(angle), .57) * taper;
      y = 83 * signedPower(Math.sin(angle), .57) * taper;
      z = -69 + v * 137;
      // Sculpted nose relief at the lower, face-facing edge.
      if (y > 0) y -= 25 * Math.exp(-(x * x) / 650) * (1 - v) ** 2;
      light = v > .94 || v < .045 ? .96 : .4 + .28 * Math.max(0, -Math.cos(angle));
    } else if (i < count * .73) {
      // Separate cushion lip behind the housing.
      const angle = u * TAU, tube = v * TAU;
      x = (132 + Math.cos(tube) * 8) * signedPower(Math.cos(angle), .58);
      y = (74 + Math.cos(tube) * 7) * signedPower(Math.sin(angle), .58);
      z = -73 + Math.sin(tube) * 9;
      if (y > 0) y -= 24 * Math.exp(-(x * x) / 650);
      light = .55 + .32 * Math.max(0, Math.sin(tube));
    } else if (i < count * .93) {
      // One broad lateral headband wraps behind the faceplate; no overhead strap.
      const angle = u * Math.PI;
      x = Math.cos(angle) * 143;
      y = -10 + (v - .5) * 32 + Math.sin(angle) * 18;
      z = -43 - Math.sin(angle) * 177;
      light = v < .08 || v > .92 ? .97 : .47 + .16 * Math.sin(angle);
    } else if (i < count * .987) {
      // Flat adjustment tabs where the strap joins each side of the shell.
      const side = i % 2 ? 1 : -1;
      x = side * (145 + random() * 4);
      y = -12 + (u - .5) * 43;
      z = -60 + v * 76;
      light = u < .08 || u > .92 || v < .05 || v > .95 ? .96 : .55;
    } else {
      // Small VR mark on the otherwise clean front, also constructed from dots.
      const strokes = [[-15,-7,-10,7],[-10,7,-5,-7],[1,7,1,-7],[1,-7,10,-7],[10,-7,11,0],[11,0,1,0],[5,0,13,7]];
      const line = strokes[i % strokes.length];
      x = line[0] + (line[2]-line[0]) * u;
      y = line[1] + (line[3]-line[1]) * u + 8;
      z = front(x,y) + 1;
      light = .98;
    }
    return { x, y, z, light, alpha: .5 + light * .48 };
  });
}

export function projectPoint(point, yaw = .58, pitch = .32) {
  const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const depth = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  const y = point.y * Math.cos(pitch) - depth * Math.sin(pitch);
  const z = point.y * Math.sin(pitch) + depth * Math.cos(pitch);
  const perspective = 760 / (760 - z);
  return { x: 260 + x * perspective * 1.18, y: 284 + y * perspective * 1.18, z };
}

export function createMannequinCloud(count = 9000) {
  let seed = 109;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  const visorCount = Math.round(count * .29);
  const points = createHeadsetCloud(visorCount).map(p => ({ ...p, x: p.x * .43, y: p.y * .43 - 128, z: p.z * .43 + 31, light: Math.min(1, p.light + .12), nx: 0, ny: 0, nz: 1, visor: true }));
  const ellipsoid = (cx, cy, cz, rx, ry, rz) => {
    const theta = random() * TAU, ny = random() * 2 - 1;
    const ring = Math.sqrt(1 - ny * ny);
    const nx = ring * Math.cos(theta), nz = ring * Math.sin(theta);
    return { x: cx + rx * nx, y: cy + ry * ny, z: cz + rz * nz, nx, ny, nz };
  };
  while (points.length < count) {
    const t = random();
    let p;
    if (t < .35) {
      p = ellipsoid(0, -119, 0, 45, 63, 43);
      // The opaque visor conceals the eye region of the blank mannequin face.
      if (p.z > 10 && p.y > -161 && p.y < -99) continue;
    } else if (t < .44) {
      const angle = random() * TAU;
      p = { x: Math.cos(angle) * 23, y: -63 + random() * 48, z: Math.sin(angle) * 23 - 3, nx: Math.cos(angle), ny: 0, nz: Math.sin(angle) };
    } else if (t < .91) {
      const v = random(), angle = random() * TAU;
      // Smooth shoulder line flowing into a tapered torso, with no photo texture.
      const width = v < .2 ? 28 + 73 * Math.sin(v / .2 * Math.PI / 2) : 101 - 27 * ((v - .2) / .8);
      const depth = 32 + Math.sin(v * Math.PI) * 13;
      p = { x: width * Math.cos(angle), y: -24 + v * 176, z: depth * Math.sin(angle) - 5, nx: Math.cos(angle), ny: -.15, nz: Math.sin(angle) };
    } else {
      // Upper arms finish the recognizable mannequin silhouette.
      const side = random() < .5 ? -1 : 1;
      p = ellipsoid(side * 100, 72, -8, 19, 65, 25);
    }
    const illumination = Math.max(0, p.nx * -.35 + p.ny * -.25 + p.nz * .8);
    points.push({ ...p, light: .38 + illumination * .55, alpha: .68 + illumination * .28, visor: false });
  }
  return points;
}
