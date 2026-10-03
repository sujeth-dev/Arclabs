// Text written into the HTML must match data/content.js (names, lines, sectors, stamps).
import { readFile } from "node:fs/promises";
import { projects, elements } from "../../data/content.js";
const files = ["index.html", "lab/index.html", "elements/index.html"];
const dec = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
let bad = 0, seen = 0;
for (const f of files) {
  const html = await readFile(f, "utf8");
  for (const m of html.matchAll(/<article class="lab-card[^"]*" data-file="([\w-]+)"[\s\S]*?<\/article>/g)) {
    seen++;
    const p = projects.find((x) => x.slug === m[1]);
    const t = dec(m[0]);
    const want = [`>${p.name}</h3>`, `>${p.line}</p>`, `>${p.sector}</p>`, `File ${p.file} · ${p.status}</span>`, `data-filter="${p.filter}"`];
    for (const w of want) if (!t.includes(w)) { console.log(`MISMATCH ${f} ${p.slug}: ${w}`); bad++; }
  }
  for (const m of html.matchAll(/data-element="([\w-]+)"[\s\S]*?<\/(?:li|article)>/g)) {
    seen++;
    const e = elements.find((x) => x.slug === m[1]);
    const t = dec(m[0]);
    for (const w of [`>${e.name}<`, `>${e.line}<`, `>${e.symbol}<`]) if (!t.includes(w)) { console.log(`MISMATCH ${f} ${e.slug}: ${w}`); bad++; }
  }
}
console.log(bad ? `${bad} mismatches` : `content: ${seen} blocks match data/content.js`);
process.exit(bad ? 1 : 0);
