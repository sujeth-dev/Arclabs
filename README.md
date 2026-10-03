# ARC Labs — website

Studio website for ARC Labs: Home, Lab (projects), Elements (services), Privacy and a 404.
Plain HTML, CSS and vanilla JavaScript. **No framework, no build step** — the files in this
repository are the site. `package.json` only holds dev tools (tests, media, share images);
none of it is deployed.

Built from the FINAL PLAN and the ARC Labs brand system (`arc-labs-brand.zip`): tokens,
components, ARC geometry and motion engine are ported from it unchanged.

```
index.html  lab/index.html  elements/index.html  privacy/index.html  404.html
css/styles.css          one stylesheet (brand tokens → base → components → pages)
js/config.js            site URL, Formspree, Turnstile, analytics
js/arc.js               ARC motion engine (spanPath, restCenter, draw, pop, hop, signature…)
js/main.js              every page: theme, reduced motion, nav, menu, cursor, copy, 404 node
js/home.js              hero ARC + drag, Approach figure, Process line
js/lab.js               Lab cards, filter, Lab File dialog
js/elements.js          Element rows, mini-demos
js/contact.js           contact form, chips, prefill
js/analytics.js         GA4 (after consent) or Plausible
data/content.js         all project and element content
assets/                 fonts, mark, cursors, icons, OG images
media/<slug>/           client screenshots and recordings
```

