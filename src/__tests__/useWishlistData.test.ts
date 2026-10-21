import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useWishlistData } from '@hooks/useWishlistData';
import { getWishlistById, subscribeWishlistItems } from '@api/wishListService';
vi.mock('@api/wishListService', () => ({ getWishlistById: vi.fn(), subscribeWishlistItems: vi.fn() }));
const list = (id: string) => ({ id, title: id, ownerUid: id, bannerImage: '', isHidden: false });
describe('route data lifetime', () => {
  beforeEach(() => { vi.resetAllMocks(); vi.mocked(subscribeWishlistItems).mockReturnValue(vi.fn()); });
  it('ignores late previous-route data and clears previous header immediately', async () => {
    let resolveA!: (value: ReturnType<typeof list>) => void;
    vi.mocked(getWishlistById).mockImplementation(id => id === 'a' ? new Promise(resolve => { resolveA = resolve; }) : Promise.resolve(list('b')));
    const { result, rerender } = renderHook(({ id }) => useWishlistData(id), { initialProps: { id: 'a' } });
    rerender({ id: 'b' });
    expect(result.current.wishlist).toBeNull();
    await waitFor(() => expect(result.current.wishlist?.id).toBe('b'));
    await act(async () => resolveA(list('a')));
    expect(result.current.wishlist?.id).toBe('b');
  });
  it('does not resurrect a previous list after navigating to a missing list', async () => {
    let resolveA!: (value: ReturnType<typeof list>) => void;
    vi.mocked(getWishlistById).mockImplementation(id => id === 'a' ? new Promise(resolve => { resolveA = resolve; }) : Promise.resolve(null));
    const { result, rerender } = renderHook(({ id }) => useWishlistData(id), { initialProps: { id: 'a' } });
    rerender({ id: 'missing' });
    await waitFor(() => expect(result.current.status).toBe('not_found'));
    await act(async () => resolveA(list('a')));
    expect(result.current.wishlist).toBeNull();
  });
  it('invalidates the pending read and item callback on unmount', async () => {
    let resolve!: (value: ReturnType<typeof list>) => void;
    let receive!: (items: []) => void;
    const unsubscribe = vi.fn();
    vi.mocked(getWishlistById).mockReturnValue(new Promise(done => { resolve = done; }));
    vi.mocked(subscribeWishlistItems).mockImplementation((_id, cb) => { receive = cb; return unsubscribe; });
    const { result, unmount } = renderHook(() => useWishlistData('a'));
    unmount();
    await act(async () => { resolve(list('a')); receive([]); });
    expect(result.current.wishlist).toBeNull();
    expect(result.current.itemsLoaded).toBe(false);
    expect(unsubscribe).toHaveBeenCalledOnce();
  });
  it('separates read failures from missing lists and retries', async () => {
    vi.mocked(getWishlistById).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(null);
    const { result } = renderHook(() => useWishlistData('a'));
    await waitFor(() => expect(result.current.status).toBe('error'));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.status).toBe('not_found'));
  });
  it('reports subscription errors and ignores callbacks after unmount', async () => {
    vi.mocked(getWishlistById).mockResolvedValue(list('a'));
    const unsubscribe = vi.fn();
    vi.mocked(subscribeWishlistItems).mockImplementation((_id, cb, error) => { cb([]); error?.(new Error('offline')); return unsubscribe; });
    const { result, unmount } = renderHook(() => useWishlistData('a'));
    await waitFor(() => expect(result.current.itemsError).not.toBeNull());
    expect(result.current.itemsLoaded).toBe(false);
    unmount(); expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
