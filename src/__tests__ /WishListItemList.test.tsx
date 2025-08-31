import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { WishListItemList } from '../components/WishListItemList';

import {
  getWishlistById,
  updateWishlistTitle,
  addGiftItem,
  deleteGiftItem,
  toggleGiftClaimStatus,
  subscribeWishlistItems,
} from '@api/wishListService';

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'u1', displayName: 'Test User' }, isAdmin: false }),
}));

vi.mock('@api/wishListService', () => ({
  getWishlistById: vi.fn(),
  updateWishlistTitle: vi.fn(),
  addGiftItem: vi.fn(),
  deleteGiftItem: vi.fn(),
  toggleGiftClaimStatus: vi.fn(),
  subscribeWishlistItems: vi.fn(),
}));

function renderWithRouter(ui: React.ReactNode, { initialPath = '/wishlist/wl1' } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/wishlist/:wishlistId" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

describe('WishListItemList (skeleton logic)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton first', async () => {
    (getWishlistById as vi.Mock).mockResolvedValueOnce(null);

    renderWithRouter(<WishListItemList />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders wishlist not found if API returns null', async () => {
    (getWishlistById as vi.Mock).mockResolvedValueOnce(null);

    renderWithRouter(<WishListItemList />);
    await waitFor(() =>
      expect(screen.getByText(/wishlist not found/i)).toBeInTheDocument()
    );
  });

  it('renders wishlist title when found', async () => {
    (getWishlistById as vi.Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Birthday',
      ownerUid: 'u1',
    });
    (subscribeWishlistItems as vi.Mock).mockImplementation((_, cb) => {
      cb([]);
      return vi.fn();
    });

    renderWithRouter(<WishListItemList />);
    await waitFor(() =>
      expect(screen.getByText(/birthday/i)).toBeInTheDocument()
    );
  });

  it('allows editing title for owner', async () => {
    (getWishlistById as vi.Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Old Title',
      ownerUid: 'u1',
    });
    (subscribeWishlistItems as vi.Mock).mockImplementation((_, cb) => {
      cb([]);
      return vi.fn();
    });

    renderWithRouter(<WishListItemList />);
    const titleEl = await screen.findByText(/old title/i);
    await userEvent.click(titleEl);

    const input = await screen.findByDisplayValue(/old title/i);
    await userEvent.clear(input);
    await userEvent.type(input, 'New Title{enter}');

    await waitFor(() =>
      expect(updateWishlistTitle).toHaveBeenCalledWith('wl1', 'New Title')
    );
  });

  it('adds item when Add Gift clicked', async () => {
    (getWishlistById as vi.Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'My List',
      ownerUid: 'u1',
    });
    (subscribeWishlistItems as vi.Mock).mockImplementation((_, cb) => {
      cb([]);
      return vi.fn();
    });

    renderWithRouter(<WishListItemList />);
    await screen.findByText(/my list/i);

    await userEvent.click(screen.getByRole('button', { name: /add gift/i }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('claiming as guest opens confirm dialog', async () => {
    vi.doMock('@hooks/useAuth', () => ({
      useAuth: () => ({ user: null, isAdmin: false }),
    }));

    (getWishlistById as vi.Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Guest List',
      ownerUid: 'owner123',
    });
    (subscribeWishlistItems as vi.Mock).mockImplementation((_, cb) => {
      cb([{ id: 'i1', name: 'Book', claimed: false }]);
      return vi.fn();
    });

    renderWithRouter(<WishListItemList />);
    await screen.findByText(/book/i);

    await userEvent.click(screen.getByText(/book/i));

    expect(
      await screen.findByText(/confirm to take "book"/i)
    ).toBeInTheDocument();
  });

  it('delete item as owner triggers API', async () => {
    (getWishlistById as vi.Mock).mockResolvedValueOnce({
      id: 'wl1',
      title: 'Delete List',
      ownerUid: 'u1',
    });
    (subscribeWishlistItems as vi.Mock).mockImplementation((_, cb) => {
      cb([{ id: 'i2', name: 'Pen', claimed: false }]);
      return vi.fn();
    });

    renderWithRouter(<WishListItemList />);
    await screen.findByText(/pen/i);

    await userEvent.click(
      screen.getByRole('button', { name: /delete/i })
    );

    expect(
      await screen.findByText(/confirm deletion of "pen"/i)
    ).toBeInTheDocument();
  });
});