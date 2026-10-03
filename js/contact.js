/* ==========================================================================
   contact.js — Home 06: service chips, the connecting span, prefill,
   validation, Formspree (+ honeypot, optional Turnstile), success state.
   ========================================================================== */
import { config, contact } from "./config.js";
import { resultFor, elements } from "../data/content.js";
import { draw, ms, onceInView } from "./arc.js";
import { track } from "./analytics.js";

const form = document.querySelector("[data-contact-form]");

/* ---------- chips: two selected → a span joins them, the result appears --- */
function initChips() {
  const set = form.querySelector("[data-chips]");
  const svg = form.querySelector("[data-chip-link]");
  const path = svg.querySelector("path");
  const out = form.querySelector("[data-chip-result]");
  const boxes = [...set.querySelectorAll('input[name="need"]')];
  let lastPair = "";

  const update = (animate = true) => {
    const on = boxes.filter((b) => b.checked);
    if (on.length !== 2) {
      path.setAttribute("d", ""); out.textContent = ""; lastPair = "";
      return;
    }
    const sr = set.getBoundingClientRect();
    const [a, b] = on.map((x) => x.nextElementSibling.getBoundingClientRect())
      .sort((p, q) => (p.top - q.top) || (p.left - q.left));
    // A span from the top centre of one chip to the other: it always rises.
    const x0 = a.left + a.width / 2 - sr.left, y0 = a.top - sr.top;
    const x1 = b.left + b.width / 2 - sr.left, y1 = b.top - sr.top;
    const top = Math.min(y0, y1) - Math.max(18, Math.min(30, Math.abs(x1 - x0) * 0.25));
    const [l, r] = x0 <= x1 ? [[x0, y0], [x1, y1]] : [[x1, y1], [x0, y0]];
    const mid = (l[0] + r[0]) / 2;
    path.setAttribute("d", `M${l[0]} ${l[1]} C ${l[0]} ${top} ${l[0]} ${top} ${mid} ${top} S ${r[0]} ${r[1]} ${r[0]} ${r[1]}`);
    svg.setAttribute("viewBox", `0 0 ${sr.width} ${sr.height}`);
    const key = on.map((x) => x.value).sort().join("+");
    const word = resultFor(on[0].value, on[1].value);
    out.textContent = word || "";
    if (animate && key !== lastPair) draw(path, { duration: ms("--duration-medium", 400) });
    else { path.style.strokeDasharray = "1 1"; path.style.strokeDashoffset = "0"; }
    lastPair = key;
  };
  boxes.forEach((b) => b.addEventListener("change", () => update(true)));
  new ResizeObserver(() => update(false)).observe(set);

  // Prefill from ?need=a,b (Start this project, combinations).
  const need = new URLSearchParams(location.search).get("need");
  if (need) {
    const wanted = need.split(",").filter((s) => elements.some((e) => e.slug === s));
    boxes.forEach((b) => { b.checked = wanted.includes(b.value); });
    requestAnimationFrame(() => update(false));
  }
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

function mailtoFallback(data) {
  const lines = [
    `Name: ${data.get("name")}`, `Business: ${data.get("business") || "-"}`, `Email: ${data.get("email")}`,
    `Phone: ${data.get("phone") || "-"}`, `What I need: ${data.getAll("need").map((s) => elements.find((e) => e.slug === s)?.name).join(", ") || "-"}`,
    `Budget: ${data.get("budget") || "-"}`, "", String(data.get("message") || ""),
  ];
  location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Project enquiry: ${data.get("name")}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function initSubmit() {
  const status = form.querySelector("[data-form-status]");
  const btn = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    if (!validate()) return;
    const data = new FormData(form);
    if (data.get("_gotcha")) { done(); return; }   // honeypot: quietly drop bots
    if (!config.formspreeId) {
      mailtoFallback(data);
      status.textContent = "Your email app should open with your message ready to send.";
      track("enquiry_sent", { method: "email", needs: data.getAll("need").join(",") });
      return;
    }
    btn.disabled = true;
    status.textContent = "Sending…";
    try {
      const res = await fetch(`https://formspree.io/f/${encodeURIComponent(config.formspreeId)}`, {
        method: "POST", body: data, headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      track("enquiry_sent", { method: "form", needs: data.getAll("need").join(",") });
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
  initChips();
  initTurnstile();
  initSubmit();
}
