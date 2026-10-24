# Xelorsoft design direction

Surface: Persuade, supported by interactive software concepts. The main action is to prepare a project brief and contact Xelorsoft.

Direction: Swiss architectural grid with industrial silver detailing. Asymmetric 12-column layouts, square controls, hairline divisions and open service rows. The existing XS artwork remains authoritative.

Typography: Manrope for display and body. IBM Plex Mono for small technical labels with tabular numerals. Three roles, no additional font families.

Color: preserve the approved Carbon #171719, Porcelain #F6F6F4 and Silver #B7B7BD. Semantic CSS custom properties are in design.css. Existing brand colors take precedence over the attachment's example palette. The existing native CSS architecture supports these tokens without adding a build dependency. Light-surface supporting text uses #606068. Unrevealed scroll text uses #8E8E96 so its message remains readable before the highlight arrives.

Layout: hero 7/5 columns; section statements 8/4 columns; services as open numbered rows; interactive examples remain explicitly labelled concepts. Mobile returns to a single reading column.

Motion: native browser scrolling, masked heading entrances, staggered service rows and one pinned text sequence. Use cubic-bezier(.16,1,.3,1). No competing cursor effects, elastic motion or decorative particle systems. Respect reduced motion and reveal keyboard-focused controls.

Content: describe product discovery, request handling, approvals, human review and enquiry journeys. Do not invent clients, testimonials, savings, performance or guaranteed delivery dates.

Reference: bespoke-web-design guidance supplied by the owner in SKILL.md. Applied to the existing brand and static GitHub Pages site.
