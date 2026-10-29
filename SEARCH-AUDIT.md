# Internal search discoverability audit

Reviewed 2026-10-29. Scope: metadata, JSON-LD, robots and redirects only.
Visible content, body markup, CSS, runtime JavaScript, assets and navigation remain unchanged.

## Findings and implementation

- All eight canonical pages already had unique, accurate titles/descriptions, language metadata, absolute canonical/OG URLs and permissive snippet directives. Retained this copy; added PNG MIME metadata and matching Twitter image alternative metadata. No keyword expansion was necessary.
- Existing wildcard robots rules already allowed search and AI retrieval. Explicitly documented access for OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot and their relevant user-directed fetchers. This is policy documentation, not proof of actual crawler visits. Existing training access remains unchanged, including Google-Extended through the wildcard rule.
- `/index.html` and collection `index.html` URLs returned duplicate HTTP 200 pages. `/elements/index.html` returned an HTML/JavaScript fallback instead of a permanent server redirect. Added 308 redirects in production configuration and equivalent local handling, preserving enquiry query strings and browser fragments.
- Structured data varied across collections. Added stable Organization, WebSite, page and breadcrumb entity links, publisher/language/preview-image information, and complete Home → Lab → collection breadcrumbs. Brand Kits now has a description and website relationship.
- Services schema describes all 19 existing Capabilities and the four existing Elements through nested OfferCatalog entries. These contain no prices, fixed scope, ratings or guarantees. Descriptions come directly from existing service data. Existing Lab collection links are represented in an ItemList.
- Removed unsupported `legalName`, language-availability claims, redundant contact classifications and speculative alternate-name variants from the old Organization graph. Retained the published brand, contact details and Bengaluru location. Organization is used instead of implying an eligible physical LocalBusiness listing without a verified street address. No official social profile was verified in site configuration, so no `sameAs` URLs were invented. Client social links are not ARC profiles. Product schema is inapplicable to this service portfolio.
- Sitemap already contains exactly the eight canonical, indexable pages with current dates. Kept it intact. Privacy remains indexed as before; 404 and the legacy redirect fallback remain noindex. Existing favicon and logo improvements remain intact.
- Critical service and collection text is present in initial HTML. Expanded demos and external embedded stores are enhancements; indexing does not require their JavaScript or third-party availability. No dynamic rendering, hidden content or crawler-specific HTML was introduced.

## Maintenance and validation

`npm run seo` regenerates schema from static page metadata and `data/content.js`. It does not run in the browser or require a deployment build. `npm run qa:search` checks unique metadata, canonical/hreflang/OG agreement, XML syntax, sitemap membership, robots policy, static content, JSON-LD/source agreement, resolved entity references, service anchors, crawler-labelled HTTP responses, rendering assets, redirects, 404s and generator idempotence.

`node scripts/qa/search.mjs --baseline=765edd4` additionally checks exact body/rendering-head equality, unchanged runtime assets, and pixel-identical full-page screenshots of all eight pages at 390 and 1440 pixels in both themes (32 baseline/new pairs). Screenshots use JavaScript disabled, reduced motion, loaded local media/fonts, and identical blocked third-party resources for determinism. The unchanged body, scripts and styles also establish preservation of the interactive presentation. Existing keyboard and accessibility checks cover running JavaScript.

`npm run qa:search -- --live` runs the HTTP/metadata/crawler checks against production. A user-agent string can be spoofed: these tests cannot verify real crawler IPs, edge treatment of those IPs, indexing, rankings, AI citations or Search Console acceptance.

## Platform decisions and official references

- [OpenAI crawlers](https://developers.openai.com/api/docs/bots): OAI-SearchBot is the search control; GPTBot is separate training access. ChatGPT-User is user-directed and is not the search-index control. Verify real bot traffic against published IP lists when reviewing hosting logs.
- [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler): Claude-SearchBot indexes for search, Claude-User retrieves for users, and ClaudeBot has a separate training purpose.
- [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers): PerplexityBot and Perplexity-User have distinct roles; WAF restrictions can override robots access. Do not create a blanket IP bypass based only on a claimed user agent.
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features): ordinary SEO/indexing and snippet eligibility apply; no special AI schema or text files are required. No demonstrated ingestion benefit justifies adding `llms.txt` to this eight-page portfolio, so it was not added.
- [Google crawler controls](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers): Googlebot controls Search/AI Overviews; Google-Extended controls specified Gemini training/grounding uses and is not an HTTP user agent. Both retain existing access.
- [Bing webmaster guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a): allow Bingbot, accessible content and reliable canonical URLs. Existing directives do not impose noarchive/nocache/nosnippet restrictions on Copilot grounding. [Microsoft controls](https://blogs.bing.com/webmaster/2023/9/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat/).
- [Vercel redirect configuration](https://vercel.com/docs/project-configuration/vercel-json): permanent redirects use 308; slash handling alone does not normalize file-extension URLs.

## External access and follow-up

Update 2026-10-29: the next phase is implemented in [SEARCH-STRATEGY.md](SEARCH-STRATEGY.md). Page metadata now has a maintained query focus; IndexNow notification and weekly production checks are configured. The live www redirect now returns 308. The original audit below records the state before these updates; account-dependent work remains outstanding.

- Google Search Console: submit/confirm the sitemap, inspect Home and Services, check Google's selected canonical and fetched HTML, then request recrawl for changed pages. Run Google's Rich Results Test and review actual enhancement eligibility; local schema validation does not certify rich-result eligibility.
- Bing Webmaster Tools: submit/confirm the sitemap, use URL Inspection and review indexing/Copilot reporting where available. IndexNow is optional for later publishing automation; no speculative API key, dependency or submission mechanism was added.
- Vercel/hosting logs and firewall settings: confirm genuine crawler requests using current official verification guidance and check for challenges/403/429 responses. Test requests from this environment do not substitute for this. The existing www host currently redirects to the canonical host with 307 before application routing; inspect the hosting-domain setting if a permanent host redirect is desired. HTTPS and application path redirects already use permanent redirects.
- Business Profile and social accounts: verify real-world address, opening hours and owned official profiles before expanding LocalBusiness/sameAs data. Do not use client profiles.
- No Search Console, Bing or Business Profile account changes or URL submissions were performed. Technical eligibility cannot guarantee indexing, recommendations or citations by any assistant.
