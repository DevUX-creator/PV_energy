import type { Product } from "../Products/config";

/** A product flattened with its department name, used across the showcase. */
export type ShowcaseProduct = Product & { department: string };
