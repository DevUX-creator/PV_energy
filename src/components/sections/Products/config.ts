/**
 * Products — reconciled per the client brief (see docs/CONTENT.md):
 *   • Two departments: Petroleum Products + Fertilizer Department.
 *   • Adds Bitumen, Base Oil, and Urea (+ related fertilizers).
 *   • Excludes crude oil and similar products.
 *
 * LPG / Distillates / Fuel Oil copy is from the live site. Bitumen, Base
 * Oil and the fertilizer line use SHORT PLACEHOLDER descriptions (modelled
 * on the Sohar reference) pending final copy from the client.
 *
 * `tab` + `points` drive the ProductShowcase (tabs + accordion) section;
 * `image` is the per-product art — left undefined for now so the showcase
 * renders a dark placeholder until the client's images land.
 */
export type ProductPoint = {
  id: string;
  title: string;
  body: string;
};

export type Product = {
  id: string;
  name: string;
  /** Sourcing / coverage line shown as meta (optional). */
  origin?: string;
  tagline: string;
  description: string;
  /** Short label for the tabs nav (falls back to `name`). */
  tab?: string;
  /** Per-product image; dark placeholder until provided. */
  image?: string;
  /** Per-product intro video (looping .mp4); falls back to `image` when absent. */
  video?: string;
  /** Accordion sub-points — applications / grades. DRAFT copy. */
  points?: ProductPoint[];
};

export type ProductDepartment = {
  id: string;
  name: string;
  intro: string;
  products: Product[];
};

