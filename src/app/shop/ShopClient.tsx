"use client";
/**
 * SHOP PAGE UI: product catalog with filtering, sorting and search.
 * - Filter state lives in frontend/store/useFilters.ts.
 * - On load/URL change the filters are reset and seeded from the URL query.
 * - `results` applies every filter, then the chosen sort order.
 * - Shows removable "chips" for active filters, and the filter sidebar/drawer.
 */

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/frontend/components/ProductCard";
import FilterSidebar from "@/frontend/components/FilterSidebar";
import { categories, products } from "@/backend/data/products";
import { getArtisan } from "@/backend/data/artisans";
import { productMatches } from "@/backend/lib/search";
import { useFilters, MAX_PRICE, type SortKey } from "@/frontend/store/useFilters";

const sorts: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
];

export default function ShopClient() {
  const params = useSearchParams();
  const f = useFilters();
  const qs = params.toString();

  // Seed filters from the URL (deep links from nav, search, artisan pages)
  useEffect(() => {
    const s = useFilters.getState();
    s.reset();
    const q = params.get("q");
    const cat = params.get("category");
    const artisan = params.get("artisan");
    if (q) s.setQuery(q);
    if (cat) s.toggle("categories", cat);
    if (artisan) s.setArtisan(artisan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  // Apply search text + every selected filter, then sort. Recomputed only when a filter changes.
  const results = useMemo(() => {
    const list = products.filter(
      (p) =>
        productMatches(p, f.query) &&
        (!f.categories.length || f.categories.includes(p.category)) &&
        (!f.craftForms.length || f.craftForms.includes(p.craftForm)) &&
        (!f.states.length || f.states.includes(p.state)) &&
        (!f.materials.length || f.materials.includes(p.material)) &&
        (!f.artisan || p.artisanId === f.artisan) &&
        p.price <= f.maxPrice &&
        (!f.inStockOnly || p.stock > 0),
    );
    const sorted = [...list];
    if (f.sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (f.sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (f.sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (f.sort === "newest") sorted.sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New"));
    return sorted;
  }, [f.query, f.categories, f.craftForms, f.states, f.materials, f.artisan, f.maxPrice, f.inStockOnly, f.sort]);

  // One removable "chip" per active filter, shown above the grid.
  const chips = [
    ...(f.query ? [{ label: `“${f.query}”`, clear: () => f.setQuery("") }] : []),
    ...(f.artisan ? [{ label: getArtisan(f.artisan)?.name ?? f.artisan, clear: () => f.setArtisan(null) }] : []),
    ...f.categories.map((c) => ({ label: categories.find((x) => x.id === c)?.name ?? c, clear: () => f.toggle("categories", c) })),
    ...f.craftForms.map((c) => ({ label: c, clear: () => f.toggle("craftForms", c) })),
    ...f.states.map((c) => ({ label: c, clear: () => f.toggle("states", c) })),
    ...f.materials.map((c) => ({ label: c, clear: () => f.toggle("materials", c) })),
    ...(f.maxPrice < MAX_PRICE ? [{ label: `Under ₹${f.maxPrice.toLocaleString("en-IN")}`, clear: () => f.setMaxPrice(MAX_PRICE) }] : []),
  ];

  return (
    <div className="container-x py-10">
      <header className="mb-8">
        <p className="kicker">The collection</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Shop handcrafted pieces</h1>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => f.setDrawerOpen(true)} className="btn btn-outline !py-2 lg:hidden"><SlidersHorizontal aria-hidden className="h-4 w-4" /> Filters</button>
        <p className="text-sm text-ink-soft" role="status" aria-live="polite">{results.length} {results.length === 1 ? "piece" : "pieces"}</p>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <label htmlFor="sort" className="text-ink-soft">Sort by</label>
          <select id="sort" value={f.sort} onChange={(e) => f.setSort(e.target.value as SortKey)} className="input !w-auto !py-2">
            {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="mb-6 flex flex-wrap gap-2" aria-label="Active filters">
          {chips.map((c) => (
            <li key={c.label}>
              <button type="button" onClick={c.clear} className="flex items-center gap-1.5 rounded-full bg-indigo/10 px-3 py-1.5 text-xs font-medium text-indigo hover:bg-indigo/20">
                {c.label} <X aria-label="Remove filter" className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-10">
        <FilterSidebar resultCount={results.length} />
        <div className="min-w-0 flex-1">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sand p-12 text-center">
              <p className="font-serif text-2xl">Nothing matches just yet</p>
              <p className="mt-2 text-sm text-ink-soft">Try removing a filter or searching for a different craft or region.</p>
              <button type="button" onClick={f.reset} className="btn btn-primary mt-5">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
