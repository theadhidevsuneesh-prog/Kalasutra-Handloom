"use client";
/**
 * CART DRAWER: the panel that slides in from the right when the cart is opened.
 * Shows items with quantity +/-, a free-shipping progress bar, a coupon box, the price
 * breakdown and the checkout button. Open/closed state is in store/useStore.ts.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag, Tag, Truck, X, Trash2 } from "lucide-react";
import { products } from "@/data/products";
import { computeTotals, useMounted, useShop } from "@/store/useStore";
import { FREE_SHIPPING_THRESHOLD, inr } from "@/lib/utils";
import SafeImage from "./SafeImage";

export default function CartDrawer() {
  const { cart, coupon, cartOpen, setCartOpen, setQty, removeFromCart, applyCoupon, removeCoupon } = useShop();
  const mounted = useMounted();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: lock page scrolling, focus the close button and let Esc close the drawer.
  useEffect(() => {
    if (!cartOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [cartOpen, setCartOpen]);

  if (!mounted || !cartOpen) return null;

  // Join each cart line with its product details (skips ids that no longer exist).
  const lines = cart.flatMap((l) => { const p = products.find((x) => x.id === l.productId); return p ? [{ ...l, p }] : []; });
  const t = computeTotals(cart, coupon);
  const progress = Math.min(100, ((t.subtotal - t.discount) / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="anim-fade absolute inset-0 bg-charcoal/50" onClick={() => setCartOpen(false)} />
      <aside className="anim-right absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-linen shadow-2xl">
        <header className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 className="text-xl">Your cart <span className="text-sm text-ink-soft">({lines.reduce((n, l) => n + l.qty, 0)})</span></h2>
          <button ref={closeRef} type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" className="rounded-full p-2 hover:bg-linen-dark"><X aria-hidden className="h-5 w-5" /></button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag aria-hidden className="h-12 w-12 text-brass" />
            <p className="font-serif text-xl">Your cart is empty</p>
            <p className="text-sm text-ink-soft">Every piece was made by hand. Find the one that speaks to you.</p>
            <Link href="/shop" onClick={() => setCartOpen(false)} className="btn btn-primary">Browse the shop</Link>
          </div>
        ) : (
          <>
            <div className="border-b border-sand px-5 py-3 text-sm">
              <p className="flex items-center gap-2">
                <Truck aria-hidden className="h-4 w-4 text-forest" />
                {t.toFree > 0 ? <span>Add <strong>{inr(t.toFree)}</strong> more for free shipping</span> : <span className="font-semibold text-forest">You&apos;ve unlocked free shipping!</span>}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free shipping">
                <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-sand overflow-y-auto px-5">
              {lines.map(({ p, qty }) => (
                <li key={p.id} className="flex gap-4 py-4">
                  <Link href={`/product/${p.slug}`} onClick={() => setCartOpen(false)} className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-linen-dark">
                    <SafeImage src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-ink-soft">{p.craftForm} · {p.state}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-sand bg-white" role="group" aria-label={`Quantity for ${p.name}`}>
                        <button type="button" aria-label="Decrease quantity" onClick={() => setQty(p.id, qty - 1)} className="p-2"><Minus aria-hidden className="h-3.5 w-3.5" /></button>
                        <span className="w-6 text-center text-sm" aria-live="polite">{qty}</span>
                        <button type="button" aria-label="Increase quantity" disabled={qty >= p.stock} onClick={() => setQty(p.id, qty + 1)} className="p-2 disabled:opacity-40"><Plus aria-hidden className="h-3.5 w-3.5" /></button>
                      </div>
                      <p className="text-sm font-semibold">{inr(p.price * qty)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFromCart(p.id)} aria-label={`Remove ${p.name}`} className="self-start p-1 text-ink-soft hover:text-terracotta"><Trash2 aria-hidden className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>

            <footer className="space-y-4 border-t border-sand bg-white px-5 py-4">
              {coupon ? (
                <p className="flex items-center justify-between rounded-lg bg-forest/10 px-3 py-2 text-sm text-forest">
                  <span className="flex items-center gap-2"><Tag aria-hidden className="h-4 w-4" /> {coupon} applied</span>
                  <button type="button" onClick={removeCoupon} className="text-xs underline">Remove</button>
                </p>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); const r = applyCoupon(code); setMsg({ ok: r.ok, text: r.message }); if (r.ok) setCode(""); }} className="space-y-1.5">
                  <div className="flex gap-2">
                    <label htmlFor="coupon" className="sr-only">Coupon code</label>
                    <input id="coupon" className="input !py-2 uppercase" placeholder="Coupon code (try HERITAGE10)" value={code} onChange={(e) => setCode(e.target.value)} />
                    <button type="submit" className="btn btn-outline !py-2">Apply</button>
                  </div>
                  {msg && <p role="status" className={`text-xs ${msg.ok ? "text-forest" : "text-terracotta"}`}>{msg.text}</p>}
                </form>
              )}
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
                {t.discount > 0 && <div className="flex justify-between text-forest"><dt>Discount</dt><dd>−{inr(t.discount)}</dd></div>}
                <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd>{t.shipping === 0 ? "Free" : inr(t.shipping)}</dd></div>
                <div className="flex justify-between border-t border-sand pt-2 text-base font-semibold"><dt>Total</dt><dd>{inr(t.total)}</dd></div>
                <p className="text-xs text-ink-soft">Inclusive of GST ({inr(t.includedTax)})</p>
              </dl>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn btn-primary w-full">Proceed to checkout</Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