export const PRODUCT_DEPARTMENTS: ProductDepartment[] = [
  {
    id: "petroleum",
    name: "Petroleum Products",
    intro:
      "Refined energy products moved on-spec, compliant, and on schedule across global markets.",
    products: [
      {
        id: "lpg",
        name: "LPG (Liquefied Petroleum Gas)",
        tab: "LPG",
        image: "/Products/lpg.webp",
        video: "/Products/lpg.mp4",
        origin: "Alberta, Canada",
        tagline: "A Cleaner, Efficient Energy Option",
        description:
          "We trade and distribute LPG across global markets to meet rising demand for cleaner-burning fuels in residential, industrial, and transport sectors.",
        points: [
          {
            id: "lpg-residential",
            title: "Residential & Commercial",
            body: "Bottled and bulk LPG for cooking, heating, and hot water across households and businesses.",
          },
          {
            id: "lpg-autogas",
            title: "Autogas for Transport",
            body: "A cleaner-burning alternative to petrol and diesel for vehicle fleets and mobility.",
          },
          {
            id: "lpg-industrial",
            title: "Industrial & Petrochemical",
            body: "Process fuel and feedstock for manufacturing, drying, and petrochemical applications.",
          },
          {
            id: "lpg-logistics",
            title: "Logistics & Fleet Access",
            body: "Pressurised storage and shipping handled end-to-end for reliable, on-spec delivery.",
          },
        ],
      },
      {
        id: "distillates-naphtha-mogas",
        name: "Distillates: Naphtha & Mogas",
        tab: "Distillates",
        image: "/Products/distillates.webp",
        video: "/Products/distillates.mp4",
        origin: "Riyadh, Saudi Arabia",
        tagline: "Versatile Fuels, Strategic Reach",
        description:
          "A flexible distillates portfolio — naphtha and motor gasoline — backed by integrated logistics and broad market coverage.",
        points: [
          {
            id: "dist-naphtha",
            title: "Naphtha",
            body: "Petrochemical feedstock for cracking and a blendstock for gasoline production.",
          },
          {
            id: "dist-mogas",
            title: "Motor Gasoline (Mogas)",
            body: "Finished and blendstock gasoline supplied to spec for regional markets.",
          },
          {
            id: "dist-blending",
            title: "Blending & Specifications",
            body: "Octane, RVP, and grade tailored to each destination's requirements.",
          },
          {
            id: "dist-logistics",
            title: "Integrated Logistics",
            body: "Coordinated storage, blending, and shipping across key trading hubs.",
          },
        ],
      },
      {
        id: "fuel-oil",
        name: "Fuel Oil",
        tab: "Fuel Oil",
        image: "/Products/fuel-oil.webp",
        video: "/Products/fuel-oil.mp4",
        origin: "Global",
        tagline: "Heavy Fuels, Smart Solutions",
        description:
          "We supply a full range of fuel oils — including bunker fuels and both high-sulfur and low-sulfur grades — tailored for industrial use, shipping, and power generation.",
        points: [
          {
            id: "fo-bunker",
            title: "Bunker Fuels (Marine)",
            body: "Marine fuels supplied at major bunkering ports for global shipping.",
          },
          {
            id: "fo-hsfo",
            title: "High-Sulfur (HSFO)",
            body: "Heavy fuel oil for scrubber-fitted vessels and industrial users.",
          },
          {
            id: "fo-lsfo",
            title: "Low-Sulfur (LSFO / VLSFO)",
            body: "IMO 2020-compliant grades for emission-controlled operations.",
          },
          {
            id: "fo-power",
            title: "Power & Industry",
            body: "Feedstock for power generation and heavy industrial processes.",
          },
        ],
      },
      {
        id: "bitumen",
        name: "Bitumen",
        tab: "Bitumen",
        image: "/Products/bitumen.webp",
        video: "/Products/bitumen.mp4",
        origin: "Global",
        tagline: "Building the Roads That Connect Economies",
        description:
          "Penetration- and viscosity-grade bitumen for paving, roofing, and waterproofing — supplied in bulk and drummed packaging with reliable logistics.",
        points: [
          {
            id: "bit-pen",
            title: "Penetration Grades",
            body: "Standard paving grades such as 60/70 and 80/100 for road construction.",
          },
          {
            id: "bit-vg",
            title: "Viscosity Grades",
            body: "Performance-graded binders for demanding climates and traffic loads.",
          },
          {
            id: "bit-packaging",
            title: "Bulk & Drummed Supply",
            body: "Hot bulk tankers and drummed packaging for flexible delivery.",
          },
          {
            id: "bit-apps",
            title: "Applications",
            body: "Road paving, roofing, and waterproofing membranes.",
          },
        ],
      },
      {
        id: "base-oil",
        name: "Base Oil",
        tab: "Base Oil",
        image: "/Products/base-oil.webp",
        video: "/Products/base-oil.mp4",
        origin: "Global",
        tagline: "The Foundation of Quality Lubricants",
        description:
          "Group I–III base oils for lubricant blending and industrial formulation, sourced from established refiners and delivered on-spec.",
        points: [
          {
            id: "bo-g1",
            title: "Group I",
            body: "Solvent-refined base oils for general-purpose lubricant blending.",
          },
          {
            id: "bo-g2",
            title: "Group II",
            body: "Hydroprocessed oils with improved purity and oxidation stability.",
          },
          {
            id: "bo-g3",
            title: "Group III",
            body: "High-viscosity-index base oils for premium and synthetic-grade lubricants.",
          },
          {
            id: "bo-blending",
            title: "Lubricant Blending",
            body: "Supplied on-spec to blenders and industrial formulators.",
          },
        ],
      },
    ],
  },
  {
    id: "fertilizers",
    name: "Fertilizer Department",
    intro:
      "Crop nutrition and feedstock chemicals for farmers, distributors, and industrial users worldwide.",
    products: [
      {
        id: "urea",
        name: "Urea",
        tab: "Urea",
        image: "/Products/urea.webp",
        video: "/Products/urea.mp4",
        origin: "Global",
        tagline: "Concentrated Nitrogen for High-Yield Crops",
        description:
          "A highly concentrated nitrogen fertilizer (46% N) for cereals, vegetables, and plantation crops.",
        points: [
          {
            id: "urea-forms",
            title: "Granular & Prilled",
            body: "Both forms supplied for field application and industrial use.",
          },
          {
            id: "urea-ag",
            title: "Agricultural Grade (46% N)",
            body: "High-nitrogen fertilizer for cereals, vegetables, and plantations.",
          },
          {
            id: "urea-technical",
            title: "Technical Grade",
            body: "Feedstock for resins, adhesives, and DEF / AdBlue production.",
          },
          {
            id: "urea-handling",
            title: "Bulk Handling",
            body: "Bagged and bulk logistics from major producing regions.",
          },
        ],
      },
      {
        id: "ammonia",
        name: "Ammonia",
        tab: "Ammonia",
        image: "/Products/ammonia.webp",
        video: "/Products/ammonia.mp4",
        origin: "Global",
        tagline: "High-Purity Feedstock",
        description:
          "High-purity ammonia for fertilizer production and industrial processes.",
        points: [
          {
            id: "amm-feedstock",
            title: "Fertilizer Feedstock",
            body: "Primary nitrogen source for downstream fertilizer production.",
          },
          {
            id: "amm-industrial",
            title: "Industrial Uses",
            body: "Refrigeration, chemicals, and emissions-control applications.",
          },
          {
            id: "amm-handling",
            title: "Storage & Handling",
            body: "Refrigerated and pressurised handling under strict safety controls.",
          },
        ],
      },
      {
        id: "npk",
        name: "NPK Blends",
        tab: "NPK",
        image: "/Products/npk.webp",
        video: "/Products/npk.mp4",
        origin: "Global",
        tagline: "Balanced Nutrition, Customizable Ratios",
        description:
          "Balanced fertilizers combining nitrogen, phosphorus, and potassium in customizable ratios.",
        points: [
          {
            id: "npk-ratios",
            title: "Custom Ratios",
            body: "Nitrogen-phosphorus-potassium blended to agronomic requirements.",
          },
          {
            id: "npk-crop",
            title: "Crop-Specific Formulas",
            body: "Tailored nutrition for target crops and soil conditions.",
          },
          {
            id: "npk-supply",
            title: "Bulk Blending & Supply",
            body: "Bagged and bulk delivery for distributors and farms.",
          },
        ],
      },
      {
        id: "dap",
        name: "DAP (Diammonium Phosphate)",
        tab: "DAP",
        image: "/Products/dap.webp",
        video: "/Products/dap.mp4",
        origin: "Global",
        tagline: "Phosphorus-Rich Crop Nutrition",
        description:
          "Phosphorus-rich fertilizer for cereals, oilseeds, pulses, and horticultural crops.",
        points: [
          {
            id: "dap-nutrition",
            title: "Phosphorus-Rich Nutrition",
            body: "High-phosphate fertilizer supporting strong roots and early growth.",
          },
          {
            id: "dap-crops",
            title: "Cereals & Oilseeds",
            body: "Widely used across grains, pulses, and oilseed crops.",
          },
          {
            id: "dap-supply",
            title: "Bulk Supply",
            body: "Granular product handled in bulk from key origins.",
          },
        ],
      },
      {
        id: "ammonium-sulfate",
        name: "Ammonium Sulfate",
        tab: "Ammonium Sulfate",
        image: "/Products/ammonium-sulfate.webp",
        video: "/Products/ammonium-sulfate.mp4",
        origin: "Global",
        tagline: "Nitrogen + Sulfur for Alkaline Soils",
        description:
          "A nitrogen and sulfur source, particularly beneficial for alkaline soils.",
        points: [
          {
            id: "as-dual",
            title: "Nitrogen + Sulfur",
            body: "A dual-nutrient source supporting protein and chlorophyll formation.",
          },
          {
            id: "as-alkaline",
            title: "Alkaline Soils",
            body: "Lowers soil pH, making it well-suited to alkaline conditions.",
          },
          {
            id: "as-forms",
            title: "Granular & Crystalline",
            body: "Supplied in multiple forms for varied application methods.",
          },
        ],
      },
    ],
  },
];
