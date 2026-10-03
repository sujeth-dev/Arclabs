// Lighthouse (mobile, default throttling) on /, /lab/, /elements/.
import { mkdir, writeFile } from "node:fs/promises";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "playwright";
import { serve } from "../serve.mjs";

const external = process.env.QA_BASE;
const server = external ? null : await serve(4387);
const base = external || "http://localhost:4387";
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new", "--no-sandbox"] });
await mkdir("qa/final", { recursive: true });
let fail = 0;
for (const path of ["/", "/lab/", "/elements/"]) {
  const { lhr } = await lighthouse(base + path, { port: chrome.port, output: "json", logLevel: "error" });
  const s = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const a = lhr.audits;
  const row = { path, ...s, LCP: a["largest-contentful-paint"].displayValue, CLS: a["cumulative-layout-shift"].displayValue, TBT: a["total-blocking-time"].displayValue, FCP: a["first-contentful-paint"].displayValue };
  const low = Object.values(s).some((v) => v < 90) || a["largest-contentful-paint"].numericValue > 2500 || a["cumulative-layout-shift"].numericValue >= 0.1;
  if (low) fail++;
  console.log(`${low ? "FAIL" : "ok  "} ${JSON.stringify(row)}`);
  for (const [k, v] of Object.entries(lhr.audits)) if (v.score !== null && v.score < 0.9 && v.scoreDisplayMode === "binary" && ["accessibility", "seo", "best-practices"].some((c) => lhr.categories[c].auditRefs.some((r) => r.id === k && r.weight > 0))) console.log(`       ✗ ${k}: ${v.title}`);
  await writeFile(`qa/final/lighthouse${path.replace(/\//g, "_") || "_"}.json`, JSON.stringify({ ...row, audits: Object.fromEntries(Object.entries(a).filter(([, v]) => v.score !== null && v.score < 0.9).map(([k, v]) => [k, v.displayValue || v.score])) }, null, 2));
}
await chrome.kill();
server?.close();
process.exit(fail ? 1 : 0);
