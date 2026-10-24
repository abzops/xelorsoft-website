import { initRibbon } from './ribbon.js';

const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
  menu.querySelector('span').textContent = open ? '−' : '＋';
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); menu.querySelector('span').textContent = '＋'; }
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });

const concepts = {
  software: {
    kicker: 'A PLACE FOR EVERY NEXT STEP', title: 'Your work.<br>One clear view.',
    description: 'Bring requests, ownership and progress into a focused internal workspace. Help your team see what needs attention and what happens next.',
    cta: 'Build a tool around your team',
    demo: `<div class="dashboard"><div class="window-top"><div class="window-dots"><i></i><i></i><i></i></div><span class="mono">WORKSPACE / CONCEPT</span><span>↗</span></div><div class="dash-grid"><div class="dash-sidebar" aria-hidden="true"><b>◈</b><span>▦</span><span>☰</span><span>◇</span></div><div class="dash-main"><div class="dash-heading"><h4>Work overview</h4><span class="mono">YOUR WORKSPACE</span></div><div class="dash-stats"><div><span>Awaiting review</span><strong id="pending-count">03</strong></div><div><span>In progress</span><strong>02</strong></div><div><span>Completed here</span><strong id="completed-count">00</strong></div></div><div class="task"><button aria-label="Mark Website brief complete" aria-pressed="false"></button><span>Website brief</span><small>Review</small></div><div class="task"><button aria-label="Mark New enquiry complete" aria-pressed="false"></button><span>New enquiry</span><small>Review</small></div><div class="task"><button aria-label="Mark Product requirements complete" aria-pressed="false"></button><span>Product requirements</span><small>Review</small></div><p class="demo-help" aria-live="polite">Try it: check a task to update this workspace.</p></div></div></div>`
  },
  ai: {
    kicker: 'MAKE THE HANDOFF MAKE SENSE', title: 'Routine work.<br>A better route.',
    description: 'An enquiry arrives. An AI-assisted step suggests a category. A person reviews the suggestion before the request moves forward. Clear ownership throughout.',
    cta: 'Explore your next automation',
    demo: `<div class="workflow"><p class="mono">ILLUSTRATIVE ENQUIRY WORKFLOW</p><div class="flow-node"><span class="node-icon">↙</span><div><b>Enquiry received</b><small>Bring the request into one place</small></div><span class="tick">✓</span></div><div class="flow-connector">↓</div><div class="flow-node"><span class="node-icon">✳</span><div><b>AI-assisted sorting</b><small>Suggest a category and next owner</small></div><span class="tick">✓</span></div><div class="flow-connector">↓</div><div class="flow-node"><span class="node-icon">◎</span><div><b>Human review</b><small>A person checks before it proceeds</small></div><span class="tick">✓</span></div><button class="flow-run">Run the example →</button><p class="demo-help" id="flow-status" aria-live="polite">A visual simulation. No AI or external services are called.</p></div>`
  },
  web: {
    kicker: 'ONE PURPOSE. A CLEAR NEXT STEP.', title: 'A first impression.<br>With direction.',
    description: 'Help people understand your offer, find the information they need and make an enquiry. A focused journey that feels considered on every screen.',
    cta: 'Shape your digital presence',
    demo: `<div class="mini-site"><div class="window-top"><div class="window-dots"><i></i><i></i><i></i></div><span class="mono">ILLUSTRATIVE WEBSITE</span><span>↗</span></div><div class="mini-nav"><b>your next idea.</b><span>About &nbsp; / &nbsp; Contact</span></div><div class="mini-body"><div><h4>Something<br>worth building.</h4><p>A clear offer. A useful experience.<br>A place to begin.</p><button id="mini-enquiry" aria-expanded="false">Start a conversation ↗</button></div><div class="mini-art" aria-hidden="true"><b></b></div></div><div class="mini-confirm" role="status">One clear next step: share your idea.<br><a href="#contact"><u>Try the Xelorsoft brief builder ↗</u></a></div><div class="mini-footer">THOUGHTFUL DESIGN / PRACTICAL PURPOSE</div></div>`
  }
};
const tabs = [...document.querySelectorAll('[data-tab]')];
let flowTimer;
function selectConcept(key, focus = false) {
  clearTimeout(flowTimer);
  const concept = concepts[key];
  tabs.forEach(tab => { const selected = tab.dataset.tab === key; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected && focus) tab.focus(); });
  document.querySelector('#concept').setAttribute('aria-labelledby', `tab-${key}`);
  document.querySelector('#concept-kicker').textContent = concept.kicker;
  document.querySelector('#concept-title').innerHTML = concept.title;
  document.querySelector('#concept-description').textContent = concept.description;
  document.querySelector('#concept-cta').innerHTML = `${concept.cta} <span>↗</span>`;
  document.querySelector('#demo-area').innerHTML = concept.demo;
  document.querySelectorAll('.task button').forEach(button => button.addEventListener('click', () => {
    const done = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(done)); button.textContent = done ? '✓' : ''; button.closest('.task').classList.toggle('done', done);
    button.closest('.task').querySelector('small').textContent = done ? 'Complete' : 'Review';
    const count = document.querySelectorAll('.task.done').length;
    document.querySelector('#pending-count').textContent = String(3 - count).padStart(2, '0');
    document.querySelector('#completed-count').textContent = String(count).padStart(2, '0');
    document.querySelector('.demo-help').textContent = `${count} of 3 example tasks complete. Your overview updates with your work.`;
  }));
  document.querySelector('.flow-run')?.addEventListener('click', event => {
    const button = event.currentTarget; const nodes = [...document.querySelectorAll('.flow-node')];
    nodes.forEach(node => node.classList.remove('active')); button.disabled = true; button.textContent = 'Running example…';
    const stages = ['Enquiry received in the workspace.', 'A category is suggested for review.', 'Ready for a person to review. Nothing is automatically approved.'];
    let index = 0;
    const step = () => { nodes[index].classList.add('active'); document.querySelector('#flow-status').textContent = stages[index]; index++; if (index < nodes.length) flowTimer = setTimeout(step, 700); else { button.disabled = false; button.textContent = 'Run again ↻'; } };
    step();
  });
  document.querySelector('#mini-enquiry')?.addEventListener('click', event => { const expanded = event.currentTarget.getAttribute('aria-expanded') !== 'true'; event.currentTarget.setAttribute('aria-expanded', String(expanded)); document.querySelector('.mini-confirm').classList.toggle('visible', expanded); });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectConcept(tab.dataset.tab));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); selectConcept(tabs[next].dataset.tab, true);
  });
});
document.querySelectorAll('[data-select]').forEach(link => link.addEventListener('click', () => selectConcept(link.dataset.select)));
selectConcept('software');

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#brief-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget; const data = new FormData(form);
  const text = `Hello Xelorsoft!\n\nI’m thinking about: ${data.getAll('service').join(', ') || 'Exploring an idea'}\n\nWhat I’d like to build or improve:\n${String(data.get('goal')).trim()}\n\nTarget timing: ${data.get('timing')}\n\nLet’s discuss a useful starting point.`;
  const status = document.querySelector('#brief-status');
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = 'Brief copied. Open @xelorsoft above and paste it into a message.';
  } catch {
    status.textContent = 'Your browser couldn’t copy the brief. ';
    const download = document.createElement('button'); download.type = 'button'; download.textContent = 'Download the brief instead ↓'; download.className = 'download-brief';
    download.addEventListener('click', () => { const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'xelorsoft-project-brief.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
    status.append(download);
  }
});
initRibbon(document.querySelector('#ribbon'), document.querySelector('.motion-button'));
