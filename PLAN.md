# ARC Labs website — build plan

Source of truth: the FINAL PLAN (content, structure, creative, behaviour) and the
prototype `arc-labs-brand.zip` (tokens, components, ARC geometry, motion code).
This file is the task list. Tasks are ticked as they finish; see `LOG.md` for
what was tested, `DECISIONS.md` for choices the plan does not cover, `TODO.md`
for anything that needs input.

---

## 1. Architecture

| Area | Choice |
|---|---|
| Framework | Astro (static output) + TypeScript (strict), no UI framework |
| Styles | `src/styles/global.css` — the prototype's tokens, base, layout, type and primitives ported verbatim (token names kept). Component CSS lives in each `.astro` file and uses tokens only |
| Scripts | Astro-bundled ES modules. `src/scripts/arc.ts` is the ported motion engine; every other script is a small vanilla module that imports from it. No animation or smooth-scroll libraries |
| Content | Astro content collections: `src/content/projects/*.md`, `src/content/elements/*.md`, schemas in `src/content.config.ts` |
| Site data | `src/data/site.ts` — contact details, nav, client strip, combinations, business-type links |
| Pop-up | One native `<dialog>` (Lab File) per page; each project's record lives in a `<template>` so media loads only when opened |
| Accordion | Button + region pattern, one row open at a time, `#<slug>` opens a row |
| Media | `public/media/<slug>/` (AVIF/WebP posters, MP4/WebM recordings, full-page captures). Placeholder plates until real captures exist |
| Form | Formspree (`PUBLIC_FORMSPREE_ID`), WhatsApp `wa.me/918088506783` |
| Analytics | Plausible (`PUBLIC_PLAUSIBLE_DOMAIN`), events: Enquiry Sent, File Opened, Element Opened, Filter Used |
| SEO | Per-page title/description/canonical, OG + Twitter cards, 1200×630 OG images, Organization JSON-LD, `@astrojs/sitemap`, robots.txt |
| Hosting | Vercel (static). `vercel.json` with cache headers |
| QA | Playwright (system Chromium), axe-core, Lighthouse, custom link checker — scripts in `scripts/qa/` |

### Folder structure

```
/
├── PLAN.md · LOG.md · DECISIONS.md · TODO.md · README.md
├── astro.config.mjs · tsconfig.json · package.json · vercel.json · .env.example
├── public/
│   ├── fonts/            Inter + Inter Display woff2 (from the zip)
│   ├── media/<slug>/     client screenshots, recordings, posters
│   ├── og/               1200×630 share images
│   ├── favicon.svg · favicon.ico · apple-touch-icon.png · icon-192/512.png · site.webmanifest
│   └── robots.txt
├── src/
│   ├── content.config.ts
│   ├── content/projects/*.md     6 Lab files
│   ├── content/elements/*.md     6 Elements
│   ├── data/site.ts
│   ├── styles/global.css
│   ├── scripts/                  arc.ts, prefs.ts, nav.ts, cursor.ts, hero.ts, lab-dialog.ts,
│   │                             lab-filter.ts, accordion.ts, demos.ts, contact.ts, copy.ts,
│   │                             inview.ts, analytics.ts, media.ts
│   ├── components/               Nav, Menu, Footer, Mark, Stamp, Label, MarginNote, Button,
│   │                             HeroArc, ClientStrip, LabCard, LabDialog, LabRecord,
│   │                             ElementRow, ElementSymbol, MiniDemo, Combinations, ...
│   ├── layouts/Base.astro
│   └── pages/index.astro · lab.astro · elements.astro · 404.astro
├── scripts/
│   ├── og.mjs                    renders OG images + favicons with Playwright
│   └── qa/                       pages.mjs, keyboard.mjs, a11y.mjs, lighthouse.mjs, links.mjs
└── qa/<task>/                    screenshots and reports
```

### Content model

`projects/*.md` frontmatter:
`file` (01–06), `slug`, `name`, `line`, `sector`, `status`, `filter`
(Interiors · Fashion · Food · Fitness · B2B), `liveUrl` (nullable), `featured`
(`large` · `tall` · `wide` · null), `hypothesis`, `formula {problem, context,
solution}`, `protocol[]`, `insideTheLab`, `result`, `screens {desktop[], mobile[]}`,
`video {mp4, webm, poster}` (nullable), `plate` (placeholder plate key), `order`.

`elements/*.md` frontmatter:
`number`, `symbol`, `slug`, `name`, `line`, `demo`, `solves`, `includes[]`,
`worksWellWith[{with, result}]`, `relatedWork[]` (project slugs), `order`.

---

## 2. Task list

Each task: build → `astro check` + build → Playwright at 390/768/1024/1440
(console errors, horizontal overflow, screenshots to `qa/<task>/`) → keyboard
pass for anything interactive → log → commit.

### Step 1 — Setup and global elements

- [ ] **1.1 Project setup.** Astro + TS strict, sitemap integration, fonts and mark copied from the zip, `.gitignore`, npm scripts (`dev`, `build`, `check`, `qa:*`).
  *Accept:* `npm run build` and `npm run check` pass with zero errors.
