# frontend/

Everything the visitor sees and interacts with in the browser.

- `components/`: reusable UI pieces (Navbar, Footer, ProductCard, ArtisanCard, CartDrawer, FilterSidebar, SearchBox, SafeImage) and `home/` sections.
- `store/`: browser-side state (Zustand): cart, wishlist and coupon (saved in localStorage) in `useStore.ts`, and shop filters in `useFilters.ts`.

The pages themselves live in `../app/` (Next.js requires routes in a folder called `app`).
