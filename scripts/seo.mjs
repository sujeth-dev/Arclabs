// Build-time only. Refresh JSON-LD from the existing page metadata and service
// source without rewriting any visible markup or adding client-side code.
import {readFile, writeFile} from 'node:fs/promises';
import {config, contact} from '../js/config.js';
import {elements, serviceElements} from '../data/content.js';
import {metadata} from './search-config.mjs';

export const pages = [
  {path:'/', file:'index.html', name:'Home'},
  {path:'/services/', file:'services/index.html', name:'Services'},
  {path:'/lab/', file:'lab/index.html', name:'Lab'},
  {path:'/lab/websites/', file:'lab/websites/index.html', name:'Websites & Systems'},
  {path:'/lab/logos/', file:'lab/logos/index.html', name:'Logos'},
  {path:'/lab/digital-growth/', file:'lab/digital-growth/index.html', name:'Digital Growth & Strategy'},
  {path:'/lab/brand-kits/', file:'lab/brand-kits/index.html', name:'Brand Kits'},
  {path:'/privacy/', file:'privacy/index.html', name:'Privacy'},
];
const origin=config.siteUrl, orgId=origin+'/#organization', siteId=origin+'/#website';
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const ref=id=>({'@id':id});
export function graphFor(page, html) {
  const meta=key=>decode(html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))[1]);
  const url=origin+page.path, title=decode(html.match(/<title>([^<]+)<\/title>/)[1]);
  const description=meta('description'), image=meta('og:image');
  const org={
    '@type':'Organization', '@id':orgId, name:'ARC Labs', url:origin+'/',
    logo:{'@type':'ImageObject','@id':origin+'/#logo',url:origin+'/assets/icons/icon-512.png',contentUrl:origin+'/assets/icons/icon-512.png',encodingFormat:'image/png',width:512,height:512,caption:'ARC Labs'},
    email:contact.email, telephone:contact.phoneE164,
    address:{'@type':'PostalAddress',addressLocality:'Bengaluru',addressRegion:'Karnataka',addressCountry:'IN'},
  };
  if(page.path==='/') Object.assign(org,{
    description, slogan:'Design. Build. Grow.', image,
    knowsAbout:elements.map(e=>e.name),
    hasOfferCatalog:ref(origin+'/services/#catalog'),
  });
  const website={'@type':'WebSite','@id':siteId,url:origin+'/',name:'ARC Labs',publisher:ref(orgId),inLanguage:'en-IN'};
  const node={
    '@type':page.path.startsWith('/lab/')?'CollectionPage':'WebPage',
    '@id':url+'#webpage',url,name:title,description,
    isPartOf:ref(siteId),publisher:ref(orgId),inLanguage:'en-IN',
    primaryImageOfPage:{'@type':'ImageObject',url:image,width:1200,height:630},
  };
  const nodes=[org,website,node];
  if(page.path==='/') node.mainEntity=ref(orgId);
  else {
    const trail=[pages[0],...(page.path.startsWith('/lab/')&&page.path!=='/lab/'?[pages.find(p=>p.path==='/lab/')]:[]),page];
    node.breadcrumb=ref(url+'#breadcrumb');
    nodes.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:trail.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,item:origin+p.path}))});
  }
  if(page.path==='/services/') {
    const catalog={'@type':'OfferCatalog','@id':origin+'/services/#catalog',name:'ARC Labs services',url:origin+'/services/',itemListElement:serviceElements.map(e=>({
      '@type':'OfferCatalog','@id':origin+'/services/#'+e.slug,name:e.name,description:e.line,
      url:origin+'/services/#'+e.slug,
      itemListElement:e.capabilities.map(slug=>({'@type':'Offer',itemOffered:ref(origin+'/services/#'+slug)})),
    }))};
    catalog.itemListElement.push({'@type':'Offer',itemOffered:ref(origin+'/services/#custom-systems')});
    nodes.push(catalog);
    nodes.push(...elements.map(e=>({'@type':'Service','@id':origin+'/services/#'+e.slug,url:origin+'/services/#'+e.slug,name:e.name,description:e.line,serviceType:e.name,provider:ref(orgId)})));
    if(page.path==='/services/') node.mainEntity=ref(catalog['@id']);
  }
  if(page.path==='/lab/') node.mainEntity={'@type':'ItemList',itemListElement:pages.filter(p=>p.path.startsWith('/lab/')&&p.path!=='/lab/').map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:origin+p.path}))};
  if(page.path==='/lab/brand-kits/') node.about=['Cub & Co','SanDune'];
  return {'@context':'https://schema.org','@graph':nodes};
}

export async function updateSEO() {
  for(const page of pages){
    const original=await readFile(page.file,'utf8');
    let html=original;
    const encode=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
    const entry=metadata[page.path];
    if(entry?.title){
      html=html.replace(/<title>[^<]+<\/title>/,`<title>${encode(entry.title)}</title>`);
      for(const key of ['og:title','twitter:title']) html=html.replace(new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*`),`$1${encode(entry.title)}`);
    }
    if(entry?.description) for(const key of ['description','og:description','twitter:description']) html=html.replace(new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*`),`$1${encode(entry.description)}`);
    const imageAlt=html.match(/<meta property="og:image:alt" content="([^"]*)">/)[1];
    if(!html.includes('property="og:image:type"')) html=html.replace(/(<meta property="og:image:height"[^>]*>)/,'$1\n<meta property="og:image:type" content="image/png">');
    if(!html.includes('name="twitter:image:alt"')) html=html.replace(/(<meta name="twitter:image"[^>]*>)/,`$1\n<meta name="twitter:image:alt" content="${imageAlt}">`);
    const graph=JSON.stringify(graphFor(page,html)).replace(/</g,'\\u003c');
    html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,`<script type="application/ld+json">${graph}</script>`);
    if(html!==original)await writeFile(page.file,html);
  }
}
if(process.argv[1]?.replace(/\\/g,'/').endsWith('/scripts/seo.mjs')) await updateSEO();
