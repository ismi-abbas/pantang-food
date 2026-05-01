# Pantang Food

Pantang Food is a TanStack Start recipe app for Malay moms to browse, save, and extend postpartum-friendly meals.

## What is included now
- Mobile-app style UI with bottom navigation and compact touch-friendly screens
- Installable PWA support
- 18 pantang-friendly seeded recipes
- Search and filters by category, benefit, and recovery week
- Custom recipe form and dedicated recipe pages
- Cloudflare Workers deployment
- Cloudflare D1 database binding for deployed runtime

## Stack
- TanStack Start
- React 19
- Tailwind CSS v4
- Drizzle ORM
- Cloudflare Workers + D1
- Optional libSQL / Turso fallback path for non-D1 environments

## Local development
```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open:
- http://localhost:5173

## Database runtime behavior
- Local dev without a Cloudflare D1 binding falls back to the existing safe local-memory/libSQL path.
- Deployed Cloudflare runtime now prefers the D1 binding:
  - `DB` → `pantang-food-db`

## Cloudflare deploy
```bash
pnpm run build
cd dist/server
CLOUDFLARE_API_TOKEN=your-token \
CLOUDFLARE_ACCOUNT_ID=your-account-id \
pnpm wrangler deploy
```

Current Worker URL:
- https://tanstack-start-app.abbaspuzi-dev.workers.dev

## Useful commands
```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
pnpm lint
pnpm wrangler d1 list
pnpm wrangler d1 execute pantang-food-db --remote --command "select 1"
```
