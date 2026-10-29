# ARC Labs - Current State and Direction

Updated 29 October 2026.

## Purpose and reference

Present ARC Labs as a studio for design, technology and business growth while preserving its quiet visual identity and concise, practical voice. The signature remains **Design. Build. Grow.**

The source for the broader positioning is `../Official/Brocher/ARC_Labs.pdf`. This document supersedes earlier open questions about service structure, naming and placement. `PLAN.md` records the original website build; `LOG.md` records subsequent implementation and verification.

## Site structure

| Page | Purpose |
| --- | --- |
| Home | Studio positioning, selected work, Services preview, approach, process and contact |
| Services (`/services/`) | Four flexible Elements and nineteen individual Capabilities |
| Lab (`/lab/`) | Curated overview of completed work and explanatory approaches |
| Websites & Systems | Seven website projects with project viewers and filters |
| Logos | Ten identities with an enlarged viewer |
| Brand Kits | Cub & Co and SanDune identity systems |
| Digital Growth & Strategy | Brand work, mass campaigns, SEO and going online |
| Privacy / 404 | Privacy information and the missing-page experience |

Lab and Services have distinct roles: work and offering. The main navigation uses **Services**, while **Elements** names the four broader offerings within it. Do not call these bundles in published copy.

## Services: agreed terminology and relationships

Elements combine relevant capabilities around a business need. They are flexible starting points, not fixed packages or a promise that every listed capability is included. Scope, timing and tools are agreed with each business. Capabilities are also available individually.

| Element | Individual capabilities |
| --- | --- |
| Establish your presence | Branding & Design, Websites, E-commerce, Redesigns |
| Get found | SEO, Google Maps & Local, AI Search, Content, Digital Presence |
| Reach the right people | Social Media, Paid Ads, Lead Generation, Art & Film |
| Convert & grow | Conversion, CRM, Loyalty & Retention, Analytics, Lead & Booking Systems |
| Additional capability | Custom Systems: custom applications, portals, internal tools and automation |

Each Element explains the need, approach, relevant capabilities and supported work links, then offers an enquiry action. Individual Capabilities use native expandable rows with visible descriptions. Established service demonstrations remain optional enhancements; new capabilities use simple text.

Do not invent pricing, fixed deliverable commitments, lead volumes, ranking guarantees or client results. A link to an explanatory approach is labelled as such. Portfolio copy continues to describe only the work established for each client.

## Positioning, approach and process

Home now describes design, technology and growth rather than a website-only offering. It connects the first impression, online presence, audience and the next stage of the business.

The studio process follows the brochure:

1. **Understand:** the business, audience and real problem.
2. **Strategize:** the right direction, approach and tools.
3. **Create & Build:** designed, developed and delivered with care.
4. **Improve & Grow:** refined and expanded as the business evolves.

Historical project-specific process descriptions remain unchanged. The existing ARC method and annotated website illustration remain part of the studio identity and website capability.

## Brand and writing baseline

- Ink `#17181A`, warm Cream `#F1EEE5`, muted neutrals and subtle borders. Ink is the first-visit default; the chosen theme persists between pages and visits. Motion controls remain page-local.
- Inter Display for prominent headings and Inter for body text. Strong alignment, thin rules and generous space.
- Keep the ARC mark, three nodes, arc geometry and full stops unchanged.
- Client identities keep their own colours inside the ARC presentation.
- Write in familiar language: a clear name, practical purpose and detail only where useful. Claims require evidence.
- Use restrained motion to support meaning. Growth and Services honour both OS reduced motion and the current-page motion switch; content remains usable without JavaScript.

## Digital Growth presentation

The four existing subjects remain open editorial chapters. Each brand has a clear opening and prominent media. Svojas's store and three social posts form separate sequences, and every post remains available at every width. Iconic Bengaluru and The Shallot Kitchen follow Svojas under Collaborative pages, with copy limited to content collaboration. They are excluded from the Lab overview previews.

Campaign explanations remain visible, with numbered rows and an optional distribution demonstration. SEO separates the introduction, search illustration, areas of work and ongoing process. Going online keeps six well-spaced steps and a desktop-only sticky introduction where space permits.

Paragraphs use readable widths and at least 16px body copy. Major sections have approximately 112-160px desktop and 64-88px phone spacing. No fixed viewport-height scenes, scroll locking or required animation. Search typing completes once and the caret stops.

## Compatibility and enquiry behaviour

- `/elements/` permanently redirects to `/services/` on Vercel and the development server. Query strings and browser fragments are retained; a static fallback is provided for other hosts.
- The six original capability slugs remain: `websites`, `e-commerce`, `lead-booking`, `digital-presence`, `custom-systems`, `redesigns`.
- `?need=a,b#contact` selects capabilities. `?element=<slug>#contact` records the broader direction without automatically selecting capabilities. Both can be used together; unknown values are ignored.
- Contact groups optional capabilities in expandable sections and opens groups containing preselected choices. Email and Formspree include the Element and individual capabilities.
- Canonicals, shared navigation/footer, metadata, structured data, social previews, sitemap and QA page lists use Services.

## Work retained and boundaries

Website project facts, supplied client assets and the ARC mark are preserved. Smith & Wesson stays in Logos. Brand Kits retains Cub & Co's byte-identical supplied assets and responsive SanDune captures; its closing link remains `/#contact`. The two case-study closing inventory summaries were removed at review.

The site remains static HTML, CSS and vanilla JavaScript, with no framework migration or build step. Source data and indexable HTML are checked for agreement. Generated screenshots and reports stay in ignored QA directories. Local Brand Kits planning files remain untouched.

## Delivery and validation

Deliver the Growth presentation as its own checked commit and push before beginning Services and brochure alignment. Deliver the second stage with its own verification, documentation, commit and push.

Verify static content, shared shell, keyboard use, accessibility, internal links, JavaScript budgets and layouts at 390/768/1024/1440 in both themes. Cover blocked embeds, reduced motion, no-JavaScript reading, old bookmarks and enquiry links, and mocked failed/successful submissions. Run mobile Lighthouse on Growth, Services and Home. Record actual results in `LOG.md`; pushing source does not by itself verify the public deployment.
