// Real project media always takes priority. Fallbacks are explicitly illustrative.
const illustrations = {
  chemistry: '/project-science.jpg',
  campus: '/home-campus-v1.webp',
  activation: '/studio-ar-experience-v1.webp',
  safety: '/home-immersive-v1.webp',
  book: '/studio-ar-experience-v1.webp',
  platform: '/home-workstation-v1.webp',
  'prj-1': '/project-science.jpg',
  'prj-2': '/project-culture.jpg',
  'prj-3': '/home-immersive-v1.webp',
};

export function projectVisual(project) {
  if (project.cover?.src) return { asset: project.cover, illustrative: false };
  if (project.presentation?.poster) return { asset: { ...project.cover, type: 'image', src: project.presentation.poster }, illustrative: false };
  return {
    asset: { id: project.id + '-illustration', type: 'image', src: illustrations[project.id] || '/home-immersive-v1.webp', alt: 'Imagem ilustrativa do tema: ' + project.title },
    illustrative: true,
  };
}
