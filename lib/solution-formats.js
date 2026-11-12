const simplify = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const isExperienceFormat = title => /realidade virtual|realidade aumentada|realidade mista|360/.test(simplify(title));
const formats = {
 vr: {code:'VR',name:'Realidade virtual',context:'Dentro de um ambiente digital',device:'Óculos de realidade virtual',interaction:'Explorar e interagir com o cenário',application:'Aulas práticas, simulações e treinamentos'},
 ar: {code:'AR',name:'Realidade aumentada',context:'Conteúdo digital no mundo real',device:'Celular ou tablet',interaction:'Apontar a câmera e explorar o conteúdo',application:'Materiais didáticos, objetos e espaços'},
 mr: {code:'MR',name:'Realidade mista',context:'O físico e o digital, juntos',device:'Dispositivo compatível com realidade mista',interaction:'Relacionar elementos virtuais ao espaço',application:'Atividades e demonstrações interativas'},
 panorama: {code:'360°',name:'Vídeos 360°',context:'Um lugar visto em todas as direções',device:'Celular, computador ou óculos VR',interaction:'Olhar ao redor e escolher o ponto de vista',application:'Visitas virtuais, cultura e apresentação de espaços'},
};
export function formatProfile(title='') {
 const value=simplify(title);
 const key=value.includes('aumentada')?'ar':value.includes('mista')?'mr':value.includes('360')?'panorama':'vr';
 return {key,...formats[key]};
}
