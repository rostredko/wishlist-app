import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Tooltip,
  Divider,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { CreateWishListDialog } from './CreateWishlistDialog.tsx';

export default function HomePage() {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);

  const handleOpenCreate = () => {
    if (!user) return;
    setCreateOpen(true);
  };

  const handleCloseCreate = () => setCreateOpen(false);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3} alignItems="flex-start">
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            🎁 WishList App
          </Typography>

          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Minimal wishlist app with only what matters.
          </Typography>

          <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ✨ What is it?
                </Typography>
                <Typography>
                  A clean, distraction-free wishlist that keeps the core features simple. Just all you need on Birthday, New Year, or even Hanukkah 😄
                </Typography>

                <Divider />

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  🧭 How it works
                </Typography>
                <Stack component="ul" sx={{ pl: 3, m: 0 }} spacing={1}>
                  <li>
                    <Typography>Create a wishlist in seconds. Button below.</Typography>
                  </li>
                  <li>
                    <Typography>Share a private URL with friends. Just from your browser. From any devise.</Typography>
                  </li>
                  <li>
                    <Typography>
                      Friends anonymously <b>claim</b> gifts — everyone can see what’s already taken.
                    </Typography>
                  </li>
                  <li>
                    <Typography>Sign in with Google to manage your lists.</Typography>
                  </li>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Tooltip
            title={user ? '' : 'Sign in with Google to create a wishlist'}
            placement="top"
          >
            <span>
              <Button
                size="large"
                variant="contained"
                onClick={handleOpenCreate}
                disabled={!user}
              >
                Create wishlist
              </Button>
            </span>
          </Tooltip>

          <CreateWishListDialog
            open={createOpen}
            onClose={handleCloseCreate}
            user={user ? { uid: user.uid } : null}
          />
        </Stack>
      </Container>
    </Box>
  );
}