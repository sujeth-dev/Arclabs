# TODO — needs your input

| # | Item | Blocking | What's needed |
|---|---|---|---|
| T1 | Client site captures (optional) | Nothing — cards now show each client's logo on their brand colour | Only if you also want real screenshots in the Lab file: the build environment cannot reach the client sites. Run locally `npm install && node scripts/media/capture.mjs && node scripts/media/process.mjs`. Missing brand files (favicons, Velmont light logo, Possah icon mark, Zingara wordmark) are listed in `brand-assets/RECEIVED.txt`. |
| T2 | ~~Assetly URL~~ | Done: https://assetly.lease | — |
| T3 | ~~Aivora India URL~~ | Done: https://www.aivoraindia.com | — |
| T4 | Vercel deploy | Live URL | No Vercel credentials here. Import the GitHub repo in Vercel (Framework: Other) or run `vercel --prod` — see README → Deploying. |
| T5 | Production domain | Canonical, OG URLs, sitemap | `node scripts/set-domain.mjs https://your-domain` (placeholder is `https://arclabs.vercel.app`) |
| T6 | Formspree form ID | Contact form delivery (falls back to the visitor's email app) | `formspreeId` in `js/config.js` |
| T7 | Cloudflare Turnstile site key | Spam challenge (honeypot is active already) | `turnstileSiteKey` in `js/config.js`; confirm your form endpoint verifies the token |
| T8 | Redesigns "Related work" | Elements row 06 | A project with a before/after |
| T9 | Protocol for files 02–06 | Lab pop-up record | Confirm each project's protocol (only Velmont's is in the plan) |
| T10 | Privacy page review | `/privacy/` | Plain-language draft; review before launch |
| T11 | GA4 measurement ID (or Plausible domain) | Analytics | `js/config.js` → `analytics`. Consent banner appears once an ID is set |
| T12 | Live verification | Final sign-off | After deploy: `QA_BASE=https://your-domain node scripts/qa/pages.mjs live`, `…/lighthouse.mjs`, `…/links.mjs` (client links could not be checked from here), and the LinkedIn / X / WhatsApp share previews |
