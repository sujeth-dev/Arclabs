// Fails if a custom property defined in css/styles.css is never used (var(--x) in CSS, HTML or JS).
import { readFile, readdir } from "node:fs/promises";
const css = await readFile("css/styles.css", "utf8");
const defined = new Set([...css.matchAll(/(?:^|[;{\s])(--[\w-]+)\s*:/gm)].map((m) => m[1]));
const sources = [css];
for (const dir of [".", "lab", "elements", "privacy", "js", "data"]) {
  for (const f of await readdir(dir)) if (/\.(html|js)$/.test(f)) sources.push(await readFile(`${dir}/${f}`, "utf8"));
}
const all = sources.join("\n");
const unused = [...defined].filter((t) => !new RegExp(`var\\(\\s*${t}[\\s,)]|["'\`]${t}["'\`]`).test(all));
if (unused.length) { console.log("Unused tokens:\n  " + unused.join("\n  ")); process.exit(1); }
console.log(`tokens: ${defined.size} defined, all used`);
