// axe-core (WCAG 2.0/2.1 A + AA + best practice) on every page, in Cream and Ink,
// plus the interactive states: menu open, Lab File open, Element row open, form errors.
import { mkdir, writeFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { PAGES, start } from "./lib.mjs";

const { browser, base, stop } = await start(4390);
const states = [
  ...PAGES.map((p) => ({ name: p.name, path: p.path })),
  { name: "home+dialog", path: "/#file-velmont", wait: 900 },
  { name: "elements+row", path: "/elements/#redesigns", wait: 1600 },
  { name: "home+form-errors", path: "/#contact", act: async (page) => { await page.locator('.form button[type="submit"]').click(); } },
  { name: "lab+menu (390)", path: "/lab/", width: 390, act: async (page) => { await page.locator("[data-menu-open]").click(); } },
];
const results = []; let total = 0;
for (const theme of ["cream", "ink"]) {
  for (const s of states) {
    const ctx = await browser.newContext({ viewport: { width: s.width || 1280, height: 900 }, });
    // Motion off so axe sees settled pages; Cream/Ink set explicitly (phones default to Ink).
    await ctx.addInitScript((t) => { localStorage.setItem("arc-motion", "reduced"); localStorage.setItem("arc-theme", t); }, theme === "ink" ? "dark" : "light");
    const page = await ctx.newPage();
    await page.goto(base + s.path, { waitUntil: "networkidle" });
    if (s.act) await s.act(page);
    await page.waitForTimeout(s.wait || 300);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
    total += r.violations.length;
    results.push({ theme, state: s.name, violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5), help: v.help })) });
    console.log(`${r.violations.length ? "FAIL" : "ok  "} ${theme.padEnd(5)} ${s.name}${r.violations.map((v) => `\n       ${v.impact} ${v.id}: ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`).join("")}`);
    await ctx.close();
  }
}
await mkdir("qa/final", { recursive: true });
await writeFile("qa/final/axe.json", JSON.stringify(results, null, 2));
await stop();
console.log(total ? `\n${total} violations` : "\naxe: zero violations");
process.exit(total ? 1 : 0);
