import { DEMO_ITEMS } from '@constants/exampleWishlists';
import {
  createWishlist,
  copyWishlist,
  getWishlistById,
  updateWishlistTitle,
  subscribeMyWishlists,
  addGiftItem,
  deleteGiftItem,
  deleteWishlistDeep,
  toggleGiftClaimStatus,
  subscribeWishlistItems,
  uploadWishlistBanner,
  updateGiftItem,
} from '@api/wishListService';

import {
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  runTransaction,
  writeBatch,
} from 'firebase/firestore';
import { uploadBytes, getDownloadURL, deleteObject, ref } from 'firebase/storage';
import { vi, type Mock } from 'vitest';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual<typeof import('firebase/firestore')>('firebase/firestore');
  return {
    ...actual,
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    onSnapshot: vi.fn(),
    updateDoc: vi.fn(),
    runTransaction: vi.fn(),
    writeBatch: vi.fn(),
    collection: vi.fn(() => ({ _col: true })),
    doc: vi.fn(() => ({ _doc: true })),
    query: vi.fn(() => ({ _query: true })),
    where: vi.fn(() => ({ _where: true })),
    orderBy: vi.fn(() => ({ _order: true })),
  };
});

vi.mock('firebase/storage', async () => {
  const actual = await vi.importActual<typeof import('firebase/storage')>('firebase/storage');
  return {
    ...actual,
    ref: vi.fn(() => ({ _ref: true })),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
    deleteObject: vi.fn(),
  };
});

