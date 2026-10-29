import assert from 'node:assert/strict';
import sharp from 'sharp';
import {readFile} from 'node:fs/promises';
import {PAGES,start,watch} from './lib.mjs';
const live=process.argv.includes('--live');
const env=live?null:await start(4371);
const base=live?'https://arclabs.live':env.base;
const canonical='https://arclabs.live';
try{
  if(!live){
    for(const width of [390,1440]){
      const ctx=await env.browser.newContext({viewport:{width,height:900}}),page=await ctx.newPage();
      const errors=watch(page,base);await page.goto(base+'/',{waitUntil:'networkidle'});
      assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
      const toggle=async()=>{if(width<768){await page.locator('[data-menu-open]').click();await page.locator('#menu [data-theme-toggle]').click();await page.locator('[data-menu-close]').click();}else await page.locator('.nav [data-theme-toggle]').click()};
      for(const theme of ['light','dark']){
        await toggle();assert.equal(await page.evaluate(()=>localStorage.getItem('arc-theme')),theme);
        // Follow a real navigation link, then cover all pages and a legacy redirect.
        if(width<768){await page.locator('[data-menu-open]').click();await page.locator('#menu a[href="/services/"]').click();}else await page.locator('.nav a[href="/services/"]').click();
        await page.waitForLoadState('networkidle');assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
        for(const p of [...PAGES,{path:'/elements/#websites',name:'legacy'}]){
          await page.goto(base+p.path,{waitUntil:'networkidle'});
          assert.equal(await page.locator('html').getAttribute('data-theme'),theme,p.name);
          assert.equal(await page.locator('.nav [data-theme-toggle]').getAttribute('aria-pressed'),String(theme==='dark'));
          assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),theme==='dark'?'#17181A':'#F1EEE5');
        }
        await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
      }
      // A cached history page must use the most recent choice.
      await page.evaluate(()=>{localStorage.setItem('arc-theme','light');dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))});
      assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
      const second=await ctx.newPage();await second.goto(base+'/lab/',{waitUntil:'networkidle'});
      await second.evaluate(()=>localStorage.setItem('arc-theme','dark'));
      await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
      assert.deepEqual(errors,[]);await ctx.close();console.log('PASS theme persistence, reload, history and cross-tab sync at '+width);
    }
    const blocked=await env.browser.newContext();
    await blocked.addInitScript(()=>{Object.defineProperty(Storage.prototype,'getItem',{value(){throw new Error('blocked')}});Object.defineProperty(Storage.prototype,'setItem',{value(){throw new Error('blocked')}})});
    const page=await blocked.newPage(),errors=watch(page,base);await page.goto(base+'/',{waitUntil:'networkidle'});await page.locator('.nav [data-theme-toggle]').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');assert.deepEqual(errors,[]);await blocked.close();console.log('PASS blocked storage fallback');
    const invalid=await env.browser.newContext();await invalid.addInitScript(()=>localStorage.setItem('arc-theme','invalid'));
    const ip=await invalid.newPage();await ip.goto(base+'/');assert.equal(await ip.locator('html').getAttribute('data-theme'),'dark');await invalid.close();
    const ico=await readFile('favicon.ico');assert.equal(ico.readUInt16LE(4),4);assert.deepEqual([0,1,2,3].map(i=>ico[6+i*16]),[16,32,48,96]);
  }
  const request=async path=>{const res=await fetch(base+path,{headers:{'User-Agent':'Googlebot-Image/1.0'},signal:AbortSignal.timeout(15000)});assert.equal(res.status,200,path);assert(!/noindex/i.test(res.headers.get('x-robots-tag')||''));return res;};
  const xml=await (await request('/sitemap.xml')).text();
  const paths=[...xml.matchAll(/<loc>https:\/\/arclabs\.live([^<]*)<\/loc>/g)].map(m=>m[1]);assert.equal(paths.length,8);assert(paths.includes('/services/'));assert(!paths.includes('/elements/'));assert.equal(new Set(paths).size,8);
  for(const path of paths){const html=await(await request(path)).text();assert(html.includes(`<link rel="canonical" href="${canonical}${path}">`),path);assert(html.includes('href="/favicon-96.png"'),path);assert(html.includes('name="description"'));const graphs=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));assert(graphs.length>0);if(path==='/'){const org=graphs[0]['@graph'].find(n=>[n['@type']].flat().includes('Organization'));assert.equal(org.logo.width,512);assert.equal(org.logo.contentUrl,canonical+'/assets/icons/icon-512.png');}}
  const robots=await(await request('/robots.txt')).text();assert(robots.includes('Allow: /'));assert(robots.includes('Sitemap: '+canonical+'/sitemap.xml'));
  for(const [path,size] of [['/favicon-96.png',96],['/assets/icons/icon-512.png',512]]){const r=await request(path);assert(r.headers.get('content-type').startsWith('image/png'));const buffer=Buffer.from(await r.arrayBuffer());const meta=await sharp(buffer).metadata();assert.equal(meta.width,size);assert.equal(meta.height,size);const stats=await sharp(buffer).stats();assert(stats.channels[0].stdev>30,'Logo must contain visible foreground and background');}
  const svg=await(await request('/favicon.svg')).text();assert(svg.includes('viewBox="0 0 256 256"'));assert(svg.includes('<rect'));assert(!svg.includes('prefers-color-scheme'));
  console.log(`PASS ${live?'LIVE':'local'} sitemap, all 8 canonical pages, crawler access, opaque favicons and structured logo`);
}finally{await env?.stop()}
