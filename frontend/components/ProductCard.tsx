"use client";
/**
 * PRODUCT CARD: the tile used in every product grid.
 * Shows two photos (second appears on hover), badges (GI Tagged, Sold out, Only N left),
 * craft/artisan/rating, price with discount, a wishlist heart and an Add-to-cart button.
 */

import Link from "next/link";
import { Heart, MapPin, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@backend/types";
import { getArtisan } from "@backend/data/artisans";
import { inr, cn } from "@backend/lib/utils";
import { useMounted, useShop } from "@/store/useStore";
import SafeImage from "./SafeImage";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useShop((s) => s.addToCart);
  const wished = useShop((s) => s.wishlist.includes(product.id));
  const toggleWishlist = useShop((s) => s.toggleWishlist);
  const mounted = useMounted();
  const artisan = getArtisan(product.artisanId);
  const out = product.stock === 0;
  const low = product.stock > 0 && product.stock <= 5;
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  // Only trust the saved wishlist after mount, otherwise server and browser HTML would differ.
  const isWished = mounted && wished;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand bg-white transition-shadow hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-linen-dark">
        <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`} className="block h-full">
          <SafeImage
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <SafeImage
            src={product.images[1] ?? product.images[0]}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
          />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && <span className="rounded-full bg-indigo px-2.5 py-1 text-[11px] font-semibold text-white">{product.badge}</span>}
          {out ? (
            <span className="rounded-full bg-charcoal px-2.5 py-1 text-[11px] font-semibold text-white">Sold out</span>
          ) : low ? (
            <span className="rounded-full bg-terracotta px-2.5 py-1 text-[11px] font-semibold text-white">Only {product.stock} left</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={isWished}
          aria-label={isWished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110"
        >
          <Heart aria-hidden className={cn("h-4 w-4", isWished ? "fill-terracotta text-terracotta" : "text-charcoal")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="kicker !text-[10px]">{product.craftForm}</p>
        <h3 className="line-clamp-2 text-base leading-snug">
          <Link href={`/product/${product.slug}`} className="hover:text-terracotta">{product.name}</Link>
        </h3>
        <p className="flex items-center gap-1 text-xs text-ink-soft">
          <MapPin aria-hidden className="h-3 w-3" />
          {artisan?.name} · {product.state}
        </p>
        <p className="flex items-center gap-1 text-xs text-ink-soft">
          <Star aria-hidden className="h-3 w-3 fill-brass text-brass" />
          <span>{product.rating}</span>
          <span aria-label={`${product.reviews} reviews`}>({product.reviews})</span>
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-lg font-semibold">{inr(product.price)}</p>
            <p className="text-xs text-ink-soft">
              <s>{inr(product.mrp)}</s> <span className="font-semibold text-forest">{off}% off</span>
            </p>
          </div>
          <button
            type="button"
            disabled={out}
            onClick={() => addToCart(product.id)}
            aria-label={out ? `${product.name} is sold out` : `Add ${product.name} to cart`}
            className="btn btn-primary !px-4 !py-2.5"
          >
            <ShoppingBag aria-hidden className="h-4 w-4" />
            <span className="hidden sm:inline">{out ? "Sold out" : "Add"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
