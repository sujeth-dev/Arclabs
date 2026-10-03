/* ==========================================================================
   lab.js — Lab cards (hover recordings), the Lab File dialog, the /lab filter.
   Loaded on Home, /lab and /elements (Related work opens a file).
   ========================================================================== */
import { projects, domain } from "../data/content.js";
import { reduced, ms, ease, spanPath, restCenter } from "./arc.js";
import { track } from "./analytics.js";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ordered = [...projects].sort((a, b) => a.order - b.order);

/* ---------- placeholder plate (until real captures exist, TODO T1) -------- */
function plateHTML(p, extra = "") {
  const pl = p.plate;
  const links = (pl.links || []).map((l) => `<span>${esc(l)}</span>`).join("");
  let body = pl.eyebrow ? `<div class="plate__eyebrow">${esc(pl.eyebrow)}</div>` : "";
  body += `<div class="plate__title">${esc(pl.title)}</div>`;
  if (pl.cta) body += `<div class="plate__cta">${esc(pl.cta)}</div>`;
  if (pl.ticker) body += `<div class="plate__ticker">${pl.ticker.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`;
  return `<div class="plate plate--${pl.key}${extra}" aria-hidden="true"><div class="plate__nav"><span class="plate__brand">${esc(pl.brand)}</span><span class="plate__links">${links}</span></div><div class="plate__body">${body}</div></div>`;
}

// <picture> with AVIF + WebP at 1x/2x. `src` is a base path without extension,
// e.g. "/media/velmont/desktop-full" → desktop-full.avif, desktop-full@2x.avif …
function pictureHTML(src, alt, { lazy = true } = {}) {
  const set = (ext) => `${src}.${ext} 1x, ${src}@2x.${ext} 2x`;
  return `<picture><source type="image/avif" srcset="${set("avif")}"><source type="image/webp" srcset="${set("webp")}"><img src="${src}.webp" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ""}></picture>`;
}

/* ---------- Formula: a small ARC — two anchors, the solution rises ------- */
function formulaHTML(f) {
  const W = 320, y = 46, r = 5, lift = 30;
  const rc = restCenter(r, y, W - r, lift, r, 1.5);
  return `<div class="formula">
    <p class="formula__solution">${esc(f.solution)}</p>
    <svg viewBox="0 0 ${W} 56" aria-hidden="true" focusable="false">
      <path class="span-path" d="${spanPath(r, y, W - r, lift, r)}" style="stroke-width:1.5px"/>
      <circle class="span-node" cx="${r}" cy="${y}" r="${r}"/><circle class="span-node" cx="${W - r}" cy="${y}" r="${r}"/>
      <circle class="span-node" cx="${rc.x}" cy="${rc.y}" r="${r}"/>
    </svg>
    <p class="formula__a">${esc(f.problem)}</p><p class="formula__b">${esc(f.context)}</p>
    <p class="visually-hidden">${esc(f.problem)} plus ${esc(f.context)} leads to ${esc(f.solution)}</p>
  </div>`;
}

/* ---------- Viewer: Desktop / Mobile tabs ----------------------------------- */
function viewerHTML(p) {
  const desk = p.screens.desktop.length
    ? p.screens.desktop.map((src, i) => pictureHTML(src, `${p.name} homepage, desktop`, { lazy: i > 0 })).join("")
    : `<div class="viewer__plate">${plateHTML(p)}</div>`;
  const video = p.video
    ? `<video class="viewer__video" muted loop playsinline preload="none" poster="${esc(p.poster || "")}" aria-label="${esc(p.name)} homepage recording, desktop"><source src="${esc(p.video.webm)}" type="video/webm"><source src="${esc(p.video.mp4)}" type="video/mp4"></video>`
    : "";
  const mob = p.screens.mobile.length
    ? p.screens.mobile.map((src) => pictureHTML(src, `${p.name} homepage, mobile`)).join("")
    : `<div class="viewer__plate">${plateHTML(p, " plate--mobile")}</div>`;
  const url = domain(p.liveUrl) || p.name;
  const chrome = `<div class="frame__chrome" aria-hidden="true"><span class="frame__dots"><i></i><i></i><i></i></span><span class="frame__url">${esc(url)}</span></div>`;
  return `<div class="viewer">
    <div class="viewer__tabs" role="tablist" aria-label="Screens">
      <button class="viewer__tab" type="button" role="tab" id="vt-desktop" aria-selected="true" aria-controls="vp-desktop">Desktop</button>
      <button class="viewer__tab" type="button" role="tab" id="vt-mobile" aria-selected="false" aria-controls="vp-mobile" tabindex="-1">Mobile</button>
    </div>
    <div class="viewer__panel" role="tabpanel" id="vp-desktop" aria-labelledby="vt-desktop">
      <div class="frame">${chrome}<div class="viewer__scroll" role="region" data-drag-scroll data-cursor="drag" tabindex="0" aria-label="${esc(p.name)} desktop screens, scrollable">${video}${desk}</div></div>
    </div>
    <div class="viewer__panel" role="tabpanel" id="vp-mobile" aria-labelledby="vt-mobile" hidden>
      <div class="frame viewer__phone">${chrome}<div class="viewer__scroll" role="region" data-drag-scroll data-cursor="drag" tabindex="0" aria-label="${esc(p.name)} mobile screens, scrollable">${mob}</div></div>
    </div>
  </div>`;
}

