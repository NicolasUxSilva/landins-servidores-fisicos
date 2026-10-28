import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Landing de servidores físicos.
const LEAN = '/';
const OFFICIAL = /^https:\/\/wa\.me\/5511985991837\?text=/;
const block = /googletagmanager|facebook|clarity|youtube/;

test.beforeEach(async ({ page }) => {
  await page.route(block, (r) => r.abort());
});

test('página sem simulador nem "Ver no catálogo", com os 6 modelos', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(LEAN);
  await expect(page.locator('[data-simulator], #simulador, #configurar')).toHaveCount(0);
  await expect(page.locator('[data-sim-start], [data-sim-preset]')).toHaveCount(0);
  await expect(page.getByText(/simul/i)).toHaveCount(0);
  await expect(page.getByText('Ver no catálogo')).toHaveCount(0);
  await expect(page.getByText('Ver todos os servidores')).toHaveCount(0);
  await expect(page.locator('#equipamentos .cat-card')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('todos os CTAs de WhatsApp usam o número oficial e a mensagem certa', async ({ page }) => {
  await page.goto(LEAN);
  const links = await page.$$eval('a[href*="wa.me"]', (as) => as.map((a) => ({ href: a.getAttribute('href')!, loc: a.getAttribute('data-track-location'), target: a.getAttribute('target') })));
  expect(links.length).toBeGreaterThanOrEqual(12);
  expect(links.every((l) => l.href.includes('?text='))).toBe(true);
  for (const l of links) {
    expect(l.href).toMatch(OFFICIAL);
    expect(l.target).toBe('_blank');
    const text = decodeURIComponent(new URL(l.href).searchParams.get('text') ?? '');
    if (l.loc?.startsWith('modelo-')) {
      expect(text).toMatch(/^Olá! Vim pela página de servidores físicos e tenho interesse no .+ \((rack|torre), Intel Xeon .+\)\. Pode me passar disponibilidade e valores para a minha empresa\?$/);
    } else if (l.loc === 'processo') {
      expect(text).toBe('Olá! Vi como funciona a compra na página de servidores físicos e quero orientação para escolher o servidor da minha empresa.');
    } else {
      expect(text).toBe('Olá! Vim pela página de servidores físicos e procuro um servidor para a minha empresa.');
    }
  }
  const r740 = links.find((l) => l.loc === 'modelo-servidor-dell-r740')!;
  expect(decodeURIComponent(new URL(r740.href).searchParams.get('text')!)).toContain('Dell PowerEdge R740 (rack, Intel Xeon Scalable)');
});

test('clique no WhatsApp gera o evento de clique (não um lead confirmado)', async ({ page, context }) => {
  await context.route(/wa\.me/, (r) => r.fulfill({ status: 200, body: 'ok' }));
  await page.goto(LEAN);
  const popup = page.waitForEvent('popup');
  await page.locator('#inicio a[href*="wa.me"]').click();
  await (await popup).close();
  const events = await page.evaluate(() => (window.dataLayer ?? []).filter((e) => e.event));
  expect(events).toEqual([{ event: 'contact_whatsapp_click', location: 'hero' }]);
});

test('âncoras e navegação apontam para seções existentes', async ({ page }) => {
  await page.goto(LEAN);
  const hashes = await page.$$eval('a[href^="#"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')!))]);
  for (const h of hashes) expect(await page.locator(h).count(), `destino de ${h}`).toBeGreaterThan(0);
  await expect(page).toHaveTitle('Servidores Físicos para Empresas | Dell, HP e IBM | MSSERVER');
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '[]');
  const faqLd = ld.find((x: { '@type': string }) => x['@type'] === 'FAQPage').mainEntity.map((q: { name: string }) => q.name);
  const visible = await page.locator('#duvidas summary h3').allTextContents();
  expect(faqLd).toEqual(visible);
});

test('sem violações de acessibilidade (axe, WCAG A/AA)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(LEAN);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
});

test('botão flutuante de WhatsApp aparece depois do hero', async ({ page }) => {
  await page.goto(LEAN);
  const fab = page.locator('[data-wa-fab]');
  await expect(fab).toBeHidden();
  await page.locator('#diferenciais').scrollIntoViewIfNeeded();
  await expect(fab).toBeVisible();
});

test('menu móvel e sem rolagem horizontal', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 1440) >= 1100, 'somente telas menores');
  await page.goto(LEAN);
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  const menu = page.locator('#menu-movel');
  await expect(menu.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', OFFICIAL);
  await expect(menu.getByText(/Simular/)).toHaveCount(0);
  await menu.getByRole('link', { name: /Modelos/ }).click();
  await expect(menu).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('CTA de WhatsApp na seção "Como funciona a compra"', async ({ page, context, viewport }) => {
  await context.route(/wa\.me/, (r) => r.fulfill({ status: 200, body: 'ok' }));
  await page.goto(LEAN);
  const section = page.locator('#processo');
  const cta = section.getByRole('link', { name: 'Falar com a equipe' });
  await expect(cta).toBeVisible();
  // Fica depois das etapas.
  const order = await section.evaluate((el) => {
    const ol = el.querySelector('ol.proc')!;
    const a = el.querySelector('.proc-cta')!;
    return ol.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING;
  });
  expect(order).toBeTruthy();
  const box = await cta.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  if ((viewport?.width ?? 1440) < 640) expect(box!.width).toBeGreaterThan(280);
  const popup = page.waitForEvent('popup');
  await cta.click();
  await (await popup).close();
  const events = await page.evaluate(() => (window.dataLayer ?? []).filter((e) => e.event));
  expect(events).toEqual([{ event: 'contact_whatsapp_click', location: 'processo' }]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('indicador de projetos entregues mostra +10.250', async ({ page }) => {
  await page.goto(LEAN);
  const stats = page.locator('#clientes .proof-stats');
  await expect(stats.locator('dd')).toHaveText(['+15', '+10.250']);
  await expect(stats).toContainText('projetos entregues');
  await expect(page.getByText('+250', { exact: true })).toHaveCount(0);
});
