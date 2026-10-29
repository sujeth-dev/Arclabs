/* ==========================================================================
   ARC Labs — content. Project facts are preserved; service copy follows the brochure direction.
   Lab cards, Element names and lines are also written into the HTML (so they
   are indexable without JS); scripts/qa/content.mjs checks the two agree.

   Cards and the Lab file show a `brand` panel: the client's own logo
   (assets/clients/, trimmed copies of brand-assets/) on their brand colour.
   Optional site captures go in /media/<slug>/ (README → Replacing media).
   ========================================================================== */

export const projects = [
  {
    file: "01", slug: "velmont", order: 1,
    name: "Velmont Design",
    line: "Defining spaces. Delivering everything around them.",
    sector: "Commercial interiors",
    status: "Live", filter: "Interiors",
    liveUrl: "https://www.velmontdesign.com",
    featured: "large",
    hypothesis: "A turnkey interiors company working across workplace, healthcare and hospitality needed a site that shows its full scope before a client ever calls.",
    formula: {
      problem: "Four disciplines to explain",
      context: "clients who need proof first",
      solution: "a portfolio-led site: work first, then scope, then one step to enquire.",
    },
    protocol: ["Understand", "Structure", "Design", "Build", "Launch"],
    insideTheLab: "A quiet stone-and-charcoal palette, large type, and photography doing the talking. An enquiry path ends every page.",
    result: "Live at velmontdesign.com.",
    // TODO(T1): /media/velmont/desktop-full.{avif,webp}, poster + recording
    screens: { desktop: [] }, video: null, poster: null,
    brand: { bg: "#F4F0EB", logo: "/assets/clients/velmont.webp", width: 1000, height: 112, style: "--bp-w:58%" },
  },
  {
    file: "02", slug: "the-possah", order: 2,
    name: "The Possah",
    line: "Modern Indian fashion, made to be discovered.",
    sector: "Fashion · E-commerce",
    status: "Ready for launch", filter: "Fashion",
    liveUrl: "https://thepossah.com",
    featured: "tall",
    hypothesis: "A contemporary Indian fashion label needed a store where products are discovered, not just listed.",
    formula: {
      problem: "A growing collection",
      context: "shoppers who browse by mood and occasion",
      solution: "e-commerce built around discovery, product stories and a short path to checkout.",
    },
    protocol: [],
    insideTheLab: "Category navigation, product storytelling, a made-to-measure flow, payments.",
    result: "Ready for launch.",
    screens: { desktop: [] }, video: null, poster: null,
    brand: { bg: "#1F3A2D", logo: "/assets/clients/the-possah.webp", width: 453, height: 77, style: "--bp-w:58%" },
  },
  {
    file: "03", slug: "zingara", order: 3,
    name: "Zingara",
    line: "The Art of White Biryani.",
    sector: "Restaurant",
    status: "Live", filter: "Food",
    liveUrl: "https://www.zingararestaurant.co.in",
    featured: "wide",
    hypothesis: "A restaurant with a rare dish, Mysore-style white biryani, needed a site as distinctive as its food.",
    formula: {
      problem: "A dish people don't know yet",
      context: "a heritage worth telling",
      solution: "a site that leads with the food and the story, with ordering one tap away.",
    },
    protocol: [],
    insideTheLab: "Heritage-led copy, menu presentation, Swiggy, Zomato and WhatsApp ordering.",
    result: "Live at zingararestaurant.co.in.",
    screens: { desktop: [] }, video: null, poster: null,
    brand: { bg: "#1C1A18", logo: "/assets/clients/zingara.webp", width: 545, height: 489, style: "--bp-w:30%;--bp-h:52%" },
  },
  {
    file: "04", slug: "assetly", order: 4,
    name: "Assetly",
    line: "Access assets. Preserve capital. Keep growing.",
    sector: "Asset leasing · B2B",
    status: "Live", filter: "B2B",
    liveUrl: "https://assetly.lease",
    featured: null,
    hypothesis: "An asset-leasing company needed to explain a financial idea simply: get equipment without tying up capital.",
    formula: {
      problem: "A B2B offer that sounds complex",
      context: "decision-makers short on time",
      solution: "a structured site that explains the benefit first and the process second.",
    },
    protocol: [],
    insideTheLab: "Benefit-first structure, plain-language explanations, an enquiry flow.",
    result: "Live website.",
    screens: { desktop: [] }, video: null, poster: null,
    brand: { bg: "#21241A", logo: "/assets/clients/assetly.webp", width: 263, height: 267, style: "--bp-w:30%;--bp-h:56%" },
  },
  {
    file: "05", slug: "fitness-garage", order: 5,
    name: "Fitness Garage",
    line: "Train better. Move stronger.",
    sector: "Fitness",
    status: "Live", filter: "Fitness",
    liveUrl: "https://www.fitness-garage.in",
    featured: null,
    hypothesis: "A Bengaluru gym needed its programs, memberships and enquiries in one place.",
    formula: {
      problem: "Ten programs and five plans",
      context: "people deciding quickly on their phones",
      solution: "one page that shows everything and books a free trial over WhatsApp.",
    },
    protocol: [],
    insideTheLab: "Program grid, membership plans, Google reviews, WhatsApp trial booking.",
    result: "Live at fitness-garage.in.",
    screens: { desktop: [] }, video: null, poster: null,
    brand: { bg: "#070707", logo: "/assets/clients/fitness-garage.webp", width: 1000, height: 287, style: "--bp-w:56%" },
  },
  {
    file: "06", slug: "aivora-india", order: 6,
    name: "Aivora India",
    line: "Making everyday business workflows simpler.",
    sector: "Business solutions · B2B",
    status: "Live", filter: "B2B",
    liveUrl: "https://www.aivoraindia.com",
    featured: null,
    hypothesis: "A business-solutions company needed to explain its offering clearly and make the next step easy.",
    formula: {
      problem: "A practical B2B offer",
      context: "buyers who want clarity fast",
      solution: "a focused site with one clear message and one clear action.",
    },
    protocol: [],
    insideTheLab: "Focused structure, concise messaging, an enquiry path.",
    result: "Live website.",
    screens: { desktop: [] }, video: null, poster: null,
    brand: { bg: "linear-gradient(135deg, #175AA1, #12467D)", logo: "/assets/clients/aivora-india.webp", width: 914, height: 262, style: "--bp-w:58%" },
  },
  {
    file: "07", slug: "nuanse", order: 7,
    name: "NUANSE Studio",
    line: "A considered presence for a studio built on detail.",
    sector: "Brand studio · B2B",
    status: "Live", filter: "B2B",
    liveUrl: "https://thenuanse.com/",
    featured: null,
    hypothesis: "A Bangalore brand studio with work across strategy, identity, websites, content, film and performance needed a clear place to bring its disciplines together.",
    formula: {
      problem: "A broad creative offering",
      context: "founders looking for the right studio",
      solution: "a work-led website that connects the studio's approach and services to a straightforward audit enquiry.",
    },
    protocol: [],
    insideTheLab: "Editorial storytelling, selected projects, service navigation, and an eight-question brand audit flow.",
    result: "Live at thenuanse.com.",
    screens: { desktop: [] }, video: null, poster: null,
    brand: { bg: "#F5F1E8", logo: "/assets/clients/nuanse.png", width: 128, height: 184, style: "--bp-w:128px;--bp-h:48%" },
  },
];

