import { useCallback, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@hooks/useAuth';
import { useGoogleSignIn } from '@hooks/useGoogleSignIn';
import { auth } from '@lib/auth-client';

/** Auth UI for tests; production uses Footer and HomePage with useGoogleSignIn. */
export default function LoginControls() {
  const { t } = useTranslation('auth');
  const { user, isAdmin } = useAuth();
  const { signIn, loading: signInLoading, isTelegram } = useGoogleSignIn();
  const [loading, setLoading] = useState(false);

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

  if (isTelegram) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {user ? (
        <>
          <Typography variant="body1" sx={{ color: '#aaa' }}>
            {user.displayName} {isAdmin ? t('admin') : ''}
          </Typography>
          <Button variant="outlined" onClick={handleSignOut} disabled={loading || signInLoading}>
            {loading ? t('pleaseWait') : t('signOut')}
          </Button>
        </>
      ) : (
        <Button variant="outlined" onClick={() => void signIn()} disabled={signInLoading}>
          {signInLoading ? t('pleaseWait') : t('signIn')}
        </Button>
      )}
    </Box>
  );
}
