# Owner-Blind Reservations + Reservation Progress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Repo rule override:** per `CLAUDE.md`, the agent must **never commit or push**. Wherever this plan says "Checkpoint", stop, run the listed verification, and leave the changes for the user to review and commit manually.

**Spec:** `docs/superpowers/specs/2026-07-03-owner-blind-reservations-design.md`

**Goal:** Hide per-item reservation state from list owners by default (surprise-safe mode), give them an opt-in "manager peek" toggle persisted per wishlist in localStorage, and show owners an aggregate-only "X of Y gifts reserved" progress indicator in surprise-safe mode. Admin and guest behavior unchanged.

**Architecture:** Pure client-side UI gating - no schema or Firestore rules changes. A new `useOwnerViewMode` hook owns localStorage persistence; `WishListItemRow` gets a `showClaimedState` prop (default `true`); `WishListItemList` derives the viewer role (`admin` | `owner` | `guest`) and wires everything together.

**Tech Stack:** React 19, TypeScript, MUI v7 (`Switch`, `FormControlLabel`, `LinearProgress`), i18next, Vitest + Testing Library.

**Verification commands (run from repo root):**

- Single test file: `npx vitest run src/__tests__/<file>`
- Full suite: `npx vitest run`
- Lint: `npm run lint`
- Build: `npm run build`

---

## File map

| File | Action | Responsibility |
|---|---|---|
| `src/hooks/useOwnerViewMode.ts` | Create | Read/write `'surprise' \| 'peek'` per wishlist in localStorage |
| `src/__tests__/useOwnerViewMode.test.ts` | Create | Hook unit tests |
| `src/Components/WishListItemRow.tsx` | Modify (lines 33-47, 116-138) | New `showClaimedState` prop hides checkbox + strikethrough |
| `src/__tests__/WishListItemRow.test.tsx` | Create | Row visibility tests |
| `src/Components/WishListItemList.tsx` | Modify | Viewer role, toggle switch, progress indicator, click gating |
| `src/__tests__/WishListItemList.test.tsx` | Modify | Update owner-click test; add role-based integration tests |
| `src/locales/en/wishlist.json` | Modify | 2 new keys |
| `src/locales/ua/wishlist.json` | Modify | 2 new keys |

---

### Task 1: `useOwnerViewMode` hook

**Files:**
- Create: `src/hooks/useOwnerViewMode.ts`
- Test: `src/__tests__/useOwnerViewMode.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/useOwnerViewMode.test.ts`:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOwnerViewMode } from '@hooks/useOwnerViewMode';

beforeEach(() => {
  window.localStorage.clear();
});

