// Retain custom CMS photography; replace the original bundled hero defaults.
const originalHeroes = new Set([
  '/hero-vr.jpg', '/home-vr-background.jpg', '/studio-background.png',
  '/solutions-vr.jpg', '/contact-vr.png', '/contact-vr-portrait.jpg',
  '/portfolio/images/vr-background.webp', '/portfolio/images/vr-background.png',
]);
export function editorialHeroImage(src, portrait = false) {
  return src && !originalHeroes.has(src) ? src : portrait
    ? '/images/vr-immersive-editorial.webp' : '/images/vr-headset-editorial.webp';
}
