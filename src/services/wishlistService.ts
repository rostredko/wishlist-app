import {db, storage} from '@lib/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';

import type {WishList} from '@models/WishList';
import type {WishListItem} from '@models/WishListItem';

export async function createWishlist(title: string, ownerUid: string): Promise<string> {
  const ref = await addDoc(collection(db, 'wishlists'), {
    title,
    ownerUid,
    bannerImage: '',
    isHidden: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getWishlistById(wishlistId: string): Promise<WishList | null> {
  const wishlistDocRef = doc(db, 'wishlists', wishlistId);
  const snapshot = await getDoc(wishlistDocRef);
  if (!snapshot.exists()) return null;

  const raw = snapshot.data() as any;

  return {
    id: snapshot.id,
    title: raw.title || '',
    ownerUid: raw.ownerUid || '',
    bannerImage: raw.bannerImage || '',
    isHidden: Boolean(raw.isHidden),
    createdAt: raw.createdAt as Timestamp | undefined,
  };
}

export async function updateWishlistTitle(wishlistId: string, newTitle: string): Promise<void> {
  await updateDoc(doc(db, 'wishlists', wishlistId), {title: newTitle.trim()});
}

export function subscribeMyWishlists(
  ownerUid: string,
  cb: (lists: (WishList & { id: string })[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'wishlists'),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snap) => {
    const lists = snap.docs.map((d) => {
      const raw = d.data() as any;
      return {
        id: d.id,
        title: raw.title || '',
        ownerUid: raw.ownerUid || '',
        bannerImage: raw.bannerImage || '',
        isHidden: Boolean(raw.isHidden),
        createdAt: raw.createdAt as Timestamp | undefined,
      } as WishList & { id: string };
    });
    cb(lists);
  });
}

export async function addGiftItem(
  wishlistId: string,
  item: { name: string; description?: string; link?: string }
): Promise<void> {
  await addDoc(collection(db, 'wishlists', wishlistId, 'items'), {
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

export async function toggleGiftClaimStatus(
  wishlistId: string,
  itemId: string,
  currentStatus: boolean
): Promise<void> {
  await updateDoc(doc(db, 'wishlists', wishlistId, 'items', itemId), {
    claimed: !currentStatus,
  });
}

export function subscribeWishlistItems(
  wishlistId: string,
  cb: (items: WishListItem[]) => void
): Unsubscribe {
  const col = collection(db, 'wishlists', wishlistId, 'items');
  return onSnapshot(col, (snapshot) => {
    const result: WishListItem[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<WishListItem, 'id'>),
    }));
    cb(result);
  });
}

export async function uploadWishlistBanner(wishlistId: string, file: File): Promise<string> {
  const fileName = `${wishlistId}-${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `banners/${fileName}`);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
    cacheControl: 'public,max-age=31536000,immutable',
  });

  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db, 'wishlists', wishlistId), {bannerImage: url});
  return url;
}

export async function updateGiftItem(
  wishlistId: string,
  itemId: string,
  patch: { name?: string; description?: string; link?: string }
): Promise<void> {
  const normalized = {
    ...(patch.name !== undefined ? {name: patch.name.trim()} : {}),
    ...(patch.description !== undefined ? {description: patch.description.trim()} : {}),
    ...(patch.link !== undefined ? {link: patch.link.trim()} : {}),
  };
  await updateDoc(doc(db, 'wishlists', wishlistId, 'items', itemId), normalized);
}