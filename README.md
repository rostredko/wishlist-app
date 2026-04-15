# WishList App

Free wishlist (gift list) web app: React 19, TypeScript, Vite, MUI v7, Firebase.  
Production: [wishlistapp.com.ua](https://wishlistapp.com.ua).

**Agent / contributor onboarding:** see [`AGENTS.md`](AGENTS.md) for stack, SEO conventions, blog routes, Firebase data layer, and verification commands.

## Commands

From the repository root:

- `npm run dev` — Vite dev server
- `npm run build` — TypeScript + production bundle
- `npm run lint` — ESLint
- `npx vitest run` — tests (CI-style)

For changes that touch routing, SEO, or blog content, run `lint`, `build`, and `vitest` before handoff.

## Vite template notes

The project was bootstrapped with Vite’s React + TypeScript template. For ESLint expansion (type-aware rules, `eslint-plugin-react-x`), see the [Vite ESLint docs](https://vite.dev/guide/features.html#eslint) and adjust `eslint.config.js` as needed.
