# Polish / deferred TODO

Tracked items the client/dev will handle later (not bugs — the desktop look &
animations are working).

## Responsive (review on mobile / tablet — DEFERRED)

The desktop (≥1024px) layouts are good; small-screen passes still needed.

**About (`src/components/sections/About`)**
- `.about__head` collapses to one column at ≤768px — verify the tag, heading,
  lead, and CTA still align and breathe.
- The hero→About overlap (`about-overlap`, `z-index:1`) — re-check the scroll
  overlap on short mobile viewports.

**WhatWeDo showcase (`src/components/sections/WhatWeDo`)**
- `.ww-show__inner` stacks at ≤900px — long service names ("Hedging & Risk
  Management", "Shipping & Chartering") may overflow at narrow widths; check the
  `clamp()` size and wrapping.
- The moving indicator bar (`.ww-show__indicator`) is JS-measured; re-verify its
  width/position after the stacked reflow.
- `.ww-show__img-wrap` is capped at `max-width:460px` — confirm sizing on mobile.

## Content (DEFERRED)

- **Product subpages** — content drafted in `docs/content/products/`, but the
  client will review product copy/specs later. Do **not** build the product
  subpages yet.
- Per-metric **numbers**, Bitumen/Base Oil/fertilizer **specs**, and office
  **legal entity names** still pending the client (see `docs/CONTENT.md`).

## Assets (mostly done — see `docs/ASSETS.md`)

- `public/WhatWeDo` art partly placeholder (trading poster = brand cube). Swap
  when real art lands.
- Redundant optimized webps now parked under `raw/Trusted` / `raw/Offices`;
  delete from `raw/` once the `public/` copies are final.
