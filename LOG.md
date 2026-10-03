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

## 2026-10-03 — Step 4: /lab

**Built:** page head (label, H1, intro), client strip, filter (All · Interiors · Fashion · Food · Fitness · B2B as `aria-pressed` buttons, underline on active, FLIP re-order + fade 400ms, live-region count, `filter_used` event), six-file grid (large, tall, two staggered pairs; filtered view becomes an even two-up), closing CTA with margin note, Lab File dialog.

**Tested:** filter suite 8/8 (keyboard filter, pressed state, announcement, event, reset, `/lab/#file-aivora-india` on load, no live link without a URL) · content check 9 blocks · html-validate · shell · pages 5 × 4 widths.

**Failed → fixed:** no space between the grid and the closing band → section bottom padding · files without a URL showed "aivoraindia" in the browser chrome (reads like a domain) → plain name · test selector collided with cards' `data-filter` → scoped.

Screenshots: `qa/04-lab/`.

## 2026-10-03 — Step 5: Elements

**Built:** /elements (always Ink): six accordion rows (number · symbol tile · name · line · +; button with `aria-expanded` + `role="region"` panel; one open at a time; + turns into a close mark; 400ms height; large faint symbol behind the row on hover; cursor tag Expand/Close; `#<slug>` opens a row; `element_opened`). Panels rendered from `data/content.js`: mini-demo, What it solves, What's included, Works well with (links open that row), Related work (opens the Lab file in the dialog), How it works, Start this project (`/?need=<slug>#contact`). Mini-demos: frame assembles · Add to cart ticks a live counter · message bubble · map pin drops onto a result · three bars grow · before/after range slider (keyboard operable); each plays once, complete when reduced. Combinations strip (five small ARCs, symbols as anchors, result on top → prefilled Contact). Closing CTA. Home 03 preview rows → `/elements/#<slug>` (symbol grows on hover, tag "Open").

**Tested:** elements suite 18/18 · content check 21 blocks · html-validate · shell · pages 5 × 4 widths.

**Failed → fixed:** Redesigns "after" layer content sat left of the split → spread across the width · "Mix and match." overlapped the lead below 1024px → static there · combinations single-column on phones → two-up.

Screenshots: `qa/05-elements/`.

## 2026-10-03 — Step 6: Approach, Process, Contact

**Built:** 04 Approach — philosophy lines (static) beside the mark drawn as a measured figure (u = node Ø: anchors 3.3u apart, rest 2.0u up, stroke 0.32u, dimension lines 1u / 3.3u / 2.0u, Design · Build · Grow labels); the span draws once in view (700ms), nodes pop, dimensions fade; studio copy; business types set very large, each opening its Lab file (Restaurants → Zingara, Interior companies → Velmont, Fashion labels → The Possah, Fitness studios → Fitness Garage, B2B firms → Assetly). 05 Process — five steps on one hairline with a node per step, the line draws once in view (700ms), vertical on < 1024px, margin note. 06 Contact (Ink) — heading + four lines + lead; email and phone set large as copy buttons (cursor tag "Copy"); WhatsApp us; margin note; form (Name · Business · Email · Phone · six chips · Budget · Message), honeypot `_gotcha`, Turnstile slot (loads only with a site key), inline validation with focus to the first error, Formspree POST → "Thanks, we'll be in touch." (mailto fallback when no form ID), `enquiry_sent`. Chips: two selected → a span joins them (400ms draw) and the plan's result word appears above; prefill via `?need=`.

**Tested:** contact suite 15/15 (prefill, result words, keyboard chips, validation + focus, clipboard, WhatsApp, Formspree POST via stubbed config + endpoint, success state, event) · html-validate · shell · content · pages 5 × 4 widths.

**Failed → fixed:** technical figure's "Build" label collided with the 2.0u dimension → dimension moved out; units no longer uppercased · on phones the chip connector crossed chips on the row between → chips now sit on an opaque ground above the line · html-validate flagged the shared checkbox name and `role="list"` on `<ol>` → both are intended; rules configured.

Screenshots: `qa/06-approach-process-contact/`.

## 2026-10-03 — Step 7.1–7.4: 404, privacy, SEO, analytics

**Built:** 404 ("This page didn't land." + Back to home; the top node slides down the span's right side, leaves it, and hops back over the outside to rest on the apex — 1200ms, once, none when reduced). Privacy page (plain-language draft, TODO T10). `scripts/og.mjs` renders three 1200×630 OG images (Ink, mark + lockup, "Design. Build. Grow." with node stops, page label) and the icon set (favicon.ico 16+32, apple-touch-icon 180, 192/512 + maskable) from the untouched mark path. `sitemap.xml`, `robots.txt`, `site.webmanifest`, `scripts/set-domain.mjs`, `vercel.json` (no install/build, trailing slashes, cache + security headers), `.vercelignore` (dev files never deployed). Analytics consent banner (only when a GA4 ID is set), Cookie settings in the footer, Plausible switch.

**Tested:** `scripts/qa/og.mjs` — every page has unique title/description, canonical, og:title/description/url/image/alt, `summary_large_image`; images are absolute, exist and are 1200×630; JSON-LD parses · analytics suite 11/11 (no tracker without an ID; banner; Allow → GA4 loads and `filter_used` reaches `dataLayer`; choice remembered; decline → nothing loads).

**Failed → fixed:** the 404 hop back cut through the arch (a node crossing the span) → control point moved up and out · OG images rendered in a serif fallback (`setContent` on about:blank made the font requests cross-origin) → render from the dev server's origin · OG footer used my own wording → the plan's services line · OG headline touched the right margin → 122px.

**Not verifiable here:** live preview in WhatsApp / LinkedIn / X debuggers needs a public URL (after deploy).

## 2026-10-03 — Step 7.5: deploy prep + media pipeline

**Built:** README (setup, config, adding a project/element, replacing media, share images, QA, deploying). `scripts/media/capture.mjs` (status check, fonts/images settled, pop-ups dismissed, desktop/mobile viewport + full page, ~11s smooth-scroll recording). `scripts/media/process.mjs` (AVIF + WebP 1x/2x with the top kept in frame; MP4 H.264 + WebM VP9, muted, no audio, ≤ 1.5MB with CRF stepping; poster from 1s; wires `data/content.js`, the Lab cards and File 01's poster preload; idempotent).

**Tested (offline, on synthetic captures of this site in a scratch copy):** outputs created; `ffprobe` shows video streams only; MP4 805KB, WebM 566KB; content.js and both pages wired; html-validate + content check still pass; second run changes nothing; card poster and the dialog's Desktop recording render with no console errors.

**Failed → fixed:** comment regex stopped at a `>` inside the TODO text · a lazy match crossed into the next card on re-run and replaced its plate → match confined to the card's `<article>`.

**Not done:** real captures — client sites are unreachable from this environment (TODO T1).
