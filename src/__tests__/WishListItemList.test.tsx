import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { act } from 'react';
import { customRender as render, screen, waitFor } from '../test/render';
import '../../src/i18n';
import { WishListItemList } from '@components/WishListItemList';
import SEOHead from '@components/SEOHead';
import { useAuth } from '@hooks/useAuth';
import WishlistHeader from '@components/WishListHeader';

vi.mock('canvas-confetti', () => ({
  __esModule: true,
  default: () => {
  },
}));

vi.mock('@components/WishListHeader', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="header-stub" />),
}));
vi.mock('@components/BannerUploader', () => ({
  __esModule: true,
  default: () => null,
}));
vi.mock('@components/SEOHead', () => ({
  __esModule: true,
  default: vi.fn(() => null),
}));

vi.mock('@hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: { uid: 'u1', displayName: 'Test User' }, isAdmin: false })),
}));

import {
  getWishlistById,
  updateWishlistTitle,
  toggleGiftClaimStatus,
  subscribeWishlistItems,
  addGiftItem,
  copyWishlist,
} from '@api/wishListService';

vi.mock('@api/wishListService', () => ({
  getWishlistById: vi.fn(),
  updateWishlistTitle: vi.fn(),
  addGiftItem: vi.fn(),
  deleteGiftItem: vi.fn(),
  toggleGiftClaimStatus: vi.fn(),
  subscribeWishlistItems: vi.fn(),
  createWishlist: vi.fn(),
  copyWishlist: vi.fn(),
  updateGiftItem: vi.fn(),
}));

const signIn = vi.fn();
vi.mock('@hooks/useGoogleSignIn', () => ({ useGoogleSignIn: () => ({ signIn, loading: false, isTelegram: false }) }));
vi.mock('@utils/analytics', () => ({ trackEvent: vi.fn().mockResolvedValue(undefined) }));
import { trackEvent } from '@utils/analytics';

function renderAt(path: string) {
  window.history.pushState({}, '', path);
  return render(
    <Routes>
      <Route path="/:lng/wishlist/:wishlistId" element={<WishListItemList />} />
    </Routes>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getWishlistById).mockReset();
  vi.mocked(copyWishlist).mockReset();
  vi.mocked(addGiftItem).mockReset();
  vi.mocked(toggleGiftClaimStatus).mockReset();
  sessionStorage.clear();
  signIn.mockResolvedValue('cancelled');
  vi.mocked(useAuth).mockReturnValue({ user: { uid: 'u1', displayName: 'Test User' }, isAdmin: false });
  (subscribeWishlistItems as Mock).mockImplementation((_id: string, cb: (items: unknown[]) => void) => {
    cb([]);
    return () => {
    };
  });
});

