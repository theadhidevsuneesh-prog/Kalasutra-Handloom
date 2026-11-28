// HOME > COLLECTIONS: image tiles for each category (from `categories` in backend/data/products.ts); each links to /shop?category=<id>.
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@backend/data/products";
import SafeImage from "../SafeImage";

export default function Collections() {
  return (
    <section aria-labelledby="collections" className="container-x pt-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="kicker">Curated collections</p>
          <h2 id="collections" className="mt-2 text-3xl sm:text-4xl">Shop by craft</h2>
        </div>
        <Link href="/shop" className="hidden text-sm font-semibold text-terracotta sm:inline">View all →</Link>
      </div>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/shop?category=${c.id}`}
              className={`group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br sm:aspect-[4/3] ${c.gradient}`}
            >
              <SafeImage src={c.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white sm:p-5">
                <div>
                  <h3 className="text-lg leading-tight sm:text-xl">{c.name}</h3>
                  <p className="mt-1 hidden text-sm text-white/80 sm:block">{c.tagline}</p>
                </div>
                <ArrowUpRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
