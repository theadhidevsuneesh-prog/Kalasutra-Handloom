/**
 * HOMEPAGE ( / ).
 * Stacks the home sections in order: Hero, impact counters, collection tiles,
 * bestselling products, artisan spotlight carousel, then testimonials and trust badges.
 */
import Link from "next/link";
import Hero from "@/components/home/Hero";
import ImpactCounter from "@/components/home/ImpactCounter";
import Collections from "@/components/home/Collections";
import ArtisanSpotlight from "@/components/home/ArtisanSpotlight";
import TrustSection from "@/components/home/TrustSection";
import ProductCard from "@/components/ProductCard";
import { products } from "@backend/data/products";

export default function HomePage() {
  const bestsellers = products.filter((p) => p.badge === "Bestseller" || p.rating >= 4.8).slice(0, 4);
  return (
    <>
      <Hero />
      <ImpactCounter />
      <Collections />
      <section aria-labelledby="best" className="container-x pt-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="kicker">Most loved</p>
            <h2 id="best" className="mt-2 text-3xl sm:text-4xl">Bestselling pieces</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-terracotta">Shop all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
      <ArtisanSpotlight />
      <TrustSection />
    </>
  );
}
