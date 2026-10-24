import { initRibbon } from './ribbon.js?v=20261024-bespoke-1';

document.querySelector('#year').textContent = new Date().getFullYear();
initRibbon(document.querySelector('#ribbon'), document.querySelector('.motion-button'));

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const reveals = [...document.querySelectorAll('.reveal')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: .12, rootMargin: '0px 0px -15px 0px' });
function configure() {
  document.documentElement.classList.toggle('motion-ready', !reduced.matches);
  reveals.forEach(el => {
    if (reduced.matches || el.getBoundingClientRect().top < innerHeight * .95) el.classList.add('visible');
    else observer.observe(el);
  });
}
document.addEventListener('focusin', event => event.target.closest('.reveal')?.classList.add('visible'));
reduced.addEventListener('change', configure);
configure();
