import { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { signInWithPopup, signOut } from 'firebase/auth';

import { useAuth } from '@hooks/useAuth';
import { auth, googleProvider } from '@lib/firebase';

const LoginControls = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error('Sign-in failed', e);
      alert('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await signOut(auth);
    } catch (e) {
      console.error('Sign-out failed', e);
      alert('Sign-out failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <Typography variant="body1" sx={{ color: '#aaa' }}>
            👋&nbsp; {user.displayName} {isAdmin ? '(Admin)' : ''}
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleSignOut} disabled={loading}>
            {loading ? 'Please wait…' : 'Sign Out'}
          </Button>
        </>
      ) : (
        <Button variant="outlined" onClick={handleSignIn} disabled={loading}>
          {loading ? 'Please wait…' : 'Sign In'}
        </Button>
      )}
    </Box>
  );
};

export default LoginControls;