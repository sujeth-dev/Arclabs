# ARC Labs website — build plan

Source of truth: the FINAL PLAN (content, structure, creative, behaviour) and the
prototype `arc-labs-brand.zip` (tokens, components, ARC geometry, motion code).
This file is the task list; tasks are ticked as they finish. `LOG.md` records
what was tested, `DECISIONS.md` the choices the plan does not cover, `TODO.md`
anything that needs input.

> **Stack revision (2026-10-03):** the first draft targeted Astro. The brief was
> revised to plain HTML, CSS and vanilla JS with no framework and no build step.
> This plan reflects the revised stack.

---

## 1. Architecture

| Layer | Choice |
|---|---|
| Pages | Hand-written HTML: `index.html`, `lab/index.html`, `elements/index.html`, `404.html`, `privacy/index.html`. Shared nav and footer markup is written into each page |
| Styling | One stylesheet, `css/styles.css`, ported from the prototype. Token names and values unchanged |
| Interactivity | Vanilla ES modules, no libraries. No bundler, no transpiler |
| Motion | `js/arc.js` — the prototype engine (`spanPath`, `restCenter`, `draw`, `pop`, `hop`, `signature`, `loop`, `reduced`) as an ES module, plus CSS transitions |
| Content | `data/content.js` exports `projects` and `elements`. JS renders dialogs and Element details from it. Critical text (headings, Lab cards, Element names and lines) is in the HTML so it is visible and indexable without JS |
| Pop-up | Native `<dialog>` |
| Fonts | Inter + Inter Display woff2 from the zip, self-hosted in `assets/fonts/` |
| Images | AVIF + WebP made once by `scripts/media/process.mjs` (sharp, dev only), served with `<picture>` |
| Video | Self-hosted MP4 + WebM, muted, lazy-loaded |
| Form | Formspree + honeypot + Cloudflare Turnstile (keys in `js/config.js`) |
| WhatsApp | `https://wa.me/918088506783` |
| Analytics | GA4 behind a consent banner; switchable to Plausible in `js/config.js`. Events: enquiry sent, file opened, element opened, filter used |
| SEO | Hand-written meta per page, static OG images, `sitemap.xml`, `robots.txt`, Organization JSON-LD |
| Hosting | Vercel, static (no build). `.vercelignore` keeps dev files out of the deploy |
| Testing | Playwright, Lighthouse, axe, html-validate — dev dependencies only, nothing shipped |

### Folder structure

```
/index.html                 Home
/lab/index.html             All projects
/elements/index.html        All services (always Ink)
/404.html
/privacy/index.html
/css/styles.css
/js/config.js               site URL, Formspree, Turnstile, analytics switches
/js/arc.js                  ARC motion engine (ported from script.js)
/js/main.js                 nav, menu, cursor, theme, reduced motion, consent, copy
/js/home.js                 hero ARC + drag, Approach figure, Process line
/js/lab.js                  Lab cards, filter, Lab File dialog
/js/elements.js             accordion, mini-demos, combinations
/js/contact.js              form, chips, prefill
/js/analytics.js            track() → GA4 or Plausible, consent-gated
/data/content.js            projects + elements
/assets/fonts/  /assets/logo-mark.svg  /assets/og/  /assets/cursors/  /assets/icons/
/media/<slug>/              screenshots, posters, recordings
/favicon.svg  /favicon.ico  /apple-touch-icon.png  /site.webmanifest
/sitemap.xml  /robots.txt  /vercel.json  /.vercelignore
--- dev only (not deployed) ---
/scripts/serve.mjs          local static server (dir index + 404.html)
/scripts/og.mjs             renders OG images + icons with Playwright
/scripts/media/             capture.mjs (client sites), process.mjs (sharp, ffmpeg)
/scripts/qa/                pages, keyboard, a11y, lighthouse, links, tokens, validate
/qa/<task>/                 screenshots and reports
/package.json               dev dependencies for testing and media only
```

### Content model — `data/content.js`

```js
export const projects = [{ file, slug, name, line, sector, status, filter, liveUrl,
  featured, hypothesis, formula: { problem, context, solution }, protocol: [],
  insideTheLab, result, screens: { desktop: [], mobile: [] }, video, poster, plate, order }];
export const elements = [{ number, symbol, slug, name, line, demo, solves,
  includes: [], worksWellWith: [{ with, result }], relatedWork: [], order }];
export const combinations = [{ a, b, result }];
```

