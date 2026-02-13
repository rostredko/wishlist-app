import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Box, Typography, Card, CardContent, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAuth } from '@hooks/useAuth';
import { auth, googleProvider } from '@lib/auth-client';
import { canUseRedirectFlow, isTelegramWebView, shouldUseRedirect } from '@utils/auth';

export default function Footer() {
  const location = useLocation();
  const { t } = useTranslation(['auth', 'home']);
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const isTelegram = isTelegramWebView();

  // Note: getRedirectResult is handled in App.tsx (AuthRedirectHandler)
  // to avoid duplicate calls since Firebase clears the result after first call

  const run = useCallback(
    async (action: () => Promise<unknown>, failMsg: string) => {
      if (loading) return;
      try {
        setLoading(true);
        await action();
      } catch (e) {
        console.error(failMsg.replace(/\.? Please try again\.?$/i, ''), e);
        alert(failMsg);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  const handleSignIn = useCallback(async () => {
    if (loading) return;

    // Don't attempt sign-in in Telegram webview - show instruction instead
    if (isTelegram) {
      return;
    }

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
        return;
      }

      try {
        await signInWithPopup(auth, googleProvider);
      } catch (popupError: any) {
        const shouldFallbackToRedirect =
          redirectSupported &&
          (
            popupError.code === 'auth/popup-blocked' ||
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/operation-not-supported-in-this-environment' ||
            popupError.message?.includes('sessionStorage') ||
            popupError.message?.includes('initial state') ||
            popupError.message?.includes('missing initial state')
          );

        if (shouldFallbackToRedirect) {
          await triggerRedirect();
          return;
        }

        throw popupError;
      }
    } catch (e: any) {
      console.error('Sign-in error:', e);
      if (!e.code || !String(e.code).startsWith('auth/redirect')) {
        alert(t('auth:signinFailed'));
      }
    } finally {
      setLoading(false);
    }
  }, [loading, t, location.pathname, location.search, isTelegram]);

  const handleSignOut = useCallback(
    () => run(() => signOut(auth), t('auth:signoutFailed')),
    [run, t],
  );

  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        gap: 3,
        borderTop: '1px solid #333',
        backgroundColor: '#1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Card variant="outlined" sx={{ bgcolor: 'background.paper', width: '100%', maxWidth: 'md' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24 }}>
              {t('home:faqTitle')}
            </Typography>
            <Stack>
              {(t('home:faq', { returnObjects: true }) as Array<{ q: string; a: string }>).map((item, idx) => (
                <Accordion key={idx} disableGutters square>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 600 }}>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{item.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
        {user ? (
          <>
            <Typography variant="body1" sx={{ color: '#aaa' }}>
              👋&nbsp; {user.displayName} {isAdmin ? t('auth:admin') : ''}
            </Typography>
            <Button variant="outlined" color="secondary" onClick={handleSignOut} disabled={loading}>
              {loading ? t('auth:pleaseWait') : t('auth:signOut')}
            </Button>
          </>
        ) : isTelegram ? (
          <Stack spacing={2} alignItems="center" sx={{ maxWidth: 420 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'center' }}>
              {t('auth:telegramInstructionTitle')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', textAlign: 'center' }}>
              {t('auth:telegramInstruction')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                // Try to open in external browser (may not work in all Telegram versions)
                const currentUrl = window.location.href;
                try {
                  // Attempt to open in system browser
                  window.open(currentUrl, '_system');
                } catch {
                  // Fallback: just show the URL
                  alert(`${t('auth:telegramInstructionCta')}: ${currentUrl}`);
                }
              }}
              sx={{ mt: 1 }}
            >
              {t('auth:telegramInstructionCta')}
            </Button>
          </Stack>
        ) : (
          <Button variant="outlined" onClick={handleSignIn} disabled={loading}>
            {loading ? t('auth:pleaseWait') : t('auth:signIn')}
          </Button>
        )}
      </Box>
    </Box>
  );
}