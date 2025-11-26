import {useCallback, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Button, Box, Typography, Card, CardContent, Stack, Accordion, AccordionSummary, AccordionDetails} from '@mui/material';
import {signInWithPopup, signInWithRedirect, signOut} from 'firebase/auth';
import {useTranslation} from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {useAuth} from '@hooks/useAuth';
import {auth, googleProvider} from '@lib/firebase';
import {shouldUseRedirect} from '@utils/auth';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const {t} = useTranslation(['auth', 'home']);
  const {user, isAdmin} = useAuth();
  const [loading, setLoading] = useState(false);

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
    
    try {
      setLoading(true);
      
      // Save current URL to return after redirect
      if (shouldUseRedirect() || typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('auth_return_url', location.pathname + location.search);
        } catch {
          // sessionStorage not available, continue anyway
        }
      }
      
      if (shouldUseRedirect()) {
        // Use redirect for mobile and embedded browsers
        await signInWithRedirect(auth, googleProvider);
        // Navigation will happen automatically after redirect
        return; // Don't set loading to false, page will redirect
      } else {
        // Use popup for desktop browsers
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (popupError: any) {
          // If popup fails (blocked or sessionStorage issue), fallback to redirect
          if (
            popupError.code === 'auth/popup-blocked' ||
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.message?.includes('sessionStorage') ||
            popupError.message?.includes('initial state') ||
            popupError.message?.includes('missing initial state')
          ) {
            await signInWithRedirect(auth, googleProvider);
            return; // Don't set loading to false, page will redirect
          } else {
            throw popupError;
          }
        }
      }
    } catch (e: any) {
      console.error('Sign-in error:', e);
      // Don't show alert for redirect (user will be redirected)
      if (!e.code || e.code !== 'auth/redirect-cancelled-by-user') {
        alert(t('auth:signinFailed'));
      }
    } finally {
      setLoading(false);
    }
  }, [loading, t, location.pathname, location.search]);

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
      <Card variant="outlined" sx={{bgcolor: 'background.paper', width: '100%', maxWidth: 'md'}}>
        <CardContent>
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
        </CardContent>
      </Card>

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