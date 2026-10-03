# Build log

Dated entries: what was done, what was tested, what failed, the fix.

## 2026-10-03 — Plan

- Read `arc-labs-brand.zip` (README, styles.css, script.js, index.html, components/) and the FINAL PLAN.
- Environment check: Node 22, npm registry reachable, Playwright Chromium at `/opt/pw-browsers`, ffmpeg present.
- **Failed:** all four client sites return a proxy 403 (`connect_rejected`) — the environment's network policy only allows package registries. Logged in TODO.md; placeholder plates stay.
- No Vercel credentials in the environment. Logged in TODO.md.
- Wrote PLAN.md.

## 2026-10-03 — Stack revision

- Brief revised from Astro to plain HTML/CSS/vanilla JS, no build step. Removed the Astro scaffold (config, tsconfig, npm deps); kept the ported stylesheet as `css/styles.css` (font and cursor paths updated). `package.json` now holds dev-only tools (Playwright, axe, Lighthouse, sharp, html-validate).
- Rewrote PLAN.md for the new stack.
