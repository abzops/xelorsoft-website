// Presentation only: preserve the wording, links and order of every section.
export function prepareVisualPolish() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const heroCopy = document.querySelector('.hero-copy');
  const sections = [...document.querySelectorAll('main > section[id]')];
  const navLinks = [...document.querySelectorAll('#navigation a')];

  document.querySelectorAll('h1,h2').forEach(heading => {
    const label = heading.innerText.replace(/\s+/g, ' ').trim();
    const groups = [[]];
    [...heading.childNodes].forEach(node => {
      if (node.nodeName === 'BR') groups.push([]);
      else groups[groups.length - 1].push(node.cloneNode(true));
    });
    heading.replaceChildren();
    heading.classList.add('reveal','masked-heading');
    heading.setAttribute('aria-label', label);
    groups.forEach((nodes,index) => {
      const mask = document.createElement('span');
      mask.className = 'heading-mask'; mask.setAttribute('aria-hidden','true');
      const inner = document.createElement('span'); inner.className = 'heading-inner';
      inner.style.setProperty('--line-delay', `${index * 85}ms`);
      inner.append(...nodes); mask.append(inner); heading.append(mask);
    });
  });
  document.querySelectorAll('.hero-copy > p,.hero-cta').forEach((el,index) => {
    el.classList.add('reveal'); el.style.setProperty('--reveal-delay',`${180 + index * 90}ms`);
  });
  document.querySelectorAll('.audiences,.detail-grid,.process-list').forEach(group => {
    [...group.children].forEach((el,index) => el.style.setProperty('--reveal-delay',`${index * 65}ms`));
  });

  const progress = document.createElement('div');
  progress.className = 'page-progress'; progress.setAttribute('aria-hidden','true');
  document.body.append(progress);
  let frame = 0;
  const clamp = value => Math.max(0,Math.min(1,value));
  function paint() {
    frame = 0;
    // Read layout together before updating presentation properties.
    const scroll = scrollY;
    const max = root.scrollHeight - innerHeight;
    const heroRect = hero.getBoundingClientRect();
    const sectionPositions = sections.map(section => ({id:section.id,top:section.getBoundingClientRect().top}));
    let current = '';
    sectionPositions.forEach(section => { if(section.top < innerHeight * .4) current = section.id; });
    navLinks.forEach(link => {
      if(link.hash === `#${current}`) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
    progress.style.transform = `scaleX(${max > 0 ? clamp(scroll / max) : 0})`;
    if(!reduced.matches && heroRect.bottom > 0) {
      const p = clamp(-heroRect.top / heroRect.height);
      heroCopy.style.setProperty('--hero-lift',`${-p * 20}px`);
      hero.style.setProperty('--hero-light',String(1 - p * .7));
    }
  }
  function schedule() { if(!frame) frame = requestAnimationFrame(paint); }
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  reduced.addEventListener('change',schedule);
  new ResizeObserver(schedule).observe(document.body);
  schedule();
}
