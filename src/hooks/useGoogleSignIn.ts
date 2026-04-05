import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';

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
  const isTelegram = isTelegramWebView();

  const signIn = useCallback(async (): Promise<GoogleSignInResult> => {
    if (loading) return 'cancelled';
    if (isTelegram) return 'cancelled';

    const redirectSupported = canUseRedirectFlow();
    const preferRedirect = shouldUseRedirect();

    const triggerRedirect = async () => {
      if (!redirectSupported) {
        throw Object.assign(new Error('Redirect sign-in is not supported in this browser'), {
          code: 'auth/redirect-unsupported',
        });
      }
      await signInWithRedirect(auth, googleProvider);
    };

    try {
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
        return 'signed_in';
      } catch (popupError: unknown) {
        const e = popupError as { code?: string; message?: string };
        const shouldFallbackToRedirect =
          redirectSupported &&
          (e.code === 'auth/popup-blocked' ||
            e.code === 'auth/popup-closed-by-user' ||
            e.code === 'auth/operation-not-supported-in-this-environment' ||
            e.message?.includes('sessionStorage') ||
            e.message?.includes('initial state') ||
            e.message?.includes('missing initial state'));

        if (shouldFallbackToRedirect) {
          await triggerRedirect();
          return 'redirecting';
        }

        throw popupError;
      }
    } catch (e: unknown) {
      const err = e as { code?: string };
      console.error('Sign-in error:', e);
      if (!err.code || !String(err.code).startsWith('auth/redirect')) {
        alert(t('signinFailed'));
      }
      return 'cancelled';
    } finally {
      setLoading(false);
    }
  }, [loading, t, location.pathname, location.search, isTelegram]);

  return { signIn, loading, isTelegram };
}
