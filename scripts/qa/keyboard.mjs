// Keyboard + behaviour tests. Usage: node scripts/qa/keyboard.mjs [suite ...]
import { start, watch } from "./lib.mjs";

const { browser, base, stop } = await start(4398);
const only = process.argv.slice(2);
let pass = 0, fail = 0;

function check(name, cond, info = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name} ${info}`); }
}
async function open(path, { width = 1440, height = 900, touch = false, reduced = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, hasTouch: touch, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const errors = watch(page, base);
  await page.goto(base + path, { waitUntil: "networkidle" });
  return { page, ctx, errors };
}
const focused = (page) => page.evaluate(() => {
  const a = document.activeElement;
  return a ? (a.getAttribute("data-test") || a.className || a.tagName) + "|" + (a.textContent || "").trim().slice(0, 40) : "";
});

const suites = {
  async shell() {
    console.log("shell");
    let { page, ctx, errors } = await open("/");
    await page.keyboard.press("Tab");
    check("skip link is the first tab stop", (await focused(page)).startsWith("skip-link"));
    await page.keyboard.press("Enter");
    check("skip link moves to main", await page.evaluate(() => location.hash === "#main"));
    // Theme toggle
    const theme = page.locator(".nav [data-theme-toggle]");
    await theme.focus(); await page.keyboard.press("Enter");
    check("theme toggle → Ink", await page.evaluate(() => document.documentElement.dataset.theme === "dark" && localStorage.getItem("arc-theme") === "dark"));
    check("theme toggle aria-pressed", (await theme.getAttribute("aria-pressed")) === "true");
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    check("Ink background", bg === "rgb(23, 24, 26)", bg);
    await page.reload();
    check("theme restored before paint", await page.evaluate(() => document.documentElement.dataset.theme === "dark"));
    await page.locator(".nav [data-theme-toggle]").click();
    // Motion toggle
    const motion = page.locator(".footer [data-motion-toggle]");
    await motion.focus(); await page.keyboard.press("Space");
    check("motion toggle → reduced", await page.evaluate(() => document.documentElement.dataset.motion === "reduced"));
    check("motion toggle aria-pressed", (await motion.getAttribute("aria-pressed")) === "true");
    await motion.click();
    check("nav: no current link on Home", (await page.locator(".nav__link[aria-current]").count()) === 0);
    check("no errors (desktop)", !errors.length, errors.join(" | "));
    await ctx.close();

    ({ page, ctx, errors } = await open("/lab/", { width: 390, height: 844, touch: true }));
    check("nav: Lab is current on /lab", (await page.locator('.nav__link[aria-current="page"]').textContent()) === "Lab");
    check("no custom cursor on touch", await page.evaluate(() => !document.documentElement.classList.contains("has-cursor") && !document.querySelector(".cursor-tag")));
    const menuBtn = page.locator("[data-menu-open]");
    await menuBtn.focus(); await page.keyboard.press("Enter");
    check("menu opens", await page.evaluate(() => document.getElementById("menu").open));
    check("menu is Ink", (await page.evaluate(() => getComputedStyle(document.getElementById("menu")).backgroundColor)) === "rgb(23, 24, 26)");
    check("menu focus inside", await page.evaluate(() => document.getElementById("menu").contains(document.activeElement)));
    check("menu-open aria-expanded", (await menuBtn.getAttribute("aria-expanded")) === "true");
    for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
    check("focus trapped in menu", await page.evaluate(() => document.getElementById("menu").contains(document.activeElement) || document.activeElement === document.body));
    await page.keyboard.press("Escape");
    check("Esc closes menu", await page.evaluate(() => !document.getElementById("menu").open));
    check("focus returns to Menu button", await page.evaluate(() => document.activeElement?.hasAttribute("data-menu-open")));
    check("no errors (mobile)", !errors.length, errors.join(" | "));
    await ctx.close();

    ({ page, ctx, errors } = await open("/elements/"));
    check("/elements is Ink in Cream theme", (await page.evaluate(() => getComputedStyle(document.body).backgroundColor)) === "rgb(23, 24, 26)");
    await ctx.close();
  },

  async hero() {
    console.log("hero");
    let { page, ctx, errors } = await open("/", { reduced: true });
    const st = await page.evaluate(() => {
      const span = document.querySelector("[data-hero-arc] [data-span]");
      const rest = document.querySelector("[data-hero-arc] [data-rest]");
      return { off: getComputedStyle(span).strokeDashoffset, op: getComputedStyle(rest).opacity };
    });
    check("reduced motion: hero ARC complete on first frame", (st.off === "0px" || st.off === "0") && st.op === "1", JSON.stringify(st));
    await ctx.close();
    ({ page, ctx, errors } = await open("/"));
    await page.waitForTimeout(1600);
    const d0 = await page.locator("[data-hero-arc] [data-span]").getAttribute("d");
    check("rest span = prototype geometry", d0 === "M40 272 A 280 214 0 0 1 600 272", d0);
    await page.evaluate(() => scrollTo(0, 200));
    const b = await page.locator("[data-grab]").boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x - 100, b.y - 40, { steps: 6 });
    const d1 = await page.locator("[data-hero-arc] [data-span]").getAttribute("d");
    check("drag recomputes the span", d1 !== d0);
    check("cursor tag reads Drag", (await page.locator(".cursor-tag.is-on").textContent()) === "Drag");
    await page.mouse.up();
    await page.waitForTimeout(1400);
    check("springs back to rest", (await page.locator("[data-hero-arc] [data-span]").getAttribute("d")) === d0);
    check("no errors", !errors.length, errors.join(" | "));
    await ctx.close();
  },
};

for (const [name, fn] of Object.entries(suites)) {
  if (only.length && !only.includes(name)) continue;
  try { await fn(); } catch (e) { fail++; console.log(`  FAIL ${name} threw: ${e.message}`); }
}
await stop();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
