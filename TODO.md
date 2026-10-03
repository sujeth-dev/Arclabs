# TODO — needs input

| # | Item | Blocking | What's needed |
|---|---|---|---|
| T1 | Client site captures (screenshots, full-page, recordings) | Lab cards, Lab pop-up viewer | Network access to velmontdesign.com, thepossah.com, zingararestaurant.co.in, fitness-garage.in (+ Assetly, Aivora). Run `npm run media:capture` where those sites are reachable. |
| T2 | Assetly URL | Lab File 04 "Visit live site", capture | The live URL |
| T3 | Aivora India URL | Lab File 06 "Visit live site", capture | The live URL |
| T4 | Vercel deploy | Live URL, live QA | Vercel account/token, or run `vercel` locally (see README) |
| T5 | Production domain | canonical, OG URLs, sitemap | Domain → `node scripts/set-domain.mjs https://…` |
| T6 | Formspree form ID | Contact form delivery | ID in `js/config.js` (`formspreeId`) |
| T7 | Cloudflare Turnstile site key | Spam protection | Site key in `js/config.js`; secret key in Formspree's Turnstile settings |
| T8 | Redesigns "Related work" | Elements row 06 | A project with a before/after |
| T9 | Protocol for files 02–06 | Lab pop-up record | Confirm each project's protocol (only Velmont's is in the plan) |
