// Stratified samples preserve facial features without duplicate points or clumps.
export function samplePortraitPixels(pixels, size = 520) {
  const points = [];
  let seed = 71;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  const luminance = (x, y) => {
    const i = (Math.max(0, Math.min(size - 1, y)) * size + Math.max(0, Math.min(size - 1, x))) * 4;
    return Math.max(pixels[i] * .85, pixels[i + 1], pixels[i + 2] * .72) / 255;
  };
  for (let gy = 30; gy < 489; gy += 2.6) for (let gx = 26; gx < 495; gx += 2.6) {
    const x = Math.floor(gx + random() * 1.8), y = Math.floor(gy + random() * 1.8);
    const light = luminance(x, y);
    if (pixels[(y * size + x) * 4 + 3] < 80 || light < .135) continue;
    const edge = Math.min(1, (Math.abs(luminance(x + 2, y) - luminance(x - 2, y)) + Math.abs(luminance(x, y + 2) - luminance(x, y - 2))) * 3);
    const face = x > 190 && x < 335 && y > 80 && y < 275;
    const hands = y > 65 && y < 205;
    if (!face && !hands && random() > .54 + light * .65 + edge * .2) continue;
    const fade = Math.max(0, Math.min(1, (489 - y) / 32, (x - 26) / 16, (495 - x) / 16));
    const brightness = Math.min(1, Math.pow(light, .65) + edge * .13);
    points.push({ x: x + random() * .35, y: y + random() * .35, z: (light - .4) * 25, light: brightness, alpha: (.65 + brightness * .35) * fade, detail: face || hands || edge > .3 });
  }
  return points;
}
