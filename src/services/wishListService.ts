import { db } from '@lib/db-client';
import { storage } from '@lib/storage-client';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  runTransaction,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { DEMO_WISHLISTS } from '@constants/exampleWishlists';
import type { WishList } from '@models/WishList';
import { isValidMoney } from '@utils/money';
import type { GiftValues, WishListItem } from '@models/WishListItem';

type FirestoreWishListData = {
  title?: string;
  ownerUid?: string;
  creationMethod?: WishList['creationMethod'];
  bannerImage?: string;
  isHidden?: boolean;
  createdAt?: Timestamp;
};

type FirestoreWishListItemData = Pick<WishListItem, 'priceMinor' | 'currency'> & {
  name: string;
  description?: string;
  link?: string;
  claimed: boolean;
  createdAt?: Timestamp;
};

export async function createWishlist(title: string, ownerUid: string): Promise<string> {
  const docRef = await addDoc(collection(db, 'wishlists'), {
    title,
    ownerUid,
    creationMethod: 'manual',
    bannerImage: '',
    isHidden: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getWishlistById(wishlistId: string): Promise<WishList | null> {
  const snap = await getDoc(doc(db, 'wishlists', wishlistId));

  if (!snap.exists()) {
    if (DEMO_WISHLISTS[wishlistId]) {
      return {
        id: wishlistId,
        title: DEMO_WISHLISTS[wishlistId].title!,
        ownerUid: 'demo',
        bannerImage: DEMO_WISHLISTS[wishlistId].bannerImage!,
        isHidden: false,
        createdAt: Timestamp.now(),
      };
    }
    return null;
  }

  const data = snap.data() as FirestoreWishListData;
  return {
    id: snap.id,
    title: data.title ?? '',
    ownerUid: data.ownerUid ?? '',
    creationMethod: data.creationMethod,
    bannerImage: data.bannerImage ?? '',
    isHidden: !!data.isHidden,
    createdAt: data.createdAt,
  };
}

export async function updateWishlistTitle(wishlistId: string, newTitle: string): Promise<void> {
  await updateDoc(doc(db, 'wishlists', wishlistId), { title: newTitle.trim() });
}

export function subscribeMyWishlists(
  ownerUid: string,
  cb: (lists: WishList[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, 'wishlists'),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const lists = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as FirestoreWishListData;
      return {
        id: docSnap.id,
        title: data.title ?? '',
        ownerUid: data.ownerUid ?? '',
        creationMethod: data.creationMethod,
        bannerImage: data.bannerImage ?? '',
        isHidden: !!data.isHidden,
        createdAt: data.createdAt,
      } as WishList;
    });
    cb(lists);
  }, onError);
}

export async function addGiftItem(
  wishlistId: string,
  item: GiftValues
): Promise<void> {
  await addDoc(collection(db, 'wishlists', wishlistId, 'items'), {
    ...normalizeMoney(item),
    name: item.name.trim(),
    description: item.description?.trim() || '',
    link: item.link?.trim() || '',
    claimed: false,
    createdAt: serverTimestamp(),
  });
}

export async function deleteGiftItem(wishlistId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'wishlists', wishlistId, 'items', itemId));
}

export async function deleteWishlistDeep(wishlistId: string): Promise<void> {
  const wlRef = doc(db, 'wishlists', wishlistId);
  const snap = await getDoc(wlRef);
  const bannerUrl = snap.exists() ? (snap.data() as FirestoreWishListData).bannerImage : undefined;

  const itemsCol = collection(db, 'wishlists', wishlistId, 'items');
  const itemsSnap = await getDocs(itemsCol);
  if (!itemsSnap.empty) {
    await Promise.all(itemsSnap.docs.map((d) => deleteDoc(d.ref)));
  }

  if (bannerUrl && bannerUrl.includes('firebasestorage.googleapis.com')) {
    try {
      await deleteObject(ref(storage, bannerUrl));
    } catch {
      // Legacy flat banners are read-only; inaccessible or missing objects are retained.
    }
  }
  await deleteDoc(wlRef);
}

export async function toggleGiftClaimStatus(
  wishlistId: string,
  itemId: string,
  currentStatus: boolean
): Promise<void> {
  const itemRef = doc(db, 'wishlists', wishlistId, 'items', itemId);
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(itemRef);
    if (!snapshot.exists() || snapshot.data().claimed !== currentStatus) throw new Error('Reservation changed');
    transaction.update(itemRef, { claimed: !currentStatus });
  });
}

export function subscribeWishlistItems(
  wishlistId: string,
  cb: (items: WishListItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'wishlists', wishlistId, 'items');
  const itemsQuery = query(colRef, orderBy('createdAt', 'asc'));
  return onSnapshot(itemsQuery, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as FirestoreWishListItemData;
      return { id: docSnap.id, ...data };
    });
    cb(items);
  }, onError);
}

export async function uploadWishlistBanner(wishlistId: string, file: File): Promise<string> {
  const fileName = `${Date.now()}-${crypto.randomUUID()}`;
  const storageRef = ref(storage, `banners/${wishlistId}/${fileName}`);
  await uploadBytes(storageRef, file, {
    contentType: file.type,
    cacheControl: 'public,max-age=31536000,immutable',
  });
  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db, 'wishlists', wishlistId), { bannerImage: url });
  return url;
}

export async function updateGiftItem(
  wishlistId: string,
  itemId: string,
  patch: Partial<GiftValues>
): Promise<void> {
  const normalized = {
    ...normalizeMoney(patch),
    ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
    ...(patch.description !== undefined ? { description: patch.description?.trim() ?? '' } : {}),
    ...(patch.link !== undefined ? { link: patch.link?.trim() ?? '' } : {}),
  };
  await updateDoc(doc(db, 'wishlists', wishlistId, 'items', itemId), normalized);
}

function normalizeMoney(values: Pick<WishListItem, 'priceMinor' | 'currency'>) {
  if (values.priceMinor === undefined && values.currency === undefined) return {};
  if (values.priceMinor === null && values.currency === null) return { priceMinor: null, currency: null };
  if (!isValidMoney(values.priceMinor, values.currency)) throw new Error('Invalid gift price');
  return { priceMinor: values.priceMinor, currency: values.currency };
}

export async function copyWishlist(
  title: string,
  ownerUid: string,
  items: WishListItem[],
  creationMethod: 'demo_copy' | 'shared_copy' = 'demo_copy'
): Promise<string> {
  if (items.length > 499) throw new Error('Wishlist exceeds atomic copy limit');
  const resolved = items.map(item => ({
    name: item.name.trim(), description: item.description?.trim() || '', link: item.link?.trim() || '',
    ...normalizeMoney(item), claimed: false, createdAt: serverTimestamp(),
  }));
  const listRef = doc(collection(db, 'wishlists'));
  const batch = writeBatch(db);
  batch.set(listRef, { title: title.trim(), ownerUid, creationMethod, bannerImage: '', isHidden: false, createdAt: serverTimestamp() });
  for (const item of resolved) batch.set(doc(collection(db, 'wishlists', listRef.id, 'items')), item);
  await batch.commit();
  return listRef.id;
}
