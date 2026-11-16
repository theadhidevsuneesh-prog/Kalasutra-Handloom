"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useMounted, useShop } from "@/store/useStore";

export default function WishlistPage() {
  const ids = useShop((s) => s.wishlist);
  const mounted = useMounted();
  const items = mounted ? products.filter((p) => ids.includes(p.id)) : [];

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl sm:text-4xl">Your wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-sand py-20 text-center">
          <Heart aria-hidden className="h-10 w-10 text-brass" />
          <p className="font-serif text-2xl">{mounted ? "Nothing saved yet" : "Loading…"}</p>
          <p className="text-sm text-ink-soft">Tap the heart on any piece to keep it here.</p>
          <Link href="/shop" className="btn btn-primary">Explore the collection</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
