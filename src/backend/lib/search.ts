/**
 * SEARCH HELPERS.
 * - productMatches: true if every word typed appears in a product's name, craft, state,
 *   material, category or artisan. Used by /shop filtering.
 * - suggest: builds the autocomplete list for the search box.
 */
import { artisans, getArtisan } from "@/backend/data/artisans";
import { categoryLabel, products } from "@/backend/data/products";
import type { Product } from "@/shared/types";

// Used by the /shop filter: all typed words must appear somewhere in the product's searchable text.
export const productMatches =(p: Product, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [p.name, p.craftForm, p.state, p.material, categoryLabel(p.category), getArtisan(p.artisanId)?.name ?? "", getArtisan(p.artisanId)?.village ?? ""]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((t) => hay.includes(t));
};

export interface Suggestion {
  type: "product" | "craft" | "region" | "artisan";
  label: string;
  hint: string;
  href: string;
}

// Autocomplete: after 2+ letters, returns up to 8 matches (crafts, regions, artisans, then products).
export function suggest(query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const out: Suggestion[] = [];
  const crafts = Array.from(new Set(products.map((p) => p.craftForm)));
  crafts.filter((c) => c.toLowerCase().includes(q)).forEach((c) => out.push({ type: "craft", label: c, hint: "Craft form", href: `/shop?q=${encodeURIComponent(c)}` }));
  Array.from(new Set(products.map((p) => p.state)))
    .filter((s) => s.toLowerCase().includes(q))
    .forEach((s) => out.push({ type: "region", label: s, hint: "Region", href: `/shop?q=${encodeURIComponent(s)}` }));
  artisans
    .filter((a) => a.name.toLowerCase().includes(q) || a.village.toLowerCase().includes(q))
    .forEach((a) => out.push({ type: "artisan", label: a.name, hint: `Artisan · ${a.craft}`, href: `/shop?artisan=${a.id}` }));
  products
    .filter((p) => productMatches(p, q))
    .slice(0, 4)
    .forEach((p) => out.push({ type: "product", label: p.name, hint: p.craftForm, href: `/product/${p.slug}` }));
  return out.slice(0, 8);
}
