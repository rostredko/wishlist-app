import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { customRender as render, screen, waitFor } from '../test/render';
import '../../src/i18n';
import { WishListItemList } from '@components/WishListItemList';

vi.mock('canvas-confetti', () => ({
  __esModule: true,
  default: () => {
  },
}));

vi.mock('@components/WishListHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="header-stub" />,
}));
vi.mock('@components/BannerUploader', () => ({
  __esModule: true,
  default: () => null,
}));
vi.mock('@components/SEOHead', () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'u1', displayName: 'Test User' }, isAdmin: false }),
}));

import {
  getWishlistById,
  updateWishlistTitle,
  toggleGiftClaimStatus,
  subscribeWishlistItems,
} from '@api/wishListService';

vi.mock('@api/wishListService', () => ({
  getWishlistById: vi.fn(),
  updateWishlistTitle: vi.fn(),
  addGiftItem: vi.fn(),
  deleteGiftItem: vi.fn(),
  toggleGiftClaimStatus: vi.fn(),
  subscribeWishlistItems: vi.fn(),
}));

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
  (subscribeWishlistItems as Mock).mockImplementation((_id: string, cb: (items: unknown[]) => void) => {
    cb([]);
    return () => {
    };
  });
});

describe('WishListItemList (skeleton logic)', () => {
  it('renders loading skeleton first', async () => {
    (getWishlistById as Mock).mockResolvedValueOnce(null);
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