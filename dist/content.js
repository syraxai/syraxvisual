// Conteúdo editorial. Para incluir um projeto, adicione um objeto neste array.
// Mantenha as mídias em assets/. Nenhum vídeo do portfólio é carregado antes do clique.
export const projects = [
  { id:'studio', title:'Possibilidades em cena', category:'AI Film / Produto', duration:'00:10', format:'16:9', src:'./assets/studio.mp4', poster:'./assets/studio-poster.jpg', alt:'Cena de produto com um frasco de perfume sob iluminação cinematográfica azul', description:'Filme conceitual da SYRAX Visual. Um estudo de cenas, produtos e possibilidades da produção com IA.' },
  { id:'chronos', title:'AETERNO Chronos', category:'Product Film / Luxury Watch', duration:'00:05', format:'16:9', src:'./assets/aeterno-chronos.mp4', poster:'./assets/aeterno-chronos-poster.jpg', alt:'Relógio premium AETERNO Chronos em fotografia publicitária escura e cinematográfica', description:'Filme publicitário conceitual para um relógio premium, explorando metal, vidro, reflexos e fotografia cinematográfica de produto.' }
];
export const services = [
  { title:'Comerciais com IA', description:'Produções publicitárias cinematográficas para marcas, empresas e produtos.', icon:'film' },
  { title:'Reels e conteúdo social', description:'Conteúdo vertical pensado para Instagram, TikTok, campanhas e social media.', icon:'phone' },
  { title:'Produtos', description:'Transformamos fotografias e referências de produtos em campanhas visuais.', icon:'box' },
  { title:'Pessoas e personagens', description:'Criação de cenas utilizando referências autorizadas de pessoas, preservando identidade e consistência visual.', icon:'person' },
  { title:'Voz e narração', description:'Narrações, sound design e integração de voz em produções audiovisuais.', icon:'wave' },
  { title:'Campanhas', description:'Criação de múltiplas peças a partir de um mesmo conceito visual.', icon:'layers' }
];
export const process = [
  ['Referências','O cliente envia fotos, produto, marca, informações e objetivo.'],
  ['Conceito','A SYRAX desenvolve roteiro, direção visual e estrutura das cenas.'],
  ['Produção','As cenas são produzidas e refinadas com diferentes ferramentas de Inteligência Artificial.'],
  ['Entrega','O projeto é finalizado nos formatos necessários para redes sociais, publicidade ou outras plataformas.']
];
// Preencha somente com os contatos comerciais oficiais fornecidos pela SYRAX.
export const contactConfig = {
  instagramUrl: 'https://www.instagram.com/syrax.visual/',
  whatsappNumber: null, // Ex.: país + DDD + número, apenas dígitos.
  endpoint: null // Opcional: endpoint que aceite POST JSON e retorne 2xx após receber o briefing.
};
