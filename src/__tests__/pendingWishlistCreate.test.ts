import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearPendingWishlistCreateAfterAuth, completePendingWishlistAuth, consumePendingWishlistCreateAfterAuth, discardPendingWishlistCreateOnNavigation, getPendingWishlistAuthAttempt, setPendingWishlistCreateAfterAuth } from '@utils/pendingWishlistCreate';

beforeEach(() => { clearPendingWishlistCreateAfterAuth(); sessionStorage.clear(); vi.useRealTimers(); });

describe('scoped wishlist creation intent', () => {
  it('requires successful authentication and consumes a matching intent only once', () => {
    setPendingWishlistCreateAfterAuth({ action: 'copy_demo', demoId: 'birthday-list-ua', language: 'ua', path: '/ua/wishlist/birthday-list-ua', source: 'demo' });
    expect(consumePendingWishlistCreateAfterAuth('/ua/wishlist/birthday-list-ua')).toBeNull();
    completePendingWishlistAuth();
    expect(consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
    expect(consumePendingWishlistCreateAfterAuth('/ua/wishlist/birthday-list-ua')).toMatchObject({ action: 'copy_demo', demoId: 'birthday-list-ua', language: 'ua' });
    expect(consumePendingWishlistCreateAfterAuth('/ua/wishlist/birthday-list-ua')).toBeNull();
  });

  it('does not resume cancelled or expired sign-in on a later visit', () => {
    setPendingWishlistCreateAfterAuth({ action: 'create', language: 'en', path: '/en', source: 'home' });
    clearPendingWishlistCreateAfterAuth();
    completePendingWishlistAuth();
    expect(consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
    vi.useFakeTimers();
    setPendingWishlistCreateAfterAuth({ action: 'create', language: 'en', path: '/en', source: 'home' });
    vi.advanceTimersByTime(31 * 60 * 1000);
    completePendingWishlistAuth();
    expect(consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
    vi.useRealTimers();
  });

  it('discards malformed and legacy unspecific intents', () => {
    sessionStorage.setItem('wl_pending_create_wishlist', String(Date.now()));
    expect(consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
    sessionStorage.setItem('wl_pending_create_wishlist', '{broken');
    expect(consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
  });

  it('abandons the action when navigating away before or after popup authentication', () => {
    setPendingWishlistCreateAfterAuth({ action: 'create', language: 'en', path: '/en', source: 'home' });
    discardPendingWishlistCreateOnNavigation('/en/blog');
    completePendingWishlistAuth();
    expect(consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
    setPendingWishlistCreateAfterAuth({ action: 'create', language: 'en', path: '/en', source: 'home' });
    completePendingWishlistAuth();
    discardPendingWishlistCreateOnNavigation('/en/blog');
    expect(consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
  });

  it('does not let an old authentication result complete or clear a newer action', () => {
    setPendingWishlistCreateAfterAuth({ action: 'create', language: 'en', path: '/en', source: 'home' });
    const oldAttempt = getPendingWishlistAuthAttempt()!;
    setPendingWishlistCreateAfterAuth({ action: 'create', language: 'ua', path: '/ua', source: 'home' });
    const newAttempt = getPendingWishlistAuthAttempt()!;
    completePendingWishlistAuth(oldAttempt);
    expect(consumePendingWishlistCreateAfterAuth('/ua')).toBeNull();
    clearPendingWishlistCreateAfterAuth(oldAttempt);
    completePendingWishlistAuth(newAttempt);
    expect(consumePendingWishlistCreateAfterAuth('/ua')).toMatchObject({ language: 'ua' });
  });

  it('only restores redirect intents across a new app load', async () => {
    setPendingWishlistCreateAfterAuth({ action: 'create', language: 'en', path: '/en', source: 'home' });
    completePendingWishlistAuth();
    vi.resetModules();
    const newLoad = await import('@utils/pendingWishlistCreate');
    expect(newLoad.consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
    newLoad.setPendingWishlistCreateAfterAuth({ action: 'create', language: 'en', path: '/en', source: 'home' });
    newLoad.markPendingWishlistRedirect();
    vi.resetModules();
    const redirectLoad = await import('@utils/pendingWishlistCreate');
    expect(redirectLoad.hasPendingWishlistRedirect()).toBe(true);
    redirectLoad.completePendingWishlistAuth();
    expect(redirectLoad.consumePendingWishlistCreateAfterAuth('/en')).toMatchObject({ action: 'create' });
  });
});
