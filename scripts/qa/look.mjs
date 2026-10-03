import { start } from "/home/user/Arclabs/scripts/qa/lib.mjs";
const { browser, base, stop } = await start(4397);
const [mode, path, out, w, h, js] = process.argv.slice(2);
const ctx = await browser.newContext({ viewport: { width: +w || 1440, height: +h || 900 } });
const page = await ctx.newPage();
page.on("pageerror", e => console.log("ERR", e.message));
page.on("console", m => { if (m.type()==="error") console.log("CONSOLE", m.text()); });
if (mode === "html") await page.setContent(path); else await page.goto(base + path, { waitUntil: "networkidle" });
if (js) { const r = await page.evaluate(js); if (r !== undefined) console.log(JSON.stringify(r)); }
await page.waitForTimeout(1200);
await page.screenshot({ path: out });
await stop();
