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

## 2026-10-03 — Step 1: setup + global elements

**Built:** folder structure; `css/styles.css` (tokens unchanged + `.ink`, margin note, file stamp, toggles, cursor, nav/menu/footer/consent); `js/arc.js` (engine ported to an ES module, plus `spanPathTo` and `onceInView`); `js/main.js` (theme + motion prefs, nav, menu dialog, cursor + lagging tag, copy); `js/analytics.js` + `js/config.js`; cursor SVGs (arrow, link, drag); five page shells; dev server; QA scripts (`pages`, `validate`, `tokens`, `shell`, `keyboard`).

**Tested:** html-validate (5/5 valid) · shell drift + mark byte-identical · Playwright 5 pages × 390/768/1024/1440 (no console errors, no overflow) · keyboard suite `shell` 21/21 (skip link, theme + motion toggles and persistence, menu open/trap/Esc/focus return, touch → no cursor, /elements always Ink).

**Failed → fixed:**
- html-validate: lowercase doctype + `role="list"` flagged → rules disabled (both deliberate); phone numbers → `&nbsp;`.
- Approach/Process marked `aria-current` on Home (empty key matched empty current) → fixed.
- `[hidden]` buttons still visible (`.toggle` sets display) → global `[hidden]{display:none!important}`.
- 404 page's own 404 status reported as a console error → QA ignores the navigation's status; resource 404s still fail.
- Token check matched class names (`.btn--ghost:`) → regex tightened. Twelve tokens are not yet used; they are consumed by later steps or removed before final QA.

Screenshots: `qa/01-shell/`.

## 2026-10-03 — Step 2: Home hero

**Built:** H1 with node stops (one word per line < 640px, one line above, fitted to the content width); lead + sub line + buttons; Lift figure with labels; `js/home.js` hero: `ARC.signature` on load, Grow node drag via pointer capture with the span recomputed live (`spanPathTo`), spring back with an ease-out (no overshoot) to the exact prototype rest path; stamp with the mark at the centre under the figure's bottom corner. Pre-paint `motion` class so draw-in starts hidden (no flash), never set under reduced motion.

**Tested:** hero suite 6/6 (reduced → complete first frame; rest path = prototype `M40 272 A 280 214 0 0 1 600 272`; drag changes the span; tag reads "Drag"; springs back; no errors) · pages 5 × 4 widths pass · html-validate · shell.

**Failed → fixed:**
- At 1440 the headline broke before a node stop (inline-block = break opportunity) → `nowrap` per word, fit ratio 8.35 → 8.7.
- Stamp covered the Build anchor and label → moved below the figure's bottom corner.
- A fix block from step 1 never ran (`grep -c` returned 0 and stopped the `&&` chain): `[hidden]` rule, footer list alignment, wordmark size → applied and verified.
- Footer wordmark ignored page margins → aligned to `.wrap`.

Screenshots: `qa/02-hero/`.

## 2026-10-03 — Step 3: Lab File dialog + Home Lab preview

**Built:** `data/content.js` (six files, six elements, combinations, `resultFor()`); Home 02 Lab preview (label, heading, body, client strip marquee, three featured cards — Velmont large, The Possah tall, Zingara wide — annotation "This one's live → velmontdesign.com" joined by an arc ending in a node, margin note, View all files); Lab card (frame + grey dots, placeholder plate with TODO for real media, FILE/STATUS stamp straddling the frame edge, hover recording support for when media exists); `js/lab.js` Lab File dialog (native `<dialog>`, Ink, arch clip-path from the card 600ms and back, record rows with Formula as a small ARC, Desktop/Mobile tabs with arrow keys, drag-to-scroll, Visit live site, Previous/Next, swipe, Esc/close/outside click, focus return, `#file-<slug>` read/written, `file_opened` event). `scripts/qa/content.mjs` checks HTML text against the data file.

**Tested:** dialog suite 17/17 · content check · html-validate · shell · pages 5 × 4 widths. Visual: arch mid-rise from the clicked card; dialog at 390 and 1440.

**Failed → fixed:**
- Viewer had a fixed height → empty band under short placeholders; now `max-block-size`.
- Annotation pushed File 01 below File 02 → positioned above the frame.
- Stamp covered plate text at 390 → moved to straddle the frame's bottom edge.
- Plan gives a Protocol only for Velmont → the row is omitted for the other five (DECISIONS D9, TODO T9).

Screenshots: `qa/03-lab-dialog/`.
