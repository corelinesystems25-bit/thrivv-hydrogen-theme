# Thrivv – Luxury Streetwear Hydrogen Theme   

Thrivv is a premium Shopify Hydrogen + Remix theme for culture-driven streetwear brands that fuse couture craftsmanship with futuristic technology. The experience is dark, cinematic, and community-first with hero drops, countdown hype, and immersive product storytelling.

## Highlights

- **Hydrogen 2024.10 + Remix 2.8** foundation ready for Shopify Oxygen deployment
- **TailwindCSS styling** with a carbon-neon palette, rounded silhouettes, and typography from Space Grotesk + IBM Plex
- **Homepage** featuring a hero drop story, animated countdown timer, featured collection carousel, and drop preview grid
- **Lookbook collections** presented as editorial masonry cards with hover motion and tag callouts
- **Product detail page** showcasing rich media, variant selection, add-to-cart workflow, and community social proof
- **About / Community page** with manifesto, community initiatives, and brand story modules
- **Cart route** with session-backed checkout ready to hand off to Shopify checkout

## Project Structure

```
app/
  components/        Reusable UI components (hero, carousel, countdown, layout)
  routes/            Remix routes for home, collections, products, cart, about
  graphql/           Shared GraphQL fragments & operations
  styles/tailwind.css Tailwind layer definitions and component tokens
  root.tsx           Global layout + streaming data
```

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy your environment variables (Shopify storefront access token, domain, etc.) into `.env`
3. Start the local development server
   ```bash
   npm run dev
   ```

### Essential Environment Variables

```
SHOPIFY_STORE_ID=
SHOPIFY_STOREFRONT_API_TOKEN=
PUBLIC_STORE_DOMAIN=
FEATURED_COLLECTION_HANDLE=frontpage
NEXT_DROP_DATE=2024-12-01T00:00:00Z
```

## Scripts

- `npm run dev` – Launches the Hydrogen dev server
- `npm run build` – Creates the production build for Oxygen
- `npm run preview` – Serves the built assets locally
- `npm run lint` – Runs ESLint with Hydrogen rules
- `npm run typecheck` – Validates TypeScript types

## Deployment

The repository includes `.github/workflows/oxygen-deployment.yml` which builds with Node 20 and calls `shopify hydrogen deploy`. Configure the required Shopify secrets in your GitHub repository before triggering the workflow.

## Design System

- **Colors** – Carbon blacks with electric teal and amber flares
- **Typography** – Space Grotesk for headlines, IBM Plex Sans for body copy, IBM Plex Mono for technical accents
- **Components** – Rounded gradient shells, neon glows, glassmorphism-inspired panels, and editorial grid layouts
- **Utilities** – Tailwind component layer provides `btn-primary`, `btn-secondary`, `section-shell`, and pill badges for consistent layout spacing

## Shopify Data

GraphQL queries fetch featured collections, trending products, and individual product data. Cart mutations store the `cartId` in the Hydrogen session to power add-to-cart flows and the checkout handoff.

## License

© Thrivv Theme. All rights reserved. Built for brands operating at the edge of luxury streetwear and technology.