---

## 2. Task list

Every task: build → checks → fix → re-run → log → commit. Checks each loop:
- `html-validate` with no errors; no JS console errors; no unused CSS tokens
- Playwright at 390, 768, 1024, 1440: no console errors, no horizontal overflow, screenshots to `qa/<task>/`
- keyboard pass on any interactive component built in the task

### Step 1 — Setup and global elements
- [x] **1.1 Setup.** Folder structure, fonts/mark from the zip, dev server, QA scripts (pages, tokens, validate), `.vercelignore`, `package.json` (dev only).
- [x] **1.2 Stylesheet.** Tokens/base/layout/type/primitives ported; `.ink` subtree; margin note, stamp, file stamp, label node; cursor CSS. *Accept:* tokens identical to the zip; Cream default, Ink via toggle; `.ink` stays Ink in both themes; no unused tokens.
- [x] **1.3 ARC engine.** `js/arc.js`: geometry identical to the prototype (span leaves each anchor from its inner side at centre height; rest node tangent on the apex) + `spanPathTo` for the dragged apex.
- [x] **1.4 Page shell.** Head (meta, preloads, pre-paint theme/motion restore), skip link, mark symbol, nav, menu, footer on all five pages. *Accept:* skip link first tab stop; one `h1` per page.
- [x] **1.5 Navigation.** Lockup · Lab · Elements · Approach · Process · [Start a project]; static 1px underline on the current page; off-Home section links go to `/#approach` etc.
- [x] **1.6 Mobile menu.** "Menu" button → full-screen Ink `<dialog>`, large numbered links; Esc; focus returns.
- [x] **1.7 Theme + motion.** Cream/Ink toggle; Reduce-motion toggle; both persisted and restored before paint.
- [x] **1.8 Cursor.** SVG arrow (ink fill, cream outline, tail ends in a span curve), link variant (curve filled), drag hand; text native; lagging tag only over tagged targets; off on touch/coarse pointers.
- [x] **1.9 Footer.** "Design. Build. Grow." large; services line; contact; links; giant cropped ARC LABS wordmark; no copyright line.

### Step 2 — Home hero
- [x] **2.1** H1 with node full stops, as large as the screen allows; one word per line on mobile; lead + buttons left, figure right.
- [x] **2.2** Hero ARC draws once on load (900ms), labels 01 Design · 02 Build · 03 Grow.
- [x] **2.3** Grow node draggable (pointer events: mouse, touch, pen); span recomputed live; springs back without overshoot; cursor tag "Drag".
- [x] **2.4** Stamp "ARC LABS · DESIGN · BUILD · GROW ·" with the mark at the centre, overlapping the figure's bottom corner.

### Step 3 — Lab File dialog + Home Lab preview
- [x] **3.1** `data/content.js` with the six projects, exact plan copy.
- [x] **3.2** Lab card: frame, FILE 0X · STATUS stamp, placeholder plate or `<picture>` poster, lazy muted video on hover / in view on touch, fixed ratio; cursor tag "Open file".
- [x] **3.3** Lab File dialog (Ink): arch rises from the card (600ms) and drops back; name large; record rows (Hypothesis · Formula as a small ARC · Protocol · Inside the Lab · Result); viewer with Desktop/Mobile tabs + drag-to-scroll; Visit live site (new tab, bare domain, accessible label); Previous/Next; swipe on mobile; Esc/close/backdrop; focus returns; `#file-<slug>` read and written.
- [x] **3.4** Home Lab preview: copy, client strip (CSS marquee, pauses on hover, static when reduced), three featured files, annotation on File 01, View all files, margin note.

### Step 4 — /lab
- [ ] **4.1** Header, client strip.
- [ ] **4.2** Filter (All · Interiors · Fashion · Food · Fitness · B2B), active underlined, cards fade and re-order (400ms), result announced, event tracked.
- [ ] **4.3** Grid: one large, one tall, two staggered pairs; closing CTA; margin note.