describe('wishlist growth journey', () => {
  it.each([false, true])('ignores a banner upload from an earlier visit (return to original: %s)', async (returnToOriginal) => {
    vi.mocked(getWishlistById).mockResolvedValueOnce({ id: 'a', title: 'List A', ownerUid: 'u1', bannerImage: 'a-old' })
      .mockResolvedValueOnce({ id: 'b', title: 'List B', ownerUid: 'u1', bannerImage: 'b-image' })
      .mockResolvedValueOnce({ id: 'a', title: 'List A again', ownerUid: 'u1', bannerImage: 'a-current' });
    renderAt('/en/wishlist/a');
    await screen.findByText('List A');
    const oldUpload = vi.mocked(WishlistHeader).mock.calls.at(-1)![0].onBannerUpload!;
    await act(async () => {
      window.history.pushState({}, '', '/en/wishlist/b');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await screen.findByText('List B');
    if (returnToOriginal) {
      await act(async () => {
        window.history.pushState({}, '', '/en/wishlist/a');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
      await screen.findByText('List A again');
    }
    await act(async () => { oldUpload('late-a-image'); });
    expect(vi.mocked(WishlistHeader).mock.calls.at(-1)![0].wishlist.bannerImage).toBe(returnToOriginal ? 'a-current' : 'b-image');
    expect(trackEvent).not.toHaveBeenCalledWith('wishlist_banner_upload', expect.anything());
  });

  it('reports a successful banner upload with bounded owner context', async () => {
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'owned', title: 'Owned', ownerUid: 'u1' });
    renderAt('/en/wishlist/owned');
    await screen.findByText('Owned');
    const upload = vi.mocked(WishlistHeader).mock.calls.at(-1)![0].onBannerUpload!;
    await act(async () => { upload('https://cdn.example/banner.webp'); });
    expect(trackEvent).toHaveBeenCalledWith('wishlist_banner_upload', { viewer_role: 'owner', is_demo: false });
    expect(vi.mocked(WishlistHeader).mock.calls.at(-1)![0].wishlist.bannerImage).toBe('https://cdn.example/banner.webp');
  });

  it('does not release the next wishlist operation lock when an earlier share completes', async () => {
    let resolveA!: () => void;
    let resolveB!: () => void;
    const share = vi.fn().mockImplementationOnce(() => new Promise<void>(resolve => { resolveA = resolve; }))
      .mockImplementationOnce(() => new Promise<void>(resolve => { resolveB = resolve; }));
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    vi.mocked(getWishlistById).mockResolvedValueOnce({ id: 'a', title: 'List A', ownerUid: 'u1' })
      .mockResolvedValueOnce({ id: 'b', title: 'List B', ownerUid: 'u1' });
    renderAt('/en/wishlist/a');
    await userEvent.click(await screen.findByRole('button', { name: /^share$/i }));
    await act(async () => {
      window.history.pushState({}, '', '/en/wishlist/b');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await screen.findByText('List B');
    await userEvent.click(screen.getByRole('button', { name: /^share$/i }));
    await act(async () => { resolveA(); });
    expect(screen.getByRole('button', { name: /^share$/i })).toBeDisabled();
    await act(async () => { resolveB(); });
    expect(screen.getByRole('button', { name: /^share$/i })).toBeEnabled();
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
  });
  it('makes personal lists noindex while keeping their UI title', async () => {
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'private', title: 'Personal birthday', ownerUid: 'u1' });
    renderAt('/en/wishlist/private');
    await screen.findByText('Personal birthday');
    expect(SEOHead).toHaveBeenLastCalledWith(expect.objectContaining({ title: 'Personal birthday - WishList App', robots: 'noindex,follow' }), undefined);
  });

  it('gives signed-out shared-list guests a create action without copying private gifts', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, isAdmin: false });
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'shared', title: 'Shared birthday', ownerUid: 'other' });
    renderAt('/en/wishlist/shared');
    await userEvent.click(await screen.findByRole('button', { name: /create my wishlist/i }));
    expect(signIn).toHaveBeenCalledTimes(1);
    expect(copyWishlist).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it.each([false, true])('preserves an explicit reviewed copy for signed-in shared-list visitors (admin: %s)', async (isAdmin) => {
    vi.mocked(useAuth).mockReturnValue({ user: { uid: 'u1', displayName: 'Test User' }, isAdmin });
    const items = [{ id: 'shared-item', name: 'Shared gift', claimed: true }];
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'shared', title: 'Shared list', ownerUid: 'other' });
    vi.mocked(subscribeWishlistItems).mockImplementation((_id, callback) => { callback(items); return () => {}; });
    vi.mocked(copyWishlist).mockResolvedValue('shared-copy');
    renderAt('/en/wishlist/shared');
    await userEvent.click(await screen.findByRole('button', { name: /copy wishlist to yourself/i }));
    expect(copyWishlist).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));
    await waitFor(() => expect(copyWishlist).toHaveBeenCalledWith('Shared list', 'u1', items, 'shared_copy'));
    expect(trackEvent).toHaveBeenCalledWith('wishlist_create', { creation_method: 'shared_copy', source: 'guest_list' });
    expect(trackEvent).not.toHaveBeenCalledWith('copy_example_wishlist', expect.anything());
  });

  it('does not expose editing controls to a non-admin owner of an official example', async () => {
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'birthday-list', title: 'Official example', ownerUid: 'u1' });
    renderAt('/en/wishlist/birthday-list');
    await screen.findByRole('heading', { name: 'Official example' });
    expect(screen.queryByRole('button', { name: /add gift/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit wishlist title/i })).not.toBeInTheDocument();
    expect(vi.mocked(WishlistHeader).mock.calls.at(-1)![0].canEdit).toBe(false);
    expect(screen.getByRole('button', { name: /use this example/i })).toBeEnabled();
  });

  it('copies static demo content after title review, preserving unclaimed destination via the service', async () => {
    vi.mocked(getWishlistById).mockResolvedValue(null);
    vi.mocked(copyWishlist).mockResolvedValue('new-copy');
    renderAt('/en/wishlist/birthday-list');
    await userEvent.click(await screen.findByRole('button', { name: /use this example/i }));
    expect(copyWishlist).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));
    await waitFor(() => expect(copyWishlist).toHaveBeenCalledWith(expect.any(String), 'u1', expect.arrayContaining([expect.objectContaining({ name: expect.any(String) })]), 'demo_copy'));
    expect(vi.mocked(copyWishlist).mock.calls[0][2].length).toBeGreaterThan(0);
  });

  it('copies the populated Firestore example rather than the static fallback', async () => {
    const override = [{ id: 'override', name: 'Actual example item', claimed: true, priceMinor: 4200, currency: 'EUR' as const }];
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'birthday-list', title: 'Updated example', ownerUid: 'demo' });
    vi.mocked(subscribeWishlistItems).mockImplementation((_id, callback) => { callback(override); return () => {}; });
    vi.mocked(copyWishlist).mockResolvedValue('copy-override');
    renderAt('/en/wishlist/birthday-list');
    await userEvent.click(await screen.findByRole('button', { name: /use this example/i }));
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));
    await waitFor(() => expect(copyWishlist).toHaveBeenCalledWith('Updated example', 'u1', override, 'demo_copy'));
  });

  it('only reports a reservation after persistence succeeds and retains retry after failure', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, isAdmin: false });
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'shared', title: 'Shared list', ownerUid: 'other' });
    vi.mocked(subscribeWishlistItems).mockImplementation((_id, callback) => { callback([{ id: 'gift', name: 'Gift', claimed: false }]); return () => {}; });
    vi.mocked(toggleGiftClaimStatus).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
    renderAt('/en/wishlist/shared');
    await userEvent.click(await screen.findByText('Gift', { exact: true }));
    await userEvent.click(screen.getByRole('button', { name: /^yes$/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveTextContent(/could not reserve/i));
    expect(trackEvent).not.toHaveBeenCalledWith('gift_reserve_success', expect.anything());
    await userEvent.click(screen.getByRole('button', { name: /^yes$/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trackEvent).toHaveBeenCalledWith('gift_reserve_success', { viewer_role: 'guest', is_demo: false });
  });

  it.each([true, false])('falls back to clipboard and counts only successful writes (success: %s)', async (success) => {
    const user = userEvent.setup();
    const write = vi.spyOn(navigator.clipboard, 'writeText');
    if (success) write.mockResolvedValue(undefined); else write.mockRejectedValue(new Error('denied'));
    const prompt = vi.spyOn(window, 'prompt').mockReturnValue(null);
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'owned', title: 'Owned', ownerUid: 'u1' });
    renderAt('/en/wishlist/owned?private=query');
    await user.click(await screen.findByRole('button', { name: /^share$/i }));
    expect(write).toHaveBeenCalledWith(`${location.origin}/en/wishlist/owned`);
    if (success) {
      expect(trackEvent).toHaveBeenCalledWith('wishlist_share_copy', expect.objectContaining({ method: 'clipboard' }));
      expect(prompt).not.toHaveBeenCalled();
    } else {
      expect(prompt).toHaveBeenCalledWith(expect.any(String), `${location.origin}/en/wishlist/owned`);
      expect(trackEvent).not.toHaveBeenCalledWith('wishlist_share_copy', expect.anything());
      expect(screen.queryByText('Link copied')).not.toBeInTheDocument();
    }
    write.mockRestore();
    prompt.mockRestore();
  });

  it('offers an explicit copy option when native sharing is rejected by browser policy', async () => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: vi.fn().mockRejectedValue(new DOMException('Blocked', 'NotAllowedError')) });
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'owned', title: 'Owned', ownerUid: 'u1' });
    renderAt('/en/wishlist/owned');
    await userEvent.click(await screen.findByRole('button', { name: /^share$/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/copy-link/i);
    expect(screen.getByRole('button', { name: /copy wishlist link/i })).toBeEnabled();
    expect(trackEvent).not.toHaveBeenCalledWith('wishlist_share_handoff', expect.anything());
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
  });

  it('keeps a rejected gift draft open and allows retry', async () => {
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'owned', title: 'Owned', ownerUid: 'u1' });
    vi.mocked(addGiftItem).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
    renderAt('/en/wishlist/owned');
    await userEvent.click(await screen.findByRole('button', { name: /add gift/i }));
    await userEvent.type(screen.getByRole('textbox', { name: /what is it/i }), 'Keep my draft');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /what is it/i })).toHaveValue('Keep my draft');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(addGiftItem).toHaveBeenCalledTimes(2);
  });

  it('shows a retryable read error instead of a missing list', async () => {
    vi.mocked(getWishlistById).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ id: 'owned', title: 'Loaded after retry', ownerUid: 'u1' });
    renderAt('/en/wishlist/owned');
    await userEvent.click(await screen.findByRole('button', { name: /try again/i }));
    expect(await screen.findByText('Loaded after retry')).toBeInTheDocument();
    expect(screen.queryByText(/wishlist not found/i)).not.toBeInTheDocument();
  });

  it('treats cancelled native sharing neutrally and sends the canonical link', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError'));
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    vi.mocked(getWishlistById).mockResolvedValue({ id: 'owned', title: 'Owned', ownerUid: 'u1' });
    renderAt('/en/wishlist/owned?tracking=secret');
    await userEvent.click(await screen.findByRole('button', { name: /^share$/i }));
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: `${location.origin}/en/wishlist/owned` }));
    expect(trackEvent).not.toHaveBeenCalledWith('wishlist_share_handoff', expect.anything());
    expect(screen.queryByText('Link copied')).not.toBeInTheDocument();
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
  });
});

