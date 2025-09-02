import {db, storage} from '@lib/firebase';
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
  type Unsubscribe,
} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes, deleteObject} from 'firebase/storage';

import type {WishList} from '@models/WishList';
import type {WishListItem} from '@models/WishListItem';

type FirestoreWishListData = {
  title?: string;
  ownerUid?: string;
  bannerImage?: string;
  isHidden?: boolean;
  createdAt?: Timestamp;
};

type FirestoreWishListItemData = {
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
    bannerImage: '',
    isHidden: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getWishlistById(wishlistId: string): Promise<WishList | null> {
  const snap = await getDoc(doc(db, 'wishlists', wishlistId));
  if (!snap.exists()) return null;
  const data = snap.data() as FirestoreWishListData;
  return {
    id: snap.id,
    title: data.title ?? '',
    ownerUid: data.ownerUid ?? '',
    bannerImage: data.bannerImage ?? '',
    isHidden: !!data.isHidden,
    createdAt: data.createdAt,
  };
}

export async function updateWishlistTitle(wishlistId: string, newTitle: string): Promise<void> {
  await updateDoc(doc(db, 'wishlists', wishlistId), {title: newTitle.trim()});
}

export function subscribeMyWishlists(
  ownerUid: string,
  cb: (lists: WishList[]) => void
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
        bannerImage: data.bannerImage ?? '',
        isHidden: !!data.isHidden,
        createdAt: data.createdAt,
      } as WishList;
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

export async function deleteWishlistDeep(wishlistId: string): Promise<void> {
  const wlRef = doc(db, 'wishlists', wishlistId);
  const snap = await getDoc(wlRef);
  const bannerUrl = snap.exists() ? (snap.data() as FirestoreWishListData).bannerImage : undefined;

  const itemsCol = collection(db, 'wishlists', wishlistId, 'items');
  const itemsSnap = await getDocs(itemsCol);
  if (!itemsSnap.empty) {
    await Promise.all(itemsSnap.docs.map((d) => deleteDoc(d.ref)));
  }

  await deleteDoc(wlRef);

  if (bannerUrl) {
    try {
      await deleteObject(ref(storage, bannerUrl));
    } catch (err) {
      console.warn('Failed to delete banner from Storage:', err);
    }
  }
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
  const colRef = collection(db, 'wishlists', wishlistId, 'items');
  return onSnapshot(colRef, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as FirestoreWishListItemData;
      return {id: docSnap.id, ...data};
    });
    cb(items);
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
