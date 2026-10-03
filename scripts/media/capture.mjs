// Captures each client site (dev only; needs network access to the sites).
// Usage: node scripts/media/capture.mjs [slug ...]
// Writes media/_raw/<slug>/{desktop,desktop-full}.png + scroll.webm
// then run: node scripts/media/process.mjs
import { mkdir, rename, readdir, rm } from "node:fs/promises";
import { chromium } from "playwright";
import { projects } from "../../data/content.js";

const only = process.argv.slice(2);
const targets = projects.filter((p) => p.liveUrl && (!only.length || only.includes(p.slug)));
const browser = await chromium.launch();
const report = [];

// Close cookie banners, newsletter pop-ups and chat prompts before capturing.
async function tidy(page) {
  const words = /^(accept( all)?|agree|allow( all)?|got it|ok(ay)?|i understand|close|no,? thanks|maybe later|dismiss|×|✕)$/i;
  for (let pass = 0; pass < 3; pass++) {
    const buttons = await page.locator("button, [role=button], a").all();
    for (const b of buttons) {
      const t = ((await b.textContent().catch(() => "")) || (await b.getAttribute("aria-label").catch(() => "")) || "").trim();
      if (words.test(t) && await b.isVisible().catch(() => false)) await b.click({ timeout: 1000 }).catch(() => {});
    }
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(400);
  }
}
async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts?.ready);
  // Scroll through once so lazy images load, then wait for every image.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    scrollTo(0, 0);
    await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
  });
  await page.waitForTimeout(800);
}

for (const p of targets) {
  const dir = `media/_raw/${p.slug}`;
  await mkdir(dir, { recursive: true });
  const entry = { slug: p.slug, url: p.liveUrl };
  try {
    // 1. Status
    const probe = await (await browser.newContext()).newPage();
    const res = await probe.goto(p.liveUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    entry.status = res?.status();
    await probe.context().close();
    if (entry.status !== 200) throw new Error(`status ${entry.status}`);

    // 2. Desktop stills
    for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false]]) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
      const page = await ctx.newPage();
      await page.goto(p.liveUrl, { waitUntil: "load", timeout: 60000 });
      await settle(page); await tidy(page);
      await page.screenshot({ path: `${dir}/${name}.png` });
      await page.screenshot({ path: `${dir}/${name}-full.png`, fullPage: true });
      await ctx.close();
    }

    // 3. A 10–12s smooth scroll recording at 1440×900: top to bottom, then hold.
    const vctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir, size: { width: 1440, height: 900 } } });
    const vpage = await vctx.newPage();
    await vpage.goto(p.liveUrl, { waitUntil: "load", timeout: 60000 });
    await settle(vpage); await tidy(vpage);
    await vpage.evaluate(async () => {
      const max = document.documentElement.scrollHeight - innerHeight, dur = 9000, t0 = performance.now();
      await new Promise((done) => {
        const step = (now) => {
          const t = Math.min(1, (now - t0) / dur), e = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          scrollTo(0, max * e);
          t < 1 ? requestAnimationFrame(step) : done();
        };
        requestAnimationFrame(step);
      });
    });
    await vpage.waitForTimeout(2500);
    const video = vpage.video();
    await vctx.close();
    await rename(await video.path(), `${dir}/scroll.webm`);
    for (const f of await readdir(dir)) if (f.endsWith(".webm") && f !== "scroll.webm") await rm(`${dir}/${f}`);
    entry.ok = true;
  } catch (e) {
    entry.ok = false; entry.error = e.message;
  }
  report.push(entry);
  console.log(`${entry.ok ? "captured" : "FAILED  "} ${p.slug} ${entry.status ?? ""} ${entry.error ?? ""}`);
}
await browser.close();
const failed = report.filter((r) => !r.ok);
if (failed.length) console.log(`\n${failed.length} site(s) not captured — keep their placeholder plates and log them in TODO.md.`);
