// Usage: node scripts/media/brand-kits.mjs <SanDune capture directory>
// Inputs are the approved 2x PNG crops from the identity and store HTML files.
// Originals stay outside the repository. This only crops and encodes artwork.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const dir = process.argv[2];
if (!dir) throw new Error('Supply the directory containing the approved PNG captures');
const out = 'assets/brand-kits/sandune';
await fs.mkdir(out, { recursive: true });
const crops = {};
for (let i=0;i<5;i++) crops[`direction-${i}`]=['colourways',i*744,0,680,1100];
for (let i=0;i<6;i++) crops[`mark-${i}`]=['marks',[0,1002,2006][i%3],i<3?0:830,938,766];
Object.assign(crops, {
  'pack-tag':['pack',0,0,1358,654],
  'pack-label':['pack',1410,0,600,726],
  'pack-mailer':['pack',2062,0,1282,726],
  'pack-card':['pack2',0,0,840,570],
  'pack-bag':['pack2',892,0,600,606],
  'social-avatar':['marketing',0,0,400,750],
  'social-posts':['marketing',456,0,1232,750],
  'social-story':['marketing',2554,0,422,750],
  'social-campaign':['marketing',3032,0,312,750],
});
for(const name of ['logo','type','lines','jackets','store-m','store-d-full',...Object.keys(crops)]) {
  const crop=crops[name];
  let source=sharp(path.join(dir,(crop?.[0] || name)+'.png'));
  if(crop)source=source.extract({left:crop[1],top:crop[2],width:crop[3],height:crop[4]});
  if(name==='store-d-full')source=source.extract({left:0,top:0,width:2880,height:5500});
  const input=await source.png().toBuffer();
  for(const width of [640,1280]) {
    await sharp(input).resize({width,withoutEnlargement:true}).avif({quality:50,effort:5}).toFile(`${out}/${name}-${width}.avif`);
    await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:72}).toFile(`${out}/${name}-${width}.webp`);
  }
}
await sharp('assets/brand-kits/cub-and-co/colour/signature-cobalt-bubbles.svg').resize(640,420,{fit:'contain',background:'#fbfdf2'}).webp({quality:75}).toFile('assets/brand-kits/cub-preview.webp');
await sharp(path.join(dir,'logo.png')).resize(640,420,{fit:'cover'}).webp({quality:75}).toFile('assets/brand-kits/sandune-preview.webp');
