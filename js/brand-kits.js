import { reduced, onceInView } from './arc.js';
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
const still = () => reduced() || systemMotion.matches;

// Client fonts are requested only when their chapter approaches the viewport.
onceInView(document.querySelector('.bk-cub'), () => {
  const style = document.createElement('style');
  style.textContent = [
    ['Cub Baloo', 'Baloo2-var', '400 800'],
    ['Cub Figtree', 'Figtree-var', '300 900'],
    ['Cub Mono', 'DMMono-Medium', '500'],
  ].map(([name, file, weight]) => `@font-face{font-family:"${name}";src:url("/assets/brand-kits/cub-and-co/fonts/${file}.woff2") format("woff2");font-weight:${weight};font-display:swap}`).join('');
  document.head.append(style);
}, { rootMargin: '600px 0px' });

const swatches = [...document.querySelectorAll('.bk-swatch')];
const colour = document.querySelector('.bk-colour');
const art = document.querySelector('.bk-colour__image');
const name = document.querySelector('.bk-colour__name');
let selection = 0, request = 0;
async function choose(index, focus = false) {
  selection = (index + swatches.length) % swatches.length;
  const button = swatches[selection];
  swatches.forEach((b) => {
    b.setAttribute('aria-pressed', String(b === button));
    b.tabIndex = b === button ? 0 : -1;
  });
  if (focus) button.focus({ preventScroll: true });
  const id = ++request;
  const img = new Image();
  img.src = `/assets/brand-kits/cub-and-co/colour/${button.dataset.colour}.svg`;
  try { await img.decode(); } catch { return; }
  if (id !== request) return;
  art.src = img.src;
  art.alt = `Cub & Co logo — ${button.dataset.name}`;
  colour.style.backgroundColor = button.dataset.ground;
  name.textContent = button.dataset.name;
  if (!still()) art.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350 });
}
swatches.forEach((b, i) => b.addEventListener('click', () => choose(i)));
const strip = document.querySelector('.bk-swatches');
strip.addEventListener('keydown', e => {
  let next;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = selection + 1;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = selection - 1;
  if (e.key === 'Home') next = 0;
  if (e.key === 'End') next = swatches.length - 1;
  if (next !== undefined) { e.preventDefault(); choose(next, true); }
});
let pointer = null;
strip.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  pointer = e.pointerId;
});
strip.addEventListener('pointermove', e => {
  if (e.pointerId !== pointer) return;
  const button = document.elementFromPoint(e.clientX, e.clientY)?.closest('.bk-swatch');
  if (button && strip.contains(button) && swatches.indexOf(button) !== selection) choose(swatches.indexOf(button));
});
const release = () => { pointer = null; };
window.addEventListener('pointerup', release);
window.addEventListener('pointercancel', release);

document.querySelectorAll('[data-bk-reveal]').forEach(el => onceInView(el, () => {
  el.classList.add('is-shown');
  if (!still()) {
    const pieces = el.querySelector('.bk-packaging')?.children || [el];
    [...pieces].forEach((piece, i) => piece.animate([
      { opacity: 0, transform: 'translateY(16px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 500, delay: i * 60, easing: 'ease-out' }));
  }
}, { threshold: 0.15 }));

const exhibition = document.querySelector('.bk-exhibition');
const chapters = [...document.querySelectorAll('[data-bk-chapter]')];
const rail = document.querySelector('.bk-rail');
let queued = false;
function progress() {
  queued = false;
  const r = exhibition.getBoundingClientRect();
  const active = chapters.findLast(el => el.getBoundingClientRect().top < innerHeight * .5) || chapters[0];
  rail.querySelector('[data-bk-active]').textContent = active.dataset.bkChapter;
  rail.style.setProperty('--bk-progress', still() ? 1 : Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))));
  // The entire exhibition owns the sticky rail, so it leaves with the chapter.
  rail.classList.toggle('is-active', r.top < 100 && r.bottom > 140);
}
function schedule() { if (!queued) { queued = true; requestAnimationFrame(progress); } }
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule);
function motionChanged() {
  if (still()) document.querySelectorAll('.bk-exhibition *').forEach(el => el.getAnimations().forEach(a => a.cancel()));
  schedule();
}
document.addEventListener('arc:motion', motionChanged);
systemMotion.addEventListener('change', motionChanged);
progress();
