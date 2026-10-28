import { reduced, onceInView } from './arc.js';

// Third-party content loads only when the reader gets near it.
onceInView(document.querySelector('.growth-posts'), () => {
  const s = document.createElement('script');
  s.src = 'https://www.instagram.com/embed.js';
  s.async = true;
  document.body.append(s);
}, { rootMargin: '600px 0px' });
document.querySelectorAll('iframe[data-src]').forEach((frame) => {
  onceInView(frame, () => { frame.src = frame.dataset.src; frame.nextElementSibling?.remove(); }, { rootMargin: '400px 0px' });
});

// Brand work comes into colour as it reaches the middle of the screen; the launch steps fill as they pass.
const develop = [...document.querySelectorAll('[data-develop]')];
const launch = document.querySelector('.launch');
const steps = launch ? [...launch.querySelectorAll('.launch__steps li')] : [];
const fill = launch?.querySelector('.launch__fill');
let ticking = false;
function frame() {
  ticking = false;
  const vh = innerHeight;
  for (const el of develop) {
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.55)));
    el.style.setProperty('--p', p.toFixed(3));
  }
  if (!launch) return;
  const line = vh * 0.6;
  const list = launch.querySelector('.launch__steps').getBoundingClientRect();
  fill.style.setProperty('--fill', Math.min(1, Math.max(0, (line - list.top) / list.height)).toFixed(3));
  steps.forEach((li) => li.classList.toggle('is-on', li.getBoundingClientRect().top < line));
}
function track() {
  const on = !reduced();
  launch?.classList.toggle('is-tracking', on);
  if (on) frame();
  else {
    develop.forEach((el) => el.style.removeProperty('--p'));
    fill?.style.removeProperty('--fill');
  }
}
addEventListener('scroll', () => { if (!reduced() && !ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
addEventListener('resize', () => !reduced() && frame());
document.addEventListener('arc:motion', track);
track();

// Mass campaigns: the launch card goes out to whichever channel is chosen.
const reach = document.querySelector('.reach');
if (reach) {
  const buttons = [...reach.querySelectorAll('[data-channel]')];
  const tiles = [...reach.querySelectorAll('.reach__tile span')];
  const card = reach.querySelector('[data-reach-to]');
  let timer;
  const send = (button) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    const fill = () => {
      button.dataset.channel.split('|').forEach((name, i) => { tiles[i].textContent = name; });
      card.textContent = button.dataset.to;
      reach.classList.add('is-sent');
    };
    clearTimeout(timer);
    if (reduced()) { fill(); return; }
    reach.classList.remove('is-sent');
    timer = setTimeout(fill, 220);
  };
  buttons.forEach((b) => b.addEventListener('click', () => send(b)));
  onceInView(reach, () => send(buttons[0]), { threshold: 0.3 });
}

// SEO: the search types itself once.
const search = document.querySelector('[data-type]');
if (search) {
  const text = search.dataset.type;
  if (reduced()) search.textContent = text;
  else onceInView(search, () => {
    let i = 0;
    const step = () => { search.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(step, 55 + Math.random() * 70); };
    setTimeout(step, 300);
  }, { threshold: 1 });
}
