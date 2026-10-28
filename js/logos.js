import { logos } from '../data/logos.js';
import { reduced } from './arc.js';

const cards = [...document.querySelectorAll('.marks .mark-card')];
const dialog = document.querySelector('.mark-viewer');
let current = 0;
let returnFocus;
const stage = dialog.querySelector('.mark-viewer__stage');
const image = stage.querySelector('img');
function show(index) {
  current = (index + logos.length) % logos.length;
  const logo = logos[current];
  image.src = `/assets/logos/${logo.slug}.webp`;
  image.alt = `${logo.name} logo`;
  image.width = logo.width;
  image.height = logo.height;
  stage.style.background = logo.bg;
  document.querySelector('#mark-viewer-title').textContent = logo.name;
  dialog.querySelector('[data-mark-count]').textContent = `${String(current + 1).padStart(2, '0')} / 10`;
}
cards.forEach((card, index) => {
  card.querySelector('a').addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    returnFocus = event.currentTarget;
    show(index);
    dialog.showModal();
    document.documentElement.classList.add('mark-viewer-open');
  });
});
dialog.querySelector('[data-mark-close]').addEventListener('click', () => dialog.close());
dialog.querySelector('[data-mark-prev]').addEventListener('click', () => show(current - 1));
dialog.querySelector('[data-mark-next]').addEventListener('click', () => show(current + 1));
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  document.documentElement.classList.remove('mark-viewer-open');
  returnFocus?.focus({ preventScroll: true });
});
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    document.querySelector('[data-mark-current]').textContent = String(cards.indexOf(entry.target) + 1).padStart(2, '0');
    if (!entry.target.dataset.seen) {
      entry.target.dataset.seen = 'true';
      if (!reduced() && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        entry.target.animate([{ opacity: .3, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    }
  }
}, { threshold: .25 });
cards.forEach(card => observer.observe(card));