describe('WishListItemList (skeleton logic)', () => {
  it('renders loading skeleton first', async () => {
    (getWishlistById as Mock).mockImplementationOnce(() => new Promise(() => {}));
    renderAt('/en/wishlist/wl1');
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders wishlist not found if API returns null', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce(null);
    renderAt('/en/wishlist/wl1');
    await waitFor(() =>
      expect(screen.getByText(/wishlist not found/i)).toBeInTheDocument()
    );
  });

  it('renders wishlist title when found', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Birthday',
      ownerUid: 'u1',
    });
    renderAt('/en/wishlist/wl1');
    await waitFor(() => expect(screen.getByText(/birthday/i)).toBeInTheDocument());
  });

  it('allows editing title for owner', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Old Title',
      ownerUid: 'u1',
    });
    renderAt('/en/wishlist/wl1');

    const titleEl = await screen.findByText(/old title/i);
    await userEvent.click(titleEl);

    const input = await screen.findByDisplayValue(/old title/i);
    await userEvent.clear(input);
    await userEvent.type(input, 'New Title{enter}');

    await waitFor(() =>
      expect(updateWishlistTitle).toHaveBeenCalledWith('wl1', 'New Title')
    );
  });

  it('opens Add Item dialog when "Add Gift" clicked', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'My List',
      ownerUid: 'u1',
    });
    renderAt('/en/wishlist/wl1');
    await screen.findByText(/my list/i);

    await userEvent.click(screen.getByRole('button', { name: /add gift/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('clicking item as non-owner (guest) opens claim confirm dialog', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Guest List',
      ownerUid: 'owner123',
    });
    (subscribeWishlistItems as Mock).mockImplementation((_id: string, cb: (items: unknown[]) => void) => {
      cb([{ id: 'i1', name: 'Book', claimed: false }]);
      return () => {
      };
    });

    renderAt('/en/wishlist/wl1');
    await screen.findByText(/book/i);
    await userEvent.click(screen.getByText(/book/i));

    expect(await screen.findByText(/confirm to take "book"\?/i)).toBeInTheDocument();
  });

  it('delete item as owner shows confirm dialog', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Delete List',
      ownerUid: 'u1',
    });
    (subscribeWishlistItems as Mock).mockImplementation((_id: string, cb: (items: unknown[]) => void) => {
      cb([{ id: 'i2', name: 'Pen', claimed: false }]);
      return () => {
      };
    });

    renderAt('/en/wishlist/wl1');
    await screen.findByText(/pen/i);

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(await screen.findByText(/confirm deletion of "pen"\?/i)).toBeInTheDocument();
  });

  it('toggling claim calls API when owner clicks item', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Owner List',
      ownerUid: 'u1',
    });
    (subscribeWishlistItems as Mock).mockImplementation((_id: string, cb: (items: unknown[]) => void) => {
      cb([{ id: 'i3', name: 'Game', claimed: false }]);
      return () => {
      };
    });

    renderAt('/en/wishlist/wl1');
    await userEvent.click(await screen.findByText(/game/i));

    await waitFor(() =>
      expect(toggleGiftClaimStatus).toHaveBeenCalledWith('wl1', 'i3', false)
    );
  });
});

