// Gzipped JavaScript actually loaded by each page (all modules + inline). Budget: 60KB.
import { gzipSync } from "node:zlib";
import { PAGES, start } from "./lib.mjs";
const BUDGET = 60 * 1024;
const { browser, base, stop } = await start(4389);
let over = 0;
for (const p of PAGES) {
  const page = await browser.newPage();
  const bodies = [];
  page.on("response", async (r) => { if (r.request().resourceType() === "script") bodies.push(r.body().then((b) => [r.url().replace(base, ""), b]).catch(() => null)); });
  await page.goto(base + p.path, { waitUntil: "networkidle" });
  const inline = await page.evaluate(() => [...document.querySelectorAll("script:not([src])")].map((s) => s.textContent).join("\n"));
  const files = (await Promise.all(bodies)).filter(Boolean);
  const gz = files.reduce((n, [, b]) => n + gzipSync(b).length, 0) + gzipSync(inline).length;
  if (gz > BUDGET) over++;
  console.log(`${gz > BUDGET ? "OVER" : "ok  "} ${p.name.padEnd(9)} ${(gz / 1024).toFixed(1)}KB gz  (${files.length} files: ${files.map(([u]) => u).join(", ")})`);
  await page.close();
}
await stop();
process.exit(over ? 1 : 0);
