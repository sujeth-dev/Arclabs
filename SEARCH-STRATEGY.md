# Search strategy and operating checklist

Implemented 2026-10-29. Scope: search metadata, indexing notifications and technical checks. No visible content, styling, navigation, imagery or runtime changes.

## Query map

These are candidate query clusters, not search-volume estimates or ranking promises. Validate demand and performance in Search Console. Use one coherent page focus rather than adding all phrases to every title.

| Cluster | Candidate queries | Primary page / supporting evidence |
| --- | --- | --- |
| Brand | ARC Labs, Arclabs, ARC Lab, ARC Labs Bengaluru, ARC Labs Bangalore | Home |
| Websites | website design Bangalore, web design Bengaluru, website development Bangalore, business website design Bangalore | Services / Websites & Systems collection |
| Branding | branding studio Bangalore, brand identity design Bengaluru, logo design Bangalore, logo designer Bengaluru | Services / Logos and Brand Kits collections |
| Marketing | digital marketing Bangalore, social media marketing Bengaluru, SEO services Bangalore | Services / Digital Growth collection |
| Specific needs | ecommerce website development Bangalore, website redesign Bengaluru, local SEO Bangalore, lead generation Bengaluru | Services |

Track ARC alone separately because it is ambiguous. Monitor Banglore/Banglroe only if real query data appears; do not insert misspellings into titles, schema or hidden text. No meta-keywords tag, speculative brand aliases, new landing pages, artificial reviews or llms.txt.

## Implemented in the repository

- `scripts/search-config.mjs` holds the approved page-specific metadata. `npm run seo` updates titles, descriptions, Open Graph, Twitter and JSON-LD together. Growth retains its branch-specific description so collaboration wording stays accurate.
- The sitemap already lists the eight canonical pages. Existing lastmod dates remain accurate for this release. For future meaningful page changes, update only the affected URL dates, including pages whose metadata changed. Do not advance every date automatically on every deploy.
- Public IndexNow ownership key at the origin root. It is intentionally public, not an account credential. No runtime dependency or browser network request was added.
- `npm run indexnow -- --since=<commit-sha>` previews selected URLs. `--submit` explicitly sends them. Shared rendering changes notify all current pages; docs/QA-only changes notify none. Removed or moved routes require an explicit review and notification adjustment; the current selector covers the existing canonical page registry, not arbitrary deleted routes.
- Before submission, the script requires the production key and each selected live page to match the checked-out files. Preview URLs, query variants and hashes are rejected. Stale deployments fail safely. Receipts record HTTP acceptance only, not indexing.
- `.github/workflows/search.yml` runs on main pushes, waits for production to match, notifies IndexNow and checks production. Preview/collaboration pushes never notify production. A weekly Monday audit and manual audit are also available. GitHub Actions must be enabled; failed runs are visible in Actions under Production search discovery. Receipts are retained as workflow artifacts.
- `npm run qa:indexnow` checks selection and submission guards. `npm run qa:search -- --live` checks metadata agreement, crawler-labelled fetches, sitemap, schema, canonical URLs, permanent www redirects, icon and key accessibility. These are synthetic tests, not proof of genuine bot visits.

## Favicon and canonical host

Live www redirects were verified as 308 for Home, Services and the favicon after the hosting setting was changed. The current 96px opaque PNG, ICO and structured logo already work; keep their URLs stable. No replacement artwork is needed. Search Console inspection is required to establish Google's selected canonical, last crawl and whether the older search appearance has refreshed.

Inspect both `https://www.arclabs.live/` and `https://arclabs.live/`, test the canonical homepage live and request indexing once. Then monitor genuine Googlebot/Googlebot-Image fetches. Google may take days to weeks to refresh a favicon and does not guarantee its display.

## Account-dependent work still outstanding

- Brave Search: direct URL access works, but search discovery is independent of Google. Use [Brave's URL submission form](https://search.brave.com/submit-url) for Home and Services, then monitor brand queries. No Brave submission has been made from this session. Its crawler does not advertise a separate user agent and follows Googlebot crawl eligibility; do not invent a Bravebot allow rule or treat a spoofed Bravebot fetch as real verification. [Official crawler guidance](https://search.brave.com/help/brave-search-crawler). IndexNow does not imply Brave inclusion.
- Search Console and Bing: verify properties, confirm sitemap acceptance, inspect priority URLs and record indexing exclusions. No verification tokens or account ownership details were invented.
- Hosting logs: verify genuine crawler identities using official platform methods; investigate challenges, 403, 429 and server errors. A user-agent string alone is insufficient verification.
- Owned profiles: verify the actual ARC accounts, keep name/contact/domain consistent and then add their URLs to sameAs. Client profiles are not ARC profiles. Check Google Business Profile eligibility before making any listing; an online-only business is ineligible.
- External references: pursue accurate client credits, relevant industry listings and genuine reviews. Iconic Bengaluru and The Shallot Kitchen must be described only as content collaborations. No external messages or profile changes have been sent.
- Analytics: `js/config.js` still has no configured analytics measurement ID. No account ID was invented or tracking enabled. Connect the existing consent-aware analytics integration only with the verified ID and test actual enquiry measurement before claiming conversion reporting.

## Baseline and reviews

Record the baseline in the connected search/analytics accounts, then compare at 30, 60 and 90 days. Keep brand and non-brand query groups separate. Record impressions, clicks, CTR, relevant landing pages, enquiries by source, identifiable AI referrals, indexed/canonical pages and genuine crawler failures. Ranking positions and referral attribution have practical limits; annotate metadata release dates and avoid frequent changes on low-volume data.

## Official references

- [Google titles](https://developers.google.com/search/docs/appearance/title-link)
- [Google favicon requirements](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Google site names](https://developers.google.com/search/docs/appearance/site-names)
- [IndexNow protocol](https://www.indexnow.org/documentation)
- [IndexNow FAQ](https://www.indexnow.org/faq)

Internal technical eligibility and metadata cannot guarantee rankings, indexing, enquiries or AI citations. With visible content fixed, the site's existing subjects limit its organic search coverage.
