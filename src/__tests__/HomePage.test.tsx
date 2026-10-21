import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, customRender as render, screen, waitFor } from '../test/render';
import userEvent from '@testing-library/user-event';
import '../../src/i18n';
import HomePage from '@components/HomePage';
import { trackEvent } from '@utils/analytics';
vi.mock('@utils/analytics', () => ({ trackEvent: vi.fn().mockResolvedValue(undefined) }));

const authState = vi.hoisted(() => ({ user: { uid: 'u-1' } as { uid: string } | null }));
vi.mock('@hooks/useAuth', () => ({ useAuth: () => authState }));

const subscribeMyWishlists = vi.fn();
const deleteWishlistDeep = vi.fn();

vi.mock('@api/wishListService', () => ({
  subscribeMyWishlists: (...args: unknown[]) => subscribeMyWishlists(...args),
  deleteWishlistDeep: (...args: unknown[]) => deleteWishlistDeep(...args),
}));

function emitLists(lists: unknown[]) {
  subscribeMyWishlists.mockImplementation((_uid: string, cb: (lists: unknown[]) => void) => {
    cb(lists);
    return () => {
    };
  });
}

beforeEach(() => {
  authState.user = { uid: 'u-1' };
  subscribeMyWishlists.mockReset().mockReturnValue(() => {});
  deleteWishlistDeep.mockReset();
  window.history.replaceState({}, '', '/en');
});

describe('HomePage', () => {
  it('does not start a subscription if the user signs out while the data module is loading', async () => {
    const { rerender } = render(<HomePage lang="en" />);
    authState.user = null;
    rerender(<HomePage lang="en" />);
    await act(async () => {});

    expect(subscribeMyWishlists).not.toHaveBeenCalled();
    expect(screen.queryByRole('heading', { name: /your wishlists/i })).not.toBeInTheDocument();
  });

  it('does not start a subscription after the homepage has unmounted', async () => {
    const { unmount } = render(<HomePage lang="en" />);
    unmount();
    await act(async () => {});

    expect(subscribeMyWishlists).not.toHaveBeenCalled();
  });

  it('stops a loaded subscription on sign-out and ignores its late results', async () => {
    let publish!: (lists: unknown[]) => void;
    const unsubscribe = vi.fn();
    subscribeMyWishlists.mockImplementation((_uid, callback) => { publish = callback; return unsubscribe; });
    const { rerender } = render(<HomePage lang="en" />);
    await act(async () => {});
    await act(async () => { publish([{ id: 'old', title: 'Previous account list' }]); });
    expect(screen.getByText('Previous account list')).toBeInTheDocument();

    authState.user = null;
    rerender(<HomePage lang="en" />);
    await act(async () => { publish([{ id: 'stale', title: 'Stale list' }]); });
    expect(unsubscribe).toHaveBeenCalledOnce();
    expect(screen.queryByText('Stale list')).not.toBeInTheDocument();
    expect(screen.queryByText('Previous account list')).not.toBeInTheDocument();
  });

  it.each(['en', 'ua'] as const)('keeps %s homepage headings in a sequential hierarchy', async lang => {
    emitLists([]);
    render(<HomePage lang={lang} />);
    await screen.findByRole('heading', { level: 1 });

    const levels = screen.getAllByRole('heading').map(heading => Number(heading.tagName.slice(1)));
    expect(levels.filter(level => level === 1)).toHaveLength(1);
    levels.slice(1).forEach((level, index) => {
      expect(level).toBeLessThanOrEqual(levels[index] + 1);
    });
  });

  it('reports the blog as the creation source when its create link led here', async () => {
    emitLists([]);
    window.history.replaceState({ usr: { creationSource: 'blog' } }, '', '/en');
    render(<HomePage lang="en" />);
    await userEvent.click(screen.getAllByRole('button', { name: /create wishlist/i })[0]);
    expect(trackEvent).toHaveBeenCalledWith('create_wishlist_start', { source: 'blog' });
  });

  it('shows a retry action for subscription failure instead of loading forever', async () => {
    subscribeMyWishlists.mockImplementationOnce((_uid, _cb, onError) => { onError(new Error('offline')); return () => {}; });
    render(<HomePage lang="en" />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load/i);
    emitLists([{ id: 'retried', title: 'Restored list' }]);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByText('Restored list')).toBeInTheDocument();
  });
  it('renders Ukrainian copy on the ua route', async () => {
    emitLists([]);
    render(<HomePage lang="ua" />);

    expect(await screen.findByRole('heading', { name: /створіть вішліст/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /створити вішліст/i }).length).toBeGreaterThan(0);
  });

  it('opens confirm, shows loading (disabled button), calls deleteWishlistDeep', async () => {
    emitLists([{ id: 'wl1', title: 'My wishlist' }]);

    render(<HomePage lang="en" />);

    expect(await screen.findByText('My wishlist')).toBeInTheDocument();

    const delBtns = await screen.findAllByRole('button', { name: /delete wishlist/i });
    await userEvent.click(delBtns[0]);

    let resolve!: () => void;
    deleteWishlistDeep.mockImplementation(() => new Promise<void>((r) => (resolve = r)));

    const confirmBtn = await screen.findByRole('button', { name: /^delete$/i });
    await userEvent.click(confirmBtn);

    await waitFor(() => expect(confirmBtn).toBeDisabled());

    resolve();
    await waitFor(() => expect(deleteWishlistDeep).toHaveBeenCalledWith('wl1'));
  });

  it('renders skeletons when loading', async () => {
    const { container } = render(<HomePage lang="en" />);

    await waitFor(() => {
      const skels = container.querySelectorAll('.MuiSkeleton-root');
      expect(skels.length).toBeGreaterThan(0);
    });
  });

  it('renders empty state when no wishlists', async () => {
    emitLists([]);
    render(<HomePage lang="en" />);

    expect(await screen.findByText(/no wishlists yet/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /create one/i })).toBeInTheDocument();
  });

  it('opens CreateWishListDialog when clicking Create wishlist', async () => {
    emitLists([]);
    render(<HomePage lang="en" />);

    const createBtns = screen.getAllByRole('button', { name: /create wishlist/i });
    await userEvent.click(createBtns[createBtns.length - 1]);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('cancel in ConfirmDialog does not call deleteWishlistDeep', async () => {
    emitLists([{ id: 'wl1', title: 'My wishlist' }]);
    render(<HomePage lang="en" />);

    await userEvent.click(await screen.findByRole('button', { name: /delete wishlist/i }));

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(deleteWishlistDeep).not.toHaveBeenCalled();
    });
  });
});
