import {useEffect, useMemo, useState} from 'react';
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
  Skeleton,
  IconButton,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';

import {useAuth} from '@hooks/useAuth';
import {CreateWishListDialog} from '@components/CreateWishListDialog';
import ConfirmDialog from '@components/ConfirmDialog';
import {useNavigate} from 'react-router-dom';
import type {WishList} from '@models/WishList';

import {subscribeMyWishlists, deleteWishlistDeep} from '@api/wishListService';

type WLItem = WishList & { id: string };

export default function HomePage() {
  const {user} = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [myLists, setMyLists] = useState<WLItem[] | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; title?: string }>({
    open: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleOpenCreate = () => {
    if (!user) return;
    setCreateOpen(true);
  };
  const handleCloseCreate = () => setCreateOpen(false);

  useEffect(() => {
    if (!user?.uid) {
      setMyLists(null);
      return;
    }
    const unsub = subscribeMyWishlists(user.uid, (lists) => setMyLists(lists));
    return unsub;
  }, [user?.uid]);

  const isLoading = useMemo(() => !!user && myLists === null, [user, myLists]);

  return (
    <Box sx={{py: {xs: 6, md: 10}}}>
      <Container maxWidth="md">
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="h3" component="h1" sx={{fontWeight: 800, display: 'flex', gap: 1}}>
            🎁 WishList App
          </Typography>

          <Typography variant="h6" sx={{opacity: 0.9}}>
            Minimal wishlist app with only what matters.
          </Typography>

          <Card variant="outlined" sx={{bgcolor: 'background.paper'}}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{fontWeight: 700}}>
                  ✨ What is it?
                </Typography>
                <Typography>
                  A clean, distraction-free wishlist that keeps the core features simple. Just all
                  you need on Birthday, New Year, or even Hanukkah 😄
                </Typography>

                <Divider/>

                <Typography variant="subtitle1" sx={{fontWeight: 700}}>
                  🧭 How it works
                </Typography>
                <Stack component="ul" sx={{pl: 3, m: 0}} spacing={1}>
                  <li><Typography>Create a wishlist in seconds. Button below.</Typography></li>
                  <li><Typography>Share a private URL with friends. Just from your browser. From any
                    device.</Typography></li>
                  <li><Typography>Friends anonymously <b>claim</b> gifts — everyone can see what’s already
                    taken.</Typography></li>
                  <li><Typography>Sign in with Google to manage your lists.</Typography></li>
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
            <Stack sx={{width: '100%', mt: 4}} spacing={2}>
              <Typography variant="h6" sx={{fontWeight: 700}}>
                📚 Your wishlists
              </Typography>

              {isLoading && (
                <Grid container spacing={2}>
                  {Array.from({length: 6}).map((_, i) => (
                    <Grid key={i} size={{xs: 12, md: 6, lg: 4}}>
                      <Skeleton variant="rounded" height={96}/>
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
                    <Grid key={wl.id} size={{xs: 12, md: 6, lg: 4}}>
                      <Card
                        variant="outlined"
                        onClick={() => navigate(`/wishlist/${wl.id}`)}
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          display: 'flex',
                          transition: 'transform 120ms ease, box-shadow 120ms ease',
                          '&:hover': {transform: 'translateY(-2px)', boxShadow: 6},
                        }}
                      >
                        <CardContent sx={{width: '100%'}}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
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

                            <IconButton
                              size="small"
                              disabled={isDeleting}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isDeleting) return;
                                setDeleteDialog({open: true, id: wl.id, title: wl.title});
                              }}
                              aria-label="Delete wishlist"
                            >
                              <DeleteIcon sx={{fontSize: 18}}/>
                            </IconButton>
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
            user={user ? {uid: user.uid} : null}
          />
        </Stack>
      </Container>

      <ConfirmDialog
        open={deleteDialog.open}
        title={`Delete wishlist "${deleteDialog.title ?? ''}"?`}
        onClose={() => setDeleteDialog({open: false})}
        onConfirm={async () => {
          if (!deleteDialog.id) return;
          try {
            setIsDeleting(true);
            await deleteWishlistDeep(deleteDialog.id);
          } catch (e) {
            console.error('Failed to delete wishlist:', e);
          } finally {
            setIsDeleting(false);
            setDeleteDialog({open: false});
          }
        }}
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        loading={isDeleting}
        disableBackdropClose={isDeleting}
      />

      <Backdrop open={isDeleting} sx={{zIndex: (t) => t.zIndex.modal + 1}}>
        <CircularProgress/>
      </Backdrop>
    </Box>
  );
}