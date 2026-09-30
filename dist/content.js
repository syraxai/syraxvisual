// Conteúdo editorial. Para incluir um projeto, adicione um objeto neste array.
// Mantenha as mídias em assets/. Nenhum vídeo do portfólio é carregado antes do clique.
export const projects = [
  { id:'studio', title:'Possibilidades em cena', category:'AI Film / Produto', duration:'00:10', format:'16:9', src:'./assets/studio.mp4', poster:'./assets/studio-poster.jpg', alt:'Cena de produto com um frasco de perfume sob iluminação cinematográfica azul', description:'Filme conceitual da SYRAX Visual. Um estudo de cenas, produtos e possibilidades da produção com IA.' },
  { id:'identity', title:'Uma marca em movimento', category:'Brand Film / Identidade', duration:'00:08', format:'9:16', src:'./assets/film.mp4', poster:'./assets/identity-poster.jpg', alt:'Símbolo da SYRAX Visual iluminado em ciano na vinheta da marca', description:'Vinheta da SYRAX Visual em formato vertical, criada a partir da identidade oficial da marca.' }
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
  instagramUrl: null,
  whatsappNumber: null, // Ex.: país + DDD + número, apenas dígitos.
  endpoint: null // Opcional: endpoint que aceite POST JSON e retorne 2xx após receber o briefing.
};
