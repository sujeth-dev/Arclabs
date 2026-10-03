// Turns raw captures into web media and wires them into the site (dev only).
// Usage: node scripts/media/process.mjs [slug ...] [--raw media/_raw] [--out media] [--no-wire]
//   images → AVIF + WebP at 1x and 2x, top of the page kept in frame
//   video  → MP4 (H.264) + WebM (VP9), muted, no audio track, ≤ 1.5MB each, poster from 1s
//   wiring → data/content.js (screens, video, poster) and the Lab cards in index.html + lab/index.html
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { projects } from "../../data/content.js";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
const RAW = opt("--raw", "media/_raw"), OUT = opt("--out", "media"), WIRE = !args.includes("--no-wire");
const only = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const MAX = 1.5 * 1024 * 1024;
const exists = (p) => stat(p).then(() => true, () => false);

async function image(src, base, width, { ratio, maxHeight } = {}) {
  const meta = await sharp(src).metadata();
  for (const [suffix, w] of [["", width], ["@2x", width * 2]]) {
    let img = sharp(src);
    if (ratio) img = img.extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, Math.round(meta.width / ratio)) });
    else if (maxHeight) img = img.extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, Math.round(meta.width * (maxHeight / width))) });
    img = img.resize({ width: Math.min(w, meta.width) });
    await img.clone().avif({ quality: 52, effort: 6 }).toFile(`${base}${suffix}.avif`);
    await img.clone().webp({ quality: 78 }).toFile(`${base}${suffix}.webp`);
  }
}

function video(src, dir) {
  const run = (a) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...a]);
  const scale = "scale=1280:-2,fps=30";
  // Poster frame from the first second.
  run(["-ss", "1", "-i", src, "-frames:v", "1", "-vf", "scale=1280:-2", `${dir}/video-poster.webp`]);
  for (const [crf, ext, codec] of [[28, "mp4", "h264"], [42, "webm", "vp9"]]) {
    let q = crf;
    for (;;) {
      const out = `${dir}/scroll.${ext}`;
      if (codec === "h264") run(["-i", src, "-an", "-vf", scale, "-c:v", "libx264", "-preset", "slow", "-crf", String(q), "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]);
      else run(["-i", src, "-an", "-vf", scale, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String(q), "-row-mt", "1", out]);
      const size = execFileSync("stat", ["-c", "%s", out]).toString().trim();
      if (Number(size) <= MAX || q >= 50) { console.log(`  ${ext} ${(size / 1024).toFixed(0)}KB crf ${q}`); break; }
      q += 3;
    }
  }
}

function cardMedia(p) {
  const m = `/media/${p.slug}`;
  const sizes = p.featured === "large" ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 45vw, 100vw";
  const vid = p.video ? `\n                <video class="frame__video" muted loop playsinline preload="none" poster="${m}/video-poster.webp" data-src-mp4="${m}/scroll.mp4" data-src-webm="${m}/scroll.webm" aria-hidden="true"></video>` : "";
  return `<picture><source type="image/avif" srcset="${m}/poster.avif 960w, ${m}/poster@2x.avif 1920w" sizes="${sizes}"><source type="image/webp" srcset="${m}/poster.webp 960w, ${m}/poster@2x.webp 1920w" sizes="${sizes}"><img class="frame__img" src="${m}/poster.webp" alt="${p.name} homepage, desktop" width="960" height="600" loading="lazy" decoding="async"></picture>${vid}`;
}

const done = [];
for (const p of projects) {
  if (only.length && !only.includes(p.slug)) continue;
  const raw = `${RAW}/${p.slug}`;
  if (!(await exists(`${raw}/desktop.png`))) continue;
  const dir = `${OUT}/${p.slug}`;
  await mkdir(dir, { recursive: true });
  console.log(p.slug);
  await image(`${raw}/desktop.png`, `${dir}/poster`, 960, { ratio: 16 / 10 });
  await image(`${raw}/desktop-full.png`, `${dir}/desktop-full`, 720, { maxHeight: 9000 });
  const hasVideo = await exists(`${raw}/scroll.webm`);
  if (hasVideo) video(`${raw}/scroll.webm`, dir);
  done.push({ ...p, video: hasVideo });
}

if (WIRE && done.length) {
  // data/content.js
  let data = await readFile("data/content.js", "utf8");
  for (const p of done) {
    const m = `/media/${p.slug}`;
    const block = new RegExp(`(slug: "${p.slug}"[\\s\\S]*?)screens: \\{ desktop: \\[[^\\]]*\\](?:, mobile: \\[[^\\]]*\\])? \\}, video: (?:null|\\{[^}]*\\}), poster: (?:null|"[^"]*"),`);
    data = data.replace(block, `$1screens: { desktop: ["${m}/desktop-full"] }, video: ${p.video ? `{ mp4: "${m}/scroll.mp4", webm: "${m}/scroll.webm" }` : "null"}, poster: ${p.video ? `"${m}/video-poster.webp"` : "null"},`);
  }
  await writeFile("data/content.js", data);
  // Lab cards: swap the brand panel for the poster (+ hover recording).
  for (const f of ["index.html", "lab/index.html"]) {
    let html = await readFile(f, "utf8");
    for (const p of done) {
      html = html.replace(new RegExp(`(data-file="${p.slug}"(?:(?!</article>)[\\s\\S])*?<div class="frame__media[^"]*">\\s*)<div class="brand-panel"[\\s\\S]*?</div>`), `$1${cardMedia(p)}`);
    }
    // Preload only the hero file's poster (File 01 on Home).
    const hero = done.find((p) => p.featured === "large");
    if (f === "index.html" && hero && !html.includes('rel="preload" as="image"')) {
      html = html.replace('<link rel="stylesheet" href="/css/styles.css">', `<link rel="preload" as="image" type="image/avif" imagesrcset="/media/${hero.slug}/poster.avif 960w, /media/${hero.slug}/poster@2x.avif 1920w" imagesizes="(min-width: 1024px) 60vw, 100vw">\n<link rel="stylesheet" href="/css/styles.css">`);
    }
    await writeFile(f, html);
  }
  console.log(`wired ${done.map((p) => p.slug).join(", ")} into data/content.js and the Lab cards`);
}
if (!done.length) console.log(`No raw captures found in ${RAW}. Run scripts/media/capture.mjs first.`);
