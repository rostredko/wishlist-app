import { useEffect, useState } from 'react';

import { getWishlistById, subscribeWishlistItems } from '@api/wishListService';
import type { WishList } from '@models/WishList';
import type { WishListItem } from '@models/WishListItem';

export type PageStatus = 'loading' | 'found' | 'not_found';

export function useWishlistData(wishlistId: string | undefined) {
  const [items, setItems] = useState<WishListItem[]>([]);
  const [wishlist, setWishlist] = useState<WishList | null>(null);
  const [status, setStatus] = useState<PageStatus>('loading');

  useEffect(() => {
    if (!wishlistId) return;
    const unsub = subscribeWishlistItems(wishlistId, (list) => setItems(list));
    return unsub;
  }, [wishlistId]);

  useEffect(() => {
    const fetchWishlistData = async () => {
      if (!wishlistId) return;
      setStatus('loading');
      const result = await getWishlistById(wishlistId);
      if (result) {
        setWishlist(result);
        setStatus('found');
      } else {
        setWishlist(null);
        setStatus('not_found');
      }
    };
    fetchWishlistData();
  }, [wishlistId]);

  return { items, setItems, wishlist, setWishlist, status, setStatus };
}
