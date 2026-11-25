// SHARED TYPES: the shape of Category, Artisan, Product and Testimonial data used across the site.
export type CategoryId = "handloom" | "pottery" | "brass" | "wood" | "apparel" | "art";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
  gradient: string;
}

export interface Artisan {
  id: string;
  name: string;
  craft: string;
  village: string;
  district: string;
  state: string;
  cluster: string;
  /** approximate lat/lng of the cluster, used for the schematic map */
  coords: [number, number];
  /** Optional: only set where the figure is known (omitted for community entries) */
  yearsOfPractice?: number;
  generation?: string;
  teamSize?: number;
  image: string;
  story: string;
  quote?: string;
  /** true when the entry describes a real craft community/cluster rather than a single named maker */
  community?: boolean;
  giTag?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  craftForm: string;
  category: CategoryId;
  artisanId: string;
  state: string;
  material: string;
  price: number;
  mrp: number;
  stock: number;
  rating: number;
  reviews: number;
  badge?: "Bestseller" | "New" | "GI Tagged" | "Limited";
  images: string[];
  description: string;
  highlights: string[];
  dyeInfo: string;
  composition: string;
  dimensions: string;
  care: string[];
  certificate: string;
  productionDays: number;
}

export interface Testimonial {
  name: string;
  city: string;
  quote: string;
  product: string;
}
