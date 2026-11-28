# backend/

Data and logic. There is no separate server or database: this code is imported by `../frontend` at build time.

| Folder | What it holds |
| --- | --- |
| `data/products.ts` | Categories, products (`baseProducts`), photo mapping, filter option lists, testimonials. |
| `data/artisans.ts` | Real craft communities by state (GI-registered traditions where applicable). |
| `lib/images.ts` | Photo library with author and licence for each Wikimedia Commons image (shown on `/credits`). |
| `lib/search.ts` | Product matching and search suggestions. |
| `lib/utils.ts` | Price formatting, shipping rules, coupons, class-name helper. |
| `types/index.ts` | Shared TypeScript types (Product, Artisan, Category, Testimonial). |

Prices, stock and ratings are illustrative, not real inventory.
