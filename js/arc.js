/* ==========================================================================
   ARC LABS — MOTION ENGINE
   Ported from the brand system's script.js (window.ARC) to an ES module.
   Geometry is unchanged: a span is half an ellipse that leaves each anchor
   from its inner side at centre height; the rest node sits tangent on the apex.

     spanPath()    geometry of a span
     spanPathTo()  a span whose apex follows a dragged node (= spanPath at rest)
     restCenter()  where the rest node sits
     draw()        a path draws from its first anchor to its second
     pop()         a node appears
     hop()         anything that moves between two points travels an arc
     signature()   anchors → span → lift
     loop()        the signature on repeat
     reduced()     true when motion should be reduced (OS setting or toggle)
   ========================================================================== */

const root = document.documentElement;

/* ---------- tokens read from CSS so JS and CSS never disagree ------------ */
export function token(name, fallback = "") {
  const v = getComputedStyle(root).getPropertyValue(name).trim();
  return v || fallback;
}
export function ms(name, fallback) {
  const v = token(name, "");
  if (!v) return fallback;
  return v.includes("ms") ? parseFloat(v) : parseFloat(v) * 1000;
}
export const ease = {
  span: () => token("--ease-span", "cubic-bezier(.65,0,.35,1)"),
  lift: () => token("--ease-lift", "cubic-bezier(.22,1,.36,1)"),
  enter: () => token("--ease-enter", "cubic-bezier(.16,1,.3,1)"),
  exit: () => token("--ease-exit", "cubic-bezier(.7,0,.84,0)"),
  standard: () => token("--ease-standard", "cubic-bezier(.45,0,.25,1)"),
};

// Motion is on by default (phones and desktop alike); only the on-page
// "Reduce motion" switch turns it off.
export function reduced() {
  return root.dataset.motion === "reduced";
}

/* ---------- geometry ------------------------------------------------------ */
// A span is half an ellipse rising from anchor (x0,y) to anchor (x1,y) with
// lift h. Pass the anchor radius r so it starts at each node's inner edge.
export function spanPath(x0, y, x1, h, r = 0) {
  const a = x0 + r, b = x1 - r, rx = Math.abs(b - a) / 2;
  return `M${a} ${y} A ${rx} ${h} 0 0 1 ${b} ${y}`;
}

// The same span, with its apex moved to (ax, y - h): two quarter-ellipses that
// meet with a horizontal tangent. At ax = midpoint it is identical to spanPath.
export function spanPathTo(x0, y, x1, ax, h, r = 0) {
  const a = x0 + r, b = x1 - r;
  const px = Math.min(b - 1, Math.max(a + 1, ax));
  const top = y - h;
  return `M${a} ${y} A ${px - a} ${h} 0 0 1 ${px} ${top} A ${b - px} ${h} 0 0 1 ${b} ${y}`;
}

// The rest node sits tangent on the apex: touching the stroke, never crossing it.
export function restCenter(x0, y, x1, h, r, stroke = 0) {
  return { x: (x0 + x1) / 2, y: y - h - stroke / 2 - r };
}

// Point on a quadratic arc between two points, lifted perpendicular to travel.
function arcPoint(a, b, lift, t) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  let nx = dy / len, ny = -dx / len;
  if (Math.abs(dx) >= Math.abs(dy)) { if (ny > 0) { nx = -nx; ny = -ny; } }
  else if (nx < 0) { nx = -nx; ny = -ny; }
  const cx = mx + nx * lift * 2, cy = my + ny * lift * 2;
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * cx + t * t * b.x, y: u * u * a.y + 2 * u * t * cy + t * t * b.y };
}

/* ---------- primitives ---------------------------------------------------- */
// Paths must carry pathLength="1".
export function draw(path, opts = {}) {
  path.style.strokeDasharray = "1 1";
  if (reduced()) { path.style.strokeDashoffset = "0"; return null; }
  return path.animate(
    [{ strokeDashoffset: opts.reverse ? 0 : 1 }, { strokeDashoffset: opts.reverse ? 1 : 0 }],
    { duration: opts.duration || ms("--duration-draw", 900), delay: opts.delay || 0, easing: opts.easing || ease.span(), fill: "both" }
  );
}

