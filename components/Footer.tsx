"use client";
// FOOTER: site links, category links and a (demo) newsletter box; shown on every page via app/layout.tsx.

import Link from "next/link";
import { Leaf, Mail } from "lucide-react";
import { categories } from "@/data/products";

export default function Footer() {
  return (
    <footer className="mt-24 bg-indigo text-linen">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="flex items-center gap-2 font-serif text-2xl font-bold"><Leaf aria-hidden className="h-5 w-5 text-brass" /> KalaSutra</p>
          <p className="text-sm leading-relaxed text-linen/75">
            Handcrafted textiles, pottery and metalwork from India&apos;s artisan clusters, shipped directly from the maker with fair wages built into every price.
          </p>
        </div>
        <nav aria-label="Shop categories">
          <h2 className="mb-4 font-serif text-lg text-brass-light">Shop</h2>
          <ul className="space-y-2 text-sm text-linen/80">
            {categories.map((c) => (
              <li key={c.id}><Link className="hover:text-white" href={`/shop?category=${c.id}`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 className="mb-4 font-serif text-lg text-brass-light">Our Story</h2>
          <ul className="space-y-2 text-sm text-linen/80">
            <li><Link className="hover:text-white" href="/artisans">Meet the makers</Link></li>
            <li><Link className="hover:text-white" href="/#trust">Authenticity &amp; marks</Link></li>
            <li><Link className="hover:text-white" href="/wishlist">Your wishlist</Link></li>
            <li><Link className="hover:text-white" href="/checkout">Checkout</Link></li>
            <li><Link className="hover:text-white" href="/credits">Photo credits</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 font-serif text-lg text-brass-light">Stories from the loom</h2>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter">
            <label htmlFor="nl" className="sr-only">Email address</label>
            <input id="nl" type="email" required placeholder="you@example.com" className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm placeholder:text-linen/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-brass" />
            <button type="submit" aria-label="Subscribe" className="btn btn-primary !px-4"><Mail aria-hidden className="h-4 w-4" /></button>
          </form>
          <p className="mt-3 text-xs text-linen/60">One letter a month. No spam.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-linen/60">
        © {new Date().getFullYear()} KalaSutra Handicrafts &amp; Handloom. A demo storefront with sample data.
      </div>
    </footer>
  );
}
