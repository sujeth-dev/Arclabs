/* ==========================================================================
   main.js — every page: theme, reduced motion, nav, menu, cursor, copy, consent.
   ========================================================================== */
import { reduced, store, ease } from "./arc.js";
import { initAnalytics } from "./analytics.js";

const root = document.documentElement;

/* ---------- theme + motion preferences ----------------------------------- */
// Cream is the default; Ink only when chosen (restored before paint in <head>).
function initPrefs() {
  const themeBtns = document.querySelectorAll("[data-theme-toggle]");
  const syncTheme = () => {
    const ink = root.dataset.theme === "dark";
    themeBtns.forEach((b) => {
      b.setAttribute("aria-pressed", String(ink));
      const l = b.querySelector("[data-theme-label]");
      if (l) l.textContent = ink ? "Ink" : "Cream";
    });
  };
  themeBtns.forEach((b) => b.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    store.set("arc-theme", next);
    syncTheme();
  }));
  syncTheme();

  const motionBtns = document.querySelectorAll("[data-motion-toggle]");
  const syncMotion = () => motionBtns.forEach((b) => b.setAttribute("aria-pressed", String(reduced())));
  motionBtns.forEach((b) => b.addEventListener("click", () => {
    const next = reduced() ? "full" : "reduced";
    root.dataset.motion = next;
    store.set("arc-motion", next);
    root.classList.toggle("motion", next === "full");
    syncMotion();
    document.dispatchEvent(new CustomEvent("arc:motion"));
  }));
  syncMotion();
}

/* ---------- nav: hairline once scrolled ----------------------------------- */
function initNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- mobile menu: full-screen Ink dialog --------------------------- */
function initMenu() {
  const menu = document.getElementById("menu");
  const openBtn = document.querySelector("[data-menu-open]");
  if (!menu || !openBtn || typeof menu.showModal !== "function") return;
  openBtn.addEventListener("click", () => {
    menu.showModal();
    openBtn.setAttribute("aria-expanded", "true");
  });
  menu.addEventListener("close", () => {
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.focus();
  });
  menu.querySelector("[data-menu-close]")?.addEventListener("click", () => menu.close());
  // Links to a section on this page: close first so the scroll lands.
  menu.querySelectorAll("a[href]").forEach((a) => a.addEventListener("click", () => {
    const url = new URL(a.href, location.href);
    if (url.pathname === location.pathname && url.hash) menu.close();
  }));
  // Above the menu breakpoint the dialog has no purpose.
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => { if (e.matches && menu.open) menu.close(); });
}

/* ---------- cursor: custom arrow + a lagging context tag ------------------ */
// Fine pointers with hover only. The tag appears over [data-cursor-tag].
function initCursor() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!fine.matches) return;
  root.classList.add("has-cursor");
  const tag = document.createElement("div");
  tag.className = "cursor-tag";
  tag.setAttribute("aria-hidden", "true");
  document.body.appendChild(tag);

  let tx = 0, ty = 0, x = 0, y = 0, raf = 0, active = null;
  const step = () => {
    const k = reduced() ? 1 : 0.22;
    x += (tx - x) * k; y += (ty - y) * k;
    tag.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(step) : 0;
  };
  const show = (el) => {
    const text = el?.getAttribute("data-cursor-tag");
    if (el && text) {
      if (tag.textContent !== text) tag.textContent = text;
      if (active !== el) { x = tx; y = ty; }
      tag.classList.add("is-on");
    } else {
      tag.classList.remove("is-on");
    }
    active = el && text ? el : null;
  };
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") { tag.classList.remove("is-on"); return; }
    tx = e.clientX + 18; ty = e.clientY + 20;
    show(e.target instanceof Element ? e.target.closest("[data-cursor-tag]") : null);
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: true });
  document.addEventListener("pointerleave", () => show(null));
  // Labels that change with state (Expand/Close) refresh in place.
  new MutationObserver(() => { if (active) show(active); })
    .observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-cursor-tag"] });
}

/* ---------- copy: email and phone ----------------------------------------- */
function initCopy() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const label = btn.querySelector("[data-copy-label]");
    const reset = label?.textContent || "Copy";
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(value);
        btn.classList.add("is-done");
        if (label) label.textContent = "Copied";
      } catch {
        const target = btn.querySelector("[data-copy-value]");
        if (target) { const r = document.createRange(); r.selectNodeContents(target); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
        if (label) label.textContent = "Selected";
      }
      setTimeout(() => { btn.classList.remove("is-done"); if (label) label.textContent = reset; }, 1800);
    });
  });
}

/* ---------- 404: the top node slips off the span and hops back (1200ms) --- */
function initSlip() {
  const svg = document.querySelector("[data-slip]");
  if (!svg || reduced()) return;
  const node = svg.querySelector("[data-rest]");
  // Span: half-ellipse centred (160,150), rx 110, ry 90; node r 10, stroke 3.2.
  const cx = 160, cy = 150, rx = 110, ry = 90, off = 10 + 1.6, home = { x: 160, y: 48.4 };
  const onSpan = (deg) => {
    const t = (deg * Math.PI) / 180;
    const nx = Math.cos(t) / rx, ny = Math.sin(t) / ry, len = Math.hypot(nx, ny);
    return { x: cx + rx * Math.cos(t) + (nx / len) * off, y: cy - ry * Math.sin(t) - (ny / len) * off };
  };
  const frames = [];
  const push = (p, offset, easing) => frames.push({ transform: `translate(${(p.x - home.x).toFixed(2)}px, ${(p.y - home.y).toFixed(2)}px)`, offset, ...(easing ? { easing } : {}) });
  // Slip: slide down the right side of the span, gathering speed…
  for (let i = 0; i <= 8; i++) push(onSpan(90 - (i / 8) ** 2 * 52), 0.06 + (i / 8) * 0.3);
  // …leave it and drop a little…
  const last = onSpan(38);
  push({ x: last.x + 14, y: last.y + 16 }, 0.44);
  // …then hop back to the apex along an arc (ARC.hop's travel, sampled).
  const a = { x: last.x + 14, y: last.y + 16 };
  for (let i = 1; i <= 12; i++) {
    const t = i / 12, u = 1 - t, c = { x: a.x + 12, y: home.y - 34 };
    push({ x: u * u * a.x + 2 * u * t * c.x + t * t * home.x, y: u * u * a.y + 2 * u * t * c.y + t * t * home.y }, 0.5 + t * 0.5);
  }
  frames.unshift({ transform: "translate(0px, 0px)", offset: 0 });
  node.animate(frames, { duration: 1200, delay: 500, easing: "linear" });
  void ease;
}

initPrefs();
initSlip();
initNav();
initMenu();
initCursor();
initCopy();
initAnalytics();
