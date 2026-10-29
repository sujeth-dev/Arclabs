// Technical-only search audit. --live checks the deployment; --baseline=<git-ref>
// additionally proves unchanged body/rendering assets and pixel-identical pages.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pages,graphFor,updateSEO} from '../seo.mjs';
import {elements,serviceElements} from '../../data/content.js';
import {config,contact} from '../../js/config.js';
import {metadata,indexNowKey} from '../search-config.mjs';
import {start,forcePrefs} from './lib.mjs';

const live=process.argv.includes('--live'), baseline=process.argv.find(a=>a.startsWith('--baseline='))?.split('=')[1];
const env=live?null:await start(4373), base=live?config.siteUrl:env.base;
const bots=['OAI-SearchBot','ChatGPT-User','Claude-SearchBot','Claude-User','PerplexityBot','Perplexity-User','Googlebot','bingbot'];
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const meta=(html,key)=>decode(html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1]||'');
const urls=new Set(pages.map(p=>config.siteUrl+p.path));
async function get(path,ua='Googlebot'){
  const response=await fetch(base+path,{headers:{'User-Agent':ua},signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200,ua+' '+path);
  assert(!/noindex|nosnippet|noarchive|nocache/i.test(response.headers.get('x-robots-tag')||''),path);
  return response;
}
const rawAt=(ref,file)=>execFileSync('git',['show',`${ref}:${file}`],{encoding:'utf8',maxBuffer:8*1024*1024}).replace(/\r\n/g,'\n');
try{
  const xml=await(await get('/sitemap.xml')).text();
  const locations=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.deepEqual(new Set(locations),urls);assert.equal(locations.length,urls.size);
  const robots=await(await get('/robots.txt')).text();
  assert(robots.includes('Sitemap: '+config.siteUrl+'/sitemap.xml'));
  assert(!/^Disallow:\s*\S/m.test(robots));
  for(const bot of bots)assert(new RegExp('User-agent: '+bot+'\\s','i').test(robots));
  // Check static HTML with no rendering, authentication or JS cookies required.
  const titles=new Set(),descriptions=new Set(),allNodes=new Map();
  for(const page of pages){
    const html=await(await get(page.path)).text(), url=config.siteUrl+page.path;
    assert(html.includes('<html lang="en">'));
    assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
    assert(html.includes(`<link rel="canonical" href="${url}">`));
    for(const lang of ['en-IN','x-default'])assert(html.includes(`hreflang="${lang}" href="${url}"`));
    const title=decode(html.match(/<title>([^<]+)<\/title>/)[1]), description=meta(html,'description');
    if(metadata[page.path]?.title)assert.equal(title,metadata[page.path].title);
    if(metadata[page.path]?.description)assert.equal(description,metadata[page.path].description);
    assert(title&&description);assert(!titles.has(title));assert(!descriptions.has(description));titles.add(title);descriptions.add(description);
    assert.equal(meta(html,'og:title'),title);assert.equal(meta(html,'twitter:title'),title);
    assert.equal(meta(html,'og:description'),description);assert.equal(meta(html,'twitter:description'),description);
    assert.equal(meta(html,'og:url'),url);assert.equal(meta(html,'og:locale'),'en_IN');
    assert.equal(meta(html,'og:image'),meta(html,'twitter:image'));
    assert.equal(meta(html,'og:image:type'),'image/png');assert.equal(meta(html,'twitter:image:alt'),meta(html,'og:image:alt'));
    const directives=meta(html,'robots');assert(directives.includes('index, follow'));assert(!/noindex|nosnippet|noarchive|nocache|nofollow/.test(directives));
    const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.deepEqual(graph,graphFor(page,html),'Generated schema drift: '+page.path);
    assert.equal(graph['@context'],'https://schema.org');
    const nodes=graph['@graph'],org=nodes.find(n=>n['@type']==='Organization'),web=nodes.find(n=>['WebPage','CollectionPage'].includes(n['@type']));
    assert.equal(org.email,contact.email);assert.equal(org.telephone,contact.phoneE164);
    for(const unsupported of ['legalName','sameAs','review','aggregateRating','openingHours','geo'])assert(!(unsupported in org));
    assert.equal(web.description,description);assert.equal(web.inLanguage,'en-IN');assert.equal(web.url,url);
    for(const n of nodes){assert(n['@id']);allNodes.set(n['@id'],n);}
    if(page.path!=='/'){
      const breadcrumb=nodes.find(n=>n['@type']==='BreadcrumbList');
      assert.equal(breadcrumb.itemListElement[0].item,config.siteUrl+'/');
      assert.equal(breadcrumb.itemListElement.at(-1).item,url);
      breadcrumb.itemListElement.forEach((n,i)=>{assert.equal(n.position,i+1);assert(urls.has(n.item));});
    }
    assert(html.match(/<main[\s>]/)&&html.match(/<h1[\s>]/),'Important content must be static HTML');
    if(page.path==='/services/'){
      for(const e of elements){const service=nodes.find(n=>n['@id']===config.siteUrl+'/services/#'+e.slug);assert.equal(service['@type'],'Service');assert.equal(service.description,e.line);assert(decode(html.split('</head>')[1]).includes(e.line));assert(html.includes(`id="${e.slug}"`));}
      for(const e of serviceElements){assert(html.includes(`id="${e.slug}"`));assert.equal(nodes.find(n=>n['@type']==='OfferCatalog').itemListElement.find(n=>n.name===e.name).itemListElement.length,e.capabilities.length);}
      assert.equal(nodes.filter(n=>n['@type']==='Service').length,19);
    }
    for(const bot of bots)assert.equal((await get(page.path,bot)).url,base+page.path);
    console.log('PASS metadata, schema and 8 simulated crawler fetches: '+page.path);
  }
  // Every reference resolves within the combined site graph, including nested catalog IDs.
  function collect(value){if(!value||typeof value!=='object')return;if(value['@id']&&value['@type'])allNodes.set(value['@id'],value);Object.values(value).forEach(v=>Array.isArray(v)?v.forEach(collect):collect(v));}
  [...allNodes.values()].forEach(collect);
  function references(value){if(!value||typeof value!=='object')return;if(value['@id'])assert(allNodes.has(value['@id']),'Unresolved entity: '+value['@id']);Object.values(value).forEach(v=>Array.isArray(v)?v.forEach(references):references(v));}
  [...allNodes.values()].forEach(references);
  for(const asset of ['/robots.txt','/sitemap.xml','/css/styles.css','/js/main.js','/assets/icons/icon-512.png','/favicon-96.png',...new Set(pages.map(p=>p.path==='/services/'?'/assets/og/services.png':p.path.startsWith('/lab/')?'/assets/og/lab.png':'/assets/og/home.png'))])for(const bot of bots)await get(asset,bot);
  for(const [path,destination] of [['/index.html','/'],['/services/index.html','/services/'],['/lab/websites/index.html','/lab/websites/'],['/elements/index.html','/services/'],['/elements/','/services/']]){
    const r=await fetch(base+path+'?need=websites',{redirect:'manual'});assert([301,308].includes(r.status),path);assert.equal(new URL(r.headers.get('location'),base).href,base+destination+'?need=websites');
  }
  const missing=await fetch(base+'/search-audit-missing/',{redirect:'follow'});assert.equal(missing.status,404);assert((await missing.text()).includes('content="noindex'));
  assert.equal((await(await get('/'+indexNowKey+'.txt')).text()).trim(),indexNowKey);
  const iconResponse=await get('/favicon-96.png','Googlebot-Image');
  assert(iconResponse.headers.get('content-type').startsWith('image/png'));
  const icon=Buffer.from(await iconResponse.arrayBuffer());
  assert.equal(icon.subarray(1,4).toString(),'PNG');assert.equal(icon.readUInt32BE(16),96);assert.equal(icon.readUInt32BE(20),96);
  if(live)for(const path of ['/','/services/?need=websites','/favicon.ico']){
    const r=await fetch('https://www.arclabs.live'+path,{redirect:'manual',signal:AbortSignal.timeout(20000)});
    assert([301,308].includes(r.status),'www must permanently redirect: '+path);
    assert.equal(new URL(r.headers.get('location'),'https://www.arclabs.live').href,base+path);
  }
  if(!live){
    const page=await env.browser.newPage();assert.equal(await page.evaluate(xml=>new DOMParser().parseFromString(xml,'application/xml').querySelectorAll('parsererror').length,xml),0);await page.close();
    const before=await Promise.all(pages.map(p=>readFile(p.file,'utf8')));await updateSEO();assert.deepEqual(await Promise.all(pages.map(p=>readFile(p.file,'utf8'))),before,'SEO generator must be idempotent');
    if(baseline){
      execFileSync('git',['diff','--exit-code',baseline,'--','css','js','data','assets','media','404.html','elements/index.html']);
      for(const p of pages){
        const old=rawAt(baseline,p.file),current=(await readFile(p.file,'utf8')).replace(/\r\n/g,'\n');
        assert.equal(current.slice(current.indexOf('<body')),old.slice(old.indexOf('<body')),'Visible body changed: '+p.file);
        const strip=h=>h.split('</head>')[0].replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'').replace(/<title>[^<]*<\/title>/g,'').replace(/<meta (?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description|og:image:type|twitter:image:alt)"[^>]*>\n/g,'');
        assert.equal(strip(current),strip(old),'Rendering head changed: '+p.file);
      }
      for(const width of [390,1440])for(const theme of ['dark','light']){
        const ctx=await env.browser.newContext({viewport:{width,height:900},javaScriptEnabled:false,reducedMotion:'reduce'});
        // Block only third-party resources identically in baseline and new page.
        await ctx.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
        for(const p of pages){
          const shot=async baselineHTML=>{
            const page=await ctx.newPage();
            if(baselineHTML)await page.route(base+p.path,route=>route.fulfill({contentType:'text/html',body:baselineHTML}));
            await page.goto(base+p.path,{waitUntil:'networkidle'});
            await page.evaluate(async theme=>{document.documentElement.dataset.theme=theme;document.documentElement.classList.remove('motion');document.documentElement.dataset.motion='reduced';await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));},theme);
            const image=await page.screenshot({fullPage:true,animations:'disabled'});await page.close();return image;
          };
          assert((await shot(rawAt(baseline,p.file))).equals(await shot()),'Pixel difference '+p.path+' '+width+' '+theme);
        }
        await ctx.close();console.log(`PASS pixel-identical full pages: ${width}px ${theme}`);
      }
    }
  }
  console.log('PASS '+(live?'LIVE':'local')+' search audit: sitemap, robots, entity references, assets, redirects and 404');
}finally{await env?.stop()}
