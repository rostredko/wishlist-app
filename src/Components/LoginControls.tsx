import {useCallback, useState} from 'react';
import {Button, Box, Typography} from '@mui/material';
import {signInWithPopup, signOut} from 'firebase/auth';
import {useTranslation} from 'react-i18next';

import {useAuth} from '@hooks/useAuth';
import {auth, googleProvider} from '@lib/firebase';

export default function LoginControls() {
  const {t} = useTranslation('auth');
  const {user, isAdmin} = useAuth();
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

  const handleSignIn = useCallback(
    () => run(() => signInWithPopup(auth, googleProvider), t('signinFailed')),
    [run, t],
  );

  const handleSignOut = useCallback(
    () => run(() => signOut(auth), t('signoutFailed')),
    [run, t],
  );

  return (
    <Box
      sx={{
        py: 2,
        px: 2,
        gap: 3,
        borderTop: '1px solid #333',
        backgroundColor: '#1e1e1e',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {user ? (
        <>
          <Typography variant="body1" sx={{color: '#aaa'}}>
            👋&nbsp; {user.displayName} {isAdmin ? t('admin') : ''}
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleSignOut} disabled={loading}>
            {loading ? t('pleaseWait') : t('signOut')}
          </Button>
        </>
      ) : (
        <Button variant="outlined" onClick={handleSignIn} disabled={loading}>
          {loading ? t('pleaseWait') : t('signIn')}
        </Button>
      )}
    </Box>
  );
}