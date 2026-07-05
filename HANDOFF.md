# PV Link Energy — Developer Handoff

Marketing site for PV Link Energy (energy & commodities trading). This doc is the
one-page brief for the developer taking it over. For the fuller deferred list see
[`docs/POLISH-TODO.md`](docs/POLISH-TODO.md).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- Animation: GSAP + ScrollTrigger, Lenis smooth scroll; 3D via three.js; physics via matter-js
- Plain CSS with design tokens (no CSS framework)
- The site is almost entirely **prerendered (SSG/static)** — no database, no backend.

## Run locally

Requires **Node 20+** (built on Node 24).

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm run start` (serve the
build), `npm run typecheck`, `npm run lint`.

## Deploy — use a Next.js-native host

This is a Next.js app, **not** static HTML. Host it somewhere with first-class
Next.js support so you keep image optimization, edge CDN and caching. **Do not**
use generic shared/cPanel/FTP hosting — features will break or run slow.

- **Recommended: Vercel.** Import the GitHub repo, framework auto-detects as
  Next.js, no build config needed. Then add the custom domain `pvlinkenergy.com`.
- Alternatives: Netlify (fine), Cloudflare Pages (more caveats).

No build-time configuration is required. `VERCEL_ENV` / `VERCEL_URL` are provided
automatically by Vercel and are used to resolve social-share image URLs (see
Gotchas). On the production deploy with the real domain attached, everything
resolves to `https://pvlinkenergy.com`.

## What the incoming developer owns

### 1. Contact form backend — REQUIRED
`src/components/sections/ContactView/ContactForm.tsx` (~line 107). It currently
uses a **`mailto:` fallback** (opens the visitor's email client). Replace with a
real submission:
- POST the form data to your endpoint / CRM (e.g. an API route, HubSpot, Resend,
  Formspree…), and handle success/error states (the UI already has a submitted
  state to reuse).
- If the endpoint needs a secret (API key), add it as an **environment variable**
  in the host dashboard (e.g. `CONTACT_API_KEY`) — do not commit secrets. There
  is currently no `.env` file; `.env*` is gitignored.

### 2. Legal & registration details — REQUIRED (client-supplied)
- Legal entity names are placeholders: `src/lib/site.ts` (`SITE_LEGAL_NAME`) and
  `src/components/sections/Offices/config.ts` (per-office `entity`).
- Legal page is missing registration number, jurisdiction, VAT/tax id:
  `src/components/sections/Legal/LegalView.tsx` (~line 70).

### 3. Analytics — OPTIONAL
Nothing is wired (no GA / Plausible / Vercel Analytics). Add if the client wants
traffic data. On Vercel, `@vercel/analytics` is a two-line drop-in.

## Content still pending the client
Some copy is safe placeholder pending final client input (product descriptions
for Bitumen / Base Oil / fertilizers, and reach figures which have been softened
to non-numeric phrasing). See `docs/POLISH-TODO.md`.

## Gotchas / things to know

- **Canonical domain** is `SITE_URL` in `src/lib/site.ts` (`https://pvlinkenergy.com`).
  Sitemap, canonical tags and JSON-LD all use it. If the domain ever changes,
  update it here.
- **Social share banner** is `src/app/opengraph-image.png` (1200×630), applied
  site-wide. Pages that set their own `openGraph` block (about, contact,
  products) must include `images: [OG_IMAGE]` — Next.js does **not** auto-cascade
  the root banner into an overridden `openGraph`. `OG_IMAGE` is exported from
  `src/lib/site.ts`.
- **`metadataBase` is environment-aware** (`METADATA_BASE` in `src/lib/site.ts`):
  production → canonical domain; preview deploys → the deployment's own host, so
  share images resolve before the domain is live.
- **Social preview caching:** Telegram/Viber/LinkedIn cache link previews hard.
  After deploying, force a refresh (Telegram `@WebpageBot`, LinkedIn Post
  Inspector) or previews may look stale.
- `raw/` (design source assets) is gitignored and intentionally not shipped.
