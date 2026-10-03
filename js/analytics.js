/* Analytics: GA4 behind consent, or Plausible (cookieless).
   Events: enquiry_sent, file_opened, element_opened, filter_used.
   Every event is also dispatched as a DOM "arc:track" event (used by QA). */
import { config } from "./config.js";
import { store } from "./arc.js";

const KEY = "arc-consent";
const { provider, ga4Id, plausibleDomain } = config.analytics;
const PLAUSIBLE_NAMES = {
  enquiry_sent: "Enquiry Sent", file_opened: "File Opened",
  element_opened: "Element Opened", filter_used: "Filter Used",
};
let loaded = false;

function loadScript(src, attrs = {}) {
  const s = document.createElement("script");
  s.async = true; s.src = src;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.head.appendChild(s);
}

function loadGA4() {
  if (loaded || !ga4Id) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", ga4Id, { anonymize_ip: true });
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`);
}

function loadPlausible() {
  if (loaded || !plausibleDomain) return;
  loaded = true;
  window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
  loadScript("https://plausible.io/js/script.js", { "data-domain": plausibleDomain, defer: "" });
}

export function track(name, params = {}) {
  document.dispatchEvent(new CustomEvent("arc:track", { detail: { name, params } }));
  if (!loaded) return;
  if (provider === "ga4" && window.gtag) window.gtag("event", name, params);
  if (provider === "plausible" && window.plausible) window.plausible(PLAUSIBLE_NAMES[name] || name, { props: params });
}

function banner() {
  if (document.querySelector(".consent")) return;
  const el = document.createElement("section");
  el.className = "consent ink";
  el.setAttribute("aria-label", "Analytics consent");
  el.innerHTML = `<p>We'd like to use Google Analytics to see which pages help visitors. No ads, no selling data. <a class="link" href="/privacy/">Privacy</a></p>
    <div class="consent__actions"><button class="btn btn--sm" type="button" data-consent="granted">Allow</button><button class="btn btn--sm btn--ghost" type="button" data-consent="denied">No thanks</button></div>`;
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-consent]");
    if (!b) return;
    store.set(KEY, b.dataset.consent);
    if (b.dataset.consent === "granted") loadGA4();
    el.remove();
  });
  document.body.appendChild(el);
}

export function initAnalytics() {
  if (provider === "plausible") { loadPlausible(); return; }
  if (provider !== "ga4" || !ga4Id) return;
  document.querySelectorAll("[data-consent-open]").forEach((b) => {
    b.hidden = false;
    b.addEventListener("click", banner);
  });
  const choice = store.get(KEY);
  if (choice === "granted") loadGA4();
  else if (choice !== "denied") banner();
}
