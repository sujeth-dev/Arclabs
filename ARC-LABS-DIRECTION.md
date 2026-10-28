# ARC Labs — Current State and Planned Direction

28 October 2026
Status: Updated 29 October 2026. The logo gallery and collection-page restructure are ready for local preview; the broader service expansion remains in planning.

## Purpose

Record what ARC Labs has today, what we have understood about its brand, and the direction for expanding its work and services. This document captures the discussion so far; it does not finalise service scope, bundles, pricing, or page designs.

The central requirement is to maintain the existing site's feel, minimalism, visual identity, and writing style as the offering grows.

## What we have now

### Website and positioning

The current website presents ARC Labs as a Bengaluru design and development studio, with websites and digital systems at the centre of its offering. Its signature is **“Design. Build. Grow.”**

The site consists of Home, Lab, Elements, Privacy, and a 404 page. Home brings together selected work, services, approach, process, and contact. Lab presents projects as files; Elements presents services as individual building blocks and combinations.

Current service content includes:

| Element | Current focus |
| --- | --- |
| Websites | Explain the business, earn trust, and make the next step clear. |
| E-commerce | Product discovery, catalogues, checkout, payments, and store operations. |
| Lead & Booking Systems | Connect enquiries, forms, WhatsApp, and appointments. |
| Digital Presence | Google Business Profile, Maps, search setup, and social integration. |
| Custom Systems | Dashboards, portals, internal tools, integrations, and automation. |
| Redesigns | Restructure, refresh, and rebuild an existing website. |

The current combinations connect services to outcomes such as more enquiries, getting found, online sales, better conversion, and automated follow-up. These are service pairings, not yet a defined commercial bundle catalogue.

### Existing work

The portfolio contains Velmont Design, The Possah, Zingara, Assetly, Fitness Garage, Aivora India, and NUANSE Studio. Project content describes the business problem, context, solution, work involved, and result or launch status.

The current source uses client logos on client-coloured panels. Those logos appearing on the site do not, by themselves, establish that ARC Labs designed them. Any future logo or branding portfolio entries need confirmed authorship and scope.

### Implementation

The website uses static HTML, CSS, and vanilla JavaScript. Shared styling and brand tokens live in `css/styles.css`; project and service data live in `data/content.js`. Some service and project copy also appears directly in the HTML, so future updates must keep these representations aligned.

Existing checks cover content consistency, shared page elements, accessibility, responsive layouts, and interactions. No framework migration or technical rebuild has been requested.

## What we have understood about the brand

### Visual character

ARC Labs feels quiet, precise, minimal, and confident, with small playful interactions. Its character comes from typography, spacing, geometry, and restrained motion.

| Part of the identity | Baseline to preserve |
| --- | --- |
| Colour | Ink `#17181A` and warm Cream `#F1EEE5`, with muted neutrals and subtle borders. Ink is the current default. |
| Typography | Inter Display for prominent headings and Inter for body text and interface labels. Large, tightly spaced headlines contrast with small labels. |
| Layout | Generous space, clear grids, thin rules, numbered rows, and strong alignment. |
| Shapes | Restrained rectangular controls and panels, with circular nodes and arc geometry as recurring details. |
| Identity | The ARC mark, three nodes, and full stops in “Design. Build. Grow.” |
| Motion | Drawing lines, revealing content, and small interactive demonstrations that support the brand and explain the work. |
| Portfolio | Client identities retain their own colours within the ARC Labs presentation. |

### Writing style

The copy is concise, direct, human, and grounded in business needs. It explains what something does and why it matters in familiar language.

Existing lines establish the voice:

- “Every page has a purpose.”
- “For when the business has moved on and the website hasn't.”
- “Not sure which you need? Tell us the problem.”

New content should follow the same pattern: a clear name, a short explanation, a practical outcome, and further detail only where useful. Claims about results should remain supported by actual work.

## What the brochure adds

Reference: `../Official/Brocher/ARC_Labs.pdf`.

The brochure presents a broader business-growth offering than the website currently communicates. Its content and embedded font and colour definitions reinforce the existing Inter, Ink, and Cream identity. Its rendered page layout has not yet been fully visually verified in this review.

The brochure groups services around four customer needs:

| Brochure group | Services named in the brochure |
| --- | --- |
| Establish your presence | Branding & Design, Websites, E-commerce, Redesigns |
| Get found | SEO, Google Maps & Local, AI Search, Content |
| Reach the right people | Social Media, Paid Ads, Lead Generation, Art & Film |
| Convert & grow | Conversion, CRM, Loyalty & Retention, Analytics |

It also includes custom applications and automation: portals, internal tools, and workflows.

