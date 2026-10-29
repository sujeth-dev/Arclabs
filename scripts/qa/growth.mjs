import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { start, forcePrefs, overflow, watch } from './lib.mjs';
const { browser, base, stop } = await start(4376);
await mkdir('qa/growth-editorial', { recursive: true });
try {
  for (const theme of ['dark', 'light']) for (const width of [390, 768, 1024, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    await forcePrefs(ctx, { theme });
    const page = await ctx.newPage();
    await page.route(/https:\/\/(www\.)?(instagram\.com|svojasshop\.in)\//, r => r.abort());
    const errors = watch(page, base);
    await page.goto(base + '/lab/digital-growth/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.growth-index a').count(), 4);
    assert.equal(await page.locator('.growth-posts blockquote').count(), 3);
    for (const post of await page.locator('.growth-posts blockquote').all()) assert(await post.isVisible());
    for (const button of await page.locator('[data-channel]').all()) {
      await button.click(); await page.waitForTimeout(550);
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('[data-reach-to]').textContent(), await button.getAttribute('data-to'));
    }
    await page.locator('[data-type]').scrollIntoViewIfNeeded(); await page.waitForTimeout(2500);
    assert(await page.locator('.growth-search').evaluate(el => el.classList.contains('is-complete')));
    assert.equal(await page.locator('.growth-search__caret').evaluate(el => getComputedStyle(el).visibility), 'hidden');
    await page.evaluate(async () => { for (let y=0; y<document.documentElement.scrollHeight; y+=700) { scrollTo(0,y); await new Promise(r=>setTimeout(r,50)); } });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.launch').evaluate(el => el.classList.contains('is-tracking')), false);
    assert(!(await overflow(page)).overflow);
    const axe = await new AxeBuilder({ page }).exclude('iframe').analyze();
    assert.deepEqual(axe.violations.map(v => [v.id, v.nodes.map(n => n.target)]), []);
    assert.deepEqual(errors, []);
    if (width === 390 || width === 1440) {
      for (const [name, selector] of [['intro','.growth-intro'],['brands','#brands'],['campaigns','#campaigns'],['seo','#seo'],['online','#going-online']]) {
        await page.locator(selector).screenshot({ path: `qa/growth-editorial/${name}-${width}-${theme}.png`, style: ".nav, .skip-link { visibility:hidden !important; }" });
      }
    }
    console.log(`PASS Growth ${width} ${theme}: open content, controls, blocked embeds, motion, axe`);
    await ctx.close();
  }
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage(); await page.goto(base + '/lab/digital-growth/');
  assert.equal(await page.locator('[data-type]').textContent(), 'biryani near JP Nagar');
  assert.equal(await page.locator('.reach__item p').count(), 4);
  assert.equal(await page.locator('.growth-posts a').count(), 3);
  assert(!(await overflow(page)).overflow);
  await ctx.close(); console.log('PASS Growth without JavaScript');
} finally { await stop(); }