Planning and history: `PLAN.md` (task list), `LOG.md` (what was built and tested),
`DECISIONS.md` (choices the plan didn't cover), `TODO.md` (needs your input).

---

## Setup

Requires Node 22+ (dev tools only).

```bash
npm install          # Playwright, axe, Lighthouse, sharp, html-validate (dev only)
npm run serve        # http://localhost:4321  (any static server works)
```

The dev server serves folders as `/lab/`, `/elements/` and falls back to `404.html`, the
same as Vercel. You can also open the folder with any static server; ES modules need
`http://`, not `file://`.

## Configuration — `js/config.js`

| Key | What it does | Empty means |
|---|---|---|
| `siteUrl` | Production origin. Also hard-coded in canonical/OG tags, `sitemap.xml`, `robots.txt` — change all at once with `node scripts/set-domain.mjs https://your-domain` | — |
| `formspreeId` | Formspree form ID; the contact form POSTs to it | Form opens the visitor's email app instead |
| `turnstileSiteKey` | Cloudflare Turnstile widget on the form (add the secret in Formspree) | Honeypot only |
| `analytics.provider` | `"ga4"` (consent banner first) or `"plausible"` (cookieless, no banner) | — |
| `analytics.ga4Id` / `plausibleDomain` | Turns analytics on | No tracking, no banner |

Events sent: `enquiry_sent`, `file_opened`, `element_opened`, `filter_used`.

## Adding a project (Lab file)

1. Add an object to `projects` in `data/content.js` (copy an existing one): `file`, `slug`,
   `name`, `line`, `sector`, `status`, `filter` (Interiors · Fashion · Food · Fitness · B2B),
   `liveUrl`, `featured` (`"large"`/`"tall"`/`"wide"` for the three Home slots, else `null`),
   `hypothesis`, `formula {problem, context, solution}`, `protocol[]`, `insideTheLab`,
   `result`, `screens`, `video`, `poster`, `plate` (placeholder until media exists), `order`.
2. Add its card to `lab/index.html` (copy an `<article class="lab-card">` block and change
   `data-file`, `data-filter`, the URL, name, line, sector and stamp). Add it to
   `index.html` too if it is featured.
3. Add the name to the client strip (both lists) on Home and /lab if it should appear there.
4. Run `npm run check` — `scripts/qa/content.mjs` fails if the HTML and `data/content.js`
   disagree.

Links: `/lab/#file-<slug>` opens the file directly (also works on Home and /elements).

## Adding an element (service)

1. Add an object to `elements` in `data/content.js`: `number`, `symbol`, `slug`, `name`,
   `line`, `demo` (one of `frame`, `cart`, `bubble`, `pin`, `bars`, `slider`, or add a new
   one in `DEMOS` in `js/elements.js`), `solves`, `includes[]`, `worksWellWith[{with, result}]`,
   `relatedWork[]` (project slugs), `order`.
2. Copy an `<article class="el-row">` block in `elements/index.html` and a
   `<li data-element>` row in the Home Elements list; change slug, number, symbol, name, line.
3. Add a chip to the contact form in `index.html` (`<label class="chip">`).
4. For a new pairing in the combinations strip, add to `combinations` in `data/content.js`
   and copy a `<li>` in `elements/index.html`.

Links: `/elements/#<slug>` opens that row; `/?need=a,b#contact` pre-selects chips.

## Replacing media

Every card currently shows a placeholder plate (marked `TODO(T1)` in the HTML). With
network access to the client sites:

```bash
node scripts/media/capture.mjs              # all projects with a liveUrl (or pass slugs)
node scripts/media/process.mjs              # → media/<slug>/ and wires everything in
```

`capture.mjs` checks each site returns 200, waits for fonts and images, dismisses cookie and
newsletter pop-ups, and saves desktop (1440×900 + full page), mobile (390×844 + full page)
and a ~11s smooth-scroll recording to `media/_raw/<slug>/`.

`process.mjs` makes AVIF + WebP at 1x and 2x (top of the page kept in frame), MP4 (H.264) +
WebM, muted with no audio track and ≤ 1.5MB each, plus a poster frame from the first
second. It then updates that project's `screens`/`video`/`poster` in `data/content.js`,
swaps the card's placeholder for `<picture>` + a hover `<video>`, and adds a preload for
File 01's poster on Home. It is safe to re-run. `media/_raw/` can be deleted afterwards.

To add screenshots by hand instead: put `poster.{avif,webp}`, `poster@2x.{avif,webp}`,
`desktop-full…`, `mobile-full…` in `media/<slug>/`, then set
`screens: { desktop: ["/media/<slug>/desktop-full"], mobile: ["/media/<slug>/mobile-full"] }`
(paths without extension).

Alt text is generated as "<Project> homepage, desktop" / "<Project> homepage, mobile".

## Share images and icons

```bash
npm run og     # assets/og/*.png (1200×630), favicon.ico, apple-touch-icon.png, assets/icons/*
```

## Quality checks

```bash
npm run check                     # html-validate · shared nav/footer identical · logo untouched
                                  # · HTML ↔ data/content.js · share previews · unused CSS tokens
node scripts/qa/pages.mjs <name>  # every page at 390/768/1024/1440: console errors, overflow,
                                  #   screenshots → qa/<name>/   (--all-widths --ink --reduced)
node scripts/qa/keyboard.mjs      # keyboard + behaviour suites (shell, hero, dialog, filter,
                                  #   elements, contact, analytics)
node scripts/qa/a11y.mjs          # axe on every page, Cream + Ink, dialog and rows open
node scripts/qa/lighthouse.mjs    # Lighthouse mobile on /, /lab/, /elements/
node scripts/qa/links.mjs         # internal links + anchors; external links (needs network)
node scripts/qa/js-budget.mjs     # gzipped JS per page (budget 60KB)
```

Point the browser checks at a deployed URL with `QA_BASE=https://… node scripts/qa/…`.

## Deploying (Vercel)

The site deploys as static files; `vercel.json` sets no install and no build step,
trailing-slash URLs, cache and security headers. `.vercelignore` keeps dev files
(`scripts/`, `qa/`, `node_modules/`, `package*.json`, `*.md`) out of the deployment.

**From GitHub:** vercel.com → Add New → Project → import this repository →
Framework Preset "Other", leave build/output settings as they are (read from `vercel.json`)
→ Deploy.

**From the CLI:**

```bash
npm i -g vercel
vercel login
vercel            # preview
vercel --prod     # production
```

After the first deploy:

1. Add your domain in Vercel → Project → Domains, then run
   `node scripts/set-domain.mjs https://your-domain` and commit.
2. Fill `js/config.js` (Formspree ID, Turnstile key, GA4 ID) and commit.
3. Run the checks against the live URL: `QA_BASE=https://your-domain node scripts/qa/pages.mjs live`,
   `…/lighthouse.mjs`, `…/links.mjs`.
4. Paste the URL into the LinkedIn Post Inspector, the X card validator and a WhatsApp chat
   to confirm the share previews.
