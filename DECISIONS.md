# Decisions

Choices not covered by the plan, and why.

| # | Decision | Why |
|---|---|---|
| D1 | Cream is the default theme regardless of OS dark mode; Ink only via the toggle. | Plan names Cream as the default. The prototype followed the OS; the plan overrides it. |
| D2 | Client media are placeholder plates (the prototype's stand-ins) until real captures exist. | Client sites are unreachable from the build environment; the media brief says keep the placeholder plate and log it. |
| D3 | Added `js/home.js`, `js/config.js` and `js/analytics.js` alongside the listed JS files. | Hero/Approach/Process motion only runs on Home, so it stays out of every other page's JS; config and analytics are shared by several modules. |
| D4 | Site links use trailing slashes (`/lab/`, `/elements/`). | Directory-index pages work identically on Vercel and any local static server. |
| D5 | Production origin is a placeholder (`https://arclabs.vercel.app`) in canonical/OG/sitemap; `scripts/set-domain.mjs` rewrites it. | No domain given; absolute URLs are required for OG and sitemap. |
| D6 | The theme toggle is hidden on /elements. | The page is always Ink, so the toggle would change nothing visible. The choice is still remembered on other pages. |
| D7 | Theme toggle is a pressed/unpressed "Ink" button with a two-node swatch. | Keeps the accessible name equal to the visible label (WCAG 2.5.3) while still showing state. |
