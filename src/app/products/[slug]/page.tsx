import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/sections/ProductDetail";
import { ALL_PRODUCTS, getProduct } from "@/lib/products";

type Params = { slug: string };

export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.name} | PV Link Energy`,
      description: product.description,
      url: `/products/${product.id}`,
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <main id="main-content">
      <ProductDetail product={product} />
    </main>
  );
}
