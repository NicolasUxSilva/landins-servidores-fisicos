# Origem do projeto e alterações

## Ponto de partida

Este repositório começou a partir da landing enxuta de servidores físicos do
repositório `NicolasUxSilva/landing-ms`:

- branch `feat/landing-servidores-fisicos`, commit **`6585e48`**
  ("Landing enxuta de servidores físicos com conversão pelo WhatsApp").

O histórico do repositório original **não** foi trazido: este projeto começa com
um commit próprio e evolui de forma independente. A landing completa (com
simulador) continua no repositório original, na tag `landing-completa-v1`
(commit `a5436cc`).

## O que ficou de fora (exclusivo da landing completa)

Simulador e sua lógica (`src/simulator/`, `Simulator.astro`, `simulator.css`),
seções de modalidades e aplicações com atalhos do simulador, catálogo do servidor em
data center, rota `/completa/`, blocos do app e do vídeo nos diferenciais, lista de
cases, plugin e ferramentas do WordPress, mock de envio de formulário e documentação
da versão completa. Os componentes compartilhados foram reduzidos à versão usada
aqui, sem variantes da landing completa.

## Alterações feitas após a cópia (28/10/2026)

1. **CTA de WhatsApp em "Como funciona a compra"** (`src/components/Process.astro`):
   uma faixa depois das quatro etapas, com o texto "Quer começar agora?" e o botão
   "Falar com a equipe". Mensagem pré-preenchida: "Olá! Vi como funciona a compra na
   página de servidores físicos e quero orientação para escolher o servidor da minha
   empresa." Evento: `contact_whatsapp_click` com `location: processo`.
2. **Indicador de projetos entregues:** de "+250" para **"+10.250"**
   (`STATS` em `src/data/content.ts`), a pedido da MSSERVER. O número aparece só na
   seção "Quem atende". O indicador "+15 anos no mercado" não mudou.
3. **Imagem de compartilhamento** regenerada com o conteúdo desta landing. A anterior
   citava o simulador.

## Fontes das informações

| Informação | Fonte |
| --- | --- |
| Garantia padrão de 1 ano, extensão até 5 anos; selo de garantia, checklist e teste de stress | Páginas de produto em msserver.com.br |
| Plano Non-Stop e cobertura de peças | `/extencao-de-garantia` |
| Venda e locação; servidores usados e seminovos Dell, HP e IBM; suporte on-site | Landing anterior, home e `/sobre/` |
| Suporte humano, consultoria, recompra, estoque e envio para todo o Brasil | Landing anterior e home |
| +15 anos no mercado | `/cases-de-sucesso/` |
| +10.250 projetos entregues | Informado pela MSSERVER em 28/10/2026 |
| Depoimentos (Fernando, Sara) | `/sobre/` |
| Logos de clientes | Seção "Alguns clientes" da landing anterior |
| Preços e variações de memória | Store API do WooCommerce (`npm run sync:catalog`) |
| Contatos, endereço, horário, WhatsApp 5511985991837 | Rodapé do site |

## Pendências conhecidas

- O GTM só carrega com `PUBLIC_GTM_ID` definido no deploy. Meta Pixel, Clarity e Google
  Ads entram no site pelo WordPress, não por esta página. Se ela for publicada fora do
  WordPress e precisar desses scripts, eles devem ir para o GTM.
- Rode `npm run sync:catalog` antes de cada publicação para atualizar os preços.
- Não existe política de privacidade publicada em msserver.com.br para linkar.
