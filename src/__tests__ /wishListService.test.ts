import {
  createWishlist,
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
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';

// --- моки Firestore ---
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual<any>('firebase/firestore');
  return {
    ...actual,
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    onSnapshot: vi.fn(),
    updateDoc: vi.fn(),
    // возврат фейковых ссылок, чтобы не был undefined
    collection: vi.fn(() => ({ _col: true })),
    doc: vi.fn(() => ({ _doc: true })),
    query: vi.fn(() => ({ _query: true })),
    where: vi.fn(() => ({ _where: true })),
    orderBy: vi.fn(() => ({ _order: true })),
  };
});

// --- моки Storage ---
vi.mock('firebase/storage', async () => {
  const actual = await vi.importActual<any>('firebase/storage');
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
    (addDoc as vi.Mock).mockResolvedValue({ id: 'abc123' });
    const id = await createWishlist('Test title', 'user1');
    expect(addDoc).toHaveBeenCalled();
    expect(id).toBe('abc123');
  });

  it('getWishlistById returns null if not exists', async () => {
    (getDoc as vi.Mock).mockResolvedValue({ exists: () => false });
    const result = await getWishlistById('id1');
    expect(result).toBeNull();
  });

  it('getWishlistById returns wishlist if exists', async () => {
    (getDoc as vi.Mock).mockResolvedValue({
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

  it('subscribeMyWishlists calls onSnapshot and cb', () => {
    const fakeSnap = {
      docs: [
        { id: 'w1', data: () => ({ title: 'T1', ownerUid: 'u1', bannerImage: '', isHidden: false }) },
      ],
    };
    (onSnapshot as vi.Mock).mockImplementation((_q, cb) => {
      cb(fakeSnap);
      return () => {};
    });

    const cb = vi.fn();
    const unsub = subscribeMyWishlists('u1', cb);

    expect(cb).toHaveBeenCalledTimes(1);
    const firstArg = (cb as unknown as vi.Mock).mock.calls[0][0];
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

  it('deleteWishlistDeep deletes items, wishlist, and banner', async () => {
    (getDoc as vi.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ bannerImage: 'banner.jpg' }),
    });
    (getDocs as vi.Mock).mockResolvedValue({
      empty: false,
      docs: [{ ref: 'doc1' }, { ref: 'doc2' }],
    });

    await deleteWishlistDeep('wid');
    expect(deleteDoc).toHaveBeenCalledTimes(3); // 2 items + wishlist
    expect(deleteObject).toHaveBeenCalled();
  });

  it('toggleGiftClaimStatus flips claimed', async () => {
    await toggleGiftClaimStatus('w1', 'i1', false);
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), { claimed: true });
  });

  it('subscribeWishlistItems calls onSnapshot and cb', () => {
    const fakeSnap = {
      docs: [{ id: 'i1', data: () => ({ name: 'pen', claimed: false }) }],
    };
    (onSnapshot as vi.Mock).mockImplementation((_q, cb) => {
      cb(fakeSnap);
      return () => {};
    });

    const cb = vi.fn();
    const unsub = subscribeWishlistItems('w1', cb);
    expect(cb).toHaveBeenCalledWith([{ id: 'i1', name: 'pen', claimed: false }]);
    expect(typeof unsub).toBe('function');
  });

  it('uploadWishlistBanner uploads file, updates doc, returns url', async () => {
    const fakeFile = new File(['abc'], 'pic.png', { type: 'image/png' });
    (getDownloadURL as vi.Mock).mockResolvedValue('http://url/pic.png');
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
});