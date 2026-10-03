/* Site configuration. Edit here; no build step reads anything else.
   Empty values switch the feature off gracefully (see TODO.md). */
export const config = {
  // Production origin, no trailing slash. Also hard-coded in each page's
  // canonical/OG tags and sitemap.xml — change all at once with
  // `node scripts/set-domain.mjs https://your-domain`.
  siteUrl: "https://arclabs.vercel.app",

  // Formspree form ID (formspree.io → form → "xyzabcd"). Empty → the form opens
  // the visitor's email app with the enquiry filled in instead.
  formspreeId: "",

  // Cloudflare Turnstile site key. Empty → no challenge (honeypot only).
  turnstileSiteKey: "",

  // "ga4" (shown only after consent) or "plausible" (cookieless, no banner).
  analytics: { provider: "ga4", ga4Id: "", plausibleDomain: "" },
};

export const contact = {
  email: "arclabs.tech@gmail.com",
  phone: "+91 80885 06783",
  phoneE164: "+918088506783",
  whatsapp: "https://wa.me/918088506783",
};
