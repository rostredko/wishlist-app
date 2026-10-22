# Owner-Blind Reservations + Reservation Progress - Design Spec

Date: 2026-07-03
Source: `docs/product-feature-priorities.md` items #1 and #3 (confirmed scope: ship together).

## Problem

`claimed` is a single boolean that the list owner always sees and can toggle. `WishListItemRow.tsx` renders the same checkmark + strikethrough for owner and guest, and the row click handler lets any `canEdit` user flip `claimed`. This contradicts the product promise (UA FAQ and blog copy: the owner never sees which items are reserved) and is table stakes across every competitor: reservations must be invisible to the owner by default.

Secondary problem (#3): once reservations are hidden, owners lose all feedback and have no reason to revisit the list before the event. Competitors solve this with an aggregate "gift tracker" summary that never names items.

## Goals

1. Owner does not see per-item reservation state by default ("surprise-safe" mode).
2. Owner can explicitly opt in to seeing reservations ("manager peek" mode), persisted per wishlist on their device.
3. In surprise-safe mode, owner sees an aggregate-only progress indicator ("3 of 8 gifts reserved").
4. Admin and guest experiences are completely unchanged.
5. No schema change, no Firestore rules change (UI gating only for v1).

## Non-Goals

- Server-side enforcement (Firestore rules hiding `claimed` from owners) - optional follow-up, out of scope.
- Reserver identity, quantities, group gifting - out of scope.
- EN FAQ copy alignment - post-ship content task, tracked in the priorities doc, not part of this change.

## Roles and behavior

Viewer role is derived client-side in `WishListItemList`:

| Role | Definition | Claimed state visible | Can toggle claimed | View-mode toggle shown | Progress indicator |
|---|---|---|---|---|---|
| Admin | `isAdmin === true` | Always (unchanged) | Yes (unchanged) | No | No |
| Owner | `canEdit && !isAdmin` | Only in manager-peek mode | Only in manager-peek mode | Yes | Only in surprise-safe mode |
| Guest | `!canEdit` | Always (unchanged) | Claim only, unclaim blocked (unchanged) | No | No |

Notes:

- `canEdit` is currently `isAdmin || wishlist.ownerUid === user.uid`. An admin who also owns the list is treated as admin (full visibility, no toggle) - support/debug wins.
- Guests keep the full existing reservation UI: checkbox, strikethrough on claimed, click-to-claim with confirm dialog and confetti.

### Owner: surprise-safe mode (default)

- No checkbox column, no strikethrough, no gray-out - claimed and unclaimed items look identical.
- Clicking the row body is a no-op (today it toggles `claimed` for `canEdit` users). Edit and delete affordances keep working exactly as today.
- Aggregate progress indicator is rendered between the "Add Gift" button and the item list when the list has at least one item: a one-line label "{claimed} of {total} gifts reserved" plus a thin `LinearProgress` bar. Never names items. Hidden when the list is empty.

### Owner: manager-peek mode

- Identical to today's owner experience: checkbox and strikethrough visible, row click toggles `claimed`, edit/delete unchanged.
- Progress indicator hidden (owner already sees details).

### View-mode toggle

- A small MUI `Switch` with label "Show reservations" (i18n key, EN/UA), rendered under the wishlist title, only for role = owner.
- Default state: off (surprise-safe). This is the mode that matches the site promise.
- Persisted per wishlist in `localStorage` under key `wishlist-owner-view:{wishlistId}` with values `peek` | `surprise` (missing/invalid value = `surprise`). Wrapped in try/catch so private-mode browsers degrade to session-only default.
- Toggling fires a GA4 event `owner_view_mode_toggle` (`wishlist_id`, `mode`, `user_id`) via the existing `trackEvent` queue.

## Architecture

New/changed units:

1. **`src/hooks/useOwnerViewMode.ts` (new)** - `useOwnerViewMode(wishlistId?)` returns `{ mode, setMode }` where `mode: 'surprise' | 'peek'`. Owns the localStorage read/write and re-reads when `wishlistId` changes. No knowledge of roles - callers decide whether the mode applies.
2. **`WishListItemRow` (modified)** - new prop `showClaimedState?: boolean` (default `true`, so existing call sites keep today's behavior). When `false`, the checkbox is not rendered and the title has no strikethrough/gray. Everything else (link, description, edit/delete, guest lock styling) is untouched. The row stays a dumb presentational component.
3. **`WishListItemList` (modified)** - derives `viewerRole` (`admin` | `owner` | `guest`), wires `useOwnerViewMode`, computes `surpriseSafe = viewerRole === 'owner' && mode === 'surprise'`, and:
   - passes `showClaimedState={!surpriseSafe}` to each row;
   - makes row click a no-op when `surpriseSafe`;
   - renders the toggle switch (owner only) and the progress indicator (`surpriseSafe` and items exist);
   - counts claimed items through the existing `getItemClaimedStatus` so demo wishlists (session-local claimed state) are counted correctly.
4. **Locales** - new keys in `src/locales/{en,ua}/wishlist.json`: toggle label and progress label.

Data flow is unchanged: Firestore -> `useWishlistData` -> `WishListItemList` -> `WishListItemRow`. The feature is pure presentation gating; `claimed` still arrives on every item for every viewer (accepted for v1, documented as the reason a Firestore-rules follow-up may be desirable).

## Error handling

- `localStorage` access failures (private mode, disabled storage): caught, mode falls back to `surprise` and lives only in React state for the session.
- Analytics failures: already handled by `trackEvent(...).catch(...)` pattern; same here.
- Division by zero in the progress bar: indicator is not rendered when `items.length === 0`.

## Copy (i18n)

| Key (namespace `wishlist`) | EN | UA |
|---|---|---|
| `showReservationsToggle` | Show reservations | Показувати бронювання |
| `reservationProgress` | {{claimed}} of {{total}} gifts reserved | Заброньовано {{claimed}} з {{total}} подарунків |

## SEO impact

None. Crawlers and logged-out visitors are guests; the guest UI, `SEOHead` output, and demo-wishlist rendering are unchanged. No sitemap `lastmod` update needed.

## Testing

- **Hook test** (`renderHook`): defaults to `surprise`, persists `peek` to localStorage, re-reads on wishlistId change, survives localStorage throwing.
- **Row test**: `showClaimedState={true}` renders checkbox + strikethrough for a claimed item; `showClaimedState={false}` renders neither.
- **List integration tests** (existing `WishListItemList.test.tsx` conventions: mocked `useAuth`, `wishListService`, `SEOHead`):
  - Owner default: no checkbox, no strikethrough, progress label visible, row click does NOT call `toggleGiftClaimStatus`.
  - Owner toggles to peek: checkboxes visible, progress hidden, row click calls `toggleGiftClaimStatus`; localStorage updated.
  - Peek persists across remount (localStorage pre-seeded).
  - Admin: claimed state visible, no toggle switch rendered.
  - Guest: unchanged behavior, no toggle switch, no progress indicator.
- **Existing test update**: "toggling claim calls API when owner clicks item" changes meaning - owner click is a no-op by default; the API-call assertion moves to the peek-mode test.

## Rollout

Single client-side change, no migration, no flags. After ship: align EN FAQ copy (says owner sees "that it has been reserved" per item; intended behavior is surprise-safe + aggregate progress).
