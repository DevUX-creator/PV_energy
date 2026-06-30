# PV Link Energy — Content Reference

Source of truth for site copy during the section-by-section build. Content
was extracted from the **live pvlinkenergy.com** (homepage, /about,
/services, /products, /contact) on 2026-06-23, then **reconciled** with the
client's brief from the three Telegram screenshots (`img.png`, `img_1.png`,
`img_2.png`).

> Legend: ✅ verbatim from live site · 🔁 reconciled per client brief ·
> ⚠️ **TODO** placeholder pending client.

---

## Client brief (from the screenshots)

- Design references the client likes: **trafigura.com**, **bbenergy.com** →
  light, corporate, "super professional. Try your best."
- A country-by-country **office locations** section with **entity name +
  address per country**, modelled on BB Energy's accordion.
- A **traded-products** presentation (accordion, BB-Energy style). Product
  list **must include bitumen, base oil, urea**. **Exclude crude oil** and
  similar products.
- **Urea and similar must also live in a Fertilizer department** (reference:
  sohar-id.com/products/).

**Confirmed decisions:** light-first single theme (no dark toggle) · products
organised into **two departments** (Petroleum + Fertilizer).

---

## Identity ✅

- **Name:** PV Link Energy (legal/footer styling sometimes "PvLink Energy")
- **Primary tagline:** "Empowering Global Energy Flows"
- **Secondary tagline (about page):** "Trading Energy. Building Trust."
- **Hero sub:** "PV Link Energy delivers critical energy and agricultural
  commodities across global markets with precision and purpose."

## About / positioning ✅

- "An international energy and commodities trading company specializing in the
  supply, distribution, and risk-managed movement of essential energy and agro
  resources."
- "Your Trusted Partner in Oil, Gas, and Global Energy Infrastructure."
- "Founded with a vision to bridge supply and demand across continents."
- "A legacy built on field-tested knowledge and trust."
- Operations in **"20+ countries with on-ground specialists."**
- "From exploration to delivery — we handle it all, start to finish."
- "ISO-compliant operations with rigorous quality assurance."
- "We believe in long-term partnerships, not one-off trades."

**Trust points:** Proven track record of timely delivery · Committed to
responsible energy practices · Transparent and ethical partnerships · Strong
presence across key energy markets.

> Implemented in `src/components/sections/About/About.tsx`.

## Services (6) ✅

Heading: "Across the Energy & Commodities Supply Chain". Intro: "we provide
comprehensive oil and gas services that span every stage of the energy
lifecycle."

1. Trading
2. Supply & Distribution
3. Storage & Blending
4. Shipping & Chartering
5. Hedging & Risk Management
6. Financial Solutions

**Process — "How We Deliver Energy Solutions That Work":**
1. End-to-end integration across the value chain
2. Expertise-driven, data-backed decision-making
3. Global reach with local execution — hubs: Middle East, Asia-Pacific,
   Europe (ARA), West Africa, the Americas
4. Client-first communication

> Data: `src/components/sections/Services/config.ts`.

## Products 🔁 (reconciled to two departments)

Products page heading ✅: "Explore the Energy Products That Define Our Legacy".
Section header ✅: "Supplying the Essentials".

### Department 1 — Petroleum Products
| Product | Origin | Tagline | Notes |
|---|---|---|---|
| LPG (Liquefied Petroleum Gas) | Alberta, Canada | "A Cleaner, Efficient Energy Option" | ✅ live copy |
| Distillates: Naphtha & Mogas | Riyadh, Saudi Arabia | "Versatile Fuels, Strategic Reach" | ✅ live copy |
| Fuel Oil | Global | "Heavy Fuels, Smart Solutions" | ✅ live copy (bunker, HSFO/LSFO) |
| **Bitumen** | Global | "Building the Roads That Connect Economies" | ⚠️ description placeholder |
| **Base Oil** | Global | "The Foundation of Quality Lubricants" | ⚠️ description placeholder |

### Department 2 — Fertilizer Department
| Product | Tagline | Notes |
|---|---|---|
| **Urea** | "Concentrated Nitrogen for High-Yield Crops" | ⚠️ placeholder (46% N) |
| Ammonia | "High-Purity Feedstock" | ⚠️ placeholder |
| NPK Blends | "Balanced Nutrition, Customizable Ratios" | ⚠️ placeholder |
| DAP (Diammonium Phosphate) | "Phosphorus-Rich Crop Nutrition" | ⚠️ placeholder |
| Ammonium Sulfate | "Nitrogen + Sulfur for Alkaline Soils" | ⚠️ placeholder |

- **Excluded per brief:** crude oil and similar.
- The live site's "Agro Commodities" entry is **folded into the Fertilizer
  department** (its grains/feedstock framing can return as a sub-line if the
  client wants it — confirm).
