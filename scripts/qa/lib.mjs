// Shared QA helpers (dev only).
import { chromium } from "playwright";
import { serve } from "../serve.mjs";

export const PAGES = [
  { name: "home", path: "/" },
  { name: "lab", path: "/lab/" },
  { name: "elements", path: "/elements/" },
  { name: "privacy", path: "/privacy/" },
  { name: "404", path: "/this-page-does-not-exist" },
];
export const WIDTHS = [390, 768, 1024, 1440];
export const ALL_WIDTHS = [390, 480, 768, 1024, 1200, 1440];

export async function start(port = 4399) {
  const server = await serve(port);
  const browser = await chromium.launch();
  const base = process.env.QA_BASE || `http://localhost:${port}`;
  return { server, browser, base, async stop() { await browser.close(); server.close(); } };
}

// Collects console errors, page errors and failed same-origin requests.
export function watch(page, base) {
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push(`console: ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    const u = r.url();
    if (u.startsWith(base) && r.status() >= 400 && !r.request().isNavigationRequest()) errors.push(`http ${r.status()}: ${u}`);
  });
  return errors;
}

// Horizontal overflow, measured with clipping on <body> lifted.
export async function overflow(page) {
  return page.evaluate(() => {
    const b = document.body, prev = b.style.overflowX;
    b.style.overflowX = "visible";
    const w = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const culprits = [];
    if (sw > w + 1) {
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.right > w + 1 && r.width > 0) {
          let clipped = false;
          for (let p = el.parentElement; p && p !== b; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if (ox !== "visible") { clipped = true; break; }
          }
          if (!clipped) culprits.push(`${el.tagName.toLowerCase()}.${[...el.classList].join(".")} → ${Math.round(r.right)}`);
        }
      }
    }
    b.style.overflowX = prev;
    return { overflow: sw > w + 1, sw, w, culprits: culprits.slice(0, 8) };
  });
}