- [ ] **1.2 Global styles.** Port tokens/base/layout/type/primitives from `styles.css`, keeping token names. Add `.ink` (always-Ink subtree), margin note, stamp, file stamp, label node, cursor CSS.
  *Accept:* tokens identical to the zip; Cream default, Ink via `data-theme="dark"`; `.ink` subtree stays Ink in both themes.
- [ ] **1.3 ARC engine.** `src/scripts/arc.ts`: `spanPath`, `restCenter`, `draw`, `pop`, `hop`, `signature`, `loop`, `reduced`, plus `spanPathTo` (apex follows a dragged node; equals `spanPath` at rest).
  *Accept:* geometry identical to the prototype (span leaves anchors from the inner side at centre height; rest node tangent on the apex); typed, zero TS errors.
- [ ] **1.4 Base layout.** `<head>` (meta, preloads, pre-paint theme/motion restore), skip link, mark symbol, JSON-LD slot, page-level `ink` option.
  *Accept:* skip link is the first tab stop; one `h1` per page.
- [ ] **1.5 Navigation.** Lockup · Lab · Elements · Approach · Process · [Start a project]. Static 1px underline on the active link. Off-Home links resolve to `/#approach` etc.
  *Accept:* correct active state on every page; keyboard reachable; visible focus.
- [ ] **1.6 Mobile menu.** "Menu" button opens a full-screen Ink `<dialog>` with large numbered links; Esc closes; focus returns to the button.
  *Accept:* below 1024px; focus trapped; no motion beyond appear.
- [ ] **1.7 Theme + motion prefs.** Cream/Ink toggle (nav + menu), Reduce motion toggle (footer + menu), both persisted, both restored before paint.
  *Accept:* toggles work by keyboard; `ARC.reduced()` honours both OS setting and toggle.
- [ ] **1.8 Cursor.** Custom SVG arrow (ink fill, cream outline, tail ends in a span curve), link variant (curve filled), drag hand; text = native. Lagging DOM tag over `[data-cursor-tag]` only. Off on touch/coarse pointers.
  *Accept:* no custom cursor or tag under `(pointer: coarse)`; tag text only from the plan's table.
- [ ] **1.9 Footer.** "Design. Build. Grow." large, services line, contact, links (Lab · Elements · Approach · Process · Contact), giant cropped ARC LABS wordmark. No copyright line.
  *Accept:* static; no overflow at 390.

### Step 2 — Home hero

- [ ] **2.1 Hero copy + layout.** H1 "Design. Build. Grow." with node full stops, sized to the screen; one word per line on mobile; lead lines + two buttons left, figure right.
- [ ] **2.2 Hero ARC.** Draws once on load (`ARC.signature`, 900ms); labels 01 Design · 02 Build · 03 Grow.
- [ ] **2.3 Grow drag.** Pointer drag (mouse, touch, pen) on the Grow node; span recomputed live; springs back (no overshoot) on release; keyboard: arrow keys nudge, release on keyup/blur. Cursor tag "Drag".
- [ ] **2.4 Stamp.** Circular seal "ARC LABS · DESIGN · BUILD · GROW ·" with the mark at the centre, overlapping the figure's bottom corner. Static.
  *Accept (step):* complete first frame with motion off; no layout shift from the draw.

### Step 3 — Lab File dialog + Home Lab preview

- [ ] **3.1 Content collections.** Six project files with exact plan copy; schema validation.
- [ ] **3.2 Lab card.** Frame + browser dots, FILE 0X · STATUS stamp, placeholder plate or poster image, lazy muted video on hover / in view on touch, fixed ratio.
- [ ] **3.3 Lab File dialog.** Native `<dialog>`, Ink. Arch rises from the clicked card (600ms) and drops back into it. Name large; record rows (Hypothesis · Formula as a small ARC · Protocol · Inside the Lab · Result); viewer with Desktop/Mobile tabs and drag-to-scroll; Visit live site (new tab, bare domain, accessible label); Previous/Next; Esc / close / backdrop; focus returns to the card; reads and writes `#file-<slug>`; swipe between files on mobile.
- [ ] **3.4 Home Lab preview.** Label, heading, body copy, client strip (CSS marquee, pauses on hover, static when reduced), three featured files (Velmont large, Possah tall, Zingara wide), annotation on File 01, "View all files", margin note "Real sites. No mock-ups."
  *Accept (step):* keyboard opens/closes/navigates the dialog; `/#file-velmont` opens on load; no console errors.

### Step 4 — /lab

- [ ] **4.1 Header + strip.** Label, heading, intro, client strip.
- [ ] **4.2 Filter.** All · Interiors · Fashion · Food · Fitness · B2B as toggle buttons; active underlined; cards fade and re-order (400ms FLIP); "Filter Used" event.
- [ ] **4.3 Grid.** Six files: one large, one tall, two staggered pairs. Closing CTA + margin note.
  *Accept:* `/lab#file-<slug>` opens on load; filter keyboard accessible; result announced.

### Step 5 — Elements

