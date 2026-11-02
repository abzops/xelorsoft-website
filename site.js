/* Xelorsoft · page behaviour.
   scrollcraft.js drives pinning, progress (--sc-p), reveals and the progress
   bar. This file holds what belongs to this site alone: the menu, masked
   headings, the services index and the travelling full stop.
   Presentation only. It never adds, removes or rewrites copy. */
(function () {
  'use strict';
  var root = document.documentElement;
  var motion = root.classList.contains('motion');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };

  $('#year').textContent = new Date().getFullYear();

  /* ---- menu ------------------------------------------------------------ */
  var menu = $('.menu-toggle'), nav = $('#navigation');
  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    menu.querySelector('span').textContent = open ? '−' : '＋';
  }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (menu.getAttribute('aria-expanded') === 'true' && !e.target.closest('.header')) setMenu(false);
  });

  /* ---- reduced motion: a calm static document --------------------------- */
  if (!motion) {
    $$('[data-sc-act="pin"],[data-sc-act="pan"]').forEach(function (s) { s.removeAttribute('data-sc-act'); });
    $$('[data-sc-pan]').forEach(function (el) { el.removeAttribute('data-sc-pan'); });
    $$('[data-sc-reveal]').forEach(function (el) { el.removeAttribute('data-sc-reveal'); });
  }

  /* ---- masked headings: each line rises from behind its own edge --------- */
  var splits = $$('h2.split, h3.split');
  splits.forEach(function (h) {
    var groups = [[]];
    Array.prototype.slice.call(h.childNodes).forEach(function (n) {
      if (n.nodeName === 'BR') groups.push([]); else groups[groups.length - 1].push(n);
    });
    h.textContent = '';
    groups.forEach(function (nodes, i) {
      var mask = document.createElement('span'), inner = document.createElement('span');
      mask.className = 'mask';
      inner.style.setProperty('--d', i * 90 + 'ms');
      nodes.forEach(function (n) { inner.appendChild(n); });
      mask.appendChild(inner); h.appendChild(mask);
    });
  });
  function show(h) { if (!h.classList.contains('on')) { h.classList.add('on'); h.__onAt = performance.now(); } }
  if (motion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.2 });
    splits.forEach(function (h) { io.observe(h); });
    document.addEventListener('focusin', function (e) { var h = e.target.closest && e.target.closest('section'); if (h) $$('.split', h).forEach(show); });
  } else splits.forEach(show);

  /* ---- the engine ------------------------------------------------------ */
  if (window.ScrollCraft) ScrollCraft.mount(document.body);
  var progressOf = function (el) { return parseFloat(el.style.getPropertyValue('--sc-p')) || 0; };

  /* ---- services index: the wheel steps through the six services --------- */
  var services = $('.services'), items = $$('.service', services);
  var activeService = -1;
  function paintServices() {
    var i = motion ? clamp(Math.floor(progressOf(services) * items.length), 0, items.length - 1) : -1;
    if (i === activeService) return;
    activeService = i;
    items.forEach(function (el, k) { el.classList.toggle('is-active', k === i); });
  }
  if (motion) {
    // A keyboard visitor lands on the service they tabbed to.
    items.forEach(function (el, k) {
      el.addEventListener('focus', function () {
        var travel = services.offsetHeight - innerHeight;
        var top = services.getBoundingClientRect().top + scrollY + travel * (k + 0.5) / items.length;
        if (Math.abs(top - scrollY) > 2) scrollTo({ top: top, behavior: 'instant' });
      });
    });
  }

  /* ---- where am I: the nav underlines the section in view --------------- */
  var navLinks = $$('#navigation a');
  var tracked = navLinks.map(function (a) { return $(a.hash); }).filter(Boolean);
  function paintNav() {
    var current = null;
    tracked.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s; });
    navLinks.forEach(function (a) {
      if (current && a.hash === '#' + current.id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  /* ---- the travelling full stop ----------------------------------------
     Xelorsoft's wordmark ends on a full stop, and so does almost every
     heading on this page. One dot travels with the reader: it lands as the
     period of the heading being read, and when the next heading arrives it
     lifts off, stretches along its path and drops into place there. The last
     landing is the dot of the closing question mark. */
  var stops = $$('.stop');
  var dot = null;
  if (motion && stops.length) {
    dot = document.createElement('div');
    dot.className = 'fullstop';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
  }

  // Exact glyph geometry, measured from the font itself: render the character
  // large, then find the lowest separate blob of ink (the period, or the
  // point of a question mark). Cached per face and character.
  var glyphCache = {};
  function glyph(style, ch) {
    var key = style.fontWeight + '|' + style.fontFamily + '|' + ch;
    if (glyphCache[key]) return glyphCache[key];
    var S = 200, pad = 40, c = document.createElement('canvas');
    c.width = S + pad * 2; c.height = S * 1.6 + pad * 2;
    var x = c.getContext('2d', { willReadFrequently: true });
    x.font = style.fontWeight + ' ' + S + 'px ' + style.fontFamily;
    var m = x.measureText(ch), base = pad + S * 1.2;
    x.fillText(ch, pad, base);
    var d = x.getImageData(0, 0, c.width, c.height).data, W = c.width;
    var ink = function (px, py) { return d[(py * W + px) * 4 + 3] > 110; };
    var rowHas = function (py) { for (var px = 0; px < W; px++) if (ink(px, py)) return true; return false; };
    var y1 = c.height - 1; while (y1 > 0 && !rowHas(y1)) y1--;
    var y0 = y1; while (y0 > 0 && rowHas(y0 - 1)) y0--;
    var x0 = W, x1 = 0;
    for (var py = y0; py <= y1; py++) for (var px = 0; px < W; px++) if (ink(px, py)) { if (px < x0) x0 = px; if (px > x1) x1 = px; }
    var g = {
      x: (x0 - pad) / S, y: (y0 - base) / S, w: (x1 - x0 + 1) / S, h: (y1 - y0 + 1) / S,
      asc: m.fontBoundingBoxAscent / S, box: (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent) / S
    };
    return (glyphCache[key] = g);
  }

  // Where a stop's dot sits on screen right now, or null if it is not legible.
  function place(s) {
    var r = s.getBoundingClientRect();
    if (r.bottom < -40 || r.top > innerHeight + 40 || !r.height) return null;
    var host = s.parentElement, cs = getComputedStyle(host);
    var g = glyph(cs, s.textContent);
    var em = r.height / g.box;               // includes any scale applied by a parent
    return {
      x: r.left + g.x * em, y: r.top + (g.asc + g.y) * em, w: g.w * em, h: g.h * em,
      color: cs.color
    };
  }

  // A heading is ready for its full stop once it is actually legible.
  function ready(s) {
    var h = s.closest('h1,h2,h3');
    if (h.classList.contains('split')) return h.classList.contains('on') && performance.now() - (h.__onAt || 0) > 450;
    if (h.id === 'hero-title') return performance.now() - t0 > 1250;
    if (h.id === 'ai-title') return progressOf(h.closest('section')) > 0.6;
    var wipe = s.closest('[data-sc-reveal]');
    if (wipe) { var n = (wipe.style.clipPath.match(/[\d.]+%/) || ['100'])[0]; return parseFloat(n) < 1; }
    return true;
  }

  var t0 = performance.now();
  var state = { target: null, attached: false, flight: null, x: 0, y: -100, w: 0, h: 0, shown: false };
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  function pickTarget() {
    var best = null, firstVisible = null;
    for (var i = 0; i < stops.length; i++) {
      var s = stops[i]; if (!ready(s)) continue;
      var p = place(s); if (!p || p.y < 0 || p.y > innerHeight) continue;
      if (!firstVisible) firstVisible = s;
      if (p.y < innerHeight * 0.68) best = s;
    }
    return best || firstVisible;
  }

  function draw(x, y, w, h, stretch, angle) {
    dot.style.width = w + 'px'; dot.style.height = h + 'px';
    dot.style.borderRadius = Math.min(w, h) * 0.32 + 'px';
    dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)' +
      (stretch ? ' rotate(' + angle + 'rad) scale(' + (1 + stretch * 0.9) + ',' + (1 - stretch * 0.3) + ') rotate(' + -angle + 'rad)' : '');
  }

  function paintDot(now) {
    var next = pickTarget();
    if (next && next !== state.target) {
      var from = state.shown ? { x: state.x, y: state.y, w: state.w, h: state.h } : null;
      if (state.target) state.target.classList.remove('is-waiting');
      state.target = next; state.attached = false;
      if (next.textContent === '.') next.classList.add('is-waiting');
      var p0 = place(next);
      if (!from) from = { x: p0.x, y: Math.max(-40, p0.y - innerHeight * 0.45), w: p0.w, h: p0.h };
      state.flight = { from: from, start: now, dur: 620 };
      dot.style.backgroundColor = p0.color;
    }
    if (!state.target) { if (state.shown) { dot.style.opacity = '0'; state.shown = false; } return; }
    var p = place(state.target);
    if (!p) { dot.style.opacity = '0'; state.shown = false; return; }
    if (!state.shown) { dot.style.opacity = '1'; state.shown = true; }
    if (state.flight) {
      var F = state.flight, t = clamp((now - F.start) / F.dur, 0, 1), e = ease(t);
      var dx = p.x - F.from.x, dy = p.y - F.from.y;
      var arc = Math.sin(Math.PI * t) * Math.min(140, Math.hypot(dx, dy) * 0.22);
      state.x = F.from.x + dx * e; state.y = F.from.y + dy * e - arc;
      state.w = F.from.w + (p.w - F.from.w) * e; state.h = F.from.h + (p.h - F.from.h) * e;
      draw(state.x, state.y, state.w, state.h, Math.sin(Math.PI * t), Math.atan2(dy, dx));
      if (t >= 1) { state.flight = null; state.attached = true; state.target.classList.remove('is-waiting'); }
      return;
    }
    state.x = p.x; state.y = p.y; state.w = p.w; state.h = p.h;
    dot.style.backgroundColor = p.color;
    draw(p.x, p.y, p.w, p.h, 0, 0);
  }

  /* ---- one loop -------------------------------------------------------- */
  var fontsReady = false;
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { fontsReady = true; glyphCache = {}; });
  function frame(now) {
    paintServices();
    paintNav();
    if (dot && fontsReady) paintDot(now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
