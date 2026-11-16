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
