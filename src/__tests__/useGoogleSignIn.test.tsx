import {act, renderHook} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {FirebaseError} from 'firebase/app';
import {useGoogleSignIn} from '@hooks/useGoogleSignIn';
import {
  clearPendingWishlistCreateAfterAuth,
  consumePendingWishlistCreateAfterAuth,
  hasPendingWishlistRedirect,
  setPendingWishlistCreateAfterAuth,
  WISHLIST_AUTH_COMPLETE,
} from '@utils/pendingWishlistCreate';
import '../i18n';

const mocks = vi.hoisted(() => ({popup: vi.fn(), redirect: vi.fn(), redirectSupported: vi.fn(), preferRedirect: vi.fn()}));
vi.mock('firebase/auth', () => ({signInWithPopup: mocks.popup, signInWithRedirect: mocks.redirect}));
vi.mock('@lib/auth-client', () => ({auth: {}, googleProvider: {}}));
vi.mock('@utils/auth', () => ({
  isTelegramWebView: () => false,
  canUseRedirectFlow: mocks.redirectSupported,
  shouldUseRedirect: mocks.preferRedirect,
}));
const intent = {action: 'create', language: 'en', path: '/en', source: 'home'} as const;

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  clearPendingWishlistCreateAfterAuth();
  window.history.replaceState({}, '', '/en?source=home');
  mocks.redirectSupported.mockReturnValue(true);
  mocks.preferRedirect.mockReturnValue(false);
  mocks.popup.mockResolvedValue({});
  mocks.redirect.mockResolvedValue(undefined);
});

describe('useGoogleSignIn', () => {
  it('marks the scoped wishlist intent authenticated after a successful popup', async () => {
    setPendingWishlistCreateAfterAuth(intent);
    const completed = vi.fn();
    window.addEventListener(WISHLIST_AUTH_COMPLETE, completed);
    const {result} = renderHook(() => useGoogleSignIn(), {wrapper: BrowserRouter});
    let outcome: string | undefined;
    await act(async () => {outcome = await result.current.signIn();});
    expect(outcome).toBe('signed_in');
    expect(completed).toHaveBeenCalledTimes(1);
    expect(consumePendingWishlistCreateAfterAuth('/ua')).toBeNull();
    expect(consumePendingWishlistCreateAfterAuth('/en')).toEqual(expect.objectContaining(intent));
    expect(mocks.redirect).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('auth_return_url')).toBeNull();
    window.removeEventListener(WISHLIST_AUTH_COMPLETE, completed);
  });

  it.each(['auth/popup-closed-by-user', 'auth/cancelled-popup-request'])('treats %s as cancellation without redirect or alert', async code => {
    setPendingWishlistCreateAfterAuth(intent);
    mocks.popup.mockRejectedValue(new FirebaseError(code, 'Cancelled'));
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const {result} = renderHook(() => useGoogleSignIn(), {wrapper: BrowserRouter});
    let outcome: string | undefined;
    await act(async () => {outcome = await result.current.signIn();});
    expect(outcome).toBe('cancelled');
    expect(result.current.loading).toBe(false);
    expect(mocks.redirect).not.toHaveBeenCalled();
    expect(alert).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('wl_pending_create_wishlist')).toBeNull();
    expect(consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
    alert.mockRestore();
  });

  it('falls back for blocked popups and preserves the scoped intent, language and return path', async () => {
    setPendingWishlistCreateAfterAuth(intent);
    mocks.popup.mockRejectedValue(new FirebaseError('auth/popup-blocked', 'Blocked'));
    const {result} = renderHook(() => useGoogleSignIn(), {wrapper: BrowserRouter});
    let outcome: string | undefined;
    await act(async () => {outcome = await result.current.signIn();});
    expect(outcome).toBe('redirecting');
    expect(mocks.redirect).toHaveBeenCalledTimes(1);
    expect(hasPendingWishlistRedirect()).toBe(true);
    expect(JSON.parse(sessionStorage.getItem('wl_pending_create_wishlist')!)).toEqual(expect.objectContaining({...intent, phase: 'redirect'}));
    expect(sessionStorage.getItem('auth_return_url')).toBe('/en?source=home');
    expect(consumePendingWishlistCreateAfterAuth('/en')).toBeNull();
  });

  it('starts only one popup for simultaneous invocations', async () => {
    let resolve!: () => void;
    mocks.popup.mockImplementation(() => new Promise<void>(done => {resolve = done;}));
    const {result} = renderHook(() => useGoogleSignIn(), {wrapper: BrowserRouter});
    let first!: Promise<string>;
    let second!: Promise<string>;
    act(() => {first = result.current.signIn(); second = result.current.signIn();});
    expect(mocks.popup).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(true);
    await act(async () => {resolve(); await Promise.all([first, second]);});
    expect(result.current.loading).toBe(false);
    expect(await first).toBe('signed_in');
    expect(await second).toBe('cancelled');
  });
});
