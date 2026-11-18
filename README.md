# KalaSutra – Artisan Handicrafts & Handloom

A D2C storefront demo built with Next.js (App Router), TypeScript, Tailwind CSS, Zustand and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Pages

`/` home · `/shop` catalog with filters and search · `/product/[slug]` · `/checkout` · `/artisans` · `/wishlist`

## About the data

- `data/artisans.ts`: real craft communities and clusters (GI-registered traditions where applicable) across 25 states, described factually. No individual is named or quoted.
- `data/products.ts`: products represent real craft traditions, but listings, prices, stock and ratings are **illustrative**. They do not represent real sellers or inventory.
- `lib/images.ts`: real photographs of each craft from Wikimedia Commons, with author and licence, shown on `/credits`.
- Craft-by-state information follows the list in the Indiahandmade "All India Handicrafts Week 2025" article. Their photos were not copied.
- Checkout is a demo; no payment is processed.
