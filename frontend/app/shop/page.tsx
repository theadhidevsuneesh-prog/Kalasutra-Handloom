/**
 * SHOP PAGE ( /shop ): server wrapper.
 * The real UI is in ShopClient. It reads the URL (?q=, ?category=, ?artisan=), which in
 * Next.js must sit inside <Suspense>, hence this thin wrapper.
 */
import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = { title: "Shop Handcrafted Pieces" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-x py-24 text-center text-ink-soft">Loading the collection…</div>}>
      <ShopClient />
    </Suspense>
  );
}
