"use client";
/**
 * SEARCH BOX with autocomplete (used in the Navbar).
 * Suggestions come from backend/lib/search.ts (crafts, regions, artisans, products). Supports
 * keyboard (arrows/Enter/Esc); Enter without a pick goes to /shop?q=<text>.
 */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, MapPin, User, Package } from "lucide-react";
import { suggest } from "@backend/lib/search";

const icons = { product: Package, craft: Sparkles, region: MapPin, artisan: User } as const;

export default function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();
  const items = useMemo(() => suggest(q), [q]);

  useEffect(() => {
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Close the list, clear the box and navigate to a suggestion / search results page.
  const go = (href: string) => {
    setOpen(false);
    setQ("");
    onNavigate?.();
    router.push(href);
  };

  const submit = () => {
    if (active >= 0 && items[active]) return go(items[active].href);
    if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={box} className="relative w-full" role="search">
      <label htmlFor={`${listId}-input`} className="sr-only">Search crafts, regions or artisans</label>
      <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
      <input
        id={`${listId}-input`}
        role="combobox"
        aria-expanded={open && items.length > 0}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        aria-autocomplete="list"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(items.length - 1, a + 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
          else if (e.key === "Enter") { e.preventDefault(); submit(); }
          else if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Search Ikat, Odisha, Rukmini…"
        className="w-full rounded-full border border-sand bg-white py-2.5 pl-10 pr-4 text-sm focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
      />
      {open && items.length > 0 && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-sand bg-white shadow-xl">
          {items.map((s, i) => {
            const Icon = icons[s.type];
            return (
              <li key={`${s.type}-${s.label}`} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(s.href)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${i === active ? "bg-linen-dark" : ""}`}
                >
                  <Icon aria-hidden className="h-4 w-4 shrink-0 text-brass" />
                  <span className="min-w-0 flex-1 truncate">{s.label}</span>
                  <span className="shrink-0 text-xs text-ink-soft">{s.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
