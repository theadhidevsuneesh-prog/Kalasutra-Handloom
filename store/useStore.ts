"use client";
/**
 * CART & WISHLIST STORE (Zustand).
 * Holds the cart lines, wishlist ids, applied coupon and whether the cart drawer is open.
 * Cart, wishlist and coupon are saved in the browser's localStorage (persist), so they
 * survive a refresh. Also exports computeTotals (price maths) and useMounted (avoids
 * server/browser mismatch when showing saved data).
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { COUPONS, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/utils";

export interface CartLine {
  productId: string;
  qty: number;
}

interface ShopState {
  cart: CartLine[];
  wishlist: string[];
  coupon: string | null;
  cartOpen: boolean;
  addToCart: (productId: string, qty?: number, open?: boolean) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  setCartOpen: (open: boolean) => void;
}

const stockOf = (id: string) => products.find((p) => p.id === id)?.stock ?? 0;

// The main store. Use as: const cart = useShop((s) => s.cart);
export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      coupon: null,
      cartOpen: false,
      addToCart: (productId, qty = 1, open = true) =>
        set((s) => {
          const max = stockOf(productId);
          if (max === 0) return s;
          const existing = s.cart.find((l) => l.productId === productId);
          const cart = existing
            ? s.cart.map((l) => (l.productId === productId ? { ...l, qty: Math.min(max, l.qty + qty) } : l))
            : [...s.cart, { productId, qty: Math.min(max, qty) }];
          return { cart, cartOpen: open ? true : s.cartOpen };
        }),
      setQty: (productId, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((l) => l.productId !== productId)
              : s.cart.map((l) => (l.productId === productId ? { ...l, qty: Math.min(stockOf(productId), qty) } : l)),
        })),
      removeFromCart: (productId) => set((s) => ({ cart: s.cart.filter((l) => l.productId !== productId) })),
      clearCart: () => set({ cart: [], coupon: null }),
      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId) ? s.wishlist.filter((i) => i !== productId) : [...s.wishlist, productId],
        })),
      applyCoupon: (code) => {
        const key = code.trim().toUpperCase();
        const c = COUPONS[key];
        if (!c) return { ok: false, message: "That code isn't valid." };
        const subtotal = cartSubtotal(get().cart);
        if (subtotal < c.min) return { ok: false, message: `Add items worth ₹${c.min.toLocaleString("en-IN")} to use ${key}.` };
        set({ coupon: key });
        return { ok: true, message: `${key} applied: ${c.label}` };
      },
      removeCoupon: () => set({ coupon: null }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
    }),
    {
      name: "artisan-handloom-store",
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, coupon: s.coupon }),
    },
  ),
);

// Sum of (price x quantity) for every cart line, before discount/shipping.
export const cartSubtotal =(cart: CartLine[]) =>
  cart.reduce((sum, l) => sum + (products.find((p) => p.id === l.productId)?.price ?? 0) * l.qty, 0);

// Price breakdown used by the cart drawer and checkout:
// subtotal -> coupon discount -> shipping (free above the threshold) + extra fees -> total.
// `deliveryFee` = extra charges chosen at checkout (express delivery, COD handling).
export function computeTotals(cart: CartLine[], coupon: string | null, deliveryFee = 0) {
  const subtotal = cartSubtotal(cart);
  const c = coupon ? COUPONS[coupon] : undefined;
  const discount = c && subtotal >= c.min ? Math.round((subtotal * c.value) / 100) : 0;
  const afterDiscount = subtotal - discount;
  const baseShipping = afterDiscount === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const shipping = baseShipping + deliveryFee;
  // Prices are GST-inclusive; show the embedded tax (handicrafts ≈ 5%)
  const includedTax = Math.round(afterDiscount - afterDiscount / 1.05);
  return { subtotal, discount, shipping, includedTax, total: afterDiscount + shipping, toFree: Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount) };
}

/** Avoids hydration mismatches for persisted state. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
