import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const lock = JSON.parse(readFileSync(new URL('content-lock.json', root), 'utf8'));
const html = readFileSync(new URL('index.html', root), 'utf8').replace(/\r\n/g, '\n');
const body = html.match(/<body>([\s\S]*?)<\/body>/)?.[1];
if (!body) throw new Error('Page body missing');
const hash = createHash('sha256').update(body).digest('hex');
const sections = (body.match(/<section\b/g) || []).length;
if (hash !== lock.bodySha256 || sections !== lock.sections) {
  throw new Error('Frozen content changed. Content edits require an explicit owner request and an updated baseline.');
}
console.log(`PASS: frozen body unchanged; all ${sections} sections preserved.`);
