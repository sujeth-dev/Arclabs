# Build log

Dated entries: what was done, what was tested, what failed, the fix.

## 2026-10-29 ? Search targeting and production discovery

- Added maintained, page-specific titles and descriptions for brand, Bengaluru/Bangalore websites, branding and marketing searches. Kept the Growth project description branch-specific. Regenerated Open Graph, Twitter and JSON-LD together; page bodies, assets, CSS, navigation and runtime JavaScript are unchanged.
- Added a public IndexNow verification key, dependency-free dry-run/submission script, production matching safeguards and three passing tests. Main pushes notify only after changed pages match production; weekly/manual audits check live search configuration. Added workflow receipts and documented account-dependent indexing, analytics, profile and Brave Search follow-ups in SEARCH-STRATEGY.md.
- Verified the updated www redirect returns 308, including inner pages and favicon. Existing favicon files remain valid; no artwork replacement or unstable cache-busting URL was added. The sitemap already contains the eight canonical URLs with accurate release dates and remains unchanged.
- Validation: static/shared-shell/content checks pass; the metadata/schema/crawler audit and all 32 deterministic screenshot comparisons pass with no pixel differences. Keyboard: 95 passed. Axe: zero violations. Internal links: 275 checked, none broken. Runtime JavaScript remains within budget. Mobile Lighthouse: Home, Services and Growth each score 99 performance and 100 accessibility, best practices and SEO; CLS/TBT remain zero. IndexNow acceptance and live deployment are checked after pushing; Search Console/Bing account submissions and real crawler-log verification require access.


## 2026-10-29 ? Collaborative pages portfolio grouping

- Moved Iconic Bengaluru and The Shallot Kitchen after Svojas and its social posts under Collaborative pages. Revised their copy and labels to describe content collaborations only; retained existing media, external links and project anchors.
- Removed both preview tiles from the Lab overview; Svojas remains. Home had no direct listing for either project. Updated Growth social descriptions and generated schema to match the collaboration relationship.
- Updated direction notes. Delivered on update/collaborative-pages separately from main; local Brand Kits plan files remain untouched.
- Validation: static/content/shared-shell checks and search audit pass; 273 internal references resolve. Growth checks pass at 390, 768, 1024 and 1440px in Ink and Cream, with zero axe violations, working controls, blocked embeds and no-JavaScript reading. Focused Lab/Growth checks confirm ordering, removed tiles and no overflow at all eight width/theme combinations; reviewed desktop and phone captures.

## 2026-10-29 — Internal technical SEO and AI search audit

- Audited official OpenAI, Anthropic, Perplexity, Google and Microsoft search/crawler guidance. Kept all changes internal: page bodies, rendering head code, CSS, runtime JavaScript, media and navigation are unchanged.
- Made search/retrieval crawler access explicit without changing training access. Added permanent index.html normalization, including the old Elements HTML endpoint, with equivalent local preview handling and preserved enquiry queries.
- Connected Organization, WebSite, pages, breadcrumbs, service catalogs and all nineteen Capabilities with stable entity IDs. Matched service descriptions to existing source data; removed unsupported legal/language claims and speculative entity aliases. Kept existing accurate page titles/descriptions and the eight-page sitemap; added social image MIME and alternative metadata.
- Added an idempotent development-only schema generator and repeatable search audit. Recorded platform decisions, absence of a clear llms.txt benefit, and external account/log-verification follow-ups in SEARCH-AUDIT.md. No new dependencies, hidden text, AI-only pages or runtime work.
- Validation: npm check passes; 95 keyboard checks pass; axe reports zero violations in both themes and interactive states; 275 internal references resolve; JS remains below budget. The existing Svojas external store still returns 403 to the link checker's request; no internal link fails.
- Search audit passes on all eight canonical pages, including eight simulated crawler identities, static text, metadata agreement, XML, entity reference resolution, service anchors, redirects, noindex 404s and generator idempotence. Theme persistence/logo audit also passes.
- Compared against 765edd4: bodies and rendering assets match exactly; all 32 full-page baseline/new screenshot pairs are pixel-identical (eight pages × two widths × two themes; deterministic no-JS/reduced-motion captures).
- Mobile Lighthouse: Home 99 performance; Services and Growth 100 performance. All three score 100 accessibility, best practices and SEO; CLS/TBT are zero. LCP is 1.9s Home, 1.5s Services and 1.5s Growth. No regression against acceptance thresholds. No external indexing/account action was submitted.