Its approach is expressed as Understand, Strategize, Create & Build, and Improve & Grow. The website currently uses Understand, Structure, Design, Build, and Launch & Grow. These will need to be reconciled when the broader offering is defined.

The brochure is a reference for intended direction. Its service list is not an instruction to publish every offering immediately, and its four groups are not yet agreed website navigation or bundles.

## What we are planning

### Confirmed direction

Expand the presentation of ARC Labs beyond its current website-led offering while maintaining the existing brand and content style. The discussion includes service bundling and broader design, marketing, and social media work.

The next additions explicitly identified for discussion are:

| Addition | What needs to be established before implementation |
| --- | --- |
| Logo work | Which projects to showcase, what ARC Labs created, and how standalone logo services should be described. |
| Brand kits | Available examples, exact deliverables, and the relationship between a logo project and a fuller identity kit. |
| Marketing pages | Whether this means portfolio examples, campaign or landing-page services, dedicated marketing service pages, or a combination. |

Marketing and social media remain part of the broader intended expansion. Their deliverables, boundaries, and presentation are still to be discussed.

### Proposed sequence

1. **Review the additional work.** Gather the selected logo, brand-kit, and marketing examples, along with project context and confirmed scope.
2. **Define the offering.** Agree what each service includes, what can be purchased separately, and what belongs in a bundle.
3. **Map the content.** Decide how the broader services fit into Home, Lab, Elements, contact choices, and any new pages that are genuinely needed.
4. **Develop the copy and presentation.** Use the existing visual system and concise voice, taking the brochure's broader positioning into account.
5. **Finalise the implementation plan.** Record the agreed page changes, assets, copy, service relationships, and validation requirements.
6. **Implement when requested.** Update the website and verify content consistency, responsive behaviour, accessibility, and interactions.

This sequence is a proposed working plan, not a final sitemap or approved implementation specification.

## Decisions still open

- Which new projects and assets will be included, and what work ARC Labs performed on each.
- The exact scope of logo design, brand kits, marketing, and social media services.
- What “marketing pages” means in this expansion.
- Bundle names, inclusions, optional additions, and whether pricing will be shown.
- Whether the brochure's four groups become the primary service structure or sit alongside Elements and Combinations.
- Whether new dedicated pages are needed and how Lab should organise different types of work.
- Which headline, positioning, process, and contact wording should change to reflect the broader offering.

## Current status and boundaries

The existing site's source, copy, brand tokens, interaction code, saved previews, and decision history have been reviewed. The brochure's text and font/colour definitions have been examined as additional context.

The initial planning review made no website changes. On 29 October 2026, the logo-gallery plan was authorised and implemented locally. The broader service, brand-kit, marketing, and bundle changes remain to be defined. Nothing has been deployed.

### Logo gallery — local preview

- Added ten identities to Lab, excluding ARC: Carlos, Rose, Cub & Co, Club Pasta, MONA Coffee, Infinite Bull, Recoil, Smith and Wesson, Brave Sheep, and SanDune.
- Split the supplied combined image into separate Brave Sheep and MONA Coffee assets; retained the original source files.
- Added a three-logo preview on Home linking into the collection.
- Used a spacious grid with full-width feature panels, client colours, minimal captions, subtle entry motion, and a running collection number.
- Added an enlarged viewer with previous/next controls, arrow-key navigation, Escape to close, and focus restoration.
- Preserved the existing site shell and brand system. Small source JPEGs are kept at restrained display sizes.
- Current preview: `http://localhost:4321/lab/logos/` while the local development server is running. The original `/lab/#logos` bookmark redirects to this page.

### Lab collections — implemented locally

The combined Lab page became too long after adding the logo gallery. Lab now serves as a curated overview, with three website projects and three logos, linking into dedicated collection pages.

| Collection | Route | Status |
| --- | --- | --- |
| All work | `/lab/` | Compact overview implemented |
| Websites & Systems | `/lab/websites/` | Seven projects, sector filters, and project viewers implemented |
| Logos | `/lab/logos/` | Ten identities and enlarged viewer implemented |
| Brand Kits | `/lab/brand-kits/` | Planned; awaiting review of work |
| Digital Growth & Strategy | `/lab/digital-growth/` | Built locally: three brands, mass campaigns, SEO, going online |

**Digital Growth & Strategy** is the agreed collection name, replacing the earlier proposed Marketing collection. It can cover campaigns, social media, search visibility, lead generation, and strategy as relevant work is reviewed. Earlier references to marketing describe possible services, not the collection's final name.

The main navigation retains Lab. A smaller collection navigation connects All work, Websites & Systems, and Logos. Unready collections are not published as empty pages. Home links to the dedicated collections; older project bookmarks remain functional, and older logo bookmarks redirect to the new gallery. Shared brand styling is preserved. Nothing has been deployed.
