/**
 * Experience — the "reach / sectors served" intro that follows What We Do.
 * This is only the OPENING of the section (tag → hairline → count-up →
 * rotating headline); the body content is added below it later.
 *
 * Copy is placeholder, drawn from the live site ("Serving the World's
 * Vital Sectors", "Global Reach"). Swap freely — the component is purely
 * driven by the values here.
 */
export type ExperienceContent = {
  /** Small eyebrow tag above the hairline. */
  tag: string;
  /** Count-up stat shown under the hairline. */
  stat: { value: number; suffix: string; label: string };
  /** Static, grey lead lines (rendered uppercase). The last line leads
   *  into the rotating sector below — e.g. "…to [Refineries]". */
  lead: string[];
  /** Sectors that scroll vertically through the highlight (uppercased in
   *  CSS). Keep them short so each reads on a single line. */
  sectors: string[];
  /** Mono-font label that straddles the image's left edge (with the
   *  rotating shuriken mark beside it). */
  mark: string;
};

export const EXPERIENCE: ExperienceContent = {
  tag: "Global Reach",
  stat: {
    value: 100,
    suffix: "+",
    label: "Markets connected across the globe",
  },
  lead: ["Delivering", "energy & commodities", "to"],
  sectors: [
    "Power Generation",
    "Petrochemicals",
    "LNG Terminals",
    "Steel & Aluminium",
    "Fertilizer Plants",
    "Shipping & Tankers",
  ],
  mark: "Global Network",
};