export const elements = [
  {
    number: "01", symbol: "Ws", slug: "websites", order: 1,
    name: "Websites",
    line: "Sites that explain what you do, earn trust and make the next step obvious.",
    demo: "frame",
    solves: "Customers can't tell what you do or why to trust you.",
    includes: ["structure", "design", "responsive build", "speed", "search basics", "WhatsApp and Maps"],
    worksWellWith: [{ with: "lead-booking", result: "More enquiries" }, { with: "digital-presence", result: "Getting found" }],
    relatedWork: ["velmont", "fitness-garage"],
  },
  {
    number: "02", symbol: "Ec", slug: "e-commerce", order: 2,
    name: "E-commerce",
    line: "Catalogues, product pages, payments and the systems behind a store that sells.",
    demo: "cart",
    solves: "You have products, but no easy way for people to buy them online.",
    includes: ["catalogue", "product pages", "cart", "payments", "orders", "customer accounts"],
    worksWellWith: [{ with: "digital-presence", result: "Online sales" }, { with: "custom-systems", result: "Smoother operations" }],
    relatedWork: ["the-possah"],
  },
  {
    number: "03", symbol: "Lb", slug: "lead-booking", order: 3,
    name: "Lead & Booking Systems",
    line: "Forms, WhatsApp, enquiries and bookings joined into one simple path from interest to action.",
    demo: "bubble",
    solves: "Interested people visit, then leave without getting in touch.",
    includes: ["enquiry forms", "WhatsApp", "quote requests", "booking and appointments"],
    worksWellWith: [{ with: "websites", result: "More enquiries" }, { with: "custom-systems", result: "Automated follow-up" }],
    relatedWork: ["fitness-garage", "zingara"],
  },
  {
    number: "04", symbol: "Dp", slug: "digital-presence", order: 4,
    name: "Digital Presence",
    line: "Google, Maps, search and social: everything around your website that helps people find you.",
    demo: "pin",
    solves: "A good business that's hard to find online.",
    includes: ["Google Business Profile", "Maps", "search setup", "social integration"],
    includesNote: "SEO is planned around your goals.",
    worksWellWith: [{ with: "websites", result: "Getting found" }, { with: "e-commerce", result: "Online sales" }],
    relatedWork: ["zingara", "fitness-garage"],
  },
  {
    number: "05", symbol: "Cs", slug: "custom-systems", order: 5,
    name: "Custom Systems",
    line: "Custom applications, portals, internal tools and automation, built around how your business runs.",
    demo: "bars",
    solves: "Work runs on spreadsheets, messages and repeated manual steps.",
    includes: ["dashboards", "client portals", "internal tools", "integrations", "automation"],
    worksWellWith: [{ with: "lead-booking", result: "Automated follow-up" }, { with: "e-commerce", result: "Smoother operations" }],
    relatedWork: ["assetly", "aivora-india"],
  },
  {
    number: "06", symbol: "Rd", slug: "redesigns", order: 6,
    name: "Redesigns",
    line: "For when the business has moved on and the website hasn't.",
    demo: "slider",
    solves: "The site no longer matches the quality of the business.",
    includes: ["restructure", "new design", "rebuild", "content refresh"],
    worksWellWith: [{ with: "lead-booking", result: "Better conversion" }],
    relatedWork: [], // TODO(T8): plan says "any project with a before/after" — none yet
  },
];

