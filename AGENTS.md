# AGENTS.md

## About

WishList App is a free service for creating and sharing wishlists (gift lists).  
Core product value: **simplicity and speed**. Minimal features, maximum UX. No ads.

The primary business goal is **organic search traffic**. No paid ads are used.  
The product must rank well for queries like "зробити вішліст", "create wishlist", "список побажань онлайн".  
Fast load times (Core Web Vitals) and technical cleanliness are not just UX - they are direct SEO factors.

Site: https://wishlistapp.com.ua

## Stack

- **Frontend:** React 18, TypeScript, Vite, MUI v6
- **Backend:** Firebase (Auth, Firestore, Storage)
- **i18n:** i18next - locales in `src/locales/{en,ua}/`
- **Routing:** React Router v6 - `/ua/*`, `/en/*`
- **Testing:** Vitest + Testing Library

## Key Conventions

- **UI kit:** [docs/ui-kit.md](docs/ui-kit.md) – typography, buttons, surfaces, mobile-first layout, copy rules (reference before adding new visual patterns)
- Use existing MUI components - no custom CSS unless unavoidable
- i18n: all user-visible UI copy goes in locale files (`src/locales/{en,ua}/`), never hardcoded
- **Copy and punctuation:** use a normal hyphen `-` (ASCII), not an em dash (Unicode U+2014), in user-facing strings and in this file
- **SEO**
  - **Per-route metadata** - `SEOHead` sets title, description, canonical, alternates, and JSON-LD for SPA routes after load.
  - **Static shell (`index.html`)** - default `<title>`, meta description, Open Graph, Twitter Card, and skeleton H1 for the first HTML response (UA-focused defaults for crawlers and pre-hydration). Keep these aligned with top UA queries; they are not a substitute for `SEOHead` on `/en/*` and `/ua/*`.
  - **Example / demo wishlists** - Fallback list metadata in `DEMO_WISHLISTS` (`src/services/wishListService.ts`). Guest-facing SEO title/description overrides for known example IDs live in `EXAMPLE_SEO` inside `WishListItemList.tsx` and apply only when the viewer **cannot** edit the list (`canEdit === false`; owners and admins keep `{wishlist.title} - WishList App`).
  - **Sitemap** - `public/sitemap.xml`: update `<lastmod>` when shipping meaningful changes to listed URLs.
- Prefer editing existing files over creating new ones
- **Vitest:** mocked function components are often invoked as `(props, undefined)`; use `toHaveBeenCalledWith(expect.objectContaining({ … }), undefined)` when spying on `SEOHead`-style mocks

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
All docs and AGENTS.md must be written in English.
