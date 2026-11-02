// Frozen-content guard.
// The page's markup may change for presentation, but the words, links, image
// text and the nine-section order may not. This reads index.html, reduces the
// <body> to an ordered stream of what a visitor reads or follows, and compares
// it with content-lock.json.
//
//   node scripts/check-content.mjs            check (exit 1 on any difference)
//   node scripts/check-content.mjs --write    rewrite the baseline (owner-approved content changes only)
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const lockUrl = new URL('content-lock.json', root);
const html = readFileSync(new URL('index.html', root), 'utf8').replace(/\r\n/g, '\n');

export function contentStream(source) {
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1];
  if (!body) throw new Error('Page body missing');
  const clean = body
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const tokens = [];
  let text = '';
  const flush = () => { const t = text.replace(/\s+/g, ' ').trim(); if (t) tokens.push(t); text = ''; };
  const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const tag = /<(\/?)([a-z0-9]+)([^>]*)>/gi;
  let last = 0, m;
  const sections = [];
  while ((m = tag.exec(clean))) {
    text += decode(clean.slice(last, m.index));
    last = tag.lastIndex;
    const [, closing, name, attrs] = m;
    const lower = name.toLowerCase();
    if (lower === 'br') { text += ' '; continue; }
    if (closing) continue;
    if (lower === 'section') sections.push((attrs.match(/\bid="([^"]+)"/) || [])[1] || '');
    for (const key of ['href', 'alt', 'aria-label']) {
      const v = attrs.match(new RegExp(`\\s${key}="([^"]*)"`));
      if (v) { flush(); tokens.push(`[${key}=${decode(v[1])}]`); }
    }
  }
  text += decode(clean.slice(last));
  flush();
  return { tokens, sections };
}

const { tokens, sections } = contentStream(html);
// Whitespace between elements depends on how the markup is indented, not on
// what is written, so the comparison ignores it. Every character still counts.
const squash = list => list.map(t => t.replace(/\s+/g, ''));
const hash = createHash('sha256').update(JSON.stringify(squash(tokens))).digest('hex');

if (process.argv.includes('--write')) {
  const lock = { contentSha256: hash, sections: sections.length, sectionIds: sections, tokens };
  writeFileSync(lockUrl, JSON.stringify(lock, null, 2) + '\n');
  console.log(`Baseline written: ${tokens.length} content tokens, ${sections.length} sections.`);
  process.exit(0);
}

const lock = JSON.parse(readFileSync(lockUrl, 'utf8'));
if (hash !== lock.contentSha256 || sections.length !== lock.sections) {
  const expected = squash(lock.tokens), found = squash(tokens);
  const i = found.findIndex((t, k) => t !== expected[k]);
  console.error('Frozen content changed. Content edits require an explicit owner request and an updated baseline.');
  if (sections.length !== lock.sections) console.error(`Sections: expected ${lock.sections}, found ${sections.length}.`);
  if (i >= 0) console.error(`First difference at token ${i}:\n  expected: ${lock.tokens[i]}\n  found:    ${tokens[i]}`);
  else if (found.length !== expected.length) console.error(`Token count: expected ${lock.tokens.length}, found ${tokens.length}.`);
  process.exit(1);
}
console.log(`PASS: frozen content unchanged; ${tokens.length} content tokens, all ${sections.length} sections in order.`);
