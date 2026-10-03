// Link check: every internal href/src resolves (200) and every #anchor exists;
// external links are requested (HEAD, then GET) and reported.
import { readFile } from "node:fs/promises";
import { start } from "./lib.mjs";
import { projects, elements } from "../../data/content.js";

const files = { "/": "index.html", "/lab/": "lab/index.html", "/elements/": "elements/index.html", "/privacy/": "privacy/index.html", "/404": "404.html" };
const { browser, base, stop } = await start(4388);
const ids = {}; const internal = new Map(); const external = new Set();
for (const [path, f] of Object.entries(files)) {
  const html = await readFile(f, "utf8");
  ids[path] = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/(?:href|src|srcset|content)="([^"]+)"/g)) {
    for (const raw of m[1].split(",").map((s) => s.trim().split(" ")[0])) {
      if (m[0].startsWith("content=") && !/^(https?:|\/)/.test(raw)) continue;  // meta values, not links
      if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("data:")) continue;
      if (/^https?:/.test(raw)) { if (!raw.includes("arclabs.vercel.app")) external.add(raw); continue; }
      if (raw.startsWith("/") || raw.startsWith("#")) internal.set(raw.startsWith("#") ? path + raw : raw, path);
    }
  }
}
// Links built by JS from data/content.js
for (const p of projects) { internal.set(`/lab/#file-${p.slug}`, "data"); if (p.liveUrl) external.add(p.liveUrl); }
for (const e of elements) internal.set(`/elements/#${e.slug}`, "data");
external.add("https://wa.me/918088506783");

let bad = 0;
for (const [link, from] of internal) {
  const [path, hash] = link.split("#");
  const url = (path || from).split("?")[0];
  const res = await fetch(base + url, { redirect: "manual" });
  let ok = res.status === 200 || (url === "/404" && res.status === 404);
  if (ok && hash) ok = ids[url]?.has(hash) || /^file-/.test(hash) && projects.some((p) => `file-${p.slug}` === hash);
  if (!ok) { bad++; console.log(`FAIL ${link} (from ${from}) → ${res.status}${hash ? " #" + hash : ""}`); }
}
console.log(`internal: ${internal.size} checked, ${bad} broken`);
const ext = [];
for (const u of external) {
  let status;
  try { status = (await fetch(u, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(15000) })).status; if (status >= 400) status = (await fetch(u, { redirect: "follow", signal: AbortSignal.timeout(15000) })).status; }
  catch (e) { status = `unreachable (${e.cause?.code || e.name})`; }
  ext.push([u, status]);
  console.log(`${status === 200 ? "ok  " : "warn"} ${u} → ${status}`);
}
await stop();
process.exit(bad ? 1 : 0);
