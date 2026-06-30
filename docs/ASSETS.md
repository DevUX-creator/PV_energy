# Assets — where things live

One rule, so it's never ambiguous:

| Folder | Committed? | Used by code? | Holds |
|---|---|---|---|
| **`public/<Section>/`** | ✅ yes | ✅ yes (`/Section/file`) | the **served, web-optimized** assets — the only ones the app references |
| **`raw/<Section>/`** | ❌ gitignored (`/raw`) | ❌ never | the **source masters** (large mp4 / png originals) the optimized files were exported from |

The app **only ever** references `public/` via root-absolute paths
(`src="/WhatWeDo/trading.mp4"`). Nothing in `src/` points at `raw/` — verified.
So `raw/` is a personal, local-only working area; reorganizing it is free.

## Conventions

- **Per-section folders**, named to match the section component
  (`public/WhatWeDo`, `public/Hero`, `public/Offices`, …). Same folders in
  `raw/`.
- **`public/`** filenames: `kebab-case`, e.g. `choose-1.webp`,
  `trading-poster.jpg`, `supply.mp4`.
- **`raw/`** masters: keep the `-source` suffix, e.g. `trading-source.mp4`.
- A clip ships as **mp4 (H.264) + poster jpg**; a still ships as **webp**.

## Current layout

```
public/
  Hero/        (3)   hero video + posters
  Menu/        (2)   menu-bg.mp4 + poster
  WhatWeDo/    (9)   trading/supply/hedging .mp4 + posters, storage/shipping/finance .webp
  Trusted/     (4)   KeyPoints.jpg + choose-1/2/3.webp   (used by Leaders/Further)
  About/       (2)   about-hero.webp (ship band) + about-company.webp  (used by /about)
  Offices/     (1)   Office.webp                          (used by the Offices overlay)
  Products/    (10)  per-product art
  GlobalReach/ (1)
  LogoIcon.svg

raw/  (gitignored, ~437 MB — source masters, now foldered to mirror public/)
  Hero/        Main Hero.mp4, hero-1-source.mp4, hero-2-source.mp4
  Menu/        menu-bg-source.mp4
  WhatWeDo/    trading/supply/hedging-source.mp4, shipping/storage/finance-source.png
  GlobalReach/ global-reach-source.png, GlobalReach-products/
  Offices/     Office.webp
  Trusted/     choose_us_image_1.webp, choose_us_image_3.webp, container-2.d45373ad.webp
```

## Notes / cleanup flags

- `raw/Trusted/*` and `raw/Offices/Office.webp` are already-optimized webps, not
  true "masters" — they were loose in `raw/`'s root and are now foldered. They
  correspond to `public/Trusted/choose-*.webp` and `public/Offices/Office.webp`.
  Safe to delete from `raw/` once you're happy the `public/` copies are final.
- Some `public/WhatWeDo` art is still **placeholder** (e.g. the trading poster
  shows the brand cube, not a trading photo). Swap when real art lands.
- When adding a new section's assets: create `public/<Section>/`, drop the
  optimized files there, and keep the master in `raw/<Section>/`.
