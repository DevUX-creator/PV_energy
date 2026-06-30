/**
 * Office locations — extracted verbatim from the live pvlinkenergy.com
 * (homepage + /contact). Country-by-country, BB-Energy style.
 *
 * ⚠ `entity` (per-country legal entity name) is NOT published on the
 * current site — these are PLACEHOLDERS pending the client (see the TODO
 * in docs/CONTENT.md). Everything else is the real published data.
 */
export type Office = {
  id: string;
  city: string;
  country: string;
  /** Legal entity name for this country — PLACEHOLDER, confirm with client. */
  entity: string;
  address: string;
  phone?: string;
  email?: string;
};

export const OFFICES: Office[] = [
  {
    id: "dubai",
    city: "Dubai",
    country: "UAE",
    entity: "PV Link Energy FZCO", // TODO: confirm legal entity name
    address: "201, Emaar Square Building 4, Downtown, Dubai, UAE",
    phone: "+971 4 577 5989",
    email: "info@pvlinkenergy.com",
  },
  {
    id: "athens",
    city: "Athens",
    country: "Greece",
    entity: "PV Link Energy Hellas", // TODO: confirm legal entity name
    address: "Griva Digeni 2, Agios Dimitrios, Athina 173 43, Greece",
  },
  {
    id: "hong-kong",
    city: "Hong Kong",
    country: "Hong Kong",
    entity: "PV Link Energy (HK) Ltd.", // TODO: confirm legal entity name
    address:
      "Unit 18, 8/F, Peter Leung Industrial Building, 103 Wai Yip Street, Kwun Tong, KL, Hong Kong",
    phone: "+86 020 33974261",
  },
];
