import { signInWithPopup, signOut, auth, provider } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import { Button, Box, Typography } from "@mui/material";

const LoginControls = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Box sx={{
      py: 2,
      px: 2,
      gap: 3,
      borderTop: '1px solid #333',
      backgroundColor: '#1e1e1e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {user ? (
        <>
          <Typography variant="body1" sx={{ color: "#aaa" }}>
            👋&nbsp; {user.displayName} {isAdmin ? '(Admin)' : ''}
          </Typography>
          <Button variant="outlined" color="secondary" onClick={() => signOut(auth)}>
            Sign Out
          </Button>
        </>
      ) : (
        <Button variant="outlined" onClick={() => signInWithPopup(auth, provider)}>
          Sign In
        </Button>
      )}
    </Box>
  );
};

export default LoginControls;