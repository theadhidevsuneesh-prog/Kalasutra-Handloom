"use client";
// HOME > ARTISAN SPOTLIGHT: carousel of the first 5 artisan communities (prev/next buttons + dots), each with 2 of their products.

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Quote } from "lucide-react";
import { artisans } from "@/data/artisans";
import { getProductsByArtisan } from "@/data/products";
import { inr } from "@/lib/utils";
import SafeImage from "../SafeImage";

const featured = artisans.slice(0, 5);

export default function ArtisanSpotlight() {
  const [i, setI] = useState(0);
  const a = featured[i];
  const items = getProductsByArtisan(a.id).slice(0, 2);
  const go = (d: number) => setI((n) => (n + d + featured.length) % featured.length);

  return (
    <section aria-roledescription="carousel" aria-labelledby="spotlight" className="mt-24 bg-linen-dark py-16">
      <div className="container-x">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="kicker">Featured artisan</p>
            <h2 id="spotlight" className="mt-2 text-3xl sm:text-4xl">The hands behind the craft</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Previous artisan" className="rounded-full border border-charcoal/20 p-2.5 hover:bg-white"><ChevronLeft aria-hidden className="h-5 w-5" /></button>
            <button type="button" onClick={() => go(1)} aria-label="Next artisan" className="rounded-full border border-charcoal/20 p-2.5 hover:bg-white"><ChevronRight aria-hidden className="h-5 w-5" /></button>
          </div>
        </div>

        <article key={a.id} aria-live="polite" aria-label={`${i + 1} of ${featured.length}: ${a.name}`} className="anim-fade grid gap-8 overflow-hidden rounded-3xl bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-5 lg:gap-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:col-span-2 lg:aspect-auto lg:min-h-[28rem]">
            <SafeImage src={a.image} alt={`Portrait of ${a.name}`} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-5 py-2 lg:col-span-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm text-ink-soft"><MapPin aria-hidden className="h-4 w-4 text-terracotta" />{a.village}, {a.district} · {a.state}</p>
              <h3 className="mt-2 text-3xl">{a.name}</h3>
              <p className="text-sm font-semibold text-indigo">{a.craft}{a.generation ? ` · ${a.generation}` : ""}</p>
            </div>
            <p className="leading-relaxed text-ink-soft">{a.story}</p>
            {a.quote && (
              <blockquote className="flex gap-3 rounded-xl bg-linen p-4 font-serif italic">
                <Quote aria-hidden className="h-5 w-5 shrink-0 text-brass" />{a.quote}
              </blockquote>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="flex items-center gap-3 rounded-xl border border-sand p-2.5 transition hover:border-terracotta hover:shadow">
                  <SafeImage src={p.images[0]} alt="" className="h-16 w-14 shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 text-sm"><span className="line-clamp-2 font-medium">{p.name}</span><span className="text-terracotta">{inr(p.price)}</span></span>
                </Link>
              ))}
            </div>
            <Link href={`/shop?artisan=${a.id}`} className="btn btn-indigo self-start">Shop their collection <ArrowRight aria-hidden className="h-4 w-4" /></Link>
          </div>
        </article>

        <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Choose artisan">
          {featured.map((f, n) => (
            <button key={f.id} role="tab" aria-selected={n === i} aria-label={f.name} onClick={() => setI(n)} className={`h-2 rounded-full transition-all ${n === i ? "w-8 bg-terracotta" : "w-2 bg-charcoal/25"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