function bodyHTML(p) {
  const i = ordered.indexOf(p);
  const prev = ordered[(i - 1 + ordered.length) % ordered.length];
  const next = ordered[(i + 1) % ordered.length];
  const rows = [
    ["Hypothesis", `<p>${esc(p.hypothesis)}</p>`],
    ["Formula", formulaHTML(p.formula)],
    p.protocol.length ? ["Protocol", `<ol role="list">${p.protocol.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`] : null,
    ["Inside the Lab", `<p>${esc(p.insideTheLab)}</p>`],
    ["Result", `<p>${esc(p.result)}</p>`],
  ].filter(Boolean);
  const live = p.liveUrl
    ? `<a class="btn" href="${esc(p.liveUrl)}" target="_blank" rel="noopener">Visit live site: ${esc(domain(p.liveUrl))}<span class="visually-hidden"> (opens in a new tab)</span></a>`
    : "";
  return `<p class="lab-file__line t-lead">${esc(p.line)}</p>
    <div class="lab-file__body grid">
      <dl class="lab-file__record record">${rows.map(([k, v]) => `<div class="record__row"><dt class="label">${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      <div class="lab-file__viewer">${viewerHTML(p)}</div>
    </div>
    <div class="lab-file__foot">
      ${live}
      <div class="lab-file__pager">
        <button class="btn btn--ghost" type="button" data-file-go="${prev.slug}" aria-label="Previous file: ${esc(prev.name)}">Previous file</button>
        <button class="btn btn--ghost" type="button" data-file-go="${next.slug}" aria-label="Next file: ${esc(next.name)}">Next file</button>
      </div>
    </div>`;
}

/* ---------- the dialog ---------------------------------------------------- */
function initDialog() {
  const dlg = document.getElementById("lab-file");
  if (!dlg || typeof dlg.showModal !== "function") return;
  const f = (k) => dlg.querySelector(`[data-f="${k}"]`);
  let current = null, opener = null, busy = false;

  // The arch: the top half of an ellipse sitting on the card's bottom edge.
  const archFrom = (el) => {
    const r = el?.getBoundingClientRect();
    if (r && r.width && r.bottom > 0 && r.top < innerHeight) {
      return { cx: r.left + r.width / 2, cy: Math.min(r.bottom, innerHeight), rx: r.width / 2, ry: Math.max(40, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) };
    }
    return { cx: innerWidth / 2, cy: innerHeight, rx: innerWidth / 4, ry: 60 };
  };
  const archTo = (a) => {
    const R = Math.hypot(Math.max(a.cx, innerWidth - a.cx), Math.max(a.cy, innerHeight - a.cy)) * 1.15;
    return { ...a, rx: R, ry: R };
  };
  const clip = (a) => `ellipse(${a.rx}px ${a.ry}px at ${a.cx}px ${a.cy}px)`;
  const arch = (from, to) => dlg.animate([{ clipPath: clip(from) }, { clipPath: clip(to) }],
    { duration: ms("--duration-open", 600), easing: ease.span(), fill: "forwards" });

  const cardFor = (slug) => document.querySelector(`.lab-card[data-file="${slug}"] [data-open-file]`);

  function render(p) {
    current = p;
    const stamp = f("stamp");
    stamp.dataset.status = p.status === "Live" ? "live" : "ready";
    stamp.innerHTML = `<span class="node" aria-hidden="true"></span>File ${esc(p.file)} · ${esc(p.status)}`;
    f("sector").textContent = p.sector;
    f("name").innerHTML = `${esc(p.name)}`;
    f("body").innerHTML = bodyHTML(p);
    dlg.scrollTop = 0;
    initViewer(dlg);
    const v = dlg.querySelector(".viewer__video");
    if (v && !reduced()) v.play().catch(() => {});
    history.replaceState(null, "", `${location.pathname}${location.search}#file-${p.slug}`);
    track("file_opened", { file: p.slug });
  }

  function open(slug, from) {
    const p = projects.find((x) => x.slug === slug);
    if (!p) return;
    if (dlg.open) { render(p); return; }
    opener = from || null;
    render(p);
    dlg.showModal();
    if (!reduced()) {
      const a = archFrom(from);
      arch(a, archTo(a)).finished.then((an) => { an.commitStyles?.(); an.cancel(); dlg.style.clipPath = ""; }).catch(() => {});
    }
  }

  async function close() {
    if (!dlg.open || busy) return;
    busy = true;
    const target = cardFor(current?.slug) || opener;
    if (!reduced()) {
      const a = archFrom(target);
      try { await arch(archTo(a), a).finished; } catch { /* interrupted */ }
    }
    dlg.close();
    dlg.getAnimations().forEach((an) => an.cancel());
    history.replaceState(null, "", location.pathname + location.search);
    (target && document.contains(target) ? target : opener)?.focus({ preventScroll: true });
    busy = false;
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest?.("[data-open-file]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    open(a.dataset.openFile, a);
  });
  dlg.addEventListener("click", (e) => {
    if (e.target.closest("[data-file-close]")) return void close();
    const go = e.target.closest("[data-file-go]");
    if (go) return void open(go.dataset.fileGo);
    // Clicking outside the panel's content (the dialog's own margins) closes it.
    if (e.target === dlg) close();
  });
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); close(); });

  // Swipe between files on touch screens.
  let sx = 0, sy = 0;
  dlg.addEventListener("touchstart", (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
  dlg.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 2 || !current) return;
    const i = ordered.indexOf(current);
    open(ordered[(i + (dx < 0 ? 1 : -1) + ordered.length) % ordered.length].slug);
  }, { passive: true });

  const fromHash = () => {
    const m = location.hash.match(/^#file-([\w-]+)$/);
    if (m && projects.some((p) => p.slug === m[1])) open(m[1], cardFor(m[1]));
  };
  window.addEventListener("hashchange", fromHash);
  fromHash();
}

