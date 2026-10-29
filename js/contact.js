/* ==========================================================================
   contact.js — Home 06: grouped capability selections, prefill,
   validation, Formspree (+ honeypot, optional Turnstile), success state.
   ========================================================================== */
import { config, contact } from "./config.js";
import { elements, serviceElements } from "../data/content.js";
import { onceInView } from "./arc.js";
import { track } from "./analytics.js";

const form = document.querySelector("[data-contact-form]");

/* Individual capability selections are independent of Element interest. */
function initNeeds() {
  const boxes = [...form.querySelectorAll('input[name="need"]')];
  const groups = [...form.querySelectorAll('.contact-needs__group')];
  const update = () => groups.forEach(group => {
    const n = group.querySelectorAll('input:checked').length;
    group.querySelector('[data-need-count]').textContent = n ? n + ' selected' : 'Choose';
  });
  const params = new URLSearchParams(location.search);
  const wanted = (params.get('need') || '').split(',').filter(s => elements.some(e => e.slug === s));
  boxes.forEach(box => {
    box.checked = wanted.includes(box.value);
    if (box.checked) box.closest('details').open = true;
    box.addEventListener('change', update);
  });
  const direction = params.get('element');
  if (serviceElements.some(e => e.slug === direction)) form.elements.element.value = direction;
  update();
}

/* ---------- validation ---------------------------------------------------- */
const MESSAGES = { "f-name": "Please enter your name.", "f-email": "Please enter a valid email address." };
function validate() {
  let first = null;
  for (const id of Object.keys(MESSAGES)) {
    const input = form.querySelector(`#${id}`);
    const err = form.querySelector(`#${id}-err`);
    const ok = input.value.trim() !== "" && input.checkValidity();
    input.setAttribute("aria-invalid", String(!ok));
    err.hidden = ok;
    err.textContent = ok ? "" : MESSAGES[id];
    if (!ok && !first) first = input;
  }
  if (first) first.focus();
  return !first;
}

/* ---------- Turnstile (only when a site key is configured) ----------------- */
function initTurnstile() {
  const box = form.querySelector("[data-turnstile]");
  if (!config.turnstileSiteKey || !box) return;
  onceInView(form, () => {
    window.onArcTurnstile = () => window.turnstile.render(box, { sitekey: config.turnstileSiteKey, theme: "dark" });
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onArcTurnstile";
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }, { threshold: 0 });
}

/* ---------- submit ------------------------------------------------------- */
function done() {
  const doneEl = document.querySelector("[data-form-done]");
  form.hidden = true;
  doneEl.hidden = false;
  doneEl.focus();
}

// A ready-to-send email: whatever the form already holds, blanks for the rest.
function mailtoHref(data) {
  const v = (k) => String(data.get(k) || "").trim();
  const needs = data.getAll("need").map((s) => elements.find((e) => e.slug === s)?.name).filter(Boolean).join(", ");
  const lines = [
    "Hi ARC Labs,", "", "I'd like to talk about a project.", "",
    `Name: ${v("name")}`, `Business: ${v("business")}`, `Email: ${v("email")}`, `Phone: ${v("phone")}`,
    `Element: ${serviceElements.find(e => e.slug === v("element"))?.name || "Not sure yet"}`,
    `Capabilities: ${needs}`, `Budget: ${v("budget")}`,
    ...(v("message") ? ["", v("message")] : []),
    "", "Thanks,",
  ];
  const subject = v("name") ? `Project enquiry: ${v("name")}` : "Project enquiry";
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
function mailtoFallback(data) { location.href = mailtoHref(data); }

/* ---------- Email in "Talk to us directly": opens mail with the form so far -- */
function initDirectEmail() {
  const a = document.querySelector("[data-mailto]");
  if (!a) return;
  const refresh = () => { a.href = mailtoHref(new FormData(form)); };
  a.addEventListener("pointerdown", refresh);
  a.addEventListener("focus", refresh);
  a.addEventListener("click", refresh);
}

function initSubmit() {
  const status = form.querySelector("[data-form-status]");
  const btn = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    if (!validate()) return;
    const data = new FormData(form);
    data.set("element_name", serviceElements.find(e => e.slug === data.get("element"))?.name || "");
    data.set("capabilities", data.getAll("need").map(slug => elements.find(e => e.slug === slug)?.name).filter(Boolean).join(", "));
    if (data.get("_gotcha")) { done(); return; }   // honeypot: quietly drop bots
    if (!config.formspreeId) {
      mailtoFallback(data);
      status.textContent = "Your email app should open with your message ready to send.";
      track("enquiry_sent", { method: "email", needs: data.getAll("need").join(","), element: data.get("element") || "" });
      return;
    }
    btn.disabled = true;
    status.textContent = "Sending…";
    try {
      const res = await fetch(`https://formspree.io/f/${encodeURIComponent(config.formspreeId)}`, {
        method: "POST", body: data, headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      track("enquiry_sent", { method: "form", needs: data.getAll("need").join(","), element: data.get("element") || "" });
      done();
    } catch {
      status.textContent = `That didn't send. Please try again, or email ${contact.email}.`;
      btn.disabled = false;
    }
  });
  // Clear an error as soon as the field is fixed.
  form.addEventListener("input", (e) => {
    const err = form.querySelector(`#${e.target.id}-err`);
    if (err && !err.hidden && e.target.value.trim() && e.target.checkValidity()) {
      err.hidden = true; e.target.setAttribute("aria-invalid", "false");
    }
  });
}

if (form) {
  form.noValidate = true;
  initNeeds();
  initTurnstile();
  initSubmit();
  initDirectEmail();
}
