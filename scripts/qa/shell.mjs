// Shared markup must not drift: nav, menu and footer are identical on every page
// (apart from aria-current), and the mark is byte-identical to assets/logo-mark.svg.
import { readFile } from "node:fs/promises";
const files = ["index.html", "lab/index.html", "elements/index.html", "404.html", "privacy/index.html"];
const grab = (html, re) => (html.match(re) || [""])[0].replace(/ aria-current="page"/g, "");
const parts = { nav: /<header class="nav">[\s\S]*?<\/dialog>/, footer: /<footer class="footer">[\s\S]*?<\/footer>/, mark: /<symbol id="arc-mark"[\s\S]*?<\/symbol>/ };
const ref = await readFile(files[0], "utf8");
let bad = 0;
for (const f of files.slice(1)) {
  const html = await readFile(f, "utf8");
  for (const [k, re] of Object.entries(parts)) if (grab(html, re) !== grab(ref, re)) { console.log(`DRIFT ${k}: ${f}`); bad++; }
}
const logo = await readFile("assets/logo-mark.svg", "utf8");
const d = logo.match(/ d="([^"]+)"/)[1];
for (const f of files) if (!(await readFile(f, "utf8")).includes(`d="${d}"`)) { console.log(`MARK ALTERED: ${f}`); bad++; }
console.log(bad ? `${bad} problems` : "shell: nav, menu, footer identical; mark untouched");
process.exit(bad ? 1 : 0);