describe('WishListItemList - EXAMPLE_SEO title override', () => {
  it('uses keyword-rich SEO title for known example wishlist ID', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'christmas-list',
      title: 'Christmas Wish List 2026',
      ownerUid: 'demo',
    });
    renderAt('/en/wishlist/christmas-list');
    await waitFor(() =>
      expect(vi.mocked(SEOHead)).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Christmas Wish List 2026 - Example and Free Template | WishList App',
        }),
        undefined
      )
    );
  });

  it('shows the example intro to guests on a holiday demo', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce(null);
    renderAt('/ua/wishlist/st-nicholas-list-ua');
    expect(await screen.findByText(/Це приклад вішліста на Миколая для дитини 6-9 років/)).toBeInTheDocument();
  });

  it('hides the example intro from admins editing a demo', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { uid: 'admin-uid', displayName: 'Admin' }, isAdmin: true });
    (getWishlistById as Mock).mockResolvedValueOnce({ id: 'christmas-list', title: 'Christmas Wish List 2026', ownerUid: 'demo' });
    renderAt('/en/wishlist/christmas-list');
    expect(await screen.findByRole('heading', { name: 'Christmas Wish List 2026', level: 1 })).toBeInTheDocument();
    expect(screen.queryByText(/This is an example Christmas wish list/)).not.toBeInTheDocument();
  });

  it('uses regular title for non-example wishlist IDs', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'wl-custom',
      title: 'My Custom List',
      ownerUid: 'u1',
    });
    renderAt('/en/wishlist/wl-custom');
    await waitFor(() =>
      expect(vi.mocked(SEOHead)).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'My Custom List - WishList App' }),
        undefined
      )
    );
  });

  it('admin (canEdit=true) on example wishlist sees regular title, not SEO override', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'admin-uid', displayName: 'Admin' },
      isAdmin: true,
    });
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'birthday-list',
      title: 'Birthday Wishlist Example',
      ownerUid: 'demo',
    });
    renderAt('/en/wishlist/birthday-list');
    await waitFor(() =>
      expect(vi.mocked(SEOHead)).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Birthday Wishlist Example - WishList App' }),
        undefined
      )
    );
  });

  it('passes noindex robots to SEOHead when wishlist is not found', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce(null);
    renderAt('/en/wishlist/missing-list');

    await waitFor(() =>
      expect(vi.mocked(SEOHead)).toHaveBeenCalledWith(
        expect.objectContaining({ robots: 'noindex,follow' }),
        undefined
      )
    );
  });

  it('uses the mapped UA alternate for known example wishlists', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce({
      id: 'christmas-list',
      title: 'Christmas Wish List 2026',
      ownerUid: 'demo',
    });
    renderAt('/en/wishlist/christmas-list');

    await waitFor(() =>
      expect(vi.mocked(SEOHead)).toHaveBeenCalledWith(
        expect.objectContaining({
          alternates: {
            en: `${window.location.origin}/en/wishlist/christmas-list`,
            uk: `${window.location.origin}/ua/wishlist/christmas-list-ua`,
          },
        }),
        undefined
      )
    );
  });
});
