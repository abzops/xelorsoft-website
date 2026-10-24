// Native scrolling: event-driven rendering, no scroll interception or external runtime.
export function initScrollExperience() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const header = document.querySelector('.header');
  const story = document.querySelector('.scroll-story');
  const storyLines = [...document.querySelectorAll('.story-line')];
  const hero = document.querySelector('.hero');
  const heroArt = document.querySelector('.hero-art');
  const heroCopy = document.querySelector('.hero-copy');
  const steps = document.querySelector('.steps');
  const progress = document.createElement('div');
  progress.className = 'reading-progress'; progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
  document.querySelectorAll('h1, .section h2').forEach(heading => {
    const label = heading.innerText.replace(/\s+/g, ' ').trim();
    const groups = [[]];
    [...heading.childNodes].forEach(node => {
      if (node.nodeName === 'BR') groups.push([]);
      else groups[groups.length - 1].push(node.cloneNode(true));
    });
    heading.replaceChildren(); heading.setAttribute('aria-label', label);
    heading.classList.add('reveal-heading');
    groups.forEach((nodes, index) => {
      const line = document.createElement('span'); line.className = 'reveal-line'; line.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span'); inner.className = 'reveal-inner';
      inner.style.setProperty('--line-delay', `${index * 95}ms`);
      inner.append(...nodes); line.append(inner); heading.append(line);
    });
  });
  const reveals = [...document.querySelectorAll('.reveal-heading, .section-top, .intro > p, .explore-heading > p, .service, .also, .tabs, .concept, .steps article, .faq > div:first-child > .mono, .questions details, .contact-grid > div > p, .social-contact, #brief-form, .footer-top')];
  reveals.forEach(el => {
    el.classList.add('scroll-reveal');
    if (el.matches('.service, .steps article, .questions details')) el.style.setProperty('--reveal-delay', `${[...el.parentElement.children].indexOf(el) * 75}ms`);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    });
  }, { threshold: .08, rootMargin: '0px 0px -35px 0px' });
  document.addEventListener('focusin', event => event.target.closest('.scroll-reveal')?.classList.add('is-revealed'));
  const sections = [...document.querySelectorAll('main > section[id]')];
  let scheduled = 0;
  function paint() {
    scheduled = 0;
    const height = innerHeight;
    const pageRange = root.scrollHeight - height;
    const scroll = window.scrollY;
    progress.style.transform = `scaleX(${pageRange > 0 ? clamp(scroll / pageRange) : 0})`;
    header.classList.toggle('is-scrolled', scroll > 40);
    let current = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top < height * .46) current = section.id; });
    document.querySelectorAll('#navigation a').forEach(link => {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (reduced.matches) return;
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.bottom > 0) {
      const p = clamp(-heroRect.top / heroRect.height);
      heroArt.style.setProperty('--hero-shift', `${p * 90}px`);
      heroArt.style.setProperty('--hero-turn', `${p * 8}deg`);
      heroCopy.style.setProperty('--copy-shift', `${p * 35}px`);
    }
    const rect = story.getBoundingClientRect();
    const p = clamp(-rect.top / Math.max(1, story.offsetHeight - height));
    story.style.setProperty('--story-progress', p);
    storyLines.forEach((line, index) => {
      const local = clamp((p * 3.3 - index) / .8);
      line.style.setProperty('--line-fill', `${local * 100}%`);
      line.style.setProperty('--line-shift', `${(1 - local) * 16}px`);
    });
    document.querySelector('.story-count').textContent = `${String(Math.min(3, Math.floor(p * 3) + 1)).padStart(2, '0')} / 03`;
    steps.style.setProperty('--process-progress', clamp((height * .85 - steps.getBoundingClientRect().top) / (height * .5)));
  }
  function schedule() { if (!scheduled) scheduled = requestAnimationFrame(paint); }
  function configure() {
    root.classList.toggle('motion-ready', !reduced.matches);
    if (reduced.matches) {
      reveals.forEach(el => el.classList.add('is-revealed'));
      heroArt.style.removeProperty('--hero-shift'); heroArt.style.removeProperty('--hero-turn'); heroCopy.style.removeProperty('--copy-shift');
    } else {
      // Resolve the initial masked state so the hero has the same entrance rhythm.
      root.getBoundingClientRect();
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < innerHeight * .94 && rect.bottom > 0) el.classList.add('is-revealed');
        else observer.observe(el);
      });
    }
    schedule();
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  reduced.addEventListener('change', configure);
  new ResizeObserver(schedule).observe(document.body);
  configure();
}
