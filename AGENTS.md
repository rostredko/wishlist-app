# AGENTS.md

## Agent role

You are a senior frontend engineer on this codebase. Priorities: (1) SEO and performance (Core Web Vitals), (2) i18n and user-visible copy quality, (3) small, reviewable diffs - no drive-by refactors. If product intent is unclear, ask rather than assume.

## About

WishList App is a free service for creating and sharing wishlists (gift lists).  
Core product value: **simplicity and speed**. Minimal features, maximum UX. No ads.

The primary business goal is **organic search traffic**. No paid ads are used.  
The product must rank well for queries like "зробити вішліст", "create wishlist", "список побажань онлайн".  
Fast load times (Core Web Vitals) and technical cleanliness are not just UX - they are direct SEO factors.

Site: https://wishlistapp.com.ua

## Stack

- **Frontend:** React 19, TypeScript, Vite, MUI v7
- **Backend:** Firebase (Auth, Firestore, Storage)
- **i18n:** i18next - locales in `src/locales/{en,ua}/`
- **Routing:** React Router v7 - `/ua/*`, `/en/*`
- **Testing:** Vitest + Testing Library

## Commands

From the repository root (copy-paste):

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b` + production bundle
- `npm run lint` — ESLint
- `npx vitest run` — full test run (CI-style)
- `npm run test:ci` — coverage mode; requires `@vitest/coverage-v8` to be installed when using `--coverage`

For non-trivial changes, run `lint`, `build`, and `vitest run` before considering the task complete unless the user narrowed scope.

## Data layer (Firebase)

- **App singleton:** `src/firebase/init.ts` and `config.ts` initialize one Firebase app. Consumers import `auth` from `auth-client.ts`, `db` from `db-client.ts`, `storage` from `storage-client.ts` (not duplicate app entry points).
- **Wishlist API:** `src/services/wishListService.ts` owns Firestore and Storage calls for wishlists and items (create/read/update/delete, realtime listeners, banner upload).
- **Path alias:** `@constants/*` maps to `src/constants/` (see root `tsconfig.json`).
- **Banner URLs:** `bannerImage` stores a **download URL** from `getDownloadURL`. On wishlist delete, Storage deletion runs only for URLs under `firebasestorage.googleapis.com`, via `deleteObject(ref(storage, url))` (Firebase v11 `ref` accepts a full download URL).
- **Item order:** `subscribeWishlistItems` queries items with `orderBy('createdAt', 'asc')`. If the Firebase console reports a missing index, add the suggested composite index.

## Key Conventions

- **UI kit:** [docs/ui-kit.md](docs/ui-kit.md) – typography, buttons, surfaces, mobile-first layout, copy rules (reference before adding new visual patterns)
- Use existing MUI components - no custom CSS unless unavoidable
- i18n: all user-visible UI copy goes in locale files (`src/locales/{en,ua}/`), never hardcoded
- **Copy and punctuation:** use a normal hyphen `-` (ASCII), not an em dash (Unicode U+2014), in user-facing strings and in this file
- **SEO**
  - **Per-route metadata** - `SEOHead` sets title, description, canonical, alternates, and JSON-LD for SPA routes after load.
  - **Static shell (`index.html`)** - default `<title>`, meta description, Open Graph, Twitter Card, and skeleton H1 for the first HTML response (UA-focused defaults for crawlers and pre-hydration). Keep these aligned with top UA queries; they are not a substitute for `SEOHead` on `/en/*` and `/ua/*`.
  - **Example / demo wishlists** - `DEMO_WISHLISTS`, guest SEO overrides (`EXAMPLE_SEO`), and hreflang-style alternates (`EXAMPLE_WISHLIST_ALTERNATES`) live in [`src/constants/exampleWishlists.ts`](src/constants/exampleWishlists.ts). `wishListService.ts` imports `DEMO_WISHLISTS` from there; `WishListItemList.tsx` imports SEO maps and `isDemoWishlistId`. Overrides apply only when the viewer **cannot** edit (`canEdit === false`; owners and admins keep `{wishlist.title} - WishList App`).
  - **Sitemap** - `public/sitemap.xml`: update `<lastmod>` when shipping meaningful changes to listed URLs.
  - **Blog** - Routes `/:lng/blog` (hub) and `/:lng/blog/:slug` (articles). Slug pairs and `BLOG_LAST_UPDATED` live in [`src/constants/blogArticles.ts`](src/constants/blogArticles.ts). Article bodies are under `src/Components/blog/`; `BlogArticlePage` maps slug to a static component (no per-article `lazy` for correct client navigation). `SEOHead` supports `structured.article`, `structured.howTo`, and `structured.guideItemList` JSON-LD for posts and the hub. Legacy `/:lng/how-to` and `/:lng/how-to/:slug` redirect to `/blog` (article slug preserved when present). `public/llms.txt` lists the blog hubs for AI crawlers.
- Prefer editing existing files over creating new ones
- **Vitest:** mocked function components are often invoked as `(props, undefined)`; use `toHaveBeenCalledWith(expect.objectContaining({ … }), undefined)` when spying on `SEOHead`-style mocks

## Code quality (commit-ready)

- Prefer **self-documenting code**: names and structure should carry meaning; avoid comments that only restate the next line.
- Use comments **sparingly**: non-obvious invariants, analytics/SEO behavior, one-off Firebase/auth flows, or a one-line reason next to an `eslint-disable`.
- Remove **dead code**, unused imports, and leftover debug noise before handoff.
- For a **final pass** before the user commits: run `npm run lint`, `npm run build`, and `npx vitest run` (unless the task scope was explicitly smaller).

## Never Do

- **Never commit or push** - the user always commits and pushes manually
- Never add `console.log` to production code
- Never hardcode strings visible to users
- Never install packages without confirming with the user

## Workflow

- Prepare code changes only; the user reviews and commits
- When done with a task, summarize what changed and why - no need for verbose explanations
- Ask before making structural/architectural changes

## Docs

Everything under `docs/` is **local-only** (gitignored, not pushed). That includes [docs/ui-kit.md](docs/ui-kit.md) – keep a copy on your machine for UI conventions; the link in this file is still valid locally even though the repo has no `docs/` tree.

**Language**
- **Documentation** (`AGENTS.md`, `CLAUDE.md`, README, technical notes under `docs/`): **English** only.
- **Comments in code** (`//`, `/* */`, JSDoc in `.ts`/`.tsx`, Firebase rules such as `storage.rules`): **English** only. Do not write comments in Russian, Ukrainian, or other languages — English keeps the codebase consistent for tools and review.
- **User-visible copy** belongs in `src/locales/{en,ua}/` and in SEO/static shell where the product needs Ukrainian or English per i18n rules above — not mixed into non-locale comments.

Keep this file concise: prefer links to locale files, `wishListService.ts`, and local `docs/` over pasting long specifications here (progressive disclosure).