// Combinations strip (Elements page) and the Contact chips' result words.
export const combinations = [
  { a: "websites", b: "lead-booking", result: "More enquiries" },
  { a: "websites", b: "digital-presence", result: "Getting found" },
  { a: "e-commerce", b: "digital-presence", result: "Online sales" },
  { a: "redesigns", b: "lead-booking", result: "Better conversion" },
  { a: "custom-systems", b: "lead-booking", result: "Automated follow-up" },
];

// Every result word the plan defines for a pair (combinations + "Works well with").
export function resultFor(a, b) {
  const key = (x, y) => [x, y].sort().join("+");
  const want = key(a, b);
  for (const c of combinations) if (key(c.a, c.b) === want) return c.result;
  for (const e of elements) for (const w of e.worksWellWith) if (key(e.slug, w.with) === want) return w.result;
  return null;
}

export const process = ["Understand", "Strategize", "Create & Build", "Improve & Grow"];

export const bySlug = (list, slug) => list.find((x) => x.slug === slug);
export const domain = (url) => url ? new URL(url).hostname.replace(/^www\./, "") : "";

// Individual capabilities keep the six established slugs for old links and enquiries.
elements.push(...[
  {
    "number": "07",
    "symbol": "",
    "slug": "branding-design",
    "order": 7,
    "name": "Branding & Design",
    "line": "A distinctive identity, from your logo to the places people meet your business.",
    "solves": "Your business needs a clear, consistent identity.",
    "includes": [
      "identity direction",
      "logo and visual system",
      "brand applications"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": [
      "/lab/logos/",
      "/lab/brand-kits/"
    ]
  },
  {
    "number": "08",
    "symbol": "",
    "slug": "seo",
    "order": 8,
    "name": "SEO",
    "line": "Search work that helps the right people discover your business.",
    "solves": "Customers are searching, but your business is difficult to find.",
    "includes": [
      "search and site review",
      "useful page content",
      "ongoing measurement"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": [
      "/lab/digital-growth/#seo"
    ]
  },
  {
    "number": "09",
    "symbol": "",
    "slug": "google-maps-local",
    "order": 9,
    "name": "Google Maps & Local",
    "line": "Help nearby customers find the right location and the next step.",
    "solves": "Local customers need accurate information about your business.",
    "includes": [
      "Google Business Profile",
      "location information",
      "local search foundations"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": [
      "/lab/digital-growth/#seo"
    ]
  },
  {
    "number": "10",
    "symbol": "",
    "slug": "ai-search",
    "order": 10,
    "name": "AI Search",
    "line": "Make your business information clear for search experiences that use AI.",
    "solves": "Your information needs to be understandable beyond a traditional search listing.",
    "includes": [
      "clear business information",
      "useful structured content",
      "search visibility review"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": []
  },
  {
    "number": "11",
    "symbol": "",
    "slug": "content",
    "order": 11,
    "name": "Content",
    "line": "Useful words and visuals shaped around what your audience needs to know.",
    "solves": "People need a reason to understand, trust and remember your business.",
    "includes": [
      "content direction",
      "website and social content",
      "editorial planning"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": [
      "/lab/digital-growth/#brands"
    ]
  },
  {
    "number": "12",
    "symbol": "",
    "slug": "social-media",
    "order": 12,
    "name": "Social Media",
    "line": "A considered presence, with content and a rhythm that fit your business.",
    "solves": "Your social pages need a clear purpose and consistent direction.",
    "includes": [
      "social direction",
      "content planning",
      "publishing and review"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": [
      "/lab/digital-growth/#brands"
    ]
  },
  {
    "number": "13",
    "symbol": "",
    "slug": "paid-ads",
    "order": 13,
    "name": "Paid Ads",
    "line": "Campaigns built around a clear audience, offer and next step.",
    "solves": "You need to reach people beyond your existing audience.",
    "includes": [
      "campaign planning",
      "creative and landing-page direction",
      "performance review"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": []
  },
  {
    "number": "14",
    "symbol": "",
    "slug": "lead-generation",
    "order": 14,
    "name": "Lead Generation",
    "line": "Connect the right audience with a clear reason to get in touch.",
    "solves": "Attention needs a clearer path to an enquiry.",
    "includes": [
      "audience and offer",
      "campaign enquiry paths",
      "lead handover"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": []
  },
  {
    "number": "15",
    "symbol": "",
    "slug": "art-film",
    "order": 15,
    "name": "Art & Film",
    "line": "Images and films that give your business a recognisable point of view.",
    "solves": "Your story needs visual work that feels like your business.",
    "includes": [
      "creative direction",
      "visual storytelling",
      "campaign and social assets"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": []
  },
  {
    "number": "16",
    "symbol": "",
    "slug": "conversion",
    "order": 16,
    "name": "Conversion",
    "line": "Make the path from interest to action easier to follow.",
    "solves": "People reach your site but struggle to take the next step.",
    "includes": [
      "journey review",
      "page and form improvements",
      "measurement"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": []
  },
  {
    "number": "17",
    "symbol": "",
    "slug": "crm",
    "order": 17,
    "name": "CRM",
    "line": "Keep enquiries, customer information and follow-up connected.",
    "solves": "Customer conversations are scattered across tools and messages.",
    "includes": [
      "customer workflow planning",
      "CRM setup and connections",
      "follow-up processes"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": []
  },
  {
    "number": "18",
    "symbol": "",
    "slug": "loyalty-retention",
    "order": 18,
    "name": "Loyalty & Retention",
    "line": "Give customers a reason to return and a useful way to stay in touch.",
    "solves": "The relationship ends too soon after the first purchase.",
    "includes": [
      "customer journeys",
      "return-visit communications",
      "retention programme planning"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": []
  },
  {
    "number": "19",
    "symbol": "",
    "slug": "analytics",
    "order": 19,
    "name": "Analytics",
    "line": "Understand what people do and use that evidence to decide what comes next.",
    "solves": "You need a clearer view of what is working.",
    "includes": [
      "measurement planning",
      "analytics setup",
      "reporting and review"
    ],
    "worksWellWith": [],
    "relatedWork": [],
    "work": []
  }
]);

export const serviceElements = [
  {
    "slug": "establish-your-presence",
    "name": "Establish your presence",
    "line": "A credible, distinctive identity.",
    "need": "Starting something new, or ready for a clearer first impression?",
    "description": "Bring the way your business looks and the way it works online into one considered presence.",
    "capabilities": [
      "branding-design",
      "websites",
      "e-commerce",
      "redesigns"
    ],
    "work": [
      {
        "name": "Logo identities",
        "url": "/lab/logos/"
      },
      {
        "name": "Brand Kits",
        "url": "/lab/brand-kits/"
      },
      {
        "name": "Websites & Systems",
        "url": "/lab/websites/"
      }
    ]
  },
  {
    "slug": "get-found",
    "name": "Get found",
    "line": "Be easy to discover.",
    "need": "A good business should be easier to find.",
    "description": "Connect useful content, search foundations and accurate local information around the people looking for you.",
    "capabilities": [
      "seo",
      "google-maps-local",
      "ai-search",
      "content",
      "digital-presence"
    ],
    "work": [
      {
        "name": "Our search approach",
        "url": "/lab/digital-growth/#seo"
      }
    ]
  },
  {
    "slug": "reach-the-right-people",
    "name": "Reach the right people",
    "line": "Connect with your audience.",
    "need": "Ready to reach beyond the people who already know you?",
    "description": "Give your message a clear audience and a reason to travel, through social content, campaigns and creative work.",
    "capabilities": [
      "social-media",
      "paid-ads",
      "lead-generation",
      "art-film"
    ],
    "work": [
      {
        "name": "Brand work",
        "url": "/lab/digital-growth/#brands"
      },
      {
        "name": "Mass campaigns",
        "url": "/lab/digital-growth/#campaigns"
      }
    ]
  },
  {
    "slug": "convert-and-grow",
    "name": "Convert & grow",
    "line": "Turn attention into customers.",
    "need": "People are interested. Make the next step easier.",
    "description": "Join the customer journey, enquiries and follow-up, then use what you learn to improve the experience.",
    "capabilities": [
      "conversion",
      "crm",
      "loyalty-retention",
      "analytics",
      "lead-booking"
    ],
    "work": [
      {
        "name": "Fitness Garage / trial enquiries",
        "url": "/lab/websites/#file-fitness-garage"
      }
    ]
  }
];

export const capabilityGroups = [...serviceElements.map(({ slug, name, capabilities }) => ({ slug, name, capabilities })), { slug: "custom", name: "Custom applications & automation", capabilities: ["custom-systems"] }];
