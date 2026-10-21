import { useCallback, useEffect, useState } from 'react';

import { getWishlistById, subscribeWishlistItems } from '@api/wishListService';
import type { WishList } from '@models/WishList';
import type { WishListItem } from '@models/WishListItem';

export type PageStatus = 'loading' | 'found' | 'not_found' | 'error';

export function useWishlistData(wishlistId: string | undefined) {
  const [items, setItems] = useState<WishListItem[]>([]);
  const [wishlist, setWishlist] = useState<WishList | null>(null);
  const [status, setStatus] = useState<PageStatus>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [itemsError, setItemsError] = useState<Error | null>(null);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [loadedId, setLoadedId] = useState<string | undefined>(undefined);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);

  useEffect(() => {
    let active = true;
    setLoadedId(wishlistId);
    setItems([]);
    setWishlist(null);
    setError(null);
    setItemsError(null);
    setItemsLoaded(false);
    setStatus(wishlistId ? 'loading' : 'not_found');
    if (!wishlistId) return;
    let unsubscribe = () => {};
    try {
      unsubscribe = subscribeWishlistItems(wishlistId, list => {
        if (!active) return;
        setItems(list);
        setItemsLoaded(true);
        setItemsError(null);
      }, failure => {
        if (!active) return;
        setItemsError(failure);
        setItemsLoaded(false);
      });
    } catch (failure) {
      setItemsError(failure instanceof Error ? failure : new Error('Item subscription failed'));
    }
    void getWishlistById(wishlistId).then(result => {
      if (!active) return;
      setWishlist(result);
      setStatus(result ? 'found' : 'not_found');
    }).catch(failure => {
      if (!active) return;
      setError(failure instanceof Error ? failure : new Error('Wishlist load failed'));
      setStatus('error');
    });
    return () => { active = false; unsubscribe(); };
  }, [wishlistId, attempt]);

  const current = loadedId === wishlistId;
  return {
    items: current ? items : [], setItems, wishlist: current ? wishlist : null, setWishlist,
    status: current ? status : 'loading' as PageStatus, setStatus,
    error: current ? error : null, itemsError: current ? itemsError : null,
    itemsLoaded: current && itemsLoaded, retry,
  };
}
