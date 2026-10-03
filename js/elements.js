/* ==========================================================================
   elements.js — /elements: accordion rows (one open), mini-demos, deep links.
   ========================================================================== */
import { elements, projects, process, bySlug } from "../data/content.js";
import { reduced, ms, ease } from "./arc.js";
import { track } from "./analytics.js";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
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
  pin: () => `<div class="demo demo--pin" aria-hidden="true">${chrome}<div class="demo__stage">
      <div class="demo__result"><span class="demo__bar demo__bar--strong" style="inline-size:60%"></span><span class="demo__bar"></span><span class="demo__bar" style="inline-size:75%"></span></div></div>
      <svg class="demo__pin" data-step style="--d:150" viewBox="0 0 24 36"><circle cx="12" cy="9" r="8" fill="currentColor"/><path d="M12 17 V36" stroke="currentColor" stroke-width="2"/></svg></div>`,
  bars: () => `<div class="demo demo--bars" aria-hidden="true">${chrome}<div class="demo__stage">
      <span class="demo__col" data-step style="--h:40%;--d:0"></span><span class="demo__col" data-step style="--h:65%;--d:140"></span><span class="demo__col" data-step style="--h:90%;--d:280"></span></div></div>`,
  slider: () => `<div class="demo demo--slider">${chrome}
      <div class="demo__layer demo__before" aria-hidden="true"><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span><span class="demo__bar"></span></div>
      <div class="demo__layer demo__after" aria-hidden="true"><span class="demo__nav"><span class="demo__bar demo__bar--strong" style="inline-size:3rem"></span><span><i></i><i></i><i></i></span></span><span class="demo__bar demo__bar--strong" style="block-size:1.25rem;margin-top:1rem"></span><span class="demo__bar demo__bar--strong" style="inline-size:70%;justify-self:end;block-size:1.25rem"></span><span class="demo__btn" style="justify-self:end">Button</span></div>
      <input class="demo__range" type="range" min="0" max="100" value="50" aria-label="Before and after: move to compare" data-cursor="drag">
      <span class="demo__divider" aria-hidden="true"></span>
      <span class="demo__tags label" aria-hidden="true"><span>Before</span><span>After</span></span></div>`,
};

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
    else setTimeout(() => { add.animate([{ opacity: 1 }, { opacity: .6 }, { opacity: 1 }], { duration: 240 }); tick(); }, 500);
  }
  const range = demo.querySelector(".demo__range");
  if (range) {
    const set = (v) => demo.style.setProperty("--split", `${v}%`);
    range.addEventListener("input", () => set(range.value));
    if (!instant) {
      // Plays once: the split sweeps across, then rests in the middle.
      const t0 = performance.now(), dur = 1100;
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const v = t < .5 ? 50 + 35 * Math.sin(t * 2 * Math.PI) : 50 - 25 * Math.sin((t - .5) * 2 * Math.PI);
        set(v.toFixed(1));
        if (t < 1) requestAnimationFrame(step); else set(50);
      };
      requestAnimationFrame(step);
    }
  }
}

/* ---------- panel content (from data/content.js) -------------------------- */
function panelHTML(e) {
  const fact = (k, v) => `<div><dt class="label">${k}</dt><dd>${v}</dd></div>`;
  const works = e.worksWellWith.map((w) => {
    const o = bySlug(elements, w.with);
    return `<a class="link" href="#${o.slug}">${esc(o.name)} → ${esc(w.result)}</a>`;
  }).join("");
  const related = e.relatedWork.map((slug) => {
    const p = bySlug(projects, slug);
    return `<a class="link" href="/lab/#file-${p.slug}" data-open-file="${p.slug}" data-cursor-tag="Open file">${esc(p.name)}</a>`;
  }).join("");
  const includes = `<ul class="el-panel__list" role="list">${e.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>${e.includesNote ? `<p class="t-small t-muted" style="margin-top:.5rem">${esc(e.includesNote)}</p>` : ""}`;
  return `<div class="el-panel">
    <div>${DEMOS[e.demo]()}</div>
    <div>
      <dl class="el-panel__facts">
        ${fact("What it solves", esc(e.solves))}
        ${fact("What’s included", includes)}
        ${fact("Works well with", `<span class="el-panel__links">${works}</span>`)}
        ${related ? fact("Related work", `<span class="el-panel__links">${related}</span>`) : ""}
        ${fact("How it works", `<ol class="el-panel__steps" role="list">${process.map((s) => `<li>${s}</li>`).join("")}</ol>`)}
      </dl>
      <a class="btn" style="margin-top:2rem" href="/?need=${e.slug}#contact">Start this project</a>
    </div>
  </div>`;
}

/* ---------- accordion: one row open at a time ------------------------------ */
function initAccordion() {
  const rows = [...document.querySelectorAll(".el-row")];
  if (!rows.length) return;
  const parts = (row) => ({ btn: row.querySelector(".el-row__btn"), panel: row.querySelector(".el-row__panel") });

  const animateHeight = (panel, from, to) => {
    if (reduced()) return Promise.resolve();
    return panel.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: ms("--duration-medium", 400), easing: ease.standard() }).finished.catch(() => {});
  };
  const close = async (row) => {
    const { btn, panel } = parts(row);
    if (btn.getAttribute("aria-expanded") !== "true") return;
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("data-cursor-tag", "Expand");
    await animateHeight(panel, panel.offsetHeight, 0);
    if (btn.getAttribute("aria-expanded") === "false") panel.hidden = true;
  };
  const open = (row, { scroll = false } = {}) => {
    const { btn, panel } = parts(row);
    if (btn.getAttribute("aria-expanded") === "true") return;
    rows.filter((r) => r !== row).forEach(close);
    const e = elements.find((x) => x.slug === row.dataset.element);
    if (!panel.dataset.ready) { panel.innerHTML = panelHTML(e); panel.dataset.ready = "1"; }
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("data-cursor-tag", "Close");
    panel.hidden = false;
    animateHeight(panel, 0, panel.offsetHeight);
    playDemo(panel);
    history.replaceState(null, "", `#${e.slug}`);
    track("element_opened", { element: e.slug });
    if (scroll) row.scrollIntoView({ block: "start", behavior: reduced() ? "auto" : "smooth" });
  };
  rows.forEach((row) => parts(row).btn.addEventListener("click", () => {
    if (parts(row).btn.getAttribute("aria-expanded") === "true") {
      close(row);
      history.replaceState(null, "", location.pathname);
    } else open(row);
  }));

  // #<slug> opens that row (on load, and from "Works well with" links).
  const fromHash = () => {
    const row = rows.find((r) => `#${r.id}` === location.hash);
    if (row) open(row, { scroll: true });
  };
  window.addEventListener("hashchange", fromHash);
  fromHash();
}

initAccordion();