export function pop(el, opts = {}) {
  el.style.opacity = "";
  if (reduced()) return null;
  el.style.transformBox = "fill-box";
  el.style.transformOrigin = "center";
  return el.animate(
    [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
    { duration: opts.duration || ms("--duration-medium", 400), delay: opts.delay || 0, easing: ease.lift(), fill: "both" }
  );
}

// Things travel by arc. from/to are translate positions in px.
export function hop(el, from, to, opts = {}) {
  const end = `translate(${to.x}px,${to.y}px)`;
  if (el._hop) el._hop.cancel();
  if (reduced() || (from.x === to.x && from.y === to.y)) { el.style.transform = end; return null; }
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const lift = opts.lift ?? Math.max(6, Math.min(26, dist * 0.22));
  const frames = [];
  for (let i = 0; i <= 20; i++) {
    const p = arcPoint(from, to, lift, i / 20);
    frames.push({ transform: `translate(${p.x}px,${p.y}px)` });
  }
  el.style.transform = end;
  const anim = el.animate(frames, {
    duration: opts.duration || Math.max(260, Math.min(620, 220 + dist * 0.9)),
    easing: ease.span(),
  });
  el._hop = anim;
  return anim;
}

/* ---------- the signature: anchors → span → lift -------------------------- */
// Markup contract: [data-anchor] circles, [data-span] path (pathLength=1),
// [data-rest] circle, optional [data-lift-label] elements.
export function signature(svg, opts = {}) {
  if (!svg) return;
  const scope = opts.scope || svg;
  const anchors = svg.querySelectorAll("[data-anchor]");
  const span = svg.querySelector("[data-span]");
  const rest = svg.querySelector("[data-rest]");
  const labels = scope.querySelectorAll("[data-lift-label]");
  const delay = opts.delay || 0;
  const spanDuration = opts.spanDuration || ms("--duration-draw", 900);
  if (rest) rest.style.opacity = "";
  if (span) span.style.strokeDasharray = "1 1";
  if (reduced()) {
    if (span) span.style.strokeDashoffset = "0";
    return;
  }
  anchors.forEach((a, i) => pop(a, { delay: delay + i * 90, duration: 380 }));
  if (span) draw(span, { delay: delay + 260, duration: spanDuration });
  if (rest) {
    rest.style.transformBox = "fill-box";
    rest.style.transformOrigin = "center";
    const rise = opts.rise || 14;
    rest.animate(
      [{ transform: `translateY(${rise}px)`, opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
      { duration: 520, delay: delay + 260 + spanDuration - 120, easing: ease.lift(), fill: "both" }
    );
  }
  labels.forEach((l, i) => {
    l.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: delay + 500 + i * 220, easing: ease.standard(), fill: "both" });
  });
}

// The signature on repeat (kept from the engine; not used by any page's motion budget).
export function loop(svg) {
  const span = svg.querySelector("[data-span]");
  const rest = svg.querySelector("[data-rest]");
  if (!span || !rest) return;
  span.style.strokeDasharray = "1 1";
  (svg._loops || []).forEach((a) => a.cancel());
  if (reduced()) { span.style.strokeDashoffset = "0"; svg._loops = []; return; }
  const T = 1900, s = ease.span(), l = ease.lift();
  rest.style.transformBox = "fill-box"; rest.style.transformOrigin = "center";
  svg._loops = [
    span.animate([
      { strokeDashoffset: 1, offset: 0, easing: s },
      { strokeDashoffset: 0, offset: 0.42 },
      { strokeDashoffset: 0, opacity: 1, offset: 0.82 },
      { strokeDashoffset: 0, opacity: 0, offset: 1 },
    ], { duration: T, iterations: Infinity }),
    rest.animate([
      { transform: "translateY(8px)", opacity: 0, offset: 0 },
      { transform: "translateY(8px)", opacity: 0, offset: 0.38, easing: l },
      { transform: "translateY(0)", opacity: 1, offset: 0.6 },
      { transform: "translateY(0)", opacity: 1, offset: 0.82 },
      { transform: "translateY(0)", opacity: 0, offset: 1 },
    ], { duration: T, iterations: Infinity }),
  ];
}

/* ---------- once in view -------------------------------------------------- */
// Runs cb once, the first time el is in view. Content already on screen at load
// (or anything the reader jumps past) runs immediately, so nothing stays hidden.
export function onceInView(el, cb, { threshold = 0.1, rootMargin = "0px 0px -8% 0px" } = {}) {
  if (!el) return;
  if (!("IntersectionObserver" in window)) { cb(); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting || e.boundingClientRect.bottom < 0) { io.disconnect(); cb(); }
    }
  }, { threshold, rootMargin });
  io.observe(el);
}

// Safe storage that never throws (private windows, blocked storage).
export const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};
