# backend/

The data and logic layer. This project has no separate server or database, so "backend" means the content and the rules behind it.

- `data/products.ts`: all products and categories (and which photos belong to each).
- `data/artisans.ts`: the craft communities.
- `lib/images.ts`: the photo library, with each photo's author and licence.
- `lib/search.ts`: product matching and search-box suggestions.

To add a product, community or photo, edit the files above; nothing in `frontend/` needs to change.
