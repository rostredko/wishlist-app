import {useCallback, useState} from 'react';
import {Button, Box, Typography, Stack, Accordion, AccordionSummary, AccordionDetails} from '@mui/material';
import {signInWithPopup, signOut} from 'firebase/auth';
import {useTranslation} from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {useAuth} from '@hooks/useAuth';
import {auth, googleProvider} from '@lib/firebase';

export default function Footer() {
  const {t} = useTranslation(['auth', 'home']);
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
    () => run(() => signInWithPopup(auth, googleProvider), t('auth:signinFailed')),
    [run, t],
  );

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
      <Box sx={{width: '100%', maxWidth: 'md'}}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{fontWeight: 700, fontSize: 24}}>
            {t('home:faqTitle')}
          </Typography>
          <Stack>
            {(t('home:faq', { returnObjects: true }) as Array<{ q: string; a: string }>).map((item, idx) => (
              <Accordion key={idx} disableGutters square>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{fontWeight: 600}}>{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Stack>
      </Box>

      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3}}>
        {user ? (
          <>
            <Typography variant="body1" sx={{color: '#aaa'}}>
              👋&nbsp; {user.displayName} {isAdmin ? t('auth:admin') : ''}
            </Typography>
            <Button variant="outlined" color="secondary" onClick={handleSignOut} disabled={loading}>
              {loading ? t('auth:pleaseWait') : t('auth:signOut')}
            </Button>
          </>
        ) : (
          <Button variant="outlined" onClick={handleSignIn} disabled={loading}>
            {loading ? t('auth:pleaseWait') : t('auth:signIn')}
          </Button>
        )}
      </Box>
    </Box>
  );
}