## 2026-10-29 — NUANSE Studio portfolio addition

- Added NUANSE Studio as File 07 in Websites & Systems, using the existing card, project-detail, and live-site link format.
- Used the supplied copper monogram unchanged on a warm cream panel, respecting its original 128 × 184 dimensions.
- Added the studio to the Home and website-collection client strips and the B2B filter. Kept the curated overview selections unchanged.
- Project copy reflects the publicly visible studio website: editorial presentation, selected work, services, and the brand audit flow. No performance claims added.
- Validation: live site returned HTTP 200; project checks passed with 22 matching content blocks; no overflow at 390 or 1440 pixels; direct project links and viewer controls worked; page and viewer accessibility scans returned no violations; no browser runtime errors.
- Previous collection work was committed and pushed before this addition. Generated preview captures remain untracked.

## 2026-10-29 — Work collections and logo gallery

- Added ten logo identities, with separate Brave Sheep and MONA Coffee artwork; excluded the studio mark from the collection.
- Restructured Lab into a curated overview with dedicated Websites & Systems and Logos collections. Added collection navigation and preserved earlier project and logo bookmarks.
- Added selected logos to Home, an accessible enlarged viewer, and restrained scroll reveals. Updated metadata, sitemap, and QA coverage for the collection routes.
- Recorded the broader direction, with Brand Kits and Digital Growth & Strategy awaiting content review.
- Validation: project checks passed; all three collection routes checked at 390, 768, and 1440 pixels without overflow; project filters, legacy links, and logo keyboard controls passed; accessibility scans reported no violations on the three collection pages.
- Visual review caught an inherited absolute-positioning rule on overview brand panels; scoped positioning fixed it before the final checks.
- Added repository workflow rules for focused commits, regular pushes, clear logs, and excluding generated preview captures.

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

## 2026-10-03 — Step 7.6: full QA

| Check | Result |
|---|---|
| html-validate (5 pages) | 0 errors |
| Shared nav/menu/footer identical · logo byte-identical | pass |
| HTML ↔ `data/content.js` | 21 blocks match |
| Share previews (titles, descriptions, OG 1200×630, `summary_large_image`, canonical, JSON-LD) | all pages complete |
| Unused CSS tokens | 0 (95 defined, all used) |
| Playwright 5 pages × 390/480/768/1024/1200/1440 × Cream / Ink / reduced motion | 90/90 — no console errors, no overflow (`qa/final/`) |
| Behaviour + keyboard suites (shell, hero, dialog, filter, elements, contact, analytics) | 96/96 |
| axe (WCAG 2.0/2.1 A+AA + best practice), 9 states × Cream/Ink | 0 violations (`qa/final/axe.json`) |
| Lighthouse mobile `/` · `/lab/` · `/elements/` | Perf 99 · 100 · 99; A11y, Best Practices, SEO 100; LCP 1.6 / 1.5 / 1.7s; CLS 0 / 0.002 / 0; TBT 0 (`qa/final/lighthouse_*.json`) |
| JS per page (gzip, all modules + inline) | 7.8–21.3KB (budget 60KB) |
| Internal links + anchors | 47/47 |
| External links | 403 from this environment's egress proxy for every host — re-check on the live URL |

**Failed → fixed:**
- axe: two placeholder plate accents under 4.5:1 → darkened (D17); /lab jumped h1 → h3 → hidden "All files" h2; viewer scroller had `aria-label` without a role → `role="region"`.
- Lighthouse first run: Perf 96–97, LCP 2.3–2.4s, flagged document latency — the dev server sent uncompressed files. Added gzip (as Vercel does): Perf 99–100, LCP 1.5–1.7s. Remaining hints are "unminified CSS/JS" (no build step, by design) and the single render-blocking stylesheet.
- Link checker read `theme-color` values as anchors and treated the 404 page's own 404 as broken → fixed in the checker.
- 8 unused brand tokens removed from the shipped CSS (D16).

## 2026-10-03 — Stop point

Steps 1–7.6 complete and pushed. Blocked, with next steps in TODO.md: 7.7 client media capture (network policy blocks the client sites) and 7.8 deploy + live verification (no Vercel credentials).

## 2026-10-03 — Revision (client feedback)