describe('wishListService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createWishlist calls addDoc and returns id', async () => {
    (addDoc as Mock).mockResolvedValue({ id: 'abc123' });
    const id = await createWishlist('Test title', 'user1');
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ creationMethod: 'manual' }));
    expect(id).toBe('abc123');
  });

  it('getWishlistById returns null if not exists', async () => {
    (getDoc as Mock).mockResolvedValue({ exists: () => false });
    const result = await getWishlistById('id1');
    expect(result).toBeNull();
  });

  it('getWishlistById returns wishlist if exists', async () => {
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      id: 'id2',
      data: () => ({ title: 'Hello', ownerUid: 'u1', bannerImage: 'b', isHidden: false }),
    });
    const result = await getWishlistById('id2');
    expect(result).toMatchObject({ id: 'id2', title: 'Hello' });
  });

  it('updateWishlistTitle calls updateDoc', async () => {
    await updateWishlistTitle('id3', 'new title');
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), { title: 'new title' });
  });

  it('reads legacy customer records without backfilling or modifying stored data', async () => {
    const legacy = { title: 'Old list', ownerUid: 'owner', bannerImage: 'old-banner', isHidden: false };
    (getDoc as Mock).mockResolvedValue({ exists: () => true, id: 'legacy', data: () => legacy });
    const result = await getWishlistById('legacy');
    expect(result).toMatchObject({ id: 'legacy', ...legacy, creationMethod: undefined });
    expect(addDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(writeBatch).not.toHaveBeenCalled();
    expect(uploadBytes).not.toHaveBeenCalled();
    expect(deleteObject).not.toHaveBeenCalled();
  });

  it('subscribeMyWishlists calls onSnapshot and cb', () => {
    const fakeSnap = {
      docs: [
        { id: 'w1', data: () => ({ title: 'T1', ownerUid: 'u1', bannerImage: '', isHidden: false }) },
      ],
    };
    (onSnapshot as Mock).mockImplementation((_q, cb) => {
      cb(fakeSnap);
      return () => {
      };
    });

    const cb = vi.fn();
    const unsub = subscribeMyWishlists('u1', cb);

    expect(cb).toHaveBeenCalledTimes(1);
    const firstArg = (cb as Mock).mock.calls[0][0];
    expect(Array.isArray(firstArg)).toBe(true);
    expect(firstArg).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'w1', title: 'T1' }),
      ])
    );

    expect(typeof unsub).toBe('function');
  });

  it('addGiftItem calls addDoc with trimmed values', async () => {
    await addGiftItem('w1', { name: ' Item ', description: ' d ', link: ' l ' });
    expect(addDoc).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ name: 'Item', description: 'd', link: 'l' })
    );
  });

  it('deleteGiftItem calls deleteDoc', async () => {
    await deleteGiftItem('w1', 'i1');
    expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object));
  });

  it('deleteWishlistDeep deletes items, wishlist, and firebase banner URL', async () => {
    const bannerUrl =
      'https://firebasestorage.googleapis.com/v0/b/test-bucket/o/banners%2Fx.png?alt=media';
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ bannerImage: bannerUrl }),
    });
    (getDocs as Mock).mockResolvedValue({
      empty: false,
      docs: [{ ref: 'doc1' }, { ref: 'doc2' }],
    });

    await deleteWishlistDeep('wid');
    expect(deleteDoc).toHaveBeenCalledTimes(3);
    expect(ref).toHaveBeenCalledWith(expect.anything(), bannerUrl);
    expect(deleteObject).toHaveBeenCalledWith({ _ref: true });
  });

  it('deleteWishlistDeep skips Storage delete for non-Firebase banner URLs', async () => {
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ bannerImage: 'https://images.unsplash.com/photo-1' }),
    });
    (getDocs as Mock).mockResolvedValue({ empty: true, docs: [] });

    await deleteWishlistDeep('wid');
    expect(deleteObject).not.toHaveBeenCalled();
  });

  it('toggleGiftClaimStatus flips claimed', async () => {
    (runTransaction as Mock).mockImplementation((_db, action) => action({ get: async () => ({ exists: () => true, data: () => ({ claimed: false }) }), update: updateDoc }));
    await toggleGiftClaimStatus('w1', 'i1', false);
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), { claimed: true });
  });

  it('subscribeWishlistItems calls onSnapshot and cb', () => {
    const fakeSnap = {
      docs: [{ id: 'i1', data: () => ({ name: 'pen', claimed: false }) }],
    };
    (onSnapshot as Mock).mockImplementation((_q, cb) => {
      cb(fakeSnap);
      return () => {
      };
    });

    const cb = vi.fn();
    const unsub = subscribeWishlistItems('w1', cb);
    expect(cb).toHaveBeenCalledWith([{ id: 'i1', name: 'pen', claimed: false }]);
    expect(typeof unsub).toBe('function');
  });

  it('uploadWishlistBanner uploads file, updates doc, returns url', async () => {
    const fakeFile = new File(['abc'], 'pic.png', { type: 'image/png' });
    (getDownloadURL as Mock).mockResolvedValue('http://url/pic.png');
    await uploadWishlistBanner('w1', fakeFile);
    expect(uploadBytes).toHaveBeenCalled();
    expect(getDownloadURL).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ bannerImage: 'http://url/pic.png' })
    );
  });

  it('updateGiftItem trims and calls updateDoc', async () => {
    await updateGiftItem('w1', 'i1', { name: ' pen ', description: ' d ', link: ' l ' });
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      name: 'pen',
      description: 'd',
      link: 'l',
    });
  });

  it('preserves optional price and clears both fields explicitly', async () => {
    await addGiftItem('w1', { name: 'Pen', priceMinor: 0, currency: 'GBP' });
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ priceMinor: 0, currency: 'GBP' }));
    await updateGiftItem('w1', 'i1', { priceMinor: null, currency: null });
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { priceMinor: null, currency: null });
    await expect(addGiftItem('w1', { name: 'Pen', priceMinor: -1, currency: 'USD' })).rejects.toThrow();
  });
  it('copies resolved items atomically and resets claims', async () => {
    const set = vi.fn(); const commit = vi.fn().mockResolvedValue(undefined);
    (writeBatch as Mock).mockReturnValue({ set, commit });
    await copyWishlist('Copy', 'owner', [{ id: 'fallback', name: 'Pen', claimed: true, priceMinor: 123, currency: 'EUR' }]);
    expect(set).toHaveBeenCalledTimes(2);
    expect(set).toHaveBeenNthCalledWith(1, expect.anything(), expect.objectContaining({ creationMethod: 'demo_copy' }));
    expect(set).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ name: 'Pen', claimed: false, priceMinor: 123, currency: 'EUR' }));
    expect(commit).toHaveBeenCalledOnce();
    commit.mockRejectedValueOnce(new Error('denied'));
    await expect(copyWishlist('Copy', 'owner', [])).rejects.toThrow('denied');
  });
  it('classifies an explicit shared-list copy while retaining money and clearing reservations', async () => {
    const set = vi.fn(); const commit = vi.fn().mockResolvedValue(undefined);
    (writeBatch as Mock).mockReturnValue({ set, commit });
    await copyWishlist('Shared copy', 'owner', [{ id: 'gift', name: 'Gift', claimed: true, priceMinor: 500, currency: 'USD' }], 'shared_copy');
    expect(set).toHaveBeenNthCalledWith(1, expect.anything(), expect.objectContaining({ creationMethod: 'shared_copy' }));
    expect(set).toHaveBeenNthCalledWith(2, expect.anything(), expect.objectContaining({ claimed: false, priceMinor: 500, currency: 'USD' }));
    expect(commit).toHaveBeenCalledOnce();
  });
  it.each(['christmas-list', 'christmas-list-ua', 'secret-santa-list', 'secret-santa-list-ua'])('copies indicative demo money for %s', async demoId => {
    const set = vi.fn(); const commit = vi.fn().mockResolvedValue(undefined);
    (writeBatch as Mock).mockReturnValue({ set, commit });
    await copyWishlist('Copy', 'owner', DEMO_ITEMS[demoId]);
    const priced = DEMO_ITEMS[demoId].find(item => item.priceMinor !== undefined)!;
    expect(set).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ name: priced.name, priceMinor: priced.priceMinor, currency: priced.currency, claimed: false }));
  });
  it('rejects oversized copies before creating writes', async () => {
    await expect(copyWishlist('Copy', 'owner', Array(500).fill({ name: 'Pen', claimed: false }))).rejects.toThrow('limit');
    expect(writeBatch).not.toHaveBeenCalled();
  });
  it('forwards subscription failures', () => {
    (onSnapshot as Mock).mockImplementation((_q, _cb, error) => { error(new Error('offline')); return vi.fn(); });
    const error = vi.fn(); subscribeWishlistItems('w1', vi.fn(), error);
    expect(error).toHaveBeenCalledWith(expect.any(Error));
  });

  describe('DEMO_WISHLISTS fallback', () => {
    it('returns demo wishlist for known example ID when not in Firestore', async () => {
      (getDoc as Mock).mockResolvedValue({ exists: () => false });
      const result = await getWishlistById('christmas-list');
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Christmas Wish List 2026');
      expect(result?.ownerUid).toBe('demo');
    });

    it('returns null for unknown ID not in DEMO_WISHLISTS', async () => {
      (getDoc as Mock).mockResolvedValue({ exists: () => false });
      const result = await getWishlistById('not-a-demo-wishlist');
      expect(result).toBeNull();
    });

    it('all 8 example IDs fall back with ownerUid=demo (cannot be claimed by regular users)', async () => {
      const exampleIds = [
        'christmas-list', 'christmas-list-ua',
        'birthday-list', 'birthday-list-ua',
        'secret-santa-list', 'secret-santa-list-ua',
        'wedding-list', 'wedding-list-ua',
      ];
      for (const id of exampleIds) {
        (getDoc as Mock).mockResolvedValue({ exists: () => false });
        const result = await getWishlistById(id);
        expect(result?.ownerUid).toBe('demo');
      }
    });

    it('Firestore record takes precedence over DEMO_WISHLISTS when it exists', async () => {
      (getDoc as Mock).mockResolvedValue({
        exists: () => true,
        id: 'christmas-list',
        data: () => ({ title: 'Custom Override', ownerUid: 'u99', bannerImage: '', isHidden: false }),
      });
      const result = await getWishlistById('christmas-list');
      expect(result?.title).toBe('Custom Override');
      expect(result?.ownerUid).toBe('u99');
    });
  });
});
