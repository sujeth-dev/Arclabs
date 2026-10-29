import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { start, watch, overflow, forcePrefs } from './lib.mjs';
import { elements, serviceElements, capabilityGroups, process } from '../../data/content.js';
const { browser, base, stop } = await start(4374);
await mkdir('qa/services', { recursive: true });
try {
  const routes=JSON.parse(await readFile('vercel.json','utf8')).redirects;
  for(const source of ['/elements','/elements/']) assert(routes.some(r=>r.source===source&&r.destination==='/services/'&&r.permanent));
  for (const path of ['/elements','/elements/']) {
    const res = await fetch(base+path+'?source=old', {redirect:'manual'});
    assert.equal(res.status,308); assert.equal(res.headers.get('location'),'/services/?source=old');
  }
  console.log('PASS permanent redirects, including query strings');
  for (const theme of ['light','dark']) for (const width of [390,768,1024,1440]) {
    const ctx = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    await forcePrefs(ctx,{theme,motion:'reduced'});
    const page = await ctx.newPage(), errors=watch(page,base);
    await page.goto(base+'/services/',{waitUntil:'networkidle'});
    assert.equal(await page.locator('[data-service-element]').count(),4);
    assert.equal(await page.locator('[data-capability]').count(),elements.length);
    for(const group of capabilityGroups) for(const slug of group.capabilities) {
      const row=page.locator('#'+slug); await row.locator('summary').click();
      assert(await row.evaluate(el=>el.open));
      assert.equal(await row.locator('a[href="/?need='+slug+'#contact"]').count(),1);
    }
    const axe=await new AxeBuilder({page}).analyze();
    assert.deepEqual(axe.violations.map(v=>[v.id,v.nodes.map(n=>n.target)]),[]);
    assert(!(await overflow(page)).overflow); assert.deepEqual(errors,[]);
    for(const row of await page.locator('[data-capability]').all()) await row.evaluate(el=>el.open=false);
    if(width===390||width===1440) for(const [name,selector] of [['intro','.services-intro'],['element','.service-element'],['capabilities','.capabilities']]) {
      await page.locator(selector).first().screenshot({path:`qa/services/${name}-${width}-${theme}.png`,style:'.nav,.skip-link{visibility:hidden!important}'});
    }
    await page.goto(base+'/',{waitUntil:'networkidle'});
    assert.deepEqual(await page.locator('.process__step h3').allTextContents(),process);
    assert.equal(await page.locator('input[name="need"]').count(),elements.length);
    const counts=await page.locator('input[name="need"]').evaluateAll(inputs=>inputs.map(x=>x.value));
    assert.equal(new Set(counts).size,elements.length);
    assert.deepEqual(counts.slice().sort(), elements.map(e=>e.slug).sort());
    if(width===390||width===1440) for(const [name,selector] of [['home-services','.services-preview'],['process','#process'],['contact','#contact']]) {
      await page.locator(selector).screenshot({path:`qa/services/${name}-${width}-${theme}.png`,style:'.nav,.skip-link{visibility:hidden!important}'});
    }
    console.log(`PASS Services + Home ${width} ${theme}: details, demos, source data, axe, overflow`);
    await ctx.close();
  }
  const ctx=await browser.newContext({viewport:{width:390,height:844}}),page=await ctx.newPage();
  for(const e of serviceElements){
    await page.goto(base+'/?element='+e.slug+'#contact',{waitUntil:'networkidle'});
    assert.equal(await page.locator('#f-element').inputValue(),e.slug);
    assert.equal(await page.locator('input[name="need"]:checked').count(),0);
    assert.equal(await page.locator('.contact-needs__group[open]').count(),0);
  }
  for(const e of elements.slice(0,6)){
    await page.goto(base+'/elements/#'+e.slug,{waitUntil:'networkidle'});
    assert(page.url().endsWith('/services/#'+e.slug)); assert(await page.locator('#'+e.slug).evaluate(el=>el.open));
  }
  await page.goto(base+'/?element=get-found&need=seo,websites,unknown#contact',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#f-element').inputValue(),'get-found');
  assert.deepEqual(await page.locator('input[name="need"]:checked').evaluateAll(inputs=>inputs.map(x=>x.value).sort()),['seo','websites']);
  const mail=await page.locator('[data-mailto]').evaluate(a=>{a.dispatchEvent(new Event('focus'));return decodeURIComponent(a.href)});
  assert(mail.includes('Element: Get found')); assert(mail.includes('Capabilities: Websites, SEO'));
  await page.goto(base+'/?element=unknown&need=unknown#contact',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#f-element').inputValue(),'');assert.equal(await page.locator('input[name="need"]:checked').count(),0);
  await ctx.close();console.log('PASS all old service bookmarks, Element-only and combined enquiry links, unknown values, email contents');
  const motionCtx=await browser.newContext({viewport:{width:390,height:844}}),motionPage=await motionCtx.newPage();
  const motionErrors=watch(motionPage,base);
  await motionPage.goto(base+'/services/',{waitUntil:'networkidle'});
  await motionPage.locator('#redesigns summary').click(); await motionPage.waitForTimeout(50);
  await motionPage.emulateMedia({reducedMotion:'reduce'});await motionPage.waitForTimeout(200);
  assert.equal(await motionPage.locator('#redesigns .demo').evaluate(el=>el.style.getPropertyValue('--split')),'50%');
  await motionPage.emulateMedia({reducedMotion:'no-preference'});
  await motionPage.locator('#custom-systems summary').click();await motionPage.waitForTimeout(550);
  await motionPage.locator('.footer [data-motion-toggle]').click();await motionPage.waitForTimeout(100);
  assert.equal(await motionPage.locator('.demo').evaluateAll(ds=>ds.flatMap(d=>d.getAnimations({subtree:true})).filter(a=>a.playState==='running').length),0);
  assert.deepEqual(motionErrors,[]);await motionCtx.close();console.log('PASS mid-animation OS and site motion changes');
  // The POST never leaves the test browser: check both failure and retry.
  const formCtx=await browser.newContext(),formPage=await formCtx.newPage();let posted='',attempt=0;
  await formPage.route('**/js/config.js',async route=>{const r=await route.fetch();await route.fulfill({response:r,body:(await r.text()).replace('formspreeId: ""','formspreeId: "test123"')});});
  await formPage.route('https://formspree.io/**',route=>{posted=route.request().postData();attempt++;route.fulfill({status:attempt===1?500:200,contentType:'application/json',body:attempt===1?'{}':'{"ok":true}'});});
  await formPage.goto(base+'/?element=get-found&need=seo#contact',{waitUntil:'networkidle'});
  await formPage.fill('#f-name','QA Person');await formPage.fill('#f-email','qa@example.com');
  await formPage.locator('button[type="submit"]').click();await formPage.waitForTimeout(200);
  assert(await formPage.locator('[data-form-status]').textContent().then(s=>s.includes("didn't send")));
  assert(await formPage.locator('button[type="submit"]').isEnabled());
  assert.equal(await formPage.locator('#f-element').inputValue(),'get-found');assert(await formPage.locator('input[value="seo"]').isChecked());
  await formPage.locator('button[type="submit"]').click();await formPage.waitForTimeout(200);
  for(const value of ['name="element"','get-found','name="need"','seo','name="element_name"','Get found','name="capabilities"','SEO'])assert(posted.includes(value),value);
  assert(await formPage.locator('[data-form-done]').isVisible());await formCtx.close();console.log('PASS mocked Formspree fields, failed send, retained selections and successful retry');
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),np=await nojs.newPage();
  await np.goto(base+'/services/');await np.locator('#branding-design summary').click();
  assert(await np.locator('#branding-design').evaluate(el=>el.open));assert(await np.locator('#branding-design .capability__copy').isVisible());
  assert(!(await overflow(np)).overflow);await np.goto(base+'/elements/#websites');assert(np.url().endsWith('/services/#websites'));
  await nojs.close();console.log('PASS Services content and legacy redirect without JavaScript');
}finally{await stop()}