Built (one commit each, pushed):
- Brand assets saved unchanged in `brand-assets/` (fetch script blocked by the network; logos supplied by hand).
- Copy: hero "Websites and digital systems for businesses ready to grow online." / "Every page has a purpose."; Lab heading "Each one shaped by how the business works."; Process heading one sentence per line.
- Cursor: standard shapes in brand colours (D22).
- "This one's live" note on every live card; Assetly and Aivora India URLs; client strip names link to their files.
- Elements: Custom Systems demo was blank (bars sized against an auto-height grid row) → rebuilt as an enquiry board; Digital Presence rebuilt as a local search.
- Lab file: Mobile preview removed everywhere; Visit live site above the preview; preview opens the site (D20).
- Brand panels replace the placeholder plates (D18).
- Approach: annotated website plan replaces the measured mark.
- Hero: full stops fly into the ARC, tighter spacing, stamp removed, "Drag me" hint until the first drag (D19, D23).

Tested:
- Found while reviewing: earlier full-page screenshots were taken before once-in-view drawings ran, which hid the blank demo. `pages.mjs` now scrolls each page first and fails if a drawing has not played; `keyboard.mjs` checks every demo shows content.
- html-validate 0 errors · shell identical, mark untouched · content 21/21 · tokens all used.
- Pages: 5 × 6 widths × Cream / Ink / reduced = 90/90, no console errors, no overflow.
- Keyboard + behaviour: 104/104. axe: 0 violations.
- Lighthouse mobile: Performance 99 / 99 / 99, A11y/BP/SEO 100; LCP 1.8 / 1.8 / 1.7s; CLS 0 / 0.002 / 0; TBT 0.
- JS: 7.8–22.2KB gz per page. Internal links pass; external links 403 from this environment's proxy.
- "Elements row numbers flush left" turned out to be a screenshot crop; no change needed.

## 2026-10-03 — Revision follow-ups

- Approach: the measured mark is back (the website plan was reverted on review). It now always appears: 10% in-view threshold, visible before animating, and Home's sections start independently (D25). Checked with wheel scrolling at 1440 and 390.
- Hero → Lab gap reduced (hero bottom padding 2rem; Lab preview top padding up to 6rem).
- /elements: Ink switch shown; defaults to Ink, can switch to Cream (D24). axe 0 violations in both.
- check ✓ · keyboard/behaviour 104/104 · axe 0.


## 2026-10-29 — Logos, Lab collections, NUANSE (backfill)

Logged after the fact; details are in the commits. Ten logo identities added (`/lab/logos/`). Lab split into an overview and collection pages (`/lab/websites/`, `/lab/logos/`) with old bookmarks kept. NUANSE Studio added as File 07. Pushed as `01e6ac4` and `65992db`.

## 2026-10-29 — Digital Growth & Strategy collection

