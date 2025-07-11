import { Timestamp } from 'firebase/firestore'

export type WishList = {
  id: string;
  title: string;
  ownerUid: string;
  bannerImage?: string;
  isHidden: boolean;
  createdAt: Timestamp;
};