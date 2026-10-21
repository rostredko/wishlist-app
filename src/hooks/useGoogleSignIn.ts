import { useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FirebaseError } from 'firebase/app';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';

import { clearPendingWishlistCreateAfterAuth, completePendingWishlistAuth, getPendingWishlistAuthAttempt, markPendingWishlistRedirect } from '@utils/pendingWishlistCreate';

import { auth, googleProvider } from '@lib/auth-client';
import { canUseRedirectFlow, isTelegramWebView, shouldUseRedirect } from '@utils/auth';

/** Popup finished and user is signed in. */
export type GoogleSignInResult = 'signed_in' | 'redirecting' | 'cancelled';

/**
 * Google sign-in flow (popup with redirect fallback) shared by Footer and home header CTA.
 */
export function useGoogleSignIn() {
  const location = useLocation();
  const { t } = useTranslation('auth');
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);
  const isTelegram = isTelegramWebView();

  const signIn = useCallback(async (): Promise<GoogleSignInResult> => {
    if (inFlight.current) return 'cancelled';
    if (isTelegram) return 'cancelled';

    const attemptId = getPendingWishlistAuthAttempt();
    const redirectSupported = canUseRedirectFlow();
    const preferRedirect = shouldUseRedirect();

    const triggerRedirect = async () => {
      if (!redirectSupported) {
        throw Object.assign(new Error('Redirect sign-in is not supported in this browser'), {
          code: 'auth/redirect-unsupported',
        });
      }
      if (attemptId) markPendingWishlistRedirect(attemptId);
      await signInWithRedirect(auth, googleProvider);
    };

    try {
      inFlight.current = true;
      setLoading(true);

      if (redirectSupported) {
        try {
          sessionStorage.setItem('auth_return_url', location.pathname + location.search);
        } catch {
          // sessionStorage not available, continue anyway
        }
      }

      if (preferRedirect && redirectSupported) {
        await triggerRedirect();
        return 'redirecting';
      }

      try {
        await signInWithPopup(auth, googleProvider);
        if (attemptId) completePendingWishlistAuth(attemptId);
        try { sessionStorage.removeItem('auth_return_url'); } catch { /* Restricted storage. */ }
        return 'signed_in';
      } catch (popupError: unknown) {
        const code = popupError instanceof FirebaseError ? popupError.code : undefined;
        const message =
          popupError instanceof FirebaseError
            ? popupError.message
            : popupError instanceof Error
              ? popupError.message
              : '';
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          if (attemptId) clearPendingWishlistCreateAfterAuth(attemptId);
          return 'cancelled';
        }
        const shouldFallbackToRedirect =
          redirectSupported &&
          (code === 'auth/popup-blocked' ||
            code === 'auth/operation-not-supported-in-this-environment' ||
            message.includes('sessionStorage') ||
            message.includes('initial state') ||
            message.includes('missing initial state'));

        if (shouldFallbackToRedirect) {
          await triggerRedirect();
          return 'redirecting';
        }

        throw popupError;
      }
    } catch (e: unknown) {
      if (attemptId) clearPendingWishlistCreateAfterAuth(attemptId);
      console.error('Sign-in error:', e);
      const code = e instanceof FirebaseError ? e.code : undefined;
      if (!code || !String(code).startsWith('auth/redirect')) {
        alert(t('signinFailed'));
      }
      return 'cancelled';
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [t, location.pathname, location.search, isTelegram]);

  return { signIn, loading, isTelegram };
}