**Built:** `/lab/digital-growth/`, in four parts with copy agreed in review: Brands we work with (Iconic Bengaluru, Svojas, The Shallot Kitchen), Mass campaigns, SEO, Going online.
- Brand work: profile captures for Iconic Bengaluru and The Shallot Kitchen (`assets/growth/`); three live Svojas posts (Instagram's official embed) and the live svojasshop.in in a frame. Both load only when scrolled near. The work turns from greyscale to colour as it reaches the reader.
- Mass campaigns: choosing Creators, Colleges, On the ground or Collaborations sends one launch card out to that channel's pages (decorative panel, `aria-hidden`; the text carries the content).
- SEO: the search field types "biryani near JP Nagar" once; Maps / website / across the web; how it runs.
- Going online: six steps; the rule fills and headings brighten as the reader passes them.
- Lab overview gets a third collection; collection nav, sitemap, QA page lists and privacy (Instagram and store embeds) updated. `js/growth.js` respects Reduce motion.

**Tested:** `npm run check` passes (8 pages) · 1440 / 768 / 390: no console errors, no horizontal overflow, embeds and store render · axe 0 violations at load and after scrolling (third-party frames excluded).

**Failed → fixed:** svojasshop.in returned 403 in the test browser — CloudFront blocks the headless user agent; with a normal one it serves 200 inside the frame · axe flagged dimmed steps and faded visuals → steps now change heading colour only, visuals change saturation only · `sed` turned `lab/index.html` to LF and the shell check reported drift → line endings normalised · campaign panel cramped on phones → stacks vertically there.

**Not verified:** Instagram profile pages cannot be embedded (`X-Frame-Options: DENY`), hence the captures. No results or metrics are shown yet; they will sit beside each brand once analytics are supplied.

## 2026-10-29 — Brand Kits collection

**Built:** `/lab/brand-kits/` under “One identity. Many surfaces.” Two complete supplied systems, Cub & Co and SanDune, with their own chapter styling inside the ARC shell. Cub & Co has 13 approved selectable colourways (click, arrows, Home/End and pointer drag), real specimen fonts loaded near the chapter, patterns/icons, packaging and print/social applications. SanDune uses cropped client boards, a colour/line system, secondary marks, packaging, marketing and desktop/phone store concepts. The original 46 Cub & Co assets are byte-identical by SHA-256. SanDune has AVIF/WebP responsive sources and a repeatable conversion script; no PNG originals are committed.

**Integrated:** Brand Kits is collection 03, Digital Growth becomes 04; all five Lab menus, overview previews, metadata/CollectionPage breadcrumbs, sitemap and QA lists updated. CTA is `/#contact`; Smith & Wesson stays in Logos. Existing Digital Growth follow-up commits were preserved. Screenshots/reports live in ignored `qa/brand-kits/`.

**Tested:** `npm run check` passes (9 valid pages; shared shell/mark unchanged; content, metadata and tokens pass). Pages: 36/36 across 390/768/1024/1440, no console errors, failed local responses or horizontal overflow. Existing keyboard/behaviour suite 107/107. New collection suite passes swatch keyboard/drag input, sticky rail, store hover/focus, site reduced-motion toggle, system reduced motion at all four widths, and complete no-JavaScript rendering. axe: zero violations across all pages/themes and after scrolling Brand Kits. Internal links: 232/232. Brand Kits JS: 9.8 KB gzip; page images at 1440 px: 982 KB (below 1.2 MB). Lighthouse mobile: Lab and Brand Kits Performance 99, Accessibility/Best Practices/SEO 100; Brand Kits LCP 1.7 s, CLS 0, TBT 0.

**Failed → fixed:** fractional SVG viewBox dimensions converted to integer HTML dimensions; copied structured data replaced with Brand Kits metadata; fixed chapter labels inheriting theme colours and made the store viewport keyboard-focusable. Stray diff characters in the first CSS draft prevented mobile rules from applying; removed, then checked all widths. Final visual pass split dense SanDune boards into individual crops and removed long production notes from marketing panels. OS reduced motion is handled locally as well as the site toggle. The no-JavaScript QA case now avoids in-page timers, which do not run with JavaScript disabled. An initial Lighthouse run returned no timing data; an isolated rerun completed with no warnings or audit errors.

**External check:** Svojas store still returns 403 to the link checker; the existing normal-user-agent embed handling remains unchanged. Other external links returned 200.

## 2026-10-29 - Brand Kits closing summaries

Removed the closing statement and kit inventory from both Cub & Co and SanDune, along with their unused summary styles. Validation: `npm run check` passes.

## 2026-10-29 - Growth editorial presentation

Rebuilt Digital Growth as open editorial chapters: section index, separate brand openings and Svojas social sequence, numbered campaign rows, spacious SEO areas and ongoing process, and a six-step launch sequence. All three social posts remain available at every width. Copy is shorter and search claims are qualified. Search typing finishes once; local motion respects OS and site preferences. Existing media, links and brand facts retained.

Validation: static/content/shell checks pass; keyboard 107/107; axe zero violations; 236 internal links resolve; Growth JavaScript 9.7 KB gzip. Growth-specific checks pass in both themes at 390/768/1024/1440, including blocked embeds, keyboard controls, completed search, OS reduced motion and no-JavaScript content. Live embeds checked at all four widths. Mobile Lighthouse: Performance 99, Accessibility/Best Practices/SEO 100, LCP 1.7 s, CLS 0. The initial page run reported a third-party report-only CSP diagnostic; the QA watcher now excludes that exact browser warning, and live Growth retests pass.

## 2026-10-29 - Services and brochure alignment

**Built:** /services/ now contains four flexible Elements (Establish your presence, Get found, Reach the right people, Convert & grow), followed by nineteen individual Capabilities. Existing six capability slugs and demonstrations remain; new capabilities use static native details with useful text. Possible scope is described without fixed inclusions or commercial promises. Each Element links to its capabilities and supported portfolio work or clearly labelled approaches. Lab remains the separate work portfolio.

**Aligned:** Home now introduces design, technology and growth, previews the four Elements and links to individual Capabilities. The studio process is Understand, Strategize, Create & Build, Improve & Grow; historical project-specific process descriptions are unchanged. Navigation, footer, metadata, structured data, social previews, sitemap and QA lists use Services. The direction document records the agreed architecture and terminology; README documents maintenance and enquiries.

**Compatibility and enquiries:** Permanent /elements and /elements/ redirects are configured for Vercel and the local server, with a static fallback. Browser fragments and query strings survive. Existing need= links still select capabilities; element= records a broader direction independently. Optional choices are grouped in disclosures, with selected groups opened on arrival. Email and Formspree include both the stable selections and readable names; unknown values are ignored. Submission tests intercept requests and send no actual enquiry.

**Validation:** npm run check passes (10 HTML files including the redirect fallback; shared shell and mark unchanged; 37 content blocks and metadata/tokens match). All 72 responsive page/theme/width combinations pass across 390/768/1024/1440 in Cream and Ink. Keyboard/behaviour: 95 passed; the hero suite was repeated after the hint correction and passes 6/6. Axe reports zero violations across pages/themes and interactive states. All 274 internal links resolve; JavaScript stays under 60 KB gzip on every page (Services 18.7 KB). The Services suite passes all nineteen capability details and the six established demos, both themes at all four widths, no-JavaScript reading, all six legacy bookmarks, independent/combined enquiry links, unknown values, email contents, and mocked failed/successful Formspree submissions. OS/site motion preferences also settle demonstrations changed mid-animation.

**Visual and performance:** Reviewed the updated Growth chapters and Services/Home sections at desktop/phone sizes, plus page/theme/width overview captures. Mobile Lighthouse: Home 99 Performance, Services 100, Growth 100; all three Accessibility/Best Practices/SEO 100. LCP: 1.9 s / 1.5 s / 1.2 s respectively; CLS and TBT 0 throughout. An initial Home Accessibility 97 was traced to the existing Drag me hint fading through low contrast; the hint now appears at full contrast and hides on drag, and Lighthouse passes 100. Fixed an orphaned headline stop on mobile and retained all three social posts at intermediate widths.

**Limits:** Svojas still returns 403 to the external link checker's user agent; its existing browser preview handling and outbound store links are retained. Public deployment was not verified. Generated captures/reports remain ignored; tracked baseline axe output is restored and local Brand Kits planning files remain untouched.

## 2026-10-29 - Persistent theme and search identity

**Theme:** Cream/Ink now persists in local storage as arc-theme and is applied before paint on all nine public pages. Ink remains the first-visit fallback. Current-page controls, browser-back restores, cross-tab updates and the browser theme colour stay in sync. Blocked storage is handled without throwing; motion remains page-local. Updated the privacy page, direction notes, decisions and preference QA to match.

**Search identity:** The supplied logo images were visible and reachable; the existing favicon ICO only contained 16/32px images and the SVG used a non-square viewBox and theme-dependent colours. Added a stable opaque 96px PNG favicon, 48/96px ICO layers, and a square opaque SVG using the unchanged ARC mark. All pages declare the PNG/ICO/SVG variants. Home Organization.logo now also declares contentUrl and PNG encoding; the existing 512px logo remains. Updated the web manifest to the broader Services positioning. The asset generator reproduces every new favicon variant.

**Verified:** npm run check passes. Shared keyboard/shell checks: 24/24. The new theme-seo suite passes Cream and Ink across every page and legacy redirect at 390/1440, refresh, cached-history restores, cross-tab synchronisation, invalid settings and blocked storage. All eight sitemap URLs resolve with correct canonicals and structured data, Services is included and the legacy Elements URL is excluded. Crawler-style requests can load robots, the new favicon and the 512px logo; image dimensions and visible pixel variation pass. Before this change, the public Services page, current sitemap, robots and existing logo assets already returned 200.

**Google boundary:** There is no connected Search Console session/API in this workspace, so no account indexing status or reindex submission is claimed. Google must recrawl the homepage and icon, and displaying the favicon remains Google's decision. A repeatable deployed audit is available as node scripts/qa/theme-seo.mjs --live.
