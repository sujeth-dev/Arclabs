// Node-only production notification. Dry run unless --submit is explicit.
import {execFileSync} from 'node:child_process';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {pages} from './seo.mjs';
import {config} from '../js/config.js';
import {indexNowKey} from './search-config.mjs';

const origin=config.siteUrl;
export function changedPages(files){
  const shared=files.some(f=>/^(css|js|data|assets|media)\//.test(f)||['robots.txt','vercel.json','favicon.ico','favicon.svg','favicon-96.png'].includes(f));
  return pages.filter(p=>shared||files.includes(p.file));
}
export function payloadFor(selected){
  if(!selected.length) throw new Error('No URLs selected');
  const urlList=[...new Set(selected.map(p=>new URL(p.path,origin).href))];
  if(urlList.some(u=>new URL(u).origin!==origin||new URL(u).search||new URL(u).hash)) throw new Error('Only canonical production URLs may be submitted');
  return {host:new URL(origin).host,key:indexNowKey,keyLocation:`${origin}/${indexNowKey}.txt`,urlList};
}
const normalize=s=>s.replace(/\r\n/g,'\n').trim();
export async function verifyPublished(selected, request=fetch){
  const keyResponse=await request(`${origin}/${indexNowKey}.txt`,{redirect:'error',signal:AbortSignal.timeout(20000)});
  if(keyResponse.status!==200||normalize(await keyResponse.text())!==indexNowKey) throw new Error('Production verification key is not published');
  for(const p of selected){
    const response=await request(origin+p.path,{redirect:'error',signal:AbortSignal.timeout(20000)});
    if(response.status!==200||normalize(await response.text())!==normalize(await readFile(p.file,'utf8'))) throw new Error('Production does not match checked-out page: '+p.path);
  }
}
export async function run(args=process.argv.slice(2)){
  const since=args.find(a=>a.startsWith('--since='))?.slice(8);
  if(!since&&!args.includes('--all')) throw new Error('Provide --since=<previous-production-commit> or --all');
  if(since&&!/^[\da-f]{7,40}$/i.test(since)) throw new Error('--since must be a commit SHA');
  const files=since?execFileSync('git',['diff','--name-only',since,'HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/):pages.map(p=>p.file);
  const selected=changedPages(files);
  if(!selected.length){console.log('No changed search pages; no IndexNow request.');return;}
  const payload=payloadFor(selected);
  if(!args.includes('--submit')){console.log(JSON.stringify({dryRun:true,...payload},null,2));return;}
  const attempts=Number(args.find(a=>a.startsWith('--attempts='))?.slice(11)||1);
  if(!Number.isInteger(attempts)||attempts<1||attempts>40) throw new Error('attempts must be 1–40');
  for(let attempt=1;;attempt++){
    try{await verifyPublished(selected);break;}
    catch(error){if(attempt>=attempts)throw error;console.log(`Waiting for production (${attempt}/${attempts}): ${error.message}`);await new Promise(r=>setTimeout(r,15000));}
  }
  const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
  const report={time:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),status:response.status,urls:payload.urlList,response:(await response.text()).slice(0,2000)};
  await mkdir('qa/services/indexnow',{recursive:true});await writeFile('qa/services/indexnow/latest.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  if(![200,202].includes(response.status))throw new Error('IndexNow rejected notification: '+response.status);
  console.log(response.status===202?'Received; ownership validation pending. Not proof of indexing.':'Received. Not proof of crawling, indexing or ranking.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) await run();
