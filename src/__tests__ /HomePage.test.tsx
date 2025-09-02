import { describe, it, expect, vi, beforeEach } from 'vitest';
import { customRender as render, screen, waitFor } from '../test/render';
import userEvent from '@testing-library/user-event';

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'u-1' } }),
}));

const subscribeMyWishlists = vi.fn();
const deleteWishlistDeep = vi.fn();

vi.mock('@api/wishListService', () => ({
  subscribeMyWishlists: (...args: any[]) => subscribeMyWishlists(...args),
  deleteWishlistDeep: (...args: any[]) => deleteWishlistDeep(...args),
}));

import HomePage from '@components/HomePage';

function emitLists(lists: any[]) {
  subscribeMyWishlists.mockImplementation((_uid: string, cb: any) => {
    cb(lists);
    return () => {};
  });
}

beforeEach(() => {
  subscribeMyWishlists.mockReset();
  deleteWishlistDeep.mockReset();
});

describe('HomePage – delete wishlist flow', () => {
  it('opens confirm, shows loading, calls deleteWishlistDeep', async () => {
    emitLists([{ id: 'wl1', title: 'My wishlist' }]);
    // @ts-ignore
    const { container } = render(<HomePage />);

    expect(await screen.findByText('My wishlist')).toBeInTheDocument();

    const delBtns = await screen.findAllByRole('button', { name: /delete wishlist/i });
    await userEvent.click(delBtns[0]);

    let resolve!: () => void;
    deleteWishlistDeep.mockImplementation(() => new Promise<void>((r) => (resolve = r)));

    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(await screen.findByText(/please wait/i)).toBeDisabled();

    resolve();
    await waitFor(() => expect(deleteWishlistDeep).toHaveBeenCalledWith('wl1'));
  });

  it('renders skeletons when loading', async () => {
    const { container } = render(<HomePage />);

    await waitFor(() => {
      const skels = container.querySelectorAll('.MuiSkeleton-root');
      expect(skels.length).toBeGreaterThan(0);
    });
  });

  it('renders empty state when no wishlists', async () => {
    emitLists([]);
    render(<HomePage />);
    expect(await screen.findByText(/no wishlists yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create one/i })).toBeInTheDocument();
  });

  it('opens CreateWishListDialog when clicking Create wishlist', async () => {
    emitLists([]);
    render(<HomePage />);
    const btn = screen.getByRole('button', { name: /create wishlist/i });
    await userEvent.click(btn);
    expect(await screen.findByText(/new wishlist/i)).toBeInTheDocument();
  });

  it('cancel in ConfirmDialog does not call deleteWishlistDeep', async () => {
    emitLists([{ id: 'wl1', title: 'My wishlist' }]);
    render(<HomePage />);

    await userEvent.click(await screen.findByRole('button', { name: /delete wishlist/i }));
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(deleteWishlistDeep).not.toHaveBeenCalled();
    });
  });
});