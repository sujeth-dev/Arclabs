// Loads every page at each width; fails on console errors or horizontal overflow.
// Usage: node scripts/qa/pages.mjs <task> [--all-widths] [--ink] [--reduced] [--no-shots]
import { mkdir, writeFile } from "node:fs/promises";
import { PAGES, WIDTHS, ALL_WIDTHS, start, watch, overflow } from "./lib.mjs";

const args = process.argv.slice(2);
const task = args.find((a) => !a.startsWith("--")) || "adhoc";
const widths = args.includes("--all-widths") ? ALL_WIDTHS : WIDTHS;
const ink = args.includes("--ink"), reducedMotion = args.includes("--reduced"), shots = !args.includes("--no-shots");
const suffix = (ink ? "-ink" : "") + (reducedMotion ? "-reduced" : "");
const dir = `qa/${task}`;
await mkdir(dir, { recursive: true });

const { browser, base, stop } = await start();
const results = [];
let failed = 0;
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, hasTouch: w < 768, isMobile: false });
  if (ink) await ctx.addInitScript(() => { try { localStorage.setItem("arc-theme", "dark"); } catch {} });
  if (reducedMotion) await ctx.addInitScript(() => { try { localStorage.setItem("arc-motion", "reduced"); } catch {} });
  for (const p of PAGES) {
    const page = await ctx.newPage();
    const errors = watch(page, base);
    await page.goto(base + p.path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    // Scroll through so every once-in-view drawing has played before the shot.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 250)); }
      await new Promise((r) => setTimeout(r, 2600));
      scrollTo(0, 0);
    });
    const pending = await page.evaluate(() => [...document.querySelectorAll("[data-plan], [data-process], [data-hero-arc]")].filter((el) => !el.classList.contains("is-live")).map((el) => el.className));
    if (pending.length) errors.push(`not drawn after scrolling: ${pending.join(", ")}`);
    const of = await overflow(page);
    if (shots) await page.screenshot({ path: `${dir}/${p.name}-${w}${suffix}.jpg`, fullPage: true, type: "jpeg", quality: 55 });
    const ok = !errors.length && !of.overflow;
    if (!ok) failed++;
    results.push({ page: p.name, width: w, ok, errors, overflow: of });
    console.log(`${ok ? "PASS" : "FAIL"} ${p.name.padEnd(9)} ${String(w).padStart(4)}px${suffix}${errors.length ? "  " + errors.join(" | ") : ""}${of.overflow ? `  overflow ${of.sw}>${of.w} ${of.culprits.join(", ")}` : ""}`);
    await page.close();
  }
  await ctx.close();
}
await writeFile(`${dir}/pages${suffix}.json`, JSON.stringify(results, null, 2));
await stop();
console.log(failed ? `\n${failed} failing` : "\nall pages pass");
process.exit(failed ? 1 : 0);
