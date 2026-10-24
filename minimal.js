import { prepareVisualPolish } from './visuals.js?v=1';
prepareVisualPolish();
document.querySelector('#year').textContent = new Date().getFullYear();
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); menu.querySelector('span').textContent = '＋'; }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); menu.querySelector('span').textContent = open ? '−' : '＋';
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const reveals = [...document.querySelectorAll('.reveal')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: .12, rootMargin: '0px 0px -15px 0px' });
function configure() {
  document.documentElement.classList.toggle('motion-ready', !reduced.matches);
  // Resolve the masked starting state before revealing above-the-fold content.
  document.documentElement.getBoundingClientRect();
  reveals.forEach(el => {
    if (reduced.matches || el.getBoundingClientRect().top < innerHeight * .95) el.classList.add('visible');
    else observer.observe(el);
  });
}
document.addEventListener('focusin', event => event.target.closest('.reveal')?.classList.add('visible'));
reduced.addEventListener('change', configure);
configure();
