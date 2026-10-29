/* ==========================================================================
   elements.js — established service demonstrations, enhanced by services.js.
   ========================================================================== */
import { reduced as siteReduced, ms, ease } from "./arc.js";

const reduced = () => siteReduced() || matchMedia('(prefers-reduced-motion: reduce)').matches;

const chrome = `<div class="demo__chrome" aria-hidden="true"><i></i><i></i><i></i></div>`;

/* ---------- mini-demos ---------------------------------------------------- */
// Each is a small diagram of the service. [data-step] parts appear in order
// (--d = delay in ms); the demo plays once, the first time its row opens.
const DEMOS = {
  frame: () => `<div class="demo demo--frame" aria-hidden="true">${chrome}<div class="demo__stage">
      <div class="demo__nav" data-step style="--d:0"><span class="demo__bar demo__bar--strong" style="inline-size:3rem"></span><span><i></i><i></i><i></i></span></div>
      <span class="demo__bar demo__bar--strong" data-step style="--d:260;inline-size:80%;margin-top:1.5rem;block-size:1.25rem"></span>
      <span class="demo__bar demo__bar--strong" data-step style="--d:340;inline-size:55%;block-size:1.25rem"></span>
      <span class="demo__btn" data-step style="--d:600">Button</span></div></div>`,
  cart: () => `<div class="demo demo--cart">${chrome}
      <span class="demo__cart"><span aria-hidden="true">Cart</span><span class="demo__count" data-count aria-live="polite" aria-label="Items in cart: 0">0</span></span>
      <div class="demo__stage"><span class="demo__img" aria-hidden="true"></span>
      <div style="display:grid;gap:.5rem" ><span class="demo__bar demo__bar--strong" aria-hidden="true"></span><span class="demo__bar" style="inline-size:60%" aria-hidden="true"></span>
      <button class="demo__btn" type="button" data-add style="margin-top:.75rem">Add to cart</button></div></div></div>`,
  bubble: () => `<div class="demo demo--bubble">${chrome}<div class="demo__stage">
      <span class="demo__bar" style="inline-size:50%" aria-hidden="true"></span>
      <p class="demo__bubble" data-step style="--d:150">Hi, I’d like to book…</p></div></div>`,
  pin: () => `<div class="demo demo--search" aria-hidden="true">${chrome}<div class="demo__stage">
      <div class="demo__query"><span class="demo__glass"></span><span data-type="interior designers near me"></span><i class="demo__caret"></i></div>
      <div class="demo__serp">
        <ol class="demo__results" data-results>
          <li class="demo__res"><span class="demo__bar demo__bar--strong" style="inline-size:55%"></span><span class="demo__bar" style="inline-size:85%"></span></li>
          <li class="demo__res"><span class="demo__bar demo__bar--strong" style="inline-size:45%"></span><span class="demo__bar" style="inline-size:70%"></span></li>
          <li class="demo__res demo__res--you" data-you><span class="demo__res-name">Your business</span><span class="demo__stars">★★★★★</span><span class="demo__chips"><span>Call</span><span>Directions</span><span>Website</span></span></li>
        </ol>
        <div class="demo__map"><svg class="demo__pin" viewBox="0 0 24 36"><circle cx="12" cy="9" r="8" fill="currentColor"/><path d="M12 17 V36" stroke="currentColor" stroke-width="2"/></svg></div>
      </div></div></div>`,
  bars: () => `<div class="demo demo--board" aria-hidden="true">${chrome}<div class="demo__stage">
      <div class="demo__cols">
        ${[["New", 3], ["Contacted", 1], ["Booked", 1]].map(([name, n], c) => `<div class="demo__lane"><span class="demo__lane-head">${name}<b data-lane-count>${n}</b></span><div class="demo__lane-body" data-lane="${c}">${
          Array.from({ length: n }, (_, i) => `<span class="demo__card"${c === 0 && i === 0 ? " data-card-a" : ""}${c === 1 ? " data-card-b" : ""}><span class="demo__bar demo__bar--strong"></span><span class="demo__bar" style="inline-size:60%"></span></span>`).join("")}</div></div>`).join("")}
      </div>
      <p class="demo__toast" data-toast><span class="node"></span>Follow-up sent automatically</p></div></div>`,
  slider: () => `<div class="demo demo--slider">${chrome}
      <div class="demo__layer demo__before" aria-hidden="true"><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span></div>
      <div class="demo__layer demo__after" aria-hidden="true"><span class="demo__nav"><span class="demo__bar demo__bar--strong" style="inline-size:3rem"></span><span><i></i><i></i><i></i></span></span><span class="demo__bar demo__bar--strong" style="block-size:1.25rem;margin-top:1rem"></span><span class="demo__bar demo__bar--strong" style="inline-size:70%;justify-self:end;block-size:1.25rem"></span><span class="demo__btn" style="justify-self:end">Button</span></div>
      <input class="demo__range" type="range" min="0" max="100" value="50" aria-label="Before and after: move to compare" data-cursor="drag">
      <span class="demo__divider" aria-hidden="true"></span>
      <span class="demo__tags label" aria-hidden="true"><span>Before</span><span>After</span></span></div>`,
};

