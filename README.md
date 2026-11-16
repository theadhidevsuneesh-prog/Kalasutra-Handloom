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

- `data/artisans.ts` mixes two kinds of entries:
  - **Illustrative makers** (the first 12): named individuals and quotes are fictional.
  - **Real craft communities** (marked `community: true`): real clusters and GI-registered traditions across 21 states, described factually, with no individual named or quoted.
- `data/products.ts`: product listings, prices, stock and ratings are **illustrative**. They do not represent real sellers or inventory.
- Checkout is a demo; no payment is processed. Photos are Unsplash placeholders.