describe('useOwnerViewMode', () => {
  it('defaults to surprise mode', () => {
    const { result } = renderHook(() => useOwnerViewMode('wl1'));
    expect(result.current.mode).toBe('surprise');
  });

  it('persists peek mode to localStorage', () => {
    const { result } = renderHook(() => useOwnerViewMode('wl1'));
    act(() => result.current.setMode('peek'));
    expect(result.current.mode).toBe('peek');
    expect(window.localStorage.getItem('wishlist-owner-view:wl1')).toBe('peek');
  });

  it('reads a previously stored mode', () => {
    window.localStorage.setItem('wishlist-owner-view:wl1', 'peek');
    const { result } = renderHook(() => useOwnerViewMode('wl1'));
    expect(result.current.mode).toBe('peek');
  });

  it('re-reads when wishlistId changes', () => {
    window.localStorage.setItem('wishlist-owner-view:wl2', 'peek');
    const { result, rerender } = renderHook(({ id }) => useOwnerViewMode(id), {
      initialProps: { id: 'wl1' },
    });
    expect(result.current.mode).toBe('surprise');
    rerender({ id: 'wl2' });
    expect(result.current.mode).toBe('peek');
  });

  it('treats invalid stored values as surprise', () => {
    window.localStorage.setItem('wishlist-owner-view:wl1', 'garbage');
    const { result } = renderHook(() => useOwnerViewMode('wl1'));
    expect(result.current.mode).toBe('surprise');
  });

  it('keeps session-only state when localStorage.setItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { result } = renderHook(() => useOwnerViewMode('wl1'));
    act(() => result.current.setMode('peek'));
    expect(result.current.mode).toBe('peek');
    spy.mockRestore();
  });

  it('does not write to localStorage without a wishlistId', () => {
    const { result } = renderHook(() => useOwnerViewMode(undefined));
    act(() => result.current.setMode('peek'));
    expect(result.current.mode).toBe('peek');
    expect(window.localStorage.length).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/useOwnerViewMode.test.ts`
Expected: FAIL - cannot resolve `@hooks/useOwnerViewMode`.

- [ ] **Step 3: Write the implementation**

Create `src/hooks/useOwnerViewMode.ts`:

```tsx
import { useCallback, useEffect, useState } from 'react';

export type OwnerViewMode = 'surprise' | 'peek';

const storageKey = (wishlistId: string) => `wishlist-owner-view:${wishlistId}`;

const readStoredMode = (wishlistId?: string): OwnerViewMode => {
  if (!wishlistId) return 'surprise';
  try {
    return window.localStorage.getItem(storageKey(wishlistId)) === 'peek' ? 'peek' : 'surprise';
  } catch {
    return 'surprise';
  }
};

/** Owner-only view mode for reservations. 'surprise' (default) hides per-item claimed state. */
export const useOwnerViewMode = (wishlistId?: string) => {
  const [mode, setModeState] = useState<OwnerViewMode>(() => readStoredMode(wishlistId));

  useEffect(() => {
    setModeState(readStoredMode(wishlistId));
  }, [wishlistId]);

  const setMode = useCallback(
    (next: OwnerViewMode) => {
      setModeState(next);
      if (!wishlistId) return;
      try {
        window.localStorage.setItem(storageKey(wishlistId), next);
      } catch {
        // Private mode / disabled storage: keep session-only state.
      }
    },
    [wishlistId],
  );

  return { mode, setMode };
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/useOwnerViewMode.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Checkpoint**

Run `npm run lint`. Expected: clean. Leave changes uncommitted for user review.

---

### Task 2: `WishListItemRow` - `showClaimedState` prop

**Files:**
- Modify: `src/Components/WishListItemRow.tsx:33-47` (props), `:116-138` (checkbox + title)
- Test: `src/__tests__/WishListItemRow.test.tsx` (new)

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/WishListItemRow.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { customRender as render, screen } from '../test/render';
import '../../src/i18n';
import { WishListItemRow } from '@components/WishListItemRow';
import type { WishListItem } from '@models/WishListItem';

vi.mock('@hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: null, isAdmin: false })),
}));

const claimedItem: WishListItem = { id: 'i1', name: 'Book', claimed: true };
const noop = () => {};

describe('WishListItemRow claimed-state visibility', () => {
  it('shows checkbox and strikethrough by default for a claimed item', () => {
    render(
      <WishListItemRow
        item={claimedItem}
        canEdit={false}
        onRowClick={noop}
        onEditClick={noop}
        onDeleteClick={noop}
      />,
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Book')).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('hides checkbox and strikethrough when showClaimedState is false', () => {
    render(
      <WishListItemRow
        item={claimedItem}
        canEdit={true}
        showClaimedState={false}
        onRowClick={noop}
        onEditClick={noop}
        onDeleteClick={noop}
      />,
    );
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.getByText('Book')).not.toHaveStyle({ textDecoration: 'line-through' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/WishListItemRow.test.tsx`
Expected: first test PASSES (current behavior), second test FAILS (checkbox still rendered - prop does not exist yet).

- [ ] **Step 3: Implement the prop**

In `src/Components/WishListItemRow.tsx`, change the props type and destructuring (currently lines 33-47):

```tsx
export type WishListItemRowProps = {
  item: WishListItem;
  canEdit: boolean;
  /** When false (owner surprise-safe mode), hide checkbox and strikethrough entirely. */
  showClaimedState?: boolean;
  onRowClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export const WishListItemRow = memo(function WishListItemRow({
  item,
  canEdit,
  showClaimedState = true,
  onRowClick,
  onEditClick,
  onDeleteClick,
}: WishListItemRowProps) {
```

Add a derived flag right after `const isLockedForGuest = !canEdit && item.claimed;` (line 50):

```tsx
  const displayClaimed = showClaimedState && item.claimed;
```

Wrap the checkbox `Box` (currently lines 116-123) in the flag:

```tsx
            {showClaimedState && (
              <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
                <CustomCheckbox
                  checked={item.claimed}
                  disabled
                  icon={<RadioButtonUncheckedIcon fontSize="small" />}
                  checkedIcon={<CheckCircleIcon fontSize="small" />}
                />
              </Box>
            )}
```

Change the title `Typography` sx (currently lines 128-138) to use `displayClaimed`:

```tsx
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: displayClaimed ? 'line-through' : 'none',
                    color: displayClaimed ? 'gray' : 'inherit',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {item.name}
                </Typography>
```

Leave `isLockedForGuest` untouched - guests always receive `showClaimedState` = true (default), so their lock styling and `aria-disabled` behavior are unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/WishListItemRow.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Checkpoint**

Run `npx vitest run` (full suite - `WishListItemList.test.tsx` must still pass since the prop defaults to `true`). Expected: all green. Leave changes uncommitted.

---

### Task 3: Locale keys

**Files:**
- Modify: `src/locales/en/wishlist.json`
- Modify: `src/locales/ua/wishlist.json`

- [ ] **Step 1: Add EN keys**

In `src/locales/en/wishlist.json`, add after `"bannerErrorFailed"` (keep valid JSON - add a comma to the previous line):

```json
  "showReservationsToggle": "Show reservations",
  "reservationProgress": "{{claimed}} of {{total}} gifts reserved"
```

- [ ] **Step 2: Add UA keys**

In `src/locales/ua/wishlist.json`, add after `"bannerErrorFailed"`:

```json
  "showReservationsToggle": "Показувати бронювання",
  "reservationProgress": "Заброньовано {{claimed}} з {{total}} подарунків"
```

- [ ] **Step 3: Verify**

Run: `npx vitest run` (i18n resources load in tests; a JSON syntax error would fail the suite). Expected: PASS.

---

### Task 4: `WishListItemList` integration - role gating, toggle, progress

**Files:**
- Modify: `src/Components/WishListItemList.tsx`
- Test: `src/__tests__/WishListItemList.test.tsx`

- [ ] **Step 1: Write the failing tests**

In `src/__tests__/WishListItemList.test.tsx`:

1. Add `window.localStorage.clear();` as the first line of the existing top-level `beforeEach` (line 58).

2. **Delete** the existing test `'toggling claim calls API when owner clicks item'` (lines 164-182) - owner click is now a no-op by default; its API-call assertion moves into the peek-mode test below. Then add this new describe block at the end of the file:

```tsx
describe('owner-blind reservations', () => {
  const ownerWishlist = { id: 'wl1', title: 'Owner List', ownerUid: 'u1' };
  const twoItems = [
    { id: 'i1', name: 'Game', claimed: true },
    { id: 'i2', name: 'Book', claimed: false },
  ];

  function mockItems(items: unknown[]) {
    (subscribeWishlistItems as Mock).mockImplementation(
      (_id: string, cb: (items: unknown[]) => void) => {
        cb(items);
        return () => {};
      },
    );
  }

  it('owner in default surprise-safe mode: no item checkboxes, progress visible, click is a no-op', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce(ownerWishlist);
    mockItems(twoItems);
    renderAt('/en/wishlist/wl1');

    await screen.findByText(/game/i);
    // Only the "Show reservations" switch renders as a checkbox; item checkboxes are hidden.
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    expect(screen.getByRole('checkbox', { name: /show reservations/i })).toBeInTheDocument();
    expect(screen.getByText(/1 of 2 gifts reserved/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText(/game/i));
    expect(toggleGiftClaimStatus).not.toHaveBeenCalled();
  });

  it('owner switches to manager peek: checkboxes appear, progress hides, click toggles claim', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce(ownerWishlist);
    mockItems(twoItems);
    renderAt('/en/wishlist/wl1');
    await screen.findByText(/game/i);

    await userEvent.click(screen.getByRole('checkbox', { name: /show reservations/i }));

    // Switch + 2 item checkboxes.
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.queryByText(/1 of 2 gifts reserved/i)).not.toBeInTheDocument();
    expect(window.localStorage.getItem('wishlist-owner-view:wl1')).toBe('peek');

    await userEvent.click(screen.getByText(/book/i));
    await waitFor(() =>
      expect(toggleGiftClaimStatus).toHaveBeenCalledWith('wl1', 'i2', false),
    );
  });

  it('peek mode persists across remounts via localStorage', async () => {
    window.localStorage.setItem('wishlist-owner-view:wl1', 'peek');
    (getWishlistById as Mock).mockResolvedValueOnce(ownerWishlist);
    mockItems(twoItems);
    renderAt('/en/wishlist/wl1');

    await screen.findByText(/game/i);
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.queryByText(/1 of 2 gifts reserved/i)).not.toBeInTheDocument();
  });

  it('admin sees claimed state and no view-mode switch', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'admin-uid', displayName: 'Admin' },
      isAdmin: true,
    });
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Someone List',
      ownerUid: 'other-user',
    });
    mockItems(twoItems);
    renderAt('/en/wishlist/wl1');

    await screen.findByText(/game/i);
    expect(
      screen.queryByRole('checkbox', { name: /show reservations/i }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.queryByText(/gifts reserved/i)).not.toBeInTheDocument();
  });

  it('guest sees claimed state, no switch, no progress indicator', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Guest List',
      ownerUid: 'someone-else',
    });
    mockItems(twoItems);
    renderAt('/en/wishlist/wl1');

    await screen.findByText(/game/i);
    expect(
      screen.queryByRole('checkbox', { name: /show reservations/i }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.queryByText(/gifts reserved/i)).not.toBeInTheDocument();
    expect(screen.getByText(/game/i)).toHaveStyle({ textDecoration: 'line-through' });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/WishListItemList.test.tsx`
Expected: the 5 new tests FAIL (no switch rendered, item checkboxes still present for owner, no progress label); pre-existing tests still pass.

- [ ] **Step 3: Implement in `WishListItemList.tsx`**

3a. Imports - add `FormControlLabel`, `LinearProgress`, `Switch` to the existing `@mui/material` import block (lines 24-38), and add the hook import next to the other hooks (after line 8):

```tsx
import { useOwnerViewMode } from '@hooks/useOwnerViewMode';
```

3b. Derive the viewer role and mode - insert directly after the `canEdit` memo (lines 155-160):

```tsx
  const viewerRole: 'admin' | 'owner' | 'guest' = !canEdit
    ? 'guest'
    : isAdmin
      ? 'admin'
      : 'owner';

  const { mode: ownerViewMode, setMode: setOwnerViewMode } = useOwnerViewMode(wishlistId);
  // Surprise-safe: the owner must not see per-item reservation state (site promise).
  const surpriseSafe = viewerRole === 'owner' && ownerViewMode === 'surprise';

  const handleOwnerViewModeChange = useCallback(
    (peek: boolean) => {
      const mode = peek ? 'peek' : 'surprise';
      setOwnerViewMode(mode);
      trackEvent('owner_view_mode_toggle', {
        event_category: 'engagement',
        wishlist_id: wishlistId,
        mode,
        ...(user?.uid ? { user_id: user.uid } : {}),
      }).catch((error) => {
        console.error('Failed to track owner_view_mode_toggle event:', error);
      });
    },
    [setOwnerViewMode, wishlistId, user?.uid],
  );
```

3c. Claimed count - insert after the `getItemClaimedStatus` callback (lines 171-181):

```tsx
  const claimedCount = useMemo(
    () => items.reduce((count, item) => count + (getItemClaimedStatus(item) ? 1 : 0), 0),
    [items, getItemClaimedStatus],
  );
```

3d. View-mode switch - render right after the title block (after the `: null}` closing the title/not-found ternary, currently line 643), before the "Add Gift" button block:

```tsx
        {status === 'found' && wishlist && viewerRole === 'owner' && (
          <FormControlLabel
            sx={{ mb: 1 }}
            control={
              <Switch
                size="small"
                checked={ownerViewMode === 'peek'}
                onChange={(e) => handleOwnerViewModeChange(e.target.checked)}
              />
            }
            label={t('showReservationsToggle')}
          />
        )}
```

3e. Progress indicator - render after the "Add Gift" button block (after the closing `)}` currently at line 665), before the `<List>` block:

```tsx
        {status === 'found' && surpriseSafe && items.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('reservationProgress', { claimed: claimedCount, total: items.length })}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(claimedCount / items.length) * 100}
              sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
```

3f. Row wiring - inside the `items.map` (lines 677-698), pass the new prop and gate the click:

```tsx
                <WishListItemRow
                  key={item.id}
                  item={itemWithActualClaimed}
                  canEdit={canEdit}
                  showClaimedState={!surpriseSafe}
                  onRowClick={() => {
                    if (surpriseSafe || isLockedForGuest) return;
                    if (canEdit) {
                      handleClaimToggle(item);
                    } else if (!actualClaimed) {
                      setSelection((s) => ({ ...s, selectedItem: item }));
                      setDialogs((d) => ({ ...d, claimConfirmOpen: true }));
                    }
                  }}
                  onEditClick={() => {
                    setSelection((s) => ({ ...s, itemToEdit: item }));
                    setDialogs((d) => ({ ...d, editItemOpen: true }));
                  }}
                  onDeleteClick={() => {
                    setSelection((s) => ({ ...s, itemToDelete: item }));
                    setDialogs((d) => ({ ...d, deleteConfirmOpen: true }));
                  }}
                />
```

(Only `showClaimedState` and the first line of `onRowClick` change; edit/delete handlers are unchanged.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/WishListItemList.test.tsx`
Expected: PASS, including all pre-existing tests (guest claim-dialog test, admin SEO tests, etc.).

- [ ] **Step 5: Checkpoint**

Run `npx vitest run`. Expected: full suite green. Leave changes uncommitted.

---

### Task 5: Final verification

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `tsc -b` and Vite build succeed.

- [ ] **Step 3: Full test run**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 4: Manual smoke check (optional, dev server)**

Run `npm run dev`, open a wishlist you own:
- No checkboxes/strikethrough on items; "Show reservations" switch off; progress bar shows correct count when at least one item is claimed (claim one as a guest in an incognito window).
- Flip the switch: checkboxes and strikethrough appear, progress bar disappears, clicking an item toggles claimed. Reload - peek mode persists.
- Incognito (guest): unchanged behavior - checkboxes, claim confirm dialog, confetti, no switch, no progress bar.

- [ ] **Step 5: Hand off**

Summarize the change for the user; the user reviews and commits. Post-ship follow-up (not in this change): align EN FAQ copy with surprise-safe behavior.
