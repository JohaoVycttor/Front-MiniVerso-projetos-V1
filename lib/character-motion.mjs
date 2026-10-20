const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function characterRig(point) {
  const head = (1 - ease((Math.abs(point.x - 260) - 55) / 35)) * (1 - ease((point.y - 245) / 55));
  const arms = 1 - ease((point.y - 225) / 110);
  return { ...point, head, left: (1 - ease((point.x - 150) / 60)) * arms, right: ease((point.x - 310) / 60) * arms, chest: ease((point.y - 255) / 85) };
}

export function characterMotion(milliseconds, reduced = false) {
  const t = milliseconds / 1000;
  const sway = reduced ? 0 : Math.sin(t * .9) * .026;
  const head = reduced ? 0 : Math.sin(t * 1.15 + .3) * .046;
  const left = reduced ? 0 : Math.sin(t * 1.45) * .065;
  const right = reduced ? 0 : Math.sin(t * 1.45 + 1.1) * -.065;
  return { swaySin: Math.sin(sway), swayCos: Math.cos(sway), headSin: Math.sin(head), headCos: Math.cos(head), leftSin: Math.sin(left), leftCos: Math.cos(left), rightSin: Math.sin(right), rightCos: Math.cos(right), breath: reduced ? 0 : Math.sin(t * 1.55) * .016, nod: reduced ? 0 : Math.sin(t * 1.15) * 2.5, float: reduced ? 0 : Math.sin(t * .9) * 3 };
}

export function poseCharacter(point, motion) {
  let x = point.x, y = point.y;
  // Feathered weights keep the neck and elbows connected as each region moves.
  const rotate = (cx, cy, sin, cos, weight) => {
    const dx = point.x - cx, dy = point.y - cy;
    x += (dx * cos - dy * sin - dx) * weight;
    y += (dx * sin + dy * cos - dy) * weight;
  };
  rotate(260, 260, motion.headSin, motion.headCos, point.head);
  rotate(95, 298, motion.leftSin, motion.leftCos, point.left);
  rotate(425, 298, motion.rightSin, motion.rightCos, point.right);
  y += motion.nod * point.head;
  x += (point.x - 260) * motion.breath * point.chest;
  y -= (460 - point.y) * motion.breath * point.chest;
  const dx = x - 260, dy = y - 455;
  return { x: 260 + dx * motion.swayCos - dy * motion.swaySin, y: 455 + dx * motion.swaySin + dy * motion.swayCos + motion.float };
}
