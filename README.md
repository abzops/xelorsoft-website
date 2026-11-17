# Xelorsoft

Live: https://xelorsoft.com/ (GitHub Pages behind Cloudflare; www redirects to the apex; GitHub Pages copy at https://abzops.github.io/xelorsoft-website/)

The studio site: custom software, AI tools and websites for Kerala businesses, plus the studio's own products, XS Connect and XS Gym.

Built with [taste-skill](https://github.com/Leonxlnx/taste-skill) (non-AI-looking website rules). The product UI in the page (inbox, members list, notes, checklists) is real HTML, not screenshots.

## Files

- `index.html`: the whole page. Page-specific CSS sits in its `<style>` block.
- `assets/system.css`, `assets/system.js`: the taste-skill base (type, grid, sections, buttons, nav).
- `assets/ui/`, `assets/layout/`, `assets/motion/`, `assets/moments/`, `assets/diagrams/`, `assets/backgrounds/`, `assets/icons/`: kit files copied from taste-skill. Do not edit them; override in `index.html`.
- `assets/icons/*.svg`: real WhatsApp, Instagram, Facebook and LinkedIn marks (Iconify logos, simple-icons).
- `share.jpg`: the 1200×630 share image (a screenshot of the hero). `assets/menu-card.jpg`: the image in the Products menu.

GitHub Pages publishes the root of main. Preview with any static server, for example `python3 -m http.server`.

## Checking a change

Run the taste-skill gate before publishing visual changes:

```
node <taste-skill>/skills/taste-skill/scripts/gate.mjs index.html
```

Its working files go in `.taste-skill/` (gitignored).

No tracking cookies or external runtime dependencies. Cloudflare Web Analytics (cookieless) is injected at the edge. The enquiry form has no backend: it opens the visitor's email app addressed to info@xelorsoft.com.

Other files: `privacy.html`, `terms.html`, `404.html`, `page.css` for those pages, `sitemap.xml`, `robots.txt`, `site.webmanifest`, icons and `assets/og-image.png`. Brand assets belong to Xelorsoft; font licences are in assets/.
