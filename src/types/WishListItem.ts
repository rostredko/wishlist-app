import type { Currency } from '../utils/money';
import type {Timestamp} from 'firebase/firestore';

export type WishListItem = {
  id: string;
  name: string;
  link?: string | null;
  description?: string | null;
  priceMinor?: number | null;
  currency?: Currency | null;
  claimed: boolean;
  createdAt?: Timestamp;
};

export type GiftValues = {
  name: string;
  description?: string;
  link?: string;
  priceMinor?: number | null;
  currency?: Currency | null;
};
