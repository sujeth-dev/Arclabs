/* ==========================================================================
   home.js — Home only: hero ARC (draw once + draggable Grow node),
   Approach technical ARC and Process line (each draws once in view).
   ========================================================================== */
import { signature, spanPath, spanPathTo, restCenter, reduced, draw, pop, ms, ease, onceInView, store } from "./arc.js";

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
  const hint = fig.querySelector("[data-drag-hint]");
  const home = restCenter(G.x0, G.y, G.x1, G.lift, G.r, G.stroke);

  // Draws once on load. When the whole hero is on screen, the headline's three
  // full stops travel into the ARC: Design and Build become the anchors, the
  // span draws between them, then Grow's stop rises onto the apex.
  // Otherwise (scrolled, or reduced motion) the plain signature plays.
  // Waits for the fonts so the stops are measured where they finally sit.
  let flights = [];
  (document.fonts?.ready || Promise.resolve()).then(() => {
    flights = intro(fig, svg) || (signature(svg, { scope: fig, delay: 150, rise: 18 }), []);
    fig.classList.add("is-live");
    // Scrolling mid-flight would leave the dots behind: land them at once.
    if (flights.length) addEventListener("scroll", () => flights.forEach((a) => a.finish()), { once: true, passive: true });
  });
  initHint(fig);

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
    if (hint) { hint.style.left = `${(p.x / G.w) * 100}%`; hint.style.top = `${(p.y / G.h) * 100}%`; }
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
    flights.forEach((a) => a.finish());
    svg.getAnimations({ subtree: true }).forEach((a) => a.finish());
    fig.getAnimations({ subtree: true }).forEach((a) => a.finish());
    cancelAnimationFrame(raf);
    dragging = true;
    hideHint(fig);
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

// The stop dot is the ::after of .stop: .19em wide, .02em in, .015em up.
function stopDot(stop) {
  const r = stop.getBoundingClientRect(), fs = parseFloat(getComputedStyle(stop).fontSize);
  const size = 0.19 * fs;
  return { x: r.left + 0.02 * fs + size / 2, y: r.bottom - 0.015 * fs - size / 2, size };
}
function intro(fig, svg) {
  if (reduced() || scrollY > 4) return null;
  const title = document.querySelector(".hero__title");
  const stops = [...title.querySelectorAll(".stop")];
  const anchors = [...svg.querySelectorAll("[data-anchor]")];
  const rest = svg.querySelector("[data-rest]");
  const span = svg.querySelector("[data-span]");
  const targets = [anchors[0], anchors[1], rest];
  const box = fig.getBoundingClientRect();
  if (stops.length !== 3 || box.bottom > innerHeight || box.top < 0) return null;
  const labels = [...fig.querySelectorAll("[data-lift-label]")];
  [...targets, ...labels].forEach((el) => (el.style.opacity = "0"));
  span.style.strokeDasharray = "1 1"; span.style.strokeDashoffset = "1";
  title.classList.add("is-lifting");
  const dur = 950, T0 = 250;
  const starts = [T0, T0 + 120, T0 + 1050];           // Grow leaves as the span draws
  const flights = stops.map((stop, i) => {
    const a = stopDot(stop), t = targets[i].getBoundingClientRect();
    const b = { x: t.left + t.width / 2, y: t.top + t.height / 2, size: t.width };
    const dot = document.createElement("span");
    dot.className = "hero__fly";
    dot.setAttribute("aria-hidden", "true");
    Object.assign(dot.style, { width: `${a.size}px`, height: `${a.size}px`, marginLeft: `${-a.size / 2}px`, marginTop: `${-a.size / 2}px` });
    document.body.appendChild(dot);
    // An arc between the two points, shrinking to the node's size.
    const lift = Math.min(140, Math.hypot(b.x - a.x, b.y - a.y) * 0.25);
    const frames = Array.from({ length: 21 }, (_, k) => {
      const u = k / 20, x = a.x + (b.x - a.x) * u, y = a.y + (b.y - a.y) * u - lift * 4 * u * (1 - u);
      return { transform: `translate(${x}px, ${y}px) scale(${1 + (b.size / a.size - 1) * u})` };
    });
    const anim = dot.animate(frames, { duration: dur, delay: starts[i], easing: ease.span(), fill: "both" });
    anim.finished.catch(() => {}).then(() => { targets[i].style.opacity = ""; dot.remove(); });
    return anim;
  });
  draw(span, { delay: T0 + 120 + dur - 60, duration: ms("--duration-draw", 900) });
  labels.forEach((l, i) => l.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: T0 + dur + i * 220, easing: ease.standard(), fill: "both" }).finished.then(() => (l.style.opacity = "")));
  Promise.all(flights.map((f) => f.finished.catch(() => {}))).then(() => title.classList.remove("is-lifting"));
  return flights;
}

/* "Drag me" until the first drag (remembered per browser). */
function initHint(fig) {
  const hint = fig.querySelector("[data-drag-hint]");
  if (!hint || store.get("arc-dragged") === "1") return;
  hint.hidden = false;
  if (!reduced()) hint.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 2600, easing: ease.standard(), fill: "backwards" });
}
function hideHint(fig) {
  const hint = fig.querySelector("[data-drag-hint]");
  if (!hint || hint.hidden) return;
  hint.classList.add("is-gone");
  store.set("arc-dragged", "1");
}

/* ---------- 04 · Approach: the measured ARC draws once in view (700ms) ---- */
function initApproach() {
  const fig = document.querySelector("[data-tech]");
  if (!fig) return;
  onceInView(fig, () => {
    // Shown first: if an animation cannot run, the drawing is still there.
    fig.classList.add("is-live");
    const dur = ms("--duration-slow", 700);
    try {
      fig.querySelectorAll("[data-pop]").forEach((n, i) => pop(n, { delay: i === 2 ? dur : i * 90, duration: 380 }));
      fig.querySelectorAll("[data-draw]").forEach((p) => draw(p, { delay: 120, duration: dur }));
    } catch { /* drawing already visible */ }
  });
}

/* ---------- 05 · Process: one thin line draws once in view (700ms) -------- */
function initProcess() {
  const el = document.querySelector("[data-process]");
  if (el) onceInView(el, () => el.classList.add("is-live"));
}

// Each part starts on its own, so one failing can never leave another undrawn.
for (const init of [initApproach, initProcess, initHero]) {
  try { init(); } catch (err) { console.error(err); }
}
