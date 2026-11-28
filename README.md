# KalaSutra: Artisan Handicrafts & Handloom

A modern, responsive direct-to-consumer storefront for Indian handicrafts and handloom, built with Next.js, TypeScript and Tailwind CSS. It showcases real craft traditions from 25 states, with real photographs and artisan community profiles.

**Live demo:** https://kalasutra-handloom.vercel.app

> Preserving Heritage, Empowering Artisans

## Features

- **Home:** hero, animated impact counters, curated collections, bestsellers, featured-artisan carousel, testimonials and heritage trust badges (Silk Mark, Craft Mark, Handloom Mark).
- **Shop (`/shop`):** filter by category, craft form, state, material, price and stock; sort; instant search with autocomplete by craft, region or artisan; mobile filter drawer.
- **Product page (`/product/[slug]`):** image gallery with zoom, tax-inclusive price, stock and quantity, craft details, "Meet your maker" tab, care guide and recommendations.
- **Cart and checkout:** slide-over cart with coupons (`HERITAGE10`, `WEAVE15`) and free-shipping progress; multi-step checkout (address, delivery, UPI / card / net banking / COD, review).
- **Artisans (`/artisans`):** 41 craft communities with a clickable cluster map, state filters and links to their products.
- **Wishlist and photo credits** pages; cart and wishlist persist in the browser.
- Accessible, mobile-first UI with semantic HTML, ARIA attributes and reduced-motion support.

## Tech stack

Next.js 16 (App Router) · React · TypeScript · Tailwind CSS 4 · Zustand · Lucide React

## Getting started

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Project structure

```
frontend/              everything visitors see: pages, CSS, components, client state, Next.js config
  app/                 pages/routes (home, shop, product, checkout, artisans, wishlist, credits) + globals.css
  components/          Navbar, Footer, ProductCard, ArtisanCard, CartDrawer, FilterSidebar, home sections
  store/               browser state (Zustand): cart/wishlist and shop filters
  package.json, next.config.ts, tsconfig.json, postcss.config.mjs
backend/               data and logic (there is no separate server or database)
  data/                products.ts, artisans.ts
  lib/                 images.ts (photo library with credits), search.ts, utils.ts (prices, shipping, coupons)
  types/               shared TypeScript types
```

Each of `frontend/` and `backend/` has its own short README.

## Where to find what (quick guide)

Every source file starts with a comment explaining what it does. Common tasks:

| I want to… | Edit this |
| --- | --- |
| Add or change a product | `backend/data/products.ts` (add to `baseProducts`, then add its photos to `imageMap`) |
| Add a craft community | `backend/data/artisans.ts` (append a `c(...)` entry) |
| Add a photo | `backend/lib/images.ts` (new entry with author and licence) |
| Change colours or fonts | `frontend/app/globals.css` (`@theme` block) |
| Change coupons or shipping rules | `backend/lib/utils.ts` |
| Change cart or price logic | `frontend/store/useStore.ts` |
| Change shop filters | `frontend/components/FilterSidebar.tsx`, `frontend/store/useFilters.ts`, `frontend/app/shop/ShopClient.tsx` |
| Change the homepage | `frontend/app/page.tsx` and `frontend/components/home/*` |

## About the data

- `backend/data/artisans.ts`: real craft communities and clusters (GI-registered traditions where applicable), described factually. No individual is named or quoted.
- `backend/data/products.ts`: products represent real craft traditions, but listings, **prices, stock and ratings are illustrative**. They are not real sellers or inventory.
- The state-by-state list of crafts follows the Indiahandmade article "All India Handicrafts Week 2025". Their photos were not copied.
- Photographs come from Wikimedia Commons under free licences. See `/credits` or `backend/lib/images.ts` for each author and licence.
- Checkout is a demo: no payment is processed and nothing is stored on a server.

## Deployment

Deployed on Vercel. Because the app now lives in `frontend/` and imports `../backend`, the Vercel project needs **Root Directory = `frontend`** with "Include source files outside of the Root Directory" enabled.
