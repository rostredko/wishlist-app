# Product feature priorities - competitive research (Jul 2026)

Product backlog. Goal: identify **small/medium, non-breaking, no-redesign** improvements that close real gaps vs. competing wishlist apps, based on what customers already expect from this category. Pick one, then write a spec and implementation plan for it.

## Competitive scan

Looked at the current universal-wishlist category: GiftList, Farha, WishOwl, Giftster, Elfster, MyRegistry, GiftX. Recurring table-stakes features across most of them:

| Feature | How common | Do we have it? |
|---|---|---|
| Reservations hidden from the list owner (no spoilers) | Near-universal | **No** - owner sees and can toggle `claimed` just like guests |
| Paste-a-link auto-fill (title/image/price from URL) | Near-universal | **No** - name/description/link are 100% manual, no image at all |
| Group gifting / cash pooling for expensive items | Common | No (out of scope here - needs payments) |
| Price tracking / drop alerts | Occasional, seen as differentiator | No (out of scope here - needs a backend job; optional price already exists) |
| "Most wanted" / pinned items, custom sort | Common | No - items are a flat list ordered by creation date |
| Quantity per item | Common in registries | No |
| No-account viewing/reserving | Near-universal | **Yes**, already supported |
| Shareable link | Universal | **Yes**, already supported |

Reviewed our own data model (`WishList`, `WishListItem`) and `WishListItemList.tsx`/`WishListItemRow.tsx` to confirm gaps before proposing anything, so every item below is additive (new optional fields / UI affordances) rather than a rework.

## Top 5

### 1. Owner-blind reservations (fix the "spoiler" bug)
**Problem:** `claimed` is a single boolean the owner always sees and can toggle themselves (`WishListItemRow.tsx` renders the same checkmark/strikethrough for owner and guest, and `handleClaimToggle` lets `canEdit` users flip it). Every competitor treats reservations as owner-invisible by default - it's the entire point of the feature. Today our list owner trivially sees (and can undo) what's been claimed, which defeats the "no spoiled surprises" promise we already make in blog copy and FAQ (e.g. UA FAQ: owner never sees who booked what; blog: surprise stays a surprise).
**Fix:** Role-based UI, not a hard lock for everyone with `canEdit`:
- **Admin (`isAdmin`)** - unchanged: always sees claimed state (checkbox, strikethrough) and can toggle it, same as today. Support/debug use case.
- **List owner** - a **view-mode toggle** (persist per wishlist in `localStorage`, default = surprise-safe):
  - **Surprise-safe (default):** matches the site promise - owner does **not** see which items are reserved (no strikethrough/gray), **no** checkboxes, **no** claim/unclaim interaction. Edit/delete affordances stay so they can still manage the list. Pair with #3 for aggregate-only feedback ("3 of 8 reserved") without naming items.
  - **Manager peek:** owner opts in via toggle - claimed state visible, can toggle `claimed`, edit/delete as today. Explicit choice to spoil themselves; not the default.
- **Guests (`!canEdit`)** - unchanged: full reservation UI (checkbox, strikethrough on claimed, click-to-claim).
No schema change for v1 (UI gating + owner toggle state); Firestore rules optional later if we want a server-side guarantee beyond UI.
**Effort:** Small. **Impact:** High - trust/correctness fix with an escape hatch for owners who need it; admin stays fully capable.

**Decisions (confirmed):** Ship surprise-safe as default so product matches site/blog copy. Owner toggle yes. Admin always full visibility. After ship, align EN FAQ if needed (it currently says owner sees "that it has been reserved" at item level - surprise-safe + #3 aggregate is the intended behavior).

### 2. Paste-a-link auto-fill (title, image, price)
**Problem:** Adding a gift today means manually typing name + description + link with zero visual feedback (`AddItemDialog.tsx`). Every competitor's core loop is "paste a URL, we fill in the rest" - it's the #1 friction reducer in the category, and it's the reason our lists look like plain text next to competitors' image-rich cards.
**Fix:** On paste/blur of the link field, call a small backend function (Firebase Cloud Function) that fetches Open Graph tags (`og:title`, `og:image`, `og:price:amount`) and pre-fills the form; user can still edit everything manually. Optional `priceMinor` and `currency` already exist. Add optional `imageUrl` (backward-compatible) and render a small thumbnail in `WishListItemRow` if present - additive to the existing card, not a redesign.
**Effort:** Medium (needs one Cloud Function + two new optional fields + a thumbnail slot in the existing row). **Impact:** High - directly improves the core "add a gift" action for every user, every list.

### 3. Reservation progress indicator for owners
**Problem:** In surprise-safe mode (#1 default), owners lose per-item feedback after sharing - no reason to come back before the event. Competitors solve this with a "gift tracker"-style summary.
**Fix:** Show owners an aggregate-only progress bar/label in **surprise-safe mode only**, e.g. "3 of 8 wishes reserved" - never which items. Hidden in manager-peek mode (they already see details) and irrelevant for admin. Pure client-side count of `claimed` items in the existing `items` array; no schema change.
**Effort:** Small. **Impact:** Medium - re-engagement without breaking the surprise from #1.

### 4. "Most wanted" priority flag + smart sort
**Problem:** Longer lists are a flat, creation-order list today. Gift-givers facing 15+ items have no signal about what the owner actually wants most - a common complaint in this category, and one of the cheapest fixes available.
**Fix:** Add an optional `priority: boolean` to `WishListItem`. Owner can star/pin an item from the existing row menu; starred items float to the top of the list (client-side sort, no reordering UI needed). Small star icon next to the existing edit/delete icons - fits the current row layout.
**Effort:** Small. **Impact:** Medium - especially valuable for big-occasion lists (weddings, birthdays with many contributors).

### 5. Item quantity
**Problem:** Multi-unit wants ("2 of these mugs", "a few of these socks") have no clean way to be expressed today; owners resort to writing it into the description, which guests often miss.
**Fix:** Add optional `quantity: number` (default 1) to `WishListItem`. Show "x2" style badge next to the item name when > 1; each reservation just claims "one unit" conceptually (v1: keep it simple - single `claimed` boolean per item, quantity is informational only, no partial-claim tracking yet).
**Effort:** Small. **Impact:** Low-medium - solves a real but narrower complaint than 1-4.

## Explicitly out of scope for this batch (bigger bets, revisit later)

- **Group gifting / cash pooling** - needs a payments integration (Stripe/PayPal), legal/fee considerations, and new UI surfaces. Real differentiator, but not a small/medium change.
- **Price-drop tracking/alerts** - needs a scheduled backend job polling retailer prices and a notification channel; meaningful scope on top of #2's price field.
- **Browser extension** - separate codebase/distribution channel entirely.
- **Family circles / recurring event reminders** - useful but is a new content model (people, events, recurrence), not additive to the current one.

## Recommendation

Ship **#1 + #3 together** - confirmed scope. Default owner experience must match site promise (no per-item reservation spoilers). Owner toggle = optional manager peek; admin unchanged. **#3** gives owners aggregate progress only in surprise-safe mode. **#2** next, own spec after #1/#3.
