import { db } from '../firebase/firebase';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

import type { WishList } from '../types/WishList';
import type { WishListItem } from '../types/WishListItem';

export const getWishlistById = async (wishlistId: string): Promise<WishList | null> => {
  const wishlistDocRef = doc(db, 'wishlists', wishlistId);
  const snapshot = await getDoc(wishlistDocRef);

  if (!snapshot.exists()) return null;

  const raw = snapshot.data();

  return {
    id: snapshot.id,
    title: raw.title || '',
    ownerUid: raw.ownerUid || '',
    bannerImage: raw.bannerImage || '',
    isHidden: raw.isHidden || false,
    createdAt: raw.createdAt,
  };
};

export const addGiftItem = async (
  wishlistId: string,
  item: { name: string; description?: string; link?: string }
): Promise<void> => {
  await addDoc(collection(db, 'wishlists', wishlistId, 'items'), {
    name: item.name,
    description: item.description || '',
    link: item.link || '',
    claimed: false,
    createdAt: Timestamp.now(),
  });
};

export const deleteGiftItem = async (wishlistId: string, itemId: string): Promise<void> => {
  await deleteDoc(doc(db, 'wishlists', wishlistId, 'items', itemId));
};

export const updateWishlistTitle = async (wishlistId: string, newTitle: string): Promise<void> => {
  await updateDoc(doc(db, 'wishlists', wishlistId), { title: newTitle });
};

export const toggleGiftClaimStatus = async (
  wishlistId: string,
  itemId: string,
  currentStatus: boolean
): Promise<void> => {
  await updateDoc(doc(db, 'wishlists', wishlistId, 'items', itemId), {
    claimed: !currentStatus,
  });
};