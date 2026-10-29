import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {changedPages,payloadFor,verifyPublished} from '../indexnow.mjs';
import {pages} from '../seo.mjs';
import {indexNowKey} from '../search-config.mjs';

test('notify changed public pages, skip docs and cover shared rendering changes',()=>{
  assert.deepEqual(changedPages(['LOG.md','SEARCH-AUDIT.md','scripts/qa/search.mjs']),[]);
  assert.deepEqual(changedPages(['lab/logos/index.html']).map(p=>p.path),['/lab/logos/']);
  assert.equal(changedPages(['css/styles.css']).length,pages.length);
  assert.equal(changedPages(['assets/og/home.png']).length,pages.length);
});
test('only canonical production URLs can enter the notification',()=>{
  const payload=payloadFor([pages[0],pages[0]]);
  assert.deepEqual(payload.urlList,['https://arclabs.live/']);
  assert.equal(payload.keyLocation,`https://arclabs.live/${indexNowKey}.txt`);
  for(const path of ['https://preview.example/','/?need=websites','/#contact'])assert.throws(()=>payloadFor([{path}]));
});
test('refuse unpublished key, stale deployments and redirects before submitting',async()=>{
  const html=await readFile('index.html','utf8');
  const mock=(body,status=200)=>async url=>({status: url.endsWith('.txt')?200:status,text:async()=>url.endsWith('.txt')?indexNowKey:body});
  await assert.rejects(()=>verifyPublished([pages[0]],async()=>({status:404,text:async()=>''})),/key/);
  await assert.rejects(()=>verifyPublished([pages[0]],mock('<html>old deployment</html>')),/does not match/);
  await assert.rejects(()=>verifyPublished([pages[0]],mock(html,308)),/does not match/);
  await verifyPublished([pages[0]],mock(html));
});