- [ ] **5.1 Element content.** Six element files with exact plan copy.
- [ ] **5.2 Element row.** Accessible accordion, one open at a time, `+` → close mark, 400ms expand, large faint symbol on hover, cursor tag Expand/Close, `#<slug>` opens a row, "Element Opened" event.
- [ ] **5.3 Mini-demos.** Websites frame assembles · E-commerce add-to-cart counter · Lead & Booking bubble · Digital Presence pin drop · Custom Systems bars · Redesigns before/after slider (keyboard operable). Each plays once on open; complete when reduced.
- [ ] **5.4 Panel content.** What it solves · What's included · Works well with · Related work (opens Lab file) · How it works · "Start this project" (prefills Contact).
- [ ] **5.5 /elements page (always Ink).** Header, rows, margin note "Mix and match.", combinations strip (small ARCs, two symbols as anchors, result on top, link to prefilled Contact), closing CTA.
- [ ] **5.6 Home Elements preview.** Six compact rows → `/elements#<slug>`; symbol grows slightly on hover; cursor tag "Open"; "All elements".

### Step 6 — Approach, Process, Contact

- [ ] **6.1 Approach.** Philosophy lines left (static); technical ARC with measurement lines right (draws once in view, 700ms); studio copy; business types set very large, each linking to its Lab file.
- [ ] **6.2 Process.** Five columns joined by one thin line with a node per step, draws once in view (700ms); stacked on mobile; margin note.
- [ ] **6.3 Contact (Ink).** Heading + lines; form (Name · Business · Email · Phone · six chips · Budget · Message); two chips → line connects them and the result word appears (400ms); inline success "Thanks, we'll be in touch."; prefill from `?need=` (Start this project, combinations); email + phone large with Copy; WhatsApp button; margin note.
  *Accept (step):* form usable by keyboard; errors announced; chips are real checkboxes.

### Step 7 — 404, SEO, analytics, final QA

- [ ] **7.1 404.** "This page didn't land." + Back to home; node slips off the span and hops back (1200ms).
- [ ] **7.2 SEO.** Unique title/description per page, canonical, OG/Twitter (`summary_large_image`), 1200×630 OG images (Ink, "Design. Build. Grow.", mark), Organization JSON-LD, sitemap, robots.txt, favicon set + apple-touch-icon + manifest.
- [ ] **7.3 Analytics.** Plausible loader (env-gated) + `track()` for the four events.
- [ ] **7.4 Deploy prep.** `vercel.json`, `.env.example`, README (setup, adding a project/element, replacing media, deploying).
- [ ] **7.5 Full QA.** Lighthouse mobile on `/`, `/lab`, `/elements`; axe on all pages; reduced-motion + Ink screenshots; 390/480/768/1024/1200/1440 overflow; link check; JS budget. Fix and re-run.
- [ ] **7.6 Client media.** Capture/process client sites per the media brief (blocked by network policy — see TODO.md).
- [ ] **7.7 Deploy + verify live.** (blocked without Vercel credentials — see TODO.md).

---

## 3. Risks, open questions, assumptions

**Risks**
- *Client sites unreachable from the build environment* (proxy 403). Mitigation: placeholder plates, media pipeline script ready to run elsewhere, TODO entry.
- *No Vercel credentials.* Mitigation: deploy-ready config + README steps.
- *Lighthouse in a sandbox* has no throttling realism; scores are indicative. Re-run against the live URL after deploy.
- *Dialog arch from card position* must not cause layout shift or focus loss; native `<dialog>` handles focus, the arch is a clip-path on a fixed layer.
- *JS budget (60KB gz):* vanilla modules only; measured per page in QA.

**Open questions (logged in TODO.md)**
- Assetly and Aivora India URLs.
- Production domain (used for canonical, sitemap, OG URLs). Defaulted via `SITE_URL`.
- Formspree form ID (or Resend), Plausible domain.
- Redesigns "Related work: any project with a before/after" — no project has one yet.

**Assumptions**
- Cream is the default theme regardless of OS preference (plan: "Cream (default)").
- Six contact chips = the six Elements.
- Result words for chip pairs come only from the plan (combinations strip + "Works well with"); pairs without a defined result show the line only.
- Section labels without plan copy use the nav name (Approach, Process, Contact).

---

## 4. Test checklist (quality gates)

- [ ] `astro check` zero errors; build passes
- [ ] No horizontal overflow at 390, 480, 768, 1024, 1200, 1440 on every page
- [ ] No console errors on any page
- [ ] Lighthouse mobile ≥ 90 in all four categories on `/`, `/lab`, `/elements`
- [ ] LCP ≤ 2.5s, CLS < 0.1
- [ ] Page JS < 60KB gzipped
- [ ] axe: zero violations; WCAG AA contrast
- [ ] Full keyboard access; visible focus; skip link; dialog + accordion screen-reader correct
- [ ] Correct in Cream, Ink and reduced motion (screenshots)
- [ ] Logo untouched (byte-identical path data)
- [ ] Unique title/description per page; OG images; JSON-LD; sitemap
- [ ] Analytics events fire: enquiry sent, file opened, element opened, filter used
- [ ] Link check: internal links resolve; client links return 200 (needs network)
- [ ] Media renders at 390/768/1440 with no layout shift
