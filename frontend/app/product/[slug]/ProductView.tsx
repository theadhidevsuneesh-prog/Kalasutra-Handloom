"use client";
/**
 * PRODUCT PAGE UI: everything interactive on a product page.
 * Sections: image gallery (thumbnails + hover zoom), price/stock/quantity/add-to-cart/
 * wishlist, info tabs (craft details, meet your maker, care), and a related-products carousel.
 */

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Heart, MapPin, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck, ZoomIn } from "lucide-react";
import type { Artisan, Product } from "@backend/types";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import { categoryLabel } from "@backend/data/products";
import { cn, inr } from "@backend/lib/utils";
import { useMounted, useShop } from "@/store/useStore";

const tabs = ["Craft details", "Meet your maker", "Care"] as const;

export default function ProductView({ product: p, artisan: a, related }: { product: Product; artisan: Artisan; related: Product[] }) {
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Craft details");
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const carousel = useRef<HTMLUListElement>(null);
  const addToCart = useShop((s) => s.addToCart);
  const wished = useShop((s) => s.wishlist.includes(p.id));
  const toggleWishlist = useShop((s) => s.toggleWishlist);
  const mounted = useMounted();

  const out = p.stock === 0;
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const scroll = (d: number) => carousel.current?.scrollBy({ left: d * 300, behavior: "smooth" });

  return (
    <div className="container-x py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-terracotta">Home</Link></li><li aria-hidden>/</li>
          <li><Link href={`/shop?category=${p.category}`} className="hover:text-terracotta">{categoryLabel(p.category)}</Link></li><li aria-hidden>/</li>
          <li aria-current="page" className="truncate text-charcoal">{p.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <section aria-label="Product images" className="flex flex-col-reverse gap-3 sm:flex-row">
          <ul className="flex gap-2 sm:flex-col">
            {p.images.map((src, i) => (
              <li key={src}>
                <button type="button" onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} aria-current={i === active} className={cn("h-16 w-14 overflow-hidden rounded-lg border-2 sm:h-20 sm:w-16", i === active ? "border-terracotta" : "border-transparent opacity-70 hover:opacity-100")}>
                  <SafeImage src={src} alt="" className="h-full w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
          <div
            className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-linen-dark"
            onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
            onMouseLeave={() => setZoom(null)}
          >
            <SafeImage
              src={p.images[active]}
              alt={`${p.name}, image ${active + 1}`}
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-150"
            />
            {zoom && (
              <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-no-repeat md:block" style={{ backgroundImage: `url(${p.images[active]})`, backgroundSize: "220%", backgroundPosition: `${zoom.x}% ${zoom.y}%` }} />
            )}
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs"><ZoomIn aria-hidden className="h-3.5 w-3.5" /> Hover to zoom</span>
            {p.badge && <span className="absolute left-3 top-3 rounded-full bg-indigo px-3 py-1 text-xs font-semibold text-white">{p.badge}</span>}
          </div>
        </section>

        {/* Info */}
        <section aria-labelledby="pname" className="space-y-5">
          <div>
            <p className="kicker">{p.craftForm} · {p.state}</p>
            <h1 id="pname" className="mt-2 text-3xl leading-tight sm:text-4xl">{p.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm"><Star aria-hidden className="h-4 w-4 fill-brass text-brass" /><strong>{p.rating}</strong><span className="text-ink-soft">({p.reviews} reviews)</span></p>
          </div>

          <div>
            <p className="flex items-baseline gap-3"><span className="text-3xl font-semibold">{inr(p.price)}</span><s className="text-ink-soft">{inr(p.mrp)}</s><span className="text-sm font-semibold text-forest">{off}% off</span></p>
            <p className="text-xs text-ink-soft">Inclusive of all taxes (GST 5%) · Shipping calculated at checkout</p>
          </div>

          <p className="leading-relaxed text-ink-soft">{p.description}</p>
          <ul className="space-y-1.5 text-sm">{p.highlights.map((h) => <li key={h} className="flex gap-2"><ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-forest" />{h}</li>)}</ul>

          <p role="status" className={cn("text-sm font-semibold", out ? "text-terracotta" : p.stock <= 5 ? "text-terracotta" : "text-forest")}>
            {out ? "Currently sold out" : p.stock <= 5 ? `Only ${p.stock} left in stock, made to order in small batches` : `In stock (${p.stock} available)`}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-sand bg-white" role="group" aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" disabled={qty <= 1 || out} onClick={() => setQty((q) => q - 1)} className="p-3 disabled:opacity-40"><Minus aria-hidden className="h-4 w-4" /></button>
              <output aria-live="polite" className="w-8 text-center font-medium">{qty}</output>
              <button type="button" aria-label="Increase quantity" disabled={qty >= p.stock} onClick={() => setQty((q) => q + 1)} className="p-3 disabled:opacity-40"><Plus aria-hidden className="h-4 w-4" /></button>
            </div>
            <button type="button" disabled={out} onClick={() => addToCart(p.id, qty)} className="btn btn-primary flex-1 !py-3.5"><ShoppingBag aria-hidden className="h-4 w-4" />{out ? "Sold out" : "Add to cart"}</button>
            <button type="button" onClick={() => toggleWishlist(p.id)} aria-pressed={mounted && wished} aria-label={mounted && wished ? "Remove from wishlist" : "Save to wishlist"} className="rounded-full border border-sand bg-white p-3.5 hover:border-terracotta">
              <Heart aria-hidden className={cn("h-5 w-5", mounted && wished && "fill-terracotta text-terracotta")} />
            </button>
          </div>

          <div className="grid gap-3 rounded-xl bg-linen-dark p-4 text-sm sm:grid-cols-2">
            <p className="flex items-start gap-2"><Truck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />Free shipping above ₹2,999. Delivered in 5–8 days.</p>
            <p className="flex items-start gap-2"><Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />Crafted over {p.productionDays} days by hand.</p>
          </div>
        </section>
      </div>

      {/* Tabs */}
      <section aria-label="Product information" className="mt-14">
        <div role="tablist" aria-label="Product details" className="flex gap-1 overflow-x-auto border-b border-sand no-scrollbar">
          {tabs.map((t) => (
            <button key={t} role="tab" id={`tab-${t}`} aria-selected={tab === t} aria-controls="tabpanel" onClick={() => setTab(t)} className={cn("whitespace-nowrap border-b-2 px-5 py-3 font-serif text-lg transition", tab === t ? "border-terracotta text-terracotta" : "border-transparent text-ink-soft hover:text-charcoal")}>{t}</button>
          ))}
        </div>
        <div id="tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="anim-fade pt-8" key={tab}>
          {tab === "Craft details" && (
            <dl className="grid gap-x-10 gap-y-5 md:grid-cols-2">
              {[["Material composition", p.composition], ["Natural dyes & finish", p.dyeInfo], ["Dimensions", p.dimensions], ["Authenticity certificate", p.certificate]].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-sand bg-white p-5"><dt className="kicker !text-[11px]">{k}</dt><dd className="mt-1.5 leading-relaxed">{v}</dd></div>
              ))}
            </dl>
          )}
          {tab === "Meet your maker" && (
            <div className="grid gap-8 rounded-2xl border border-sand bg-white p-5 sm:p-8 md:grid-cols-3">
              <div className="aspect-square overflow-hidden rounded-2xl bg-linen-dark md:aspect-[4/5]"><SafeImage src={a.image} alt={`Portrait of ${a.name}`} className="h-full w-full object-cover" /></div>
              <div className="space-y-4 md:col-span-2">
                <p className="kicker">Meet your weaver / maker</p>
                <h2 className="text-3xl">{a.name}</h2>
                <p className="flex items-center gap-1.5 text-sm text-ink-soft"><MapPin aria-hidden className="h-4 w-4 text-terracotta" />{a.village}, {a.district}, {a.state} · {a.cluster}</p>
                <p className="leading-relaxed text-ink-soft">{a.story}</p>
                <dl className="grid grid-cols-2 gap-3 text-center text-sm sm:grid-cols-3">
                  <div className="rounded-xl bg-linen-dark p-3"><dt className="text-xs text-ink-soft">Time to make</dt><dd className="font-serif text-xl font-bold text-indigo">{p.productionDays} days</dd></div>
                  {a.yearsOfPractice !== undefined && <div className="rounded-xl bg-linen-dark p-3"><dt className="text-xs text-ink-soft">Practising for</dt><dd className="font-serif text-xl font-bold text-indigo">{a.yearsOfPractice} yrs</dd></div>}
                  {a.teamSize !== undefined && <div className="rounded-xl bg-linen-dark p-3"><dt className="text-xs text-ink-soft">Cluster size</dt><dd className="font-serif text-xl font-bold text-indigo">{a.teamSize}</dd></div>}
                  {a.giTag && <div className="rounded-xl bg-linen-dark p-3"><dt className="text-xs text-ink-soft">Authenticity</dt><dd className="font-serif text-base font-bold text-indigo">GI registered</dd></div>}
                </dl>
                <Link href={`/shop?artisan=${a.id}`} className="btn btn-outline">More from {a.name.split(" ")[0]}</Link>
              </div>
            </div>
          )}
          {tab === "Care" && (
            <ul className="grid gap-3 md:grid-cols-2">{p.care.map((c) => <li key={c} className="flex gap-3 rounded-xl border border-sand bg-white p-4 text-sm"><ShieldCheck aria-hidden className="h-5 w-5 shrink-0 text-forest" />{c}</li>)}</ul>
          )}
        </div>
      </section>

      {/* Related */}
      <section aria-labelledby="rel" className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="rel" className="text-2xl sm:text-3xl">Pairs beautifully with</h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left" className="rounded-full border border-charcoal/20 p-2 hover:bg-white"><ChevronLeft aria-hidden className="h-5 w-5" /></button>
            <button type="button" onClick={() => scroll(1)} aria-label="Scroll right" className="rounded-full border border-charcoal/20 p-2 hover:bg-white"><ChevronRight aria-hidden className="h-5 w-5" /></button>
          </div>
        </div>
        <ul ref={carousel} className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-2">
          {related.map((r) => <li key={r.id} className="w-64 shrink-0 snap-start sm:w-72"><ProductCard product={r} /></li>)}
        </ul>
      </section>
    </div>
  );
}
