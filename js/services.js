import { elements } from '../data/content.js';
import { mountServiceDemo } from './elements.js';
import { track } from './analytics.js';
const rows = [...document.querySelectorAll('[data-capability]')];
function enhance(row) {
  const capability = elements.find(e => e.slug === row.dataset.capability);
  const demo = row.querySelector('[data-service-demo]');
  if (demo) mountServiceDemo(demo, capability);
}
rows.forEach(row => row.addEventListener('toggle', () => {
  if (!row.open) return;
  enhance(row);
  track('capability_opened', { capability: row.dataset.capability });
}));
function fromHash() {
  const row = rows.find(row => '#' + row.id === location.hash);
  if (!row) return;
  row.open = true;
  enhance(row);
  requestAnimationFrame(() => row.scrollIntoView({ block: 'start' }));
}
addEventListener('hashchange', fromHash);
fromHash();
// Same-anchor links also reopen a capability that the visitor collapsed.
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
  if (a.hash === location.hash) fromHash();
}));

// End running demo motion immediately when a preference changes.
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
const settleDemos = () => {
  if (systemMotion.matches || document.documentElement.dataset.motion === 'reduced') {
    document.querySelectorAll('.demo').forEach(demo => demo.getAnimations({subtree:true}).forEach(a => { if (a.effect?.getComputedTiming().endTime === Infinity) a.cancel(); else a.finish(); }));
  }
};
document.addEventListener('arc:motion', settleDemos);
systemMotion.addEventListener('change', settleDemos);
