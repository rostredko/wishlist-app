import { useEffect, useMemo, useState } from 'react';
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
  Chip,
  Skeleton,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { useAuth } from '../hooks/useAuth';
import { CreateWishListDialog } from './CreateWishListDialog';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { WishList } from '../types/WishList';

type WLItem = WishList & { id: string };

export default function HomePage() {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [myLists, setMyLists] = useState<WLItem[] | null>(null); // null = loading
  const navigate = useNavigate();

  const handleOpenCreate = () => {
    if (!user) return;
    setCreateOpen(true);
  };
  const handleCloseCreate = () => setCreateOpen(false);

  useEffect(() => {
    if (!user) {
      setMyLists(null);
      return;
    }
    const q = query(
      collection(db, 'wishlists'),
      where('ownerUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data: WLItem[] = snap.docs.map((d) => ({
        ...(d.data() as WishList),
        id: d.id, // кладём id в конец
      }));
      setMyLists(data);
    });
    return () => unsub();
  }, [user]);

  const isLoading = useMemo(() => user && myLists === null, [user, myLists]);

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
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
                  A clean, distraction-free wishlist that keeps the core features simple. Just all
                  you need on Birthday, New Year, or even Hanukkah 😄
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
                    <Typography>
                      Share a private URL with friends. Just from your browser. From any device.
                    </Typography>
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

          <Tooltip title={user ? '' : 'Sign in with Google to create a wishlist'} placement="top">
            <span>
              <Button size="large" variant="contained" onClick={handleOpenCreate} disabled={!user}>
                Create wishlist
              </Button>
            </span>
          </Tooltip>

          {user && (
            <Stack sx={{ width: '100%', mt: 4 }} spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                📚 Your wishlists
              </Typography>

              {isLoading && (
                <Grid container spacing={2}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Grid key={i} xs={12} md={6} lg={4}>
                      <Skeleton variant="rounded" height={96} />
                    </Grid>
                  ))}
                </Grid>
              )}

              {!isLoading && myLists && myLists.length === 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography>No wishlists yet.</Typography>
                      <Button variant="outlined" onClick={handleOpenCreate}>
                        Create one
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {!isLoading && myLists && myLists.length > 0 && (
                <Grid container spacing={2}>
                  {myLists.map((wl) => (
                    <Grid key={wl.id} xs={12} md={6} lg={4}>
                      <Card
                        variant="outlined"
                        onClick={() => navigate(`/wishlist/${wl.id}`)}
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'stretch',
                          transition: 'transform 120ms ease, box-shadow 120ms ease',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
                        }}
                      >
                        <CardContent sx={{ width: '100%' }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                pr: 1,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                              }}
                              title={wl.title || 'Untitled wishlist'}
                            >
                              {wl.title || 'Untitled wishlist'}
                            </Typography>
                            {wl.isHidden && <Chip size="small" label="Hidden" />}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Stack>
          )}

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