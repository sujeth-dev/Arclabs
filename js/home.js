/* ==========================================================================
   home.js — Home only: hero ARC (draw once + draggable Grow node).
   ========================================================================== */
import { signature, spanPath, spanPathTo, restCenter, reduced } from "./arc.js";

/* ---------- 01 · Hero ARC ------------------------------------------------- */
// Geometry matches the prototype: anchors at x 32 / 608 on y 272, node r 8,
// span lift 214, stroke 1.5 → the Grow node rests tangent on the apex.
const G = { x0: 32, x1: 608, y: 272, r: 8, lift: 214, stroke: 1.5, w: 640, h: 300 };

function initHero() {
  const fig = document.querySelector("[data-hero-arc]");
  if (!fig) return;
  const svg = fig.querySelector("svg");
  const span = svg.querySelector("[data-span]");
  const rest = svg.querySelector("[data-rest]");
  const grab = svg.querySelector("[data-grab]");
  const label = fig.querySelector("[data-grow-label]");
  const home = restCenter(G.x0, G.y, G.x1, G.lift, G.r, G.stroke);

  // Draws once on load: anchors → span → Grow lifts (900ms span).
  signature(svg, { scope: fig, delay: 150, rise: 18 });
  fig.classList.add("is-live");

  // Place the Grow node (and its label) at p, re-computing the span so the
  // node always rests tangent on its apex, like a cable under tension.
  const place = (p) => {
    const h = G.y - p.y - G.r - G.stroke / 2;
    span.setAttribute("d", Math.abs(p.x - home.x) < 0.01 && Math.abs(p.y - home.y) < 0.01
      ? spanPath(G.x0, G.y, G.x1, G.lift, G.r)
      : spanPathTo(G.x0, G.y, G.x1, p.x, h, G.r));
    for (const c of [rest, grab]) { c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); }
    label.style.left = `calc(${(p.x / G.w) * 100}% + 1.35rem)`;
    label.style.top = `${(p.y / G.h) * 100}%`;
  };
  // Keep the node above the anchors and between them.
  const clamp = (p) => ({
    x: Math.min(G.x1 - 70, Math.max(G.x0 + 70, p.x)),
    y: Math.min(G.y - 60, Math.max(-60, p.y)),
  });
  const toSvg = (e) => {
    const m = svg.getScreenCTM();
    if (!m) return home;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: pt.x, y: pt.y };
  };

  let pos = { ...home }, offset = { x: 0, y: 0 }, raf = 0, dragging = false;
  // Spring back: eased to rest, settling without overshoot (no bounce).
  const settle = () => {
    cancelAnimationFrame(raf);
    if (reduced()) { pos = { ...home }; place(pos); return; }
    const from = { ...pos }, t0 = performance.now();
    const dur = 600 + Math.min(400, Math.hypot(from.x - home.x, from.y - home.y));
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const k = 1 - Math.pow(1 - t, 4);
      pos = { x: from.x + (home.x - from.x) * k, y: from.y + (home.y - from.y) * k };
      place(pos);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  grab.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    // Finish the load-in so a quick grab starts from a complete figure.
    svg.getAnimations({ subtree: true }).forEach((a) => a.finish());
    fig.getAnimations({ subtree: true }).forEach((a) => a.finish());
    cancelAnimationFrame(raf);
    dragging = true;
    grab.setPointerCapture(e.pointerId);
    fig.classList.add("is-dragging");
    const p = toSvg(e);
    offset = { x: pos.x - p.x, y: pos.y - p.y };
  });
  grab.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const p = toSvg(e);
    pos = clamp({ x: p.x + offset.x, y: p.y + offset.y });
    place(pos);
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    fig.classList.remove("is-dragging");
    settle();
  };
  grab.addEventListener("pointerup", release);
  grab.addEventListener("pointercancel", release);
  grab.addEventListener("lostpointercapture", release);
}

initHero();
