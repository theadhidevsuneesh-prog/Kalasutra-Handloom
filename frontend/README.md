# frontend/

Everything the visitor sees and interacts with: pages (HTML/JSX), styling (CSS), client-side JavaScript/TypeScript logic, and the Next.js project config. This is the Next.js project root.

| Folder / file | What it holds |
| --- | --- |
| `app/` | Pages and routes: home, shop, product, checkout, artisans, wishlist, credits. `globals.css` holds the Tailwind theme (colours, fonts) and all global CSS. |
| `components/` | Reusable UI: Navbar, Footer, ProductCard, ArtisanCard, CartDrawer, FilterSidebar, SearchBox, SafeImage, and `home/*` sections. |
| `store/` | Browser state (Zustand): cart, wishlist, coupon (`useStore.ts`) and shop filters (`useFilters.ts`). |
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` | Project and build configuration. |

Data, search, price utilities and types live in `../backend` and are imported with the `@backend/*` alias.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
