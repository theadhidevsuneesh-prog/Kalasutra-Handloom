"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, ShoppingBag, X, Leaf } from "lucide-react";
import SearchBox from "./SearchBox";
import { useMounted, useShop } from "@/store/useStore";
import { cn } from "@/lib/utils";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=handloom", label: "Handloom" },
  { href: "/artisans", label: "Our Artisans" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const mounted = useMounted();
  const count = useShop((s) => s.cart.reduce((n, l) => n + l.qty, 0));
  const wishCount = useShop((s) => s.wishlist.length);
  const setCartOpen = useShop((s) => s.setCartOpen);

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-linen/90 backdrop-blur">
      <div className="bg-indigo py-1.5 text-center text-xs text-white">
        Free shipping above ₹2,999 · Use <strong className="text-brass-light">HERITAGE10</strong> for 10% off your first order
      </div>
      <nav aria-label="Main" className="container-x flex h-16 items-center gap-4">
        <button type="button" className="-ml-2 p-2 lg:hidden" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}>
          <Menu aria-hidden className="h-6 w-6" />
        </button>
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-indigo">
          <Leaf aria-hidden className="h-5 w-5 text-terracotta" />
          <span>Kala<span className="text-terracotta">Sutra</span></span>
        </Link>
        <ul className="ml-6 hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={cn("text-sm font-medium transition-colors hover:text-terracotta", pathname === l.href.split("?")[0] && l.label !== "Handloom" && "text-terracotta")}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto hidden w-full max-w-sm md:block"><SearchBox /></div>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link href="/wishlist" aria-label={`Wishlist${mounted ? `, ${wishCount} items` : ""}`} className="relative rounded-full p-2.5 hover:bg-linen-dark">
            <Heart aria-hidden className="h-5 w-5" />
            {mounted && wishCount > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-white">{wishCount}</span>}
          </Link>
          <button type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart${mounted ? `, ${count} items` : ""}`} className="relative rounded-full p-2.5 hover:bg-linen-dark">
            <ShoppingBag aria-hidden className="h-5 w-5" />
            {mounted && count > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-white">{count}</span>}
          </button>
        </div>
      </nav>

      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="anim-fade absolute inset-0 bg-charcoal/50" onClick={() => setMenu(false)} />
          <div className="anim-left absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col gap-6 bg-linen p-5">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl font-bold text-indigo">KalaSutra</span>
              <button type="button" onClick={() => setMenu(false)} aria-label="Close menu" className="p-2"><X aria-hidden className="h-5 w-5" /></button>
            </div>
            <SearchBox onNavigate={() => setMenu(false)} />
            <ul className="flex flex-col divide-y divide-sand">
              {[...links, { href: "/wishlist", label: "Wishlist" }].map((l) => (
                <li key={l.href}><Link href={l.href} className="block py-3.5 font-serif text-lg">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