/* Move an element into a new parent and glide it there (FLIP). */
function moveTo(el, parent, before = null, instant = false) {
  const a = el.getBoundingClientRect();
  parent.insertBefore(el, before);
  if (instant || reduced()) return;
  const b = el.getBoundingClientRect();
  el.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: "none" }],
    { duration: ms("--duration-medium", 400), easing: ease.lift() });
}
const later = (fn, t, instant) => (instant ? fn() : setTimeout(fn, t));

// Custom Systems: an enquiry moves New → Contacted, another Contacted → Booked,
// the counts update and an automatic follow-up is noted.
function playBoard(demo, instant) {
  const lanes = [...demo.querySelectorAll("[data-lane]")];
  const counts = () => lanes.forEach((l) => (l.parentElement.querySelector("[data-lane-count]").textContent = String(l.children.length)));
  later(() => { moveTo(demo.querySelector("[data-card-b]"), lanes[2], lanes[2].firstChild, instant); counts(); }, 500, instant);
  later(() => { moveTo(demo.querySelector("[data-card-a]"), lanes[1], lanes[1].firstChild, instant); counts(); }, 1100, instant);
  later(() => demo.querySelector("[data-toast]").classList.add("is-on"), 1700, instant);
}

// Digital Presence: a local search is typed, then your business rises to the
// top with its actions, and a pin drops on the map.
function playSearch(demo, instant) {
  const field = demo.querySelector("[data-type]");
  const text = field.dataset.type;
  const list = demo.querySelector("[data-results]");
  const you = demo.querySelector("[data-you]");
  const finish = () => { moveTo(you, list, list.firstChild, instant); demo.classList.add("is-found"); };
  if (instant) { field.textContent = text; finish(); return; }
  let i = 0;
  const type = () => { if (reduced()) { field.textContent = text; finish(); return; } field.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(type, 38); else setTimeout(finish, 350); };
  setTimeout(type, 250);
}

function playDemo(root) {
  const demo = root.querySelector(".demo");
  if (!demo || demo.dataset.played) return;
  demo.dataset.played = "1";
  const instant = reduced();
  if (instant) demo.querySelectorAll("[data-step]").forEach((el) => (el.style.transition = "none"));
  // Next frame so the hidden state paints first, then the parts settle in.
  requestAnimationFrame(() => requestAnimationFrame(() => demo.classList.add("is-done")));

  const count = demo.querySelector("[data-count]");
  const add = demo.querySelector("[data-add]");
  if (count && add) {
    let n = 0;
    const tick = () => { n++; count.textContent = String(n); count.setAttribute("aria-label", `Items in cart: ${n}`); };
    add.addEventListener("click", tick);
    if (instant) { n = 1; count.textContent = "1"; count.setAttribute("aria-label", "Items in cart: 1"); }
    else setTimeout(() => { if (!reduced()) add.animate([{ opacity: 1 }, { opacity: .6 }, { opacity: 1 }], { duration: 240 }); tick(); }, 500);
  }
  if (demo.classList.contains("demo--board")) playBoard(demo, instant);
  if (demo.classList.contains("demo--search")) playSearch(demo, instant);
  const range = demo.querySelector(".demo__range");
  if (range) {
    const set = (v) => demo.style.setProperty("--split", `${v}%`);
    range.addEventListener("input", () => set(range.value));
    if (!instant) {
      // Plays once: the split sweeps across, then rests in the middle.
      const t0 = performance.now(), dur = 1100;
      const step = (now) => {
        if (reduced()) { set(50); return; }
        const t = Math.min(1, (now - t0) / dur);
        const v = t < .5 ? 50 + 35 * Math.sin(t * 2 * Math.PI) : 50 - 25 * Math.sin((t - .5) * 2 * Math.PI);
        set(v.toFixed(1));
        if (t < 1) requestAnimationFrame(step); else set(50);
      };
      requestAnimationFrame(step);
    }
  }
}

// Services keeps the established demonstrations as optional enhancements.
export function mountServiceDemo(root, capability) {
  if (!capability.demo || root.childElementCount) return;
  root.innerHTML = DEMOS[capability.demo]();
  playDemo(root);
}
