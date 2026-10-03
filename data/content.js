/* ==========================================================================
   ARC Labs — content. Copy is verbatim from the FINAL PLAN.
   Lab cards, Element names and lines are also written into the HTML (so they
   are indexable without JS); scripts/qa/content.mjs checks the two agree.

   Media: real captures go in /media/<slug>/ (see README → Replacing media).
   Until then `screens` and `video` are empty and the placeholder `plate`
   (the brand system's stand-in composition) is shown. TODO.md → T1.
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
    plate: { key: "velmont", brand: "Velmont", links: ["Work", "About", "Contact"], eyebrow: "Defining Environments.", title: "Commercial interiors built to the highest standard.", cta: "View the Portfolio" },
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
    plate: { key: "possah", brand: "The Possah", links: ["New in", "Bridal", "Festive"], eyebrow: "Couture, off-duty. Spring ’26", title: "she wants what she wants.", cta: "Shop the Collection" },
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
    plate: { key: "zingara", brand: "Zingara", links: ["Menu", "Our Story", "Gallery"], eyebrow: "A rare expression of Mysore’s culinary heritage", title: "The Art of White Biryani", cta: "Order Now" },
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
    plate: { key: "neutral", brand: "Assetly", links: [], eyebrow: "", title: "Access assets. Preserve capital. Keep growing.", cta: "" },
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
    plate: { key: "fitness", brand: "Fitness Garage", links: ["Programs", "Membership", "Contact"], eyebrow: "Kanaka Nagar, Horamavu · Bangalore", title: "Fitness Garage Bengaluru.", ticker: ["Aerobics", "Yoga", "Zumba", "Cross Fitness", "Personal Training"] },
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
    plate: { key: "neutral", brand: "Aivora India", links: [], eyebrow: "", title: "Making everyday business workflows simpler.", cta: "" },
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
    line: "Dashboards, portals, internal tools and automation, built around how your business actually runs.",
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

export const process = ["Understand", "Structure", "Design", "Build", "Launch"];

export const bySlug = (list, slug) => list.find((x) => x.slug === slug);
export const domain = (url) => url ? new URL(url).hostname.replace(/^www\./, "") : "";
