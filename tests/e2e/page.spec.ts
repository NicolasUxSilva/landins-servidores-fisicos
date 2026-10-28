import { expect, test } from '@playwright/test';

test('metadados de SEO e dados estruturados', async ({ page }) => {
  await page.route(/googletagmanager|facebook|clarity/, (r) => r.abort());
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://msserver.com.br/servidores-dedicados-para-empresas/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Servidores Dell, HP e IBM/);
  await expect(page.locator('h1')).toHaveCount(1);
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(og).toMatch(/og-servidores-dedicados\.jpg$/);
  const res = await page.request.get(new URL(og!).pathname);
  expect(res.ok()).toBe(true);
});

test('imagens e fontes carregam', async ({ page }) => {
  const failed: string[] = [];
  page.on('response', (r) => r.url().startsWith('http://localhost') && r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  await page.goto('/');
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForLoadState('networkidle');
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  expect(broken).toEqual([]);
  expect(failed).toEqual([]);
  expect(await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').length)).toBeGreaterThanOrEqual(2);
});
