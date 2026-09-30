# SYRAX Visual

Site institucional estático, sem dependências de produção. HTML semântico, CSS responsivo e módulos JavaScript nativos. Os arquivos originais na pasta superior foram preservados.

## Executar

Com Node.js 22 ou superior:

```sh
npm run dev
```

Acesse http://127.0.0.1:4173. `npm run build` verifica sintaxe, arquivos, âncoras, IDs e os atributos do hero. O diretório `dist/` já contém o site completo e pode ser servido por qualquer hospedagem estática; não há instalação de pacotes nem compilação adicional.

## Estrutura

- `dist/index.html`: estrutura semântica das seções e metadados.
- `dist/styles.css`: identidade, componentes, estados e breakpoints.
- `dist/content.js`: projetos, serviços, etapas e configuração comercial.
- `dist/app.js`: navegação, vídeo, modal, comparação, animações e formulário.
- `dist/assets/`: cópias dos materiais oficiais e capas extraídas dos vídeos.
- `scripts/serve.mjs`: servidor local, incluindo suporte a HTTP Range para vídeo.
- `scripts/check.mjs`: verificação do site.
- `.openai/hosting.json`: identidade da publicação privada no Sites.
- `qa/`: evidências locais de revisão; não fazem parte da publicação.

## Materiais identificados

| Original | Uso no site |
| --- | --- |
| `../193.png` | Logo oficial, reproduzida byte a byte em `assets/193.png`, header, footer, favicon e referência |
| `../AI_visual_production_studio_video_20260926024615.mp4` | `assets/studio.mp4`: hero e filme conceitual; 1920 × 1080, 10 segundos |
| `../hf_20260921_200416_90746e88-2567-4ccb-8587-0ff03ef66f49.mp4` | `assets/film.mp4`: vinheta vertical da marca; 720 × 1280, 8,05 segundos |

Os posters são quadros extraídos desses vídeos. Não há mídia de banco nem imagens geradas. A comparação apresenta a logo original e um quadro da vinheta, identificados como estudo da própria marca. Para outro caso, substitua as fontes, textos alternativos e legenda do componente `#comparison`. O painel de resultado também pode receber um `<video muted playsinline preload="none" poster="…">` com reprodução mediante ação do visitante.

## Adicionar projetos

Adicione a mídia em `dist/assets/` e um objeto em `projects` no `dist/content.js`. Campos: `id`, `title`, `category`, `duration`, `format`, `src`, `poster`, `alt`, `description`. A grade e o modal usam o mesmo array. Use nomes relativos e únicos. O vídeo de cada projeto só é carregado quando aberto; começa mudo e tem controles para reprodução voluntária com áudio.

## Contato comercial — pendências

O briefing fornecido não contém Instagram, número comercial nem backend. Nada foi inventado e nenhum dado é enviado a serviços externos no modo atual.

Configure `contactConfig` em `dist/content.js`:

- `instagramUrl`: URL oficial completa; substitui a indicação “Em breve” no rodapé.
- `whatsappNumber`: país + DDD + número, apenas dígitos. O botão prepara a mensagem e abre o WhatsApp para o visitante revisar e enviar.
- `endpoint`: opcional, URL de um backend real que aceite POST JSON com `name`, `company`, `contact`, `type` e `idea`. Só mostra sucesso quando a resposta for 2xx. O backend deve validar novamente os campos, limitar requisições e tratar dados conforme a política comercial. Se houver WhatsApp e endpoint, o WhatsApp tem prioridade.

Sem configuração, o botão valida os campos e oferece um arquivo TXT local. A interface informa explicitamente que o briefing não foi enviado. Os dados ficam apenas em memória e não são salvos em localStorage.

## Links oficiais

- Ad Factory: https://syrax-ad-factory.higgsfield.app/
- Higgsfield (afiliado): https://higgsfield.ai?fpr=carlos-99134b

Ambos abrem em nova aba com `noopener noreferrer`; o link afiliado é identificado e possui também `sponsored`.

## Reprodução e acessibilidade

O hero possui `autoplay`, `muted`, `loop`, `playsinline`, `object-fit: cover`, poster e nenhum controle nativo. O JavaScript reforça o mute. O botão de pausa é independente e permite interromper movimento. Com `prefers-reduced-motion`, inicia pausado no poster; o visitante pode optar por reproduzir. Políticas de economia de energia/dados do dispositivo podem impedir autoplay, mantendo o poster.

Modal nativo com Escape e restauração de foco; menu mobile com Escape e contenção de Tab; comparação acessível por setas; labels, validação nativa e mensagens de estado no formulário. As imagens abaixo da primeira tela usam lazy loading.

## Verificação

Revisão local em Chromium com viewports 1920 × 1080, 1366 × 768, 768 × 1024, 412 × 915, 390 × 844 e 320 × 740. Validados: ausência de rolagem horizontal e erros de console/recursos, hero, menu, âncoras, modais, teclado, comparação, campos inválidos, briefing válido, download e redução de movimento. São emulações de tela; não substituem testes em aparelhos físicos com Safari/iOS ou Android.

Open Graph e favicon configurados. Ao usar domínio próprio, atualize `og:url` no HTML. A publicação inicial no Sites tem acesso privado; o acesso público e um domínio oficial podem ser configurados quando desejado.