- Fertilizer line modelled on **sohar-id.com/products/** (Urea, Ammonia, NPK,
  DAP, Ammonium Sulfate).

### Live-site product extract (re-checked 2026-06-28)

The live site lists **4 products only** (each with its own detail page that
follows a `tagline → description → 3–5 "key metrics" → image gallery` layout).
The metric **values are loaded dynamically** ("Loading…" in the static HTML) —
**numbers must come from the client**; we only have the metric *labels*.

| Product | URL | Tagline | Key-metric labels (verbatim) |
|---|---|---|---|
| LPG | `/products/lpg-liquefied-petroleum-gas/` | "A Cleaner, Efficient Energy Option" | Global Coverage & Market Reach · Annual LPG Volume Handled · Logistics Capability & Fleet Access |
| Distillates: Naphtha & Mogas | `/products/distillates-naphtha-mogas/` | "Versatile Fuels, Strategic Reach" | Global Sourcing & Market Coverage · Integrated Logistics & Delivery Capability · Portfolio & Product Flexibility |
| Fuel Oil | `/products/fuel-oil/` | "Heavy Fuels, Smart Solutions" | Comprehensive Product Coverage · Global Supply & Distribution Reach · Flexible Volume & Contract Options · Full-Chain Shipping & Logistics Strength · Industry-Wide Application Coverage |
| Agro Commodities | `/products/agro-commodities/` | "Feeding Economies, Sustainably" | Diverse Commodity Portfolio · Global Sourcing Network · End-to-End Logistics & Delivery Control · Client & Market Segmentation Coverage · Regulatory & Quality Compliance |

Verbatim descriptions:
- **LPG:** "We trade and distribute LPG across global markets to meet rising demand for cleaner-burning fuels in residential, industrial, and transport sectors."
- **Fuel Oil:** "a full range of fuel oils—including bunker fuels and both high-sulfur and low-sulfur grades—tailored for industrial use, shipping, and power generation."
- **Agro Commodities:** "From grains and feedstocks to niche agricultural goods, we trade diverse agro commodities sourced responsibly from major producing regions around the world."
- **Distillates:** the live detail page shows only a facility blurb ("Upgraded facility to process 20% more capacity with advanced emissions controls") — no clean product description; keep our reconciled copy.

**Gap:** **Bitumen, Base Oil, Urea** (and the rest of the fertilizer line) are
**not on the live site** — they are client additions per the brief, so there is
**no live copy to source**. They stay on placeholder copy until the client
provides descriptions + metrics. Same for all per-product metric numbers.

> Data: `src/components/sections/Products/config.ts`.

## Industries served (21) ✅

LNG Liquefaction · Onshore Drilling · Offshore Platforms · Petrochemical
Plants · Lubricants Manufacturing · Pipeline Engineering · Refinery Processing
· Natural Gas Distribution · Fuel Storage & Terminal Operations · Oilfield
Services & Equipment · Oil & Gas Exploration · Integrated Oil & Gas · Coal &
Consumable Fuels · Shipping & Tanker Logistics · Chemical Manufacturing · Coal
Gasification · Power Generation · Steel & Aluminum Plants · Fertilizer &
Ammonia Plants · Asphalt & Paving Materials.

> Data: `src/components/sections/Industries/config.ts`.

## Offices 🔁 (country-by-country)

| Country | City | Address ✅ | Phone ✅ | Email ✅ | Entity ⚠️ |
|---|---|---|---|---|---|
| UAE | Dubai | 201, Emaar Square Building 4, Downtown, Dubai, UAE | +971 4 577 5989 | info@pvlinkenergy.com | PV Link Energy FZCO **(placeholder)** |
| Greece | Athens | Griva Digeni 2, Agios Dimitrios, Athina 173 43, Greece | — | — | PV Link Energy Hellas **(placeholder)** |
| Hong Kong | Hong Kong | Unit 18, 8/F, Peter Leung Industrial Building, 103 Wai Yip Street, Kwun Tong, KL, Hong Kong | +86 020 33974261 | — | PV Link Energy (HK) Ltd. **(placeholder)** |

> ⚠️ **Per-country legal entity names are NOT published on the current site.**
> The values above are placeholders so the BB-Energy-style accordion renders —
> **get the real entity names from the client.**
>
> Data: `src/components/sections/Offices/config.ts`.

## Contact ✅

- Headings: "Get In Touch With The Energy Experts" · "Stay Connected with PV
  Link Energy".
- Primary email **info@pvlinkenergy.com**, primary phone **+971 4 577 5989**.
- Contact form fields were not exposed on the live page; backend deferred.

## Footer ✅

- "Copyright © 2026 PvLink Energy. All Right Reserved"
- Social: LinkedIn.

## CTAs seen on live site ✅

"Get Started" · "Learn More" · "Know More" · "View more" · "Request a
Consultation".

---

## Structural references (for the build, not content)

- **bbenergy.com** — country offices in an expandable accordion; each region
  reveals address + entity + "Read more". Products framed as divisions
  (Trading / Downstream / Renewables). → drives our Offices + Products
  accordion pattern.
- **sohar-id.com/products/** — unified fertilizer portfolio (Urea, Ammonia,
  NPK, DAP, Ammonium Sulfate). → drives our Fertilizer department line-up.
- **trafigura.com** — light, corporate, editorial tone → drives the light-first
  visual direction.

## Open items to confirm with the client

1. ⚠️ Per-country **legal entity names** for the offices accordion.
2. ⚠️ Final **Bitumen, Base Oil** and **fertilizer** product descriptions /
   specs.
3. Whether to keep an explicit **Agro Commodities / grains** line alongside
   fertilizers, or fold it in entirely.
4. Final **brand fonts & colour palette** (current tokens are placeholders).
5. Whether additional **countries/offices** beyond the current three exist.
