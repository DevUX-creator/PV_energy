# PV Link Energy — Architecture & Conventions

How this codebase is organised and the rules to follow when polishing
sections. Conventions are lifted from the client's three reference projects
(Axon / Fabrisa / BeBawa) so the result matches that established style.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5** (`strict`)
- **Plain CSS** + design tokens — **no Tailwind, no CSS Modules**
- **GSAP 3** (`@gsap/react`) + **Lenis** smooth scroll
- Path alias **`@/*` → `./src/*`**
- Scripts: `npm run dev | build | start | lint | typecheck`

## Folder map

```
src/
├── app/            # routes: layout, template (page transition), page, error,
│                   #   not-found, robots.ts, sitemap.ts
├── animations/     # RevealSection (fade+rise), Copy (line reveal) + copy.css
├── components/
│   ├── providers/  # SmoothScroll (Lenis ↔ ScrollTrigger bridge)
│   ├── layout/     # Header, Footer
│   ├── ui/         # Button, Logo, Container, Section, Accordion
│   └── sections/   # one folder per page section (Hero, About, …)
├── lib/            # breakpoints.ts, gsap.ts (plugin registry), navigation.ts
└── styles/         # theme.css (tokens), globals.css, links.css, fonts.ts
docs/               # CONTENT.md (copy), ARCHITECTURE.md (this file)
```

## Component conventions

- **One component per folder**: `ComponentName.tsx` + `componentName.css`
  (camelCase) + `index.ts` barrel (`export { default } from "./ComponentName"`).
- Section static data lives in a sibling **`config.ts`** (no `"use client"`).
- **`"use client"` only** on components using hooks / browser APIs. Sections
  that are pure render stay server components (Hero, About, Services, etc.).
- Import a component's CSS at the top of its `.tsx` (`import "./x.css"`).

## Styling rules

- **Never hardcode** colours / spacing / radii / type sizes — always reference
  tokens from `theme.css`. (Values there are placeholders pending the client's
  UI; reskinning = swapping token values, not editing components.)
- **Light-first, single theme.** Semantic tokens (`--bg-*`, `--fg-*`,
  `--border*`) are kept so a dark mode could be added later as a `[data-theme]`
  block without refactoring.
- **Vertical rhythm tiers — never invert:**
  `--gap-block` < `--gap-section-header` < `--gap-section`.
- **Desktop-first** media queries (`max-width`). Breakpoints: laptop 1440,
  tablet 1024, mobile 768, mobileS 481 (see `lib/breakpoints.ts`).
- Class naming is BEM-ish: `.block`, `.block__part`, `.block--modifier`.
- Inverse (navy) surfaces: wrap in `<Section inverse>` — it remaps fg/border
  tokens locally so child CSS keeps working.

## Reusable building blocks

- **`<Section>`** — landmark + `.section` rhythm; props: `inverse`, `surface`,
  `contained`, `width`, `id`, `ariaLabel`.
- **`<Container>`** — max-width + fluid gutter; `width="default|wide|fluid|text"`.
- **`<Button>`** — polymorphic (`href` → link, else `<button>`); variants
  `primary | outline | ghost`; optional trailing arrow.
- **`<Accordion>`** — generic expand/collapse; `items`, `allowMultiple`,
  `defaultOpen`. GSAP height/opacity animation, full keyboard + ARIA. Used by
  Products and Offices. **Reach for this before building any new expandable UI.**
- **`<Logo>`** — placeholder SVG wordmark (inherits `currentColor`).

## Typography

- **B612** (`--font-display` + `--font-sans`) — titles **and** body. Airbus
  cockpit face, legibility-first. Google Fonts ships **400 + 700 only**, so
  headings render bold (700).
- **Geist Mono** (`--font-mono`) — short technical accents only: buttons,
  eyebrows/labels, numerals & stats, meta/captions. **Keep it off long-form
  body** (monospace hurts paragraph readability). Both load via
  `next/font/google` in `src/styles/fonts.ts`.

## Animation

- Register GSAP plugins once via `registerGsapPlugins()` in `lib/gsap.ts`
  (ScrollTrigger, CustomEase, SplitText). `SmoothScroll` calls it.
- **`<RevealSection>`** — fade + rise on scroll. `eager` for above-the-fold.
- **`<Copy>`** — line-by-line SplitText reveal. `eager` + `animateOnScroll`.
- Both lazy-load GSAP via IntersectionObserver and **honour
  `prefers-reduced-motion`** (render static). Keep that contract in new motion.
- Easing vocabulary lives in tokens: `--ease-standard`, `--ease-quint`
  (signature reveal), etc. Reuse them; don't invent per-component curves.

## How to add / polish a section

1. Work inside `src/components/sections/<Name>/`.
2. Put copy/data in `config.ts` (pull real content from `docs/CONTENT.md`).
3. Compose with `<Section>` + `<Container>` for layout, `<RevealSection>` /
   `<Copy>` for motion, and existing `ui/` primitives.
4. Add styles in `<name>.css` using tokens only.
5. Wire it into `src/app/page.tsx` (or its own route under `app/`).
6. Run `npm run lint` + `npm run typecheck` before considering it done.

## Patterns available for richer sections (from the references)

Marquee/ribbon strips, pinned horizontal-scroll panels, parallax/scrub
headlines, overlay menu, letter-swap links. Implement per-section as needed —
all build on GSAP + ScrollTrigger already wired through `SmoothScroll`.

## Deferred (not built yet)

Final visuals/palette/fonts · real section content beyond stubs · per-country
entity names · contact-form backend · service/product detail routes · CMS.
See `docs/CONTENT.md` "Open items".
