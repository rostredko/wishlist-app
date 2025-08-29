import type {Timestamp} from 'firebase/firestore';

export type WishList = {
  id: string;
  title: string;
  ownerUid: string;
  bannerImage?: string | null;
  isHidden?: boolean;
  createdAt?: Timestamp;
};