// Rewrites the production origin everywhere it is hard-coded.
// Usage: node scripts/set-domain.mjs https://arclabs.example
import { readFile, writeFile } from "node:fs/promises";
const next = (process.argv[2] || "").replace(/\/$/, "");
if (!/^https:\/\/[\w.-]+$/.test(next)) { console.error("Usage: node scripts/set-domain.mjs https://your-domain"); process.exit(1); }
const files = ["index.html", "lab/index.html", "elements/index.html", "404.html", "privacy/index.html", "sitemap.xml", "robots.txt", "js/config.js"];
const current = (await readFile("js/config.js", "utf8")).match(/siteUrl: "([^"]+)"/)[1];
for (const f of files) {
  const s = await readFile(f, "utf8");
  if (s.includes(current)) { await writeFile(f, s.split(current).join(next)); console.log(`updated ${f}`); }
}
console.log(`${current} → ${next}`);
