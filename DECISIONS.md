# Decisions

Choices not covered by the plan, and why.

| # | Decision | Why |
|---|---|---|
| D1 | Cream is the default theme regardless of OS dark mode; Ink only via the toggle. | Plan names Cream as the default. The prototype followed the OS; the plan overrides it. |
| D2 | Client media are placeholder plates (the prototype's stand-ins) until real captures exist. | Client sites are unreachable from the build environment; the media brief says keep the placeholder plate and log it. |
| D3 | Added `js/home.js`, `js/config.js` and `js/analytics.js` alongside the listed JS files. | Hero/Approach/Process motion only runs on Home, so it stays out of every other page's JS; config and analytics are shared by several modules. |
| D4 | Site links use trailing slashes (`/lab/`, `/elements/`). | Directory-index pages work identically on Vercel and any local static server. |
| D5 | Production origin is a placeholder (`https://arclabs.vercel.app`) in canonical/OG/sitemap; `scripts/set-domain.mjs` rewrites it. | No domain given; absolute URLs are required for OG and sitemap. |
| D6 | ~~Superseded by D24.~~ The theme toggle is hidden on /elements. | The page is always Ink, so the toggle would change nothing visible. The choice is still remembered on other pages. |
| D7 | Theme toggle is a pressed/unpressed "Ink" button with a two-node swatch. | Keeps the accessible name equal to the visible label (WCAG 2.5.3) while still showing state. |
| D8 | The draggable Grow node is pointer-only (mouse, touch, pen) and hidden from assistive tech. | It is a decorative toy; the figure's meaning is in its caption. A focusable control that does nothing on activation would be noise for keyboard and screen-reader users. |
| D9 | The Protocol row appears only for Velmont. | It is the only file with a Protocol in the plan; repeating the studio process on other files would be stating something not confirmed. TODO T9. |
| D10 | Possah's "Visit live site" links to thepossah.com although its status is "Ready for launch". | The URL was supplied in the media brief. Remove `liveUrl` in `data/content.js` if the store should not be linked before launch. |
| D11 | Mini-demos are abstract diagrams (bars, blocks, a pin) with only the plan's words ("Add to cart", "Hi, I'd like to book…") plus "Button"/"Before"/"After" labels. | Demonstrates each service without inventing client content, prices or products. |
| D12 | Redesigns has no Related work row. | The plan's "any project with a before/after" has no matching project yet (TODO T8). |
| D13 | ~~Superseded by D21.~~ "B2B firms" opens Assetly (File 04); "New ventures still finding their shape" is not linked. | One link per phrase; Assetly is the first B2B file and Aivora is one Next away. No project is a new venture. |
| D14 | Without a Formspree ID the form opens the visitor's email app with the enquiry filled in, and says so ("Your email app should open…"). | Showing "Thanks, we'll be in touch." when nothing was sent would be untrue. With an ID it shows the plan's success line. |
| D15 | The technical ARC's dimension lines fade in while the span draws. | They use non-scaling strokes, which do not combine with `pathLength` dash drawing (noted in the brand system). |
| D16 | Eight brand tokens the site never uses (`--radius-none`, `--radius-md`, `--mark-*-ratio` ×3, `--node-xl`, `--duration-signature`, `--stagger`) are not shipped. | The QA gate requires no unused tokens. All remaining token names and values are unchanged from the brand system; the mark ratios are applied as numbers in the ARC figures (documented in `js/home.js` and the brand README). |
| D17 | Two placeholder plates' accent colours were darkened slightly (Velmont #7A6C58 → #6B5F4D, Zingara #93652F → #7E5626). | The stand-in text failed 4.5:1 contrast. They are placeholders for real screenshots, which replace them entirely. |
| D18 | Cards and the Lab file show a brand panel (client logo on their brand colour) instead of a mock website. | Requested in the revision. Logos are trimmed web copies in `assets/clients/` of the unchanged originals in `brand-assets/`; colours from each `brand.json`: Velmont #F4F0EB, Possah #1F3A2D (its footer/button green, so the orange wordmark reads), Zingara #1C1A18, Assetly #21241A (matches its logo image), Fitness Garage #070707, Aivora India its header gradient #175AA1 → #12467D. |
| D19 | The round stamp was removed from the hero. | It floated under "Build" and competed with the new full-stop intro; it is not used elsewhere. |
| D20 | Lab file: desktop preview only. With no captures, the whole preview links to the live site; "Visit live site" sits above it, top right. | Mobile preview removed everywhere on request (no real mobile screens). |
| D21 | Approach: "B2B firms" opens Assetly, with small "Assetly · Aivora India" links beside it; "New ventures still finding their shape" links to Contact and is no longer greyed out. | Revision items 8 and 16. |
| D22 | Cursor: standard arrow / pointing hand / grab hands, Ink with a Cream edge (swapped on Ink surfaces). The span-curve tail is gone; the small context tags stay. | Requested in the revision. |
| D23 | Hero intro: the headline's three full stops travel into the ARC only when the whole hero is on screen at load; otherwise the plain signature plays. | Measuring a flight to an off-screen target would leave dots stranded or flying past the fold (common on phones). |
| D24 | /elements opens in Ink by default and shows the Ink switch like every other page; switching to Cream there (or having chosen Cream before) shows it in Cream. | Requested in the revision. Done with `data-default-theme="dark"` on that page's `<html>`, read by the same pre-paint script on every page. |
| D25 | The Approach drawing is shown as soon as its first 10% enters the screen (was 25%), the visible state is set before the animations start, and each Home section starts independently. | Reported as "not loading": any error in an earlier section, or a fast scroll past a 25% threshold, could leave it hidden. |
