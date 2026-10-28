# Servidores físicos para empresas · MSSERVER

Landing page de servidores físicos da MSSERVER, focada em levar o visitante a uma
conversa comercial pelo WhatsApp.

- **Stack:** Astro 7 (saída estática), TypeScript sem framework de UI, CSS próprio.
- **Saída:** `dist/` com um `index.html`, CSS embutido e pouco JavaScript (menu,
  entradas ao rolar, rastreamento de cliques e botão flutuante).
- **Dados:** catálogo e preços publicados no WooCommerce de msserver.com.br
  (`npm run sync:catalog`) e conteúdo institucional do site. As fontes estão em
  [docs/ORIGEM.md](docs/ORIGEM.md).

## Requisitos

Node.js 22.23 ou superior (o projeto foi testado com Node 24).

## Instalar e rodar

```bash
npm install
```

```bash
npm run dev            # http://localhost:4321
```

```bash
npm run build          # astro check + build de produção em dist/
```

```bash
npm run preview        # serve o build localmente
```

## Testes

```bash
npm test               # testes unitários (Vitest)
```

```bash
npx playwright install chromium
```

```bash
npm run test:e2e       # E2E no desktop e no celular (Playwright + axe)
```

Os testes E2E fazem o build e servem `dist/` com `scripts/serve-dist.mjs`.
Requisições de rastreamento e links do WhatsApp são interceptados: nada é enviado.

## Manutenção

| O quê | Onde |
| --- | --- |
| Preços e modelos do catálogo | `npm run sync:catalog` → `src/data/catalog.json` (classificação em `src/data/platform-map.json`) |
| Modelos em destaque | `src/data/featured.ts` (só modelos com foto própria em `src/assets/products/`) |
| Textos, FAQ, depoimentos, indicadores | `src/data/content.ts` |
| Contatos, WhatsApp e mensagens pré-preenchidas | `src/config/site.ts` (`CONTACT`, `WA`) |
| Logo, fotos e logos de clientes | `npm run assets` (baixa de msserver.com.br e otimiza) |
| Imagem de compartilhamento | `node scripts/make-og.mjs` (com `npm run dev` rodando) |
| Capturas de QA | `node scripts/qa-screenshots.mjs [url] [larguras]` |

## Deploy (Vercel)

1. Na Vercel: Add New → Project → importe `NicolasUxSilva/landins-servidores-fisicos`.
   O framework (Astro), o comando `npm run build` e a pasta `dist` são detectados.
2. Variáveis de ambiente (opcionais):
   - `PUBLIC_GTM_ID=GTM-KTDRRP3` para carregar o Google Tag Manager do site;
   - `PUBLIC_NOINDEX=true` em ambientes de teste, para não indexar.
3. A branch `main` vira produção. As outras branches geram previews.

O `canonical` aponta para `https://msserver.com.br/servidores-dedicados-para-empresas/`
(`SITE.canonical` em `src/config/site.ts`). Ajuste se esta landing ganhar outra URL.

## Rastreamento

Cada clique em WhatsApp envia `contact_whatsapp_click` ao `dataLayer`, com `location`
(`header`, `menu`, `hero`, `processo`, `faq`, `cta-final`, `flutuante`,
`modelo-<slug>`). O evento indica **intenção de contato**: não confirma conversa
iniciada nem venda. Sem `PUBLIC_GTM_ID`, nenhum script de terceiros é carregado.
