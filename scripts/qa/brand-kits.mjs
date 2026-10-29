// Brand Kits interactions, progressive enhancement and asset budgets.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { start, watch, overflow, forcePrefs } from './lib.mjs';
const { browser, base, stop } = await start(4396);
const out = process.env.BRAND_QA_DIR || 'qa/brand-kits';
await mkdir(out, { recursive: true });
async function scrollAll(page) {
  await page.evaluate(async () => {
    for (let y=0; y<document.documentElement.scrollHeight; y+=innerHeight*.8) {
      scrollTo(0,y); await new Promise(r=>setTimeout(r,80));
    }
  });
  await page.waitForTimeout(1100);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('img').evaluateAll(async imgs => { await Promise.all(imgs.filter(i=>i.getClientRects().length).map(i => i.decode().catch(()=>{}))); });
}
try {
  for (const theme of (process.argv.includes('--nojs-only') ? [] : ['light', 'dark'])) {
    const ctx = await browser.newContext({viewport:{width:1440,height:900}});
    await forcePrefs(ctx, {theme});
    const page = await ctx.newPage();
    const errors = watch(page,base);
    let imageBytes=0;
    const transfers=[];
    page.on('response',r=>{if(r.request().resourceType()==='image')transfers.push(r.body().then(b=>{imageBytes+=b.length;}).catch(()=>{}));});
    await page.goto(base+'/lab/brand-kits/',{waitUntil:'networkidle'});
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(),'Skip to content');
    await page.keyboard.press('Enter');
    await scrollAll(page);
    assert.deepEqual(errors,[]);
    assert.equal((await overflow(page)).overflow,false);
    assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth>0)),true);
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']).analyze();
    assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
    await Promise.all(transfers);
    console.log(`${theme}: images before selection ${(imageBytes/1024).toFixed(0)} KB`);
    assert.ok(imageBytes<1.2*1024*1024,'1440px image budget');
    const buttons=page.locator('.bk-swatch');
    await buttons.first().focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(()=>document.querySelector('.bk-colour__image').src.endsWith('ultraviolet-butter.svg'));
    assert.equal(await buttons.nth(1).getAttribute('aria-pressed'),'true');
    await page.keyboard.press('End');
    await page.waitForFunction(()=>document.querySelector('.bk-colour__image').src.endsWith('plum-cotton.svg'));
    await page.keyboard.press('Home');
    await page.waitForFunction(()=>document.querySelector('.bk-colour__image').src.endsWith('signature-cobalt.svg'));
    assert.equal(await buttons.first().evaluate(el=>el===document.activeElement),true);
    await page.keyboard.press('ArrowLeft');
    assert.equal(await buttons.last().getAttribute('aria-pressed'),'true');
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(()=>document.querySelector('.bk-colour__image').src.endsWith('signature-cobalt.svg'));
    const a=await buttons.nth(2).boundingBox(), b=await buttons.nth(3).boundingBox();
    await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();
    await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:5});await page.mouse.up();
    await page.waitForFunction(()=>document.querySelector('.bk-colour__image').src.endsWith('deepsea-sorbet.svg'));
    await buttons.first().click();
    await page.waitForFunction(()=>document.querySelector('.bk-colour__image').src.endsWith('signature-cobalt.svg'));
    await page.locator('#sandune').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('[data-bk-active]').textContent(),'02 / SanDune');
    await page.locator('.bk-store__screen').focus();
    await page.waitForTimeout(6200);
    assert.ok(await page.locator('.bk-store__screen picture').evaluate(el=>getComputedStyle(el).transform!=='none'));
    const toggle=page.locator('[data-motion-toggle]').last();await toggle.click();
    assert.equal(await page.locator('html').getAttribute('data-motion'),'reduced');
    assert.equal(await page.locator('.bk-exhibition').evaluate(el=>el.getAnimations({subtree:true}).length),0);
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`${out}/brand-kits-${theme}-1440.jpg`,fullPage:true,type:'jpeg',quality:70});
    for(const selector of ['.bk-intro','.bk-cub-hero','.bk-colour','.bk-packaging','.bk-sand-hero','.bk-store']) {
      await page.locator(selector).screenshot({path:`${out}/${theme}-${selector.slice(1)}.png`});
    }
    await ctx.close();
    console.log(`PASS ${theme}: keyboard, drag, rail, store, motion toggle, axe and images`);
  }
  for(const width of (process.argv.includes('--nojs-only') ? [] : [390,768,1024,1440])) {
    const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const page=await ctx.newPage();const errors=watch(page,base);
    await page.goto(base+'/lab/brand-kits/');await scrollAll(page);
    assert.deepEqual(errors,[]);assert.equal((await overflow(page)).overflow,false);
    assert.equal(await page.locator('.bk-exhibition').evaluate(el=>el.getAnimations({subtree:true}).length),0);
    await page.screenshot({path:`${out}/brand-kits-system-reduced-${width}.jpg`,fullPage:true,type:'jpeg',quality:65});
    if(width===390)for(const selector of ['.bk-intro','.bk-colour','.bk-packaging','.bk-store'])await page.locator(selector).screenshot({path:`${out}/mobile-${selector.slice(1)}.png`});
    await page.goto(base+'/lab/');await scrollAll(page);await page.screenshot({path:`${out}/lab-${width}.jpg`,fullPage:true,type:'jpeg',quality:65});
    await ctx.close();console.log(`PASS ${width}px system reduced motion`);
  }
  const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await ctx.newPage();await page.goto(base+'/lab/brand-kits/',{waitUntil:'networkidle'});
  assert.equal((await overflow(page)).overflow,false);
  assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth>0)),true);
  assert.equal(await page.locator('[data-bk-reveal]').evaluateAll(els=>els.every(el=>getComputedStyle(el).opacity==='1')),true);
  await ctx.close();console.log('PASS complete content without JavaScript');
} finally { await stop(); }
