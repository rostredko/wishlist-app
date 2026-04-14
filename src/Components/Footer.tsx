import { useCallback, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Button, Box, Typography, Stack } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@hooks/useAuth';
import { useGoogleSignIn } from '@hooks/useGoogleSignIn';
import { auth } from '@lib/auth-client';

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/ua' || location.pathname === '/en' || location.pathname === '/';
  const routeLang = location.pathname.startsWith('/ua') ? 'ua' : location.pathname.startsWith('/en') ? 'en' : undefined;
  const { t } = useTranslation('auth', { lng: routeLang ?? 'ua' });
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const { signIn: handleSignIn, loading: signInLoading, isTelegram } = useGoogleSignIn();

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

  const handleSignOut = useCallback(
    () => run(() => signOut(auth), t('signoutFailed')),
    [run, t],
  );

  const privacyLang = routeLang ?? 'ua';

  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        gap: 3,
        mt: isHomePage ? 0 : 6,
        borderTop: '1px solid #333',
        backgroundColor: '#1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
        {user ? (
          <>
            <Typography variant="body1" sx={{ color: '#aaa' }}>
              👋&nbsp; {user.displayName} {isAdmin ? t('admin') : ''}
            </Typography>
            <Button variant="outlined" color="secondary" onClick={handleSignOut} disabled={loading || signInLoading}>
              {loading ? t('pleaseWait') : t('signOut')}
            </Button>
          </>
        ) : isTelegram ? (
          <Stack spacing={2} alignItems="center" sx={{ maxWidth: 420 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'center' }}>
              {t('telegramInstructionTitle')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', textAlign: 'center' }}>
              {t('telegramInstruction')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                const currentUrl = window.location.href;
                try {
                  window.open(currentUrl, '_system');
                } catch {
                  alert(`${t('telegramInstructionCta')}: ${currentUrl}`);
                }
              }}
              sx={{ mt: 1 }}
            >
              {t('telegramInstructionCta')}
            </Button>
          </Stack>
        ) : (
          <Button variant="outlined" onClick={handleSignIn} disabled={signInLoading}>
            {signInLoading ? t('pleaseWait') : t('signIn')}
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Typography
          component={RouterLink}
          to={`/${privacyLang}/privacy`}
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            transition: 'color 150ms',
            '&:hover': { color: 'text.primary' },
          }}
        >
          {t('privacyPolicy')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.disabled', userSelect: 'none' }}>
          ·
        </Typography>
        <Typography
          component="a"
          href="mailto:rost.redko@gmail.com"
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            transition: 'color 150ms',
            '&:hover': { color: 'text.primary' },
          }}
        >
          {t('contactUs')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.disabled', userSelect: 'none' }}>
          ·
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('copyright')}
        </Typography>
      </Box>
    </Box>
  );
}
