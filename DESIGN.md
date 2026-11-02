# Design direction

The owner requested a more complete explanation of Xelorsoft while retaining a sleek visual style.

Nine sections: hero, studio and audiences, six services, project directions, approach, scope/handover, applied AI, FAQ and contact. The earlier minimal version remains in Git history.

Preserve the approved logo and Manrope. Carbon #171719 and Porcelain #F6F6F4 form the two main surfaces. Supporting text is #ADADB4 on dark and #606068 on light. Use open rows, editorial splits and whitespace. No fake client work, metrics or testimonials.

Services come from the supplied brand kit and social copybook: custom software, applied AI/automation, websites, brand identity, social/content and AI-assisted video. Cost, schedule and handover responsibilities remain project-specific.

Native scrolling with short one-time reveals. Mobile navigation has explicit expanded state, closes on a section selection or Escape, and preserves keyboard access. FAQs use native details/summary. Honor reduced motion. The hero is typography-led: Built around your business, a concise offer and one project enquiry action. The decorative sculpture, pause button and scroll arrow have been removed at the owner's request.

Verified contact destinations: Instagram /xelorsoft, LinkedIn /company/xelorsoft and Facebook /xelorsoft. No email or phone has been assumed.

Content is frozen at the owner's request. Preserve the copy, links and nine-section source body. Run `node scripts/check-content.mjs` to compare against content-lock.json before publishing visual updates. Change the baseline only for a new explicit content request.

## Scroll build

The owner asked for a scroll-based rebuild with no content change. The page now uses the scroll-craft engine in a typographic-poster grammar: type is the imagery, no photography or decorative objects are added, and every scroll effect is presentation only. See `docs/scroll-brief.md` for the plan.

- Hero brand mark: at the owner's request (Nov 2026) the hero now carries the XS badge as a dark metal slab with real depth: fourteen stacked planes form its thickness, light shows through the cut-out letters, a sheen and tilt follow the pointer (an idle drift on touch), and it turns away and fades at its own rate on scroll. It is decorative, aria-hidden, uses only the approved logo shape (`assets/xs-badge.svg`, `assets/xs-glyph.svg`) and holds a static pose with reduced motion. This replaces the earlier no-decorative-objects rule for the hero only.
- Hero (pinned): three type planes. "Built around" recedes, "your business." comes forward and brightens, the offer and action lift away.
- Services (pinned index): the wheel steps through the six services, one description at a time. Tabbing to a service scrolls to it.
- Approach (horizontal pan): the four steps travel sideways with oversized numerals.
- AI note (pinned, the peak): "AI where it helps." settles from large scale, then "People where it matters." is written across.
- Contact and footer invert to Porcelain as the closing ground.
- Signature: one full stop travels the page, landing as the period of each heading in turn, and finally as the point of the closing question mark.

Native scrolling throughout. With reduced motion requested, nothing pins or pans and the page reads as a static document. Without JavaScript all content is visible.
