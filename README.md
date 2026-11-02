# Xelorsoft

Live: https://abzops.github.io/xelorsoft-website/

A complete studio website covering the introduction, studio and audience, six services, project directions, working approach, scope and handover, applied AI, FAQs and contact.

The page is a scroll-driven, typography-led build on Carbon/Porcelain surfaces. All examples are project directions; no client case studies, testimonials or results are invented.

## Files

- `index.html`: the content (frozen, see below) plus `data-sc-*` scroll attributes.
- `site.css`, `site.js`: everything specific to this site (layout, motion, the travelling full stop).
- `scrollcraft.js`, `scrollcraft.css`: the scroll engine from [scroll-craft](https://github.com/nateherkai/scroll-craft) (MIT, licence in `assets/scrollcraft-MIT.txt`). Do not edit these; theme and extend from `site.*`.
- `docs/scroll-brief.md`: the scroll plan (journey, devices, feeling curve, signature move).

GitHub Pages publishes the root of main. Preview with any static server, for example `python3 -m http.server`.

## Content is frozen

Run `node scripts/check-content.mjs` before publishing. It compares every word, link, image alt and label, and the nine-section order, against `content-lock.json`. Markup and styling may change freely; copy may not. Regenerate the baseline with `--write` only for an explicit, owner-approved content change.

No analytics, forms or external runtime dependencies. Brand assets belong to Xelorsoft; font licences are in assets/.
