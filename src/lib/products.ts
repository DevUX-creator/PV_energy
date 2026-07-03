import {
  PRODUCT_DEPARTMENTS,
  type Product,
  type ProductDepartment,
} from "@/components/sections/Products/config";

export type ProductWithDept = Product & { department: ProductDepartment };

/** Every product, flattened, carrying its department. */
export const ALL_PRODUCTS: ProductWithDept[] = PRODUCT_DEPARTMENTS.flatMap((d) =>
  d.products.map((p) => ({ ...p, department: d }))
);

export function getProduct(slug: string): ProductWithDept | null {
  return ALL_PRODUCTS.find((p) => p.id === slug) ?? null;
}

export { PRODUCT_DEPARTMENTS };
