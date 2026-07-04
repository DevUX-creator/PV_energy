export type Highlight = { value: string; label: string };

/**
 * A few punchy, factual "at a glance" figures per product — rendered as large
 * stat boxes. Values are standard industry facts (grades, nutrient contents,
 * specs), not company metrics, so nothing here needs client sign-off.
 */
export const PRODUCT_HIGHLIGHTS: Record<string, Highlight[]> = {
  lpg: [
    { value: "2", label: "Core grades — propane & butane" },
    { value: "≈0%", label: "Sulphur — clean, sootless burn" },
    { value: "5+", label: "End-use sectors served" },
  ],
  "distillates-naphtha-mogas": [
    { value: "2", label: "Streams — naphtha & mogas" },
    { value: "91–98", label: "Typical RON octane range" },
    { value: "CPP", label: "Clean petroleum products" },
  ],
  "fuel-oil": [
    { value: "0.5%", label: "VLSFO sulphur cap (IMO 2020)" },
    { value: "3", label: "Sulphur grades — HS / VLS / ULS" },
    { value: "ISO 8217", label: "Bunker fuel specification" },
  ],
  bitumen: [
    { value: "3", label: "Families — paving, roofing, industrial" },
    { value: "60/70", label: "Common penetration grade" },
    { value: "PMB", label: "Polymer-modified grades available" },
  ],
  "base-oil": [
    { value: "I–V", label: "API base-oil groups" },
    { value: "70–90%", label: "Of a finished lubricant" },
    { value: "SN 150–500", label: "Common viscosity cuts" },
  ],
  urea: [
    { value: "46%", label: "Nitrogen — highest of any solid" },
    { value: "2", label: "Forms — granular & prilled" },
    { value: "3+", label: "Uses — field, technical, DEF" },
  ],
  ammonia: [
    { value: "82%", label: "Nitrogen content" },
    { value: "−33°C", label: "Refrigerated shipping" },
    { value: "NH₃", label: "Base for every nitrogen fertilizer" },
  ],
  npk: [
    { value: "N-P-K", label: "Three primary nutrients" },
    { value: "Custom", label: "Ratios matched to crop & soil" },
    { value: "2", label: "Types — compound & bulk blends" },
  ],
  dap: [
    { value: "18-46-0", label: "N-P₂O₅-K₂O grade" },
    { value: "46%", label: "Phosphate (P₂O₅)" },
    { value: "18%", label: "Nitrogen" },
  ],
  "ammonium-sulfate": [
    { value: "21%", label: "Nitrogen" },
    { value: "24%", label: "Sulphur" },
    { value: "2-in-1", label: "Nitrogen + sulphur in one" },
  ],
};
