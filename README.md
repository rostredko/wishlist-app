# WishList App

Free wishlist (gift list) web app: React 19, TypeScript, Vite, MUI v7, Firebase.  
Production: [wishlistapp.com.ua](https://wishlistapp.com.ua).

**Agent / contributor onboarding:** see [`AGENTS.md`](AGENTS.md) for stack, SEO conventions, blog routes, Firebase data layer, and verification commands.

## Commands

From the repository root:

- `npm run emulators` - isolated local Firebase Auth, Firestore, and Storage
- `npm run dev` - Vite dev server (start the emulators first)
- `npm run build` — TypeScript + production bundle
- `npm run lint` — ESLint
- `npx vitest run` — tests (CI-style)
- `npm run test:rules` - disposable Firestore and Storage rules acceptance tests

## Local development and production isolation

Use Firebase CLI 15.12.0 and Java 21 or newer. Install missing prerequisites only with the user's approval. No separate cloud Firebase project, billing setup, or production credentials are needed for local development. Firebase recommends [demo projects for emulator isolation](https://firebase.google.com/docs/emulator-suite/connect_firestore#choose_a_firebase_project).

The npm emulator commands select Java only for their child process, without changing system Java or shell profiles. Selection order: `FIREBASE_JAVA_HOME`, a home path saved in `.firebase/java-home` (gitignored, machine-local), then `JAVA_HOME` or `java` on `PATH`. For example, save `/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home` in `.firebase/java-home` if that is your installed Homebrew JDK. The launcher verifies Java 21+ before starting Firebase and accepts only the fixed local start/test commands, never arbitrary deploy arguments.

Run these in two terminals:

```sh
# Terminal 1: local data and files persist on normal shutdown (Ctrl+C).
npm run emulators

# Terminal 2: open the URL printed by Vite.
npm run dev
```

The local project is `demo-wishlist-local`, with Auth at `127.0.0.1:9099`, Firestore at `127.0.0.1:8080`, Storage at `127.0.0.1:9199`, and the Emulator UI at `http://127.0.0.1:4000`. Google sign-in uses the emulator's simulated accounts; these are separate from real customers. Use synthetic wishlists and images. Data is imported/exported at `.firebase/local-data/` (gitignored). An abrupt process termination may lose local changes since the last export; local exports are not production backups.

Development, tests, non-production modes, and locally served production bundles (`npm run preview`) ignore live `VITE_FIREBASE_*` values and connect all three services to loopback emulators. If an emulator stops, requests fail or remain pending; they never fall back to production. The live configuration is used only by a production build on the exact hosts in `src/firebase/config.ts`: the public domain, its `www` alias, and this project's two default Firebase Hosting domains. Unknown hosts also use emulators; review this allowlist before introducing a new production domain. Loopback endpoints are intended for a browser on the same computer, not a phone or remote tunnel.

Production builds require all six `VITE_FIREBASE_*` configuration fields in the build environment: `API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, and `APP_ID`. Missing values cause initialization to fail rather than silently selecting a fallback project. The existing `.env` may remain for builds; dev ignores its live Firebase values. Restart Vite and reload old local tabs after adopting this setup.

`.firebaserc` defaults to the demo project. The `production` alias is deliberately explicit. Local emulator configuration (`firebase.local.json`) is separate from the deploy configuration (`firebase.json`). Rules acceptance uses `demo-wishlist-rules` on separate ports 8180/9299, without importing or exporting development data. Its reset operation is restricted to that disposable loopback project. Each npm emulator command also gets its own temporary directory under `.firebase/runtime/`: Firebase Storage otherwise shares temporary files across projects, so separate ports alone are insufficient. Successful shutdown removes that temporary directory; failed runs retain it for diagnosis.

For changes that touch routing, SEO, or blog content, run `lint`, `build`, and `vitest` before handoff.

## Page loading and canonical URLs

The language-selection screen and lazy-route fallback reserve at least one viewport of height. Keep this loading space: showing the footer above the fold and then pushing it down when the homepage loads causes a large cumulative layout shift (CLS).

The homepage is included in the initial app bundle. Its creation dialog loads when opened, and wishlist data code loads only for signed-in users or an explicit action. Keep Firestore/Storage imports out of the guest homepage's static dependency graph; asynchronous subscriptions must ignore results and release listeners after sign-out or navigation.

`scripts/prerender.ts` writes the canonical and language alternates into each indexable route's HTML; `SEOHead` updates them during client-side navigation. Do not add canonical `Link` response headers in `firebase.json`: those headers remain attached to the original document after SPA navigation and can contradict the selected route or language. The root language-selection shell intentionally has no fixed canonical; the selected homepage supplies it at runtime.

After a Hosting release, recheck PageSpeed on `/`, `/ua`, and `/en`, including the canonical, heading order, and contrast audits. Local production-build audits use Firebase emulators and are useful regression checks, but do not establish production scores or the rolling 28-day Core Web Vitals result.

## Publishing a blog article

Keep new bilingual article text and SEO metadata in `src/locales/{ua,en}/blog.json` under `articles[English slug]`. Register the slug pair in `blogArticles.ts`, the static component in both `BlogArticlePage.tsx` maps, and localized hub cards under `cards[English slug]`. The build reads localized `title`, `description`, and `h1`; legacy articles still use their literal component metadata. The AI gift article is an example of the localized format.

Add both URLs to `public/sitemap.xml` and `public/llms.txt`; prerender supplies their canonical HTML tags. Update the blog hubs' sitemap dates and use the new article's own dates in Article metadata and `BlogArticleFooter`; do not change dates on unrelated posts. Verify both languages, internal navigation, source links, and generated `dist/{lang}/blog/{slug}.html` metadata before release.

The personal Codex skill `wishlist-blog-writer` prepares research, natural Ukrainian/English copy and these local changes. The skill is installed outside this repository. The user reviews and commits manually. `.gitlab-ci.yml` tests and builds `dev`/`main`, then deploys explicitly scoped Hosting, Firestore rules, and Storage rules to `wishlist-app-51cf7` on `main`. Review all changes included in that push, including Firebase rules. Article preparation does not commit, push, or deploy.

## Product and data behavior

- The app is free and has no ads. Creators use Google sign-in; anyone with a wishlist link can view and reserve gifts without an account.
- Personal wishlists are unlisted in search via an initial noindex shell and runtime metadata. This does not restrict access to anyone with the link. Official examples remain indexable; unknown public routes return the generated 404 page.
- Example copies use the resolved example gifts and one atomic Firestore batch. The user reviews the title before creation; copied gifts start unclaimed. The copy limit is 499 gifts. The guest creation action on an ordinary shared list starts blank; the existing explicit copy action remains available to signed-in visitors.
- Optional prices use `priceMinor` integer minor units and `currency` (`UAH`, `USD`, `EUR`, `GBP`). Blank means unspecified; zero is valid. Both fields become null when a price is removed. Existing unpriced records remain valid; amounts are indicative and no exchange-rate conversion occurs.
- Optional immutable `creationMethod` (`manual`, `demo_copy` or `shared_copy`) identifies new creation paths. Older records without it remain unknown; no migration is required.

## Firebase rules and release checks

`firebase.json` versions both Firestore and Storage rules. Authorization uses wishlist ownership and the trusted Firebase `isAdmin` custom claim. A client environment UID does not grant admin access. All official demo IDs in `exampleWishlists.ts` are reserved for administrators.

The example UI follows the same policy: a historical owner without an admin claim sees guest controls. Administrators retain the explicit copy action on other users' personal lists.

New banners use `banners/{wishlistId}/{object}` so Storage rules can verify the owner in Firestore. Legacy flat banners stay publicly readable but cannot be overwritten/deleted by clients. Replacing one stores a new owned URL; historical objects require a separate administrator cleanup. Before deployment, verify the Storage-to-Firestore rules permission and admin claims, and deploy reviewed rules before the frontend. On 2026-10-22, `roles/firebaserules.firestoreServiceAgent` was granted to this project's Google-managed Storage service agent; the existing trusted administrator claim was verified without modifying Auth accounts. No automatic production migration is included.

Real rule acceptance uses a disposable demo project:

```sh
npm run test:rules
```

The installed Firebase CLI requires Java 21 or newer and the Storage emulator runtime. Run the complete command successfully before deploying rules. Unit tests alone do not prove server-side authorization. Acceptance includes synthetic legacy records without `creationMethod` or prices, preservation of unrelated fields, guest reservations, owner/stranger access, atomic copying, and public read/write protection for old banners.

## Production data preservation and release gate

Active recovery configuration, region-specific cost estimate, verified pre-merge snapshot, Drive archive, and restore procedure: [BACKUPS.md](BACKUPS.md). PITR, daily/weekly schedules, and database deletion protection were enabled on 2026-10-22; the immediate snapshot was restored into a separate database and compared successfully. The first scheduled-backup restore and recurring Drive uploads remain unverified/unconfigured respectively.

**Customer data must never be reset, overwritten, seeded, or migrated by a build, preview, test, or deployment.** The agent rules in `AGENTS.md` and `CLAUDE.md` make this mandatory. This branch contains no automatic production migration or seeding. Creation and copying use fresh document IDs; reads do not backfill optional fields. Existing records do not need a rewrite.

The scoped CI deploy publishes website files and access rules, not local Firestore documents or local Storage objects. Rule changes can nevertheless deny previously allowed operations. In particular, legacy flat banners remain readable but old frontend tabs that upload to a flat path must reload to use the new owned path. Verify the Storage-to-Firestore permission and trusted admin claims before release. Never deploy only the new frontend against the old Storage rules, which reject the new banner paths.

Before merging data-sensitive changes:

1. Review data-writing paths and rules; run `npm run lint`, `npm run build`, `npx vitest run`, and `npm run test:rules`.
2. Confirm the target project, current deployed rules, required indexes, and backward compatibility using synthetic legacy fixtures. Do not test destructive actions against production customers.
3. Verify a current recoverable Firestore backup and a restore procedure using a separate recovery database. Review [scheduled backups](https://firebase.google.com/docs/firestore/backups) and [point-in-time recovery](https://firebase.google.com/docs/firestore/use-pitr), including billing, before enabling them. Database deletion protection guards deletion of the database itself, not document edits/deletes. Firestore recovery does not cover Storage files or Auth accounts.
4. Retain the previous frontend/rules release for rollback, and verify Storage recovery separately. Rolling back frontend code does not undo data writes.

The initial read-only inspection found PITR and database deletion protection disabled and no managed backups. The owner-authorized setup on 2026-10-22 enabled protection and verified an immediate recovery point for 1,169 wishlists and 4,430 items. The Drive archive includes all 246 current Storage objects; one pre-existing banner reference has no available source object. Storage soft delete remains seven days. See [BACKUPS.md](BACKUPS.md) for evidence and recovery boundaries, including Auth, encryption-key custody, and backup freshness before release.

## Analytics and organic growth

The application sends one manual pageview per rendered route visit, with stable route titles. Personal list IDs become `/wishlist/personal`; query strings, names, gift text, product/share URLs, user IDs, and arbitrary labels are omitted from application event payloads. Configure the GA4 web stream with **Enhanced Measurement disabled** before release to prevent automatic duplicate pageviews and outbound-link collection. Verify cold loads, navigation, language changes and auth returns in DebugView. Code validation cannot establish the property configuration.

Enhanced Measurement was disabled and verified for stream `12113637855` (`G-X8QM3ZWMZ8`) on 2026-10-22 (Europe/Kyiv). Recheck this setting for future releases; its configuration is managed outside Git.

Core events: `wishlist_view`, `create_wishlist_start`, `wishlist_create` (all creation methods), `wishlist_first_item_added`, `wishlist_copy_personalized`, `wishlist_share_attempt`, `wishlist_share_copy`, `wishlist_share_handoff`, `gift_reserve_success`, `click_gift_link`, and bounded `wishlist_operation_failed`. Clipboard success and native handoff are separate sharing proxies, not evidence of message delivery or purchases. First-item and copied-list personalization events are session/visit proxies, not deduplicated lifetime lifecycle reporting.

Record the deployment date, collect a clean 14-day baseline, then evaluate for at least 28 days. Compare absolute counts and rates by eligible guest/demo audience, language, device and acquisition source. Evaluate SEO separately in Search Console by matching query, landing page, device, country and position, allowing for recrawl time and seasonality. Monitor successful reservations, save failures and field Core Web Vitals alongside CTR. Local implementation does not prove ranking or traffic improvements.

## Vite template notes

The project was bootstrapped with Vite’s React + TypeScript template. For ESLint expansion (type-aware rules, `eslint-plugin-react-x`), see the [Vite ESLint docs](https://vite.dev/guide/features.html#eslint) and adjust `eslint.config.js` as needed.
