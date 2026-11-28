/**
 * PRODUCT PAGE ( /product/<slug> ): server part.
 * Pre-builds one page per product (generateStaticParams), sets the page title for SEO,
 * looks up the product + its artisan, picks "related" products (same artisan/category
 * first) and hands everything to ProductView. Unknown slugs show not-found.tsx.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@backend/data/products";
import { getArtisan } from "@backend/data/artisans";
import ProductView from "./ProductView";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return p ? { title: p.name, description: p.description } : {};
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const artisan = getArtisan(product.artisanId)!;
  const related = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.artisanId === product.artisanId) * 2 + Number(b.category === product.category) - (Number(a.artisanId === product.artisanId) * 2 + Number(a.category === product.category)))
    .slice(0, 8);
  return <ProductView product={product} artisan={artisan} related={related} />;
}
