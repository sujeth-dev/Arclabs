// Renders share images and icons with Playwright (dev only). Run: npm run og
//   assets/og/{home,lab,elements}.png   1200×630, Ink, "Design. Build. Grow.", the mark
//   favicon.ico (16+32), apple-touch-icon.png (180), assets/icons/icon-{192,512}.png, icon-maskable-512.png
// The mark's path data is read from assets/logo-mark.svg and used unchanged.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { start } from "./qa/lib.mjs";

const svg = await readFile("assets/logo-mark.svg", "utf8");
const d = svg.match(/ d="([^"]+)"/)[1];
const mark = (fill) => `<svg viewBox="6 6 194 136" xmlns="http://www.w3.org/2000/svg"><path fill="${fill}" d="${d}"/></svg>`;
const INK = "#17181A", CREAM = "#F1EEE5", MUTED = "#A6A49D", LINE = "#33343A";

const { browser, base, stop } = await start(4393);
const page = await browser.newPage();
await page.goto(`${base}/robots.txt`).catch(() => {}); // same origin as the fonts
await mkdir("assets/og", { recursive: true });
await mkdir("assets/icons", { recursive: true });

const fonts = `
@font-face { font-family: D; font-weight: 600; src: url(${base}/assets/fonts/inter-display-600.woff2) format("woff2"); }
@font-face { font-family: B; font-weight: 500; src: url(${base}/assets/fonts/inter-500.woff2) format("woff2"); }`;

const og = (label) => `<!doctype html><html><head><style>${fonts}
*{margin:0;box-sizing:border-box} html,body{width:1200px;height:630px;background:${INK};color:${CREAM}}
body{position:relative;padding:72px 80px;font-family:B}
.top{display:flex;align-items:center;gap:18px;font:600 22px/1 D;letter-spacing:.2em;text-transform:uppercase}
.top svg{width:52px;height:auto}
.label{position:absolute;right:80px;top:80px;display:flex;align-items:center;gap:12px;font:500 15px/1 B;letter-spacing:.14em;text-transform:uppercase;color:${MUTED}}
.label::before{content:"";width:8px;height:8px;border-radius:50%;background:${CREAM}}
h1{position:absolute;left:76px;bottom:150px;font:600 122px/.92 D;letter-spacing:-.045em;white-space:nowrap}
.stop{display:inline-block;position:relative;width:.26em;color:transparent}
.stop::after{content:"";position:absolute;left:.02em;bottom:.015em;width:.19em;height:.19em;border-radius:50%;background:${CREAM}}
.foot{position:absolute;left:80px;right:80px;bottom:72px;display:flex;justify-content:space-between;padding-top:22px;border-top:1px solid ${LINE};font:500 17px/1 B;color:${MUTED}}
</style></head><body>
<div class="top">${mark(CREAM)}<span>ARC Labs</span></div>
${label ? `<div class="label">${label}</div>` : ""}
<h1>Design<span class="stop">.</span> Build<span class="stop">.</span> Grow<span class="stop">.</span></h1>
<div class="foot"><span>Websites · E-commerce · Digital Presence · Custom Systems</span><span>arclabs.tech@gmail.com</span></div>
</body></html>`;

for (const [name, label] of [["home", ""], ["lab", "Lab"], ["elements", "Elements"]]) {
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(og(label), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `assets/og/${name}.png` });
  console.log(`assets/og/${name}.png`);
}

// Icons: the mark centred with clear space (1u ≈ 15% of the mark's width).
const icon = (size, { bg = CREAM, fg = INK, pad = 0.2 } = {}) => `<!doctype html><html><head><style>
*{margin:0} html,body{width:${size}px;height:${size}px;background:${bg};display:grid;place-items:center}
svg{width:${Math.round(size * (1 - 2 * pad))}px;height:auto;display:block}
</style></head><body>${mark(fg)}</body></html>`;
const shoot = async (html, size, path) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html);
  return page.screenshot({ path, omitBackground: false });
};
await shoot(icon(180), 180, "apple-touch-icon.png");
await shoot(icon(192), 192, "assets/icons/icon-192.png");
await shoot(icon(512), 512, "assets/icons/icon-512.png");
await shoot(icon(512, { bg: INK, fg: CREAM, pad: 0.28 }), 512, "assets/icons/icon-maskable-512.png");
const p16 = await shoot(icon(16, { pad: 0.06 }), 16, "assets/icons/icon-16.png");
const p32 = await shoot(icon(32, { pad: 0.08 }), 32, "assets/icons/icon-32.png");

// favicon.ico: an ICO container holding the two PNGs.
const pngs = [[16, p16], [32, p32]];
const head = Buffer.alloc(6 + 16 * pngs.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
let offset = head.length;
pngs.forEach(([s, buf], i) => {
  const o = 6 + i * 16;
  head.writeUInt8(s, o); head.writeUInt8(s, o + 1); head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3);
  head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
  head.writeUInt32LE(buf.length, o + 8); head.writeUInt32LE(offset, o + 12);
  offset += buf.length;
});
await writeFile("favicon.ico", Buffer.concat([head, ...pngs.map(([, b]) => b)]));
console.log("favicon.ico, apple-touch-icon.png, assets/icons/*");
await stop();
