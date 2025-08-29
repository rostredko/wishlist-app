import type { Timestamp } from 'firebase/firestore';

export type WishListItem = {
  id: string;
  name: string;
  link?: string | null;
  description?: string | null;
  claimed: boolean;
  createdAt?: Timestamp;
};