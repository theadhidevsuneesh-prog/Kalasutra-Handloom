"use client";

import { create } from "zustand";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export interface FilterState {
  query: string;
  categories: string[];
  craftForms: string[];
  states: string[];
  materials: string[];
  artisan: string | null;
  maxPrice: number;
  inStockOnly: boolean;
  sort: SortKey;
  drawerOpen: boolean;
  setQuery: (q: string) => void;
  toggle: (key: "categories" | "craftForms" | "states" | "materials", value: string) => void;
  setArtisan: (id: string | null) => void;
  setMaxPrice: (n: number) => void;
  setInStockOnly: (v: boolean) => void;
  setSort: (s: SortKey) => void;
  setDrawerOpen: (v: boolean) => void;
  reset: () => void;
}

export const MAX_PRICE = 20000;

const initial = {
  query: "",
  categories: [] as string[],
  craftForms: [] as string[],
  states: [] as string[],
  materials: [] as string[],
  artisan: null as string | null,
  maxPrice: MAX_PRICE,
  inStockOnly: false,
  sort: "featured" as SortKey,
};

export const useFilters = create<FilterState>((set) => ({
  ...initial,
  drawerOpen: false,
  setQuery: (query) => set({ query }),
  toggle: (key, value) =>
    set((s) => ({ [key]: s[key].includes(value) ? s[key].filter((v) => v !== value) : [...s[key], value] }) as Partial<FilterState>),
  setArtisan: (artisan) => set({ artisan }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly }),
  setSort: (sort) => set({ sort }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  reset: () => set({ ...initial }),
}));
