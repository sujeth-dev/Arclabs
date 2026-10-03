// Share-preview check: per-page meta for WhatsApp / LinkedIn / X.
import { readFile } from "node:fs/promises";
const pages = { "/": "index.html", "/lab/": "lab/index.html", "/elements/": "elements/index.html", "/privacy/": "privacy/index.html", "/404": "404.html" };
const site = (await readFile("js/config.js", "utf8")).match(/siteUrl: "([^"]+)"/)[1];
const meta = (html, key) => (html.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`)) || [])[1];
let bad = 0; const titles = new Set(), descs = new Set();
const fail = (m) => { bad++; console.log("FAIL " + m); };
for (const [path, file] of Object.entries(pages)) {
  const html = await readFile(file, "utf8");
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1], desc = meta(html, "description");
  if (titles.has(title)) fail(`${path} duplicate title`); titles.add(title);
  if (descs.has(desc)) fail(`${path} duplicate description`); descs.add(desc);
  for (const k of ["og:title", "og:description", "og:url", "og:image", "og:image:alt", "twitter:card", "twitter:image"]) if (!meta(html, k)) fail(`${path} missing ${k}`);
  if (meta(html, "twitter:card") !== "summary_large_image") fail(`${path} twitter:card`);
  const img = meta(html, "og:image");
  if (!img.startsWith(site + "/")) fail(`${path} og:image not absolute on ${site}`);
  const png = await readFile(img.replace(site + "/", "")).catch(() => null);
  if (!png) fail(`${path} og:image file missing`);
  else if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) fail(`${path} og:image not 1200×630`);
  if (!html.includes(`<link rel="canonical" href="${site}${path}">`)) fail(`${path} canonical`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { fail(`${path} JSON-LD invalid`); } }
  console.log(`${bad ? "    " : "ok  "}${path.padEnd(11)} ${title}  |  ${img.replace(site, "")}`);
}
for (const f of ["favicon.ico", "favicon.svg", "apple-touch-icon.png", "site.webmanifest", "sitemap.xml", "robots.txt"]) await readFile(f).catch(() => fail(`missing ${f}`));
console.log(bad ? `${bad} problems` : "share previews: all pages complete");
process.exit(bad ? 1 : 0);
