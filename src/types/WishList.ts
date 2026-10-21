import type {Timestamp} from 'firebase/firestore';

export type WishList = {
  id: string;
  title: string;
  ownerUid: string;
  creationMethod?: 'manual' | 'demo_copy' | 'shared_copy';
  bannerImage?: string | null;
  isHidden?: boolean;
  createdAt?: Timestamp;
};