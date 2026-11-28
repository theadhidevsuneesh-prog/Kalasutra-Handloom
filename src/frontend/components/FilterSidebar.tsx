"use client";
/**
 * FILTER SIDEBAR for /shop.
 * `Group` = one checkbox section; `Panel` = all filters (category, craft, state, material,
 * price slider, in-stock toggle). Desktop shows Panel as a fixed sidebar; on mobile it
 * opens as a slide-over drawer. Filter values are stored in frontend/store/useFilters.ts.
 */

import { useEffect } from "react";
import { X } from "lucide-react";
import { categories, craftForms, materials, productStates } from "@/backend/data/products";
import { MAX_PRICE, useFilters } from "@/frontend/store/useFilters";
import { inr } from "@/shared/utils";

// One titled list of checkboxes (e.g. "Region / State").
function Group({ title, name, options, selected, onToggle }: { title: string; name: string; options: { value: string; label: string }[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <fieldset className="border-b border-sand pb-5">
      <legend className="mb-3 font-serif text-base font-semibold">{title}</legend>
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o.value} className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input type="checkbox" name={name} checked={selected.includes(o.value)} onChange={() => onToggle(o.value)} className="h-4 w-4 accent-terracotta" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// All filter controls together; reused in the desktop sidebar and the mobile drawer.
function Panel() {
  const f = useFilters();
  const opts = (xs: string[]) => xs.map((v) => ({ value: v, label: v }));
  return (
    <div className="space-y-5">
      <Group title="Category" name="category" options={categories.map((c) => ({ value: c.id, label: c.name }))} selected={f.categories} onToggle={(v) => f.toggle("categories", v)} />
      <Group title="Craft form" name="craft" options={opts(craftForms)} selected={f.craftForms} onToggle={(v) => f.toggle("craftForms", v)} />
      <Group title="Region / State" name="state" options={opts(productStates)} selected={f.states} onToggle={(v) => f.toggle("states", v)} />
      <Group title="Material" name="material" options={opts(materials)} selected={f.materials} onToggle={(v) => f.toggle("materials", v)} />
      <div className="border-b border-sand pb-5">
        <label htmlFor="price" className="mb-3 flex justify-between font-serif text-base font-semibold">Max price <span className="font-sans text-sm font-normal text-terracotta">{f.maxPrice >= MAX_PRICE ? "Any" : inr(f.maxPrice)}</span></label>
        <input id="price" type="range" min={500} max={MAX_PRICE} step={500} value={f.maxPrice} onChange={(e) => f.setMaxPrice(+e.target.value)} className="w-full accent-terracotta" />
        <div className="flex justify-between text-xs text-ink-soft"><span>₹500</span><span>₹20,000+</span></div>
      </div>
      <label className="flex cursor-pointer items-center justify-between text-sm font-medium">
        In stock only
        <input type="checkbox" role="switch" checked={f.inStockOnly} onChange={(e) => f.setInStockOnly(e.target.checked)} className="h-5 w-5 accent-terracotta" />
      </label>
      <button type="button" onClick={f.reset} className="text-sm font-semibold text-terracotta underline">Clear all filters</button>
    </div>
  );
}

/** Persistent sidebar on desktop, slide-over drawer on mobile. */
export default function FilterSidebar({ resultCount }: { resultCount: number }) {
  const open = useFilters((s) => s.drawerOpen);
  const setOpen = useFilters((s) => s.setDrawerOpen);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, setOpen]);

  return (
    <>
      <aside aria-label="Filters" className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-3 no-scrollbar"><Panel /></div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="anim-fade absolute inset-0 bg-charcoal/50" onClick={() => setOpen(false)} />
          <div className="anim-left absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-linen">
            <div className="flex items-center justify-between border-b border-sand px-5 py-4">
              <h2 className="text-xl">Filters</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close filters" className="p-2"><X aria-hidden className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5"><Panel /></div>
            <div className="border-t border-sand p-4"><button type="button" onClick={() => setOpen(false)} className="btn btn-primary w-full">Show {resultCount} results</button></div>
          </div>
        </div>
      )}
    </>
  );
}