/* ---------- viewer: tabs + drag to scroll ---------------------------------- */
function initViewer(scope) {
  const tabs = [...scope.querySelectorAll('[role="tab"]')];
  const select = (t, focus) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute("aria-selected", String(on));
      x.tabIndex = on ? 0 : -1;
      scope.querySelector(`#${x.getAttribute("aria-controls")}`).hidden = !on;
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });
  scope.querySelectorAll("[data-drag-scroll]").forEach((el) => {
    let y0 = 0, s0 = 0, on = false;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      on = true; y0 = e.clientY; s0 = el.scrollTop;
      el.setPointerCapture(e.pointerId); el.classList.add("is-dragging");
    });
    el.addEventListener("pointermove", (e) => { if (on) el.scrollTop = s0 - (e.clientY - y0); });
    const end = () => { on = false; el.classList.remove("is-dragging"); };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  });
}

/* ---------- card recordings: hover (fine pointer) or in view (touch) ------- */
function initCardVideos() {
  const vids = document.querySelectorAll(".lab-card video[data-src-mp4]");
  if (!vids.length) return;
  const load = (v) => {
    if (v.dataset.loaded) return;
    v.dataset.loaded = "1";
    v.innerHTML = `<source src="${v.dataset.srcWebm}" type="video/webm"><source src="${v.dataset.srcMp4}" type="video/mp4">`;
    v.load();
  };
  const play = (v) => { if (reduced()) return; load(v); v.play().then(() => v.classList.add("is-playing")).catch(() => {}); };
  const stop = (v) => { v.pause(); v.classList.remove("is-playing"); };
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) {
    vids.forEach((v) => {
      const card = v.closest(".lab-card");
      card.addEventListener("pointerenter", () => play(v));
      card.addEventListener("pointerleave", () => stop(v));
    });
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? play(e.target) : stop(e.target))), { threshold: 0.6 });
    vids.forEach((v) => io.observe(v));
  }
}

/* ---------- /lab filter: cards fade and re-order (400ms) ------------------- */
function initFilter() {
  const grid = document.querySelector("[data-lab-grid]");
  const btns = [...document.querySelectorAll(".filter__btn")];
  const status = document.querySelector("[data-filter-status]");
  if (!grid || !btns.length) return;
  const cards = [...grid.querySelectorAll(".lab-card")];
  const apply = (value) => {
    const dur = reduced() ? 0 : ms("--duration-medium", 400);
    const before = new Map(cards.filter((c) => !c.hidden).map((c) => [c, c.getBoundingClientRect()]));
    cards.forEach((c) => { c.getAnimations().forEach((a) => a.cancel()); c.hidden = value !== "All" && c.dataset.filter !== value; });
    grid.classList.toggle("is-filtered", value !== "All");
    btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === value)));
    const shown = cards.filter((c) => !c.hidden);
    if (status) status.textContent = `${shown.length} ${shown.length === 1 ? "file" : "files"}${value === "All" ? "" : ` in ${value}`}`;
    if (!dur) return;
    for (const c of shown) {
      const b = before.get(c), a = c.getBoundingClientRect();
      if (b) {
        c.animate([{ transform: `translate(${b.left - a.left}px, ${b.top - a.top}px)` }, { transform: "none" }], { duration: dur, easing: ease.standard() });
      } else {
        c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, easing: ease.standard() });
      }
    }
  };
  btns.forEach((b) => b.addEventListener("click", () => {
    if (b.getAttribute("aria-pressed") === "true") return;
    apply(b.dataset.filter);
    track("filter_used", { filter: b.dataset.filter });
  }));
}

initCardVideos();
initFilter();
initDialog();