### Step 5 — Elements
- [ ] **5.1** Element data (exact plan copy) + combinations.
- [ ] **5.2** Element row: accordion (button + region), one open, `+` → close mark, 400ms, large faint symbol on hover, tag Expand/Close, `#<slug>` opens, event tracked.
- [ ] **5.3** Mini-demos (play once on open, complete when reduced): frame assembles · add to cart · message bubble · map pin · bars · before/after slider (keyboard operable).
- [ ] **5.4** Panel: What it solves · What's included · Works well with · Related work (opens Lab file) · How it works · Start this project (prefills Contact).
- [ ] **5.5** /elements (Ink): header, rows, margin note, combinations strip (small ARCs → prefilled Contact), closing CTA.
- [ ] **5.6** Home Elements preview: six compact rows → `/elements/#<slug>`; symbol grows on hover; tag "Open".

### Step 6 — Approach, Process, Contact
- [ ] **6.1** Approach: philosophy lines; technical ARC with measurement lines, draws once in view (700ms); studio copy; business types large, each linking to its Lab file.
- [ ] **6.2** Process: five steps joined by one thin line with nodes, draws once (700ms); stacked on mobile; margin note.
- [ ] **6.3** Contact (Ink): copy; form with honeypot + Turnstile; six chips, two connect with a line and the result word appears (400ms); success inline; prefill via `?need=`; email/phone large with Copy; WhatsApp; margin note.

### Step 7 — 404, privacy, SEO, analytics, QA
- [ ] **7.1** 404: "This page didn't land." + Back to home; node slips off and hops back (1200ms).
- [ ] **7.2** Privacy page (draft, flagged for review).
- [ ] **7.3** SEO: titles/descriptions, canonical, OG + `summary_large_image`, 1200×630 OG images (Ink, "Design. Build. Grow.", mark), JSON-LD, sitemap, robots, favicon set, manifest.
- [ ] **7.4** Analytics: consent banner, GA4 loader (Plausible switch), four events.
- [ ] **7.5** Deploy prep: `vercel.json`, `.vercelignore`, README.
- [ ] **7.6** Full QA: Lighthouse mobile (/, /lab, /elements), axe, reduced-motion + Ink screenshots, 6 widths, link check, JS budget, html-validate, tokens. Fix and re-run.
- [ ] **7.7** Client media capture + processing (blocked: network — TODO T1).
- [ ] **7.8** Deploy + live verification (blocked: credentials — TODO T4).

---

## 3. Risks, open questions, assumptions

**Risks**
- Client sites unreachable from this environment (proxy 403) → placeholder plates; capture script ready to run elsewhere.
- No Vercel credentials → deploy-ready config and README steps.
- Duplicated nav/footer across five pages can drift → `scripts/qa/shell.mjs` checks they are identical.
- Lab card text in HTML and in `data/content.js` can drift → the same script checks names/lines match.
- Lighthouse in a sandbox is indicative only; re-run on the live URL.

**Open questions** (TODO.md): Assetly and Aivora URLs; production domain; Formspree ID; Turnstile site key; GA4 ID; privacy page review; Redesigns related work.

**Assumptions**
- Cream is default regardless of OS (plan: "Cream (default)").
- Six contact chips = the six Elements.
- Result words come only from the plan (combinations + "Works well with"); other pairs show the line without a word.
- B2B in the Approach list links to Assetly (File 04); Aivora is reachable via Next and the /lab filter.

---

## 4. Test checklist (quality gates)

- [ ] HTML validates (no errors) on all pages
- [ ] No JS console errors; no unused CSS tokens
- [ ] No horizontal overflow at 390, 480, 768, 1024, 1200, 1440
- [ ] Lighthouse mobile ≥ 90 in all four categories on `/`, `/lab/`, `/elements/`
- [ ] LCP ≤ 2.5s; CLS < 0.1; page JS < 60KB gzipped
- [ ] axe zero violations; WCAG AA
- [ ] Keyboard access; visible focus; skip link; dialog + accordion correct for screen readers
- [ ] Correct in Cream, Ink and reduced motion
- [ ] Logo untouched (byte-identical)
- [ ] Unique title/description per page; OG images; JSON-LD; sitemap
- [ ] Analytics events fire (after consent)
- [ ] Link check: internal resolve; client links 200 (needs network)
- [ ] Media renders at 390/768/1440 without layout shift
