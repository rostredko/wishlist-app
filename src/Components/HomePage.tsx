import {useEffect, useMemo, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Box, Container, Typography, Button, Stack, Card, CardContent,
  Tooltip, Divider, Grid, Skeleton, IconButton, Backdrop, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import SEOHead from '@components/SEOHead';
import {useAuth} from '@hooks/useAuth';
import {CreateWishListDialog} from '@components/CreateWishListDialog';
import ConfirmDialog from '@components/ConfirmDialog';
import type {WishList} from '@models/WishList';
import {subscribeMyWishlists, deleteWishlistDeep} from '@api/wishListService';

type WLItem = WishList & { id: string };

function detectLang(): 'en' | 'uk' {
  if (typeof navigator === 'undefined') return 'en';
  let ln = navigator.language.toLowerCase();
  if (ln.startsWith('ru')) ln = 'uk'
  return ln.startsWith('uk') ? 'uk' : 'en';
}

export default function HomePage() {
  const lang = detectLang();
  const {user} = useAuth();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [myLists, setMyLists] = useState<WLItem[] | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; title?: string }>({open: false});
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setMyLists(null);
      return;
    }
    const unsub = subscribeMyWishlists(user.uid, lists => setMyLists(lists));
    return unsub;
  }, [user?.uid]);

  const isLoading = useMemo(() => !!user && myLists === null, [user, myLists]);

  const handleOpenCreate = useCallback(() => user && setCreateOpen(true), [user]);
  const handleCloseCreate = useCallback(() => setCreateOpen(false), []);

  const openDeleteDialog = useCallback((id: string, title?: string) => {
    setDeleteDialog({open: true, id, title});
  }, []);
  const closeDeleteDialog = useCallback(() => setDeleteDialog({open: false}), []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialog.id) return;
    try {
      setIsDeleting(true);
      await deleteWishlistDeep(deleteDialog.id);
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  }, [deleteDialog.id, closeDeleteDialog]);

  const props = {
    en: {
      title: 'WishList App - create and share wishlists',
      desc:
        'Create and share wishlists for any occasion. Friends can anonymously claim gifts so everyone sees what’s already taken. Simple and free.',
      what: '✨ What is it?',
      whatText: 'A clean, distraction-free wishlist that keeps the core features simple. Just all you need to build simple wishlist on Birthday, New Year, Secret Santa, Christmas, Wedding, or any other or for any other occasion 😄',
      how: '🧭 How it works',
      li1: 'Create a wishlist in seconds. Button below.',
      li2: 'Share a private URL with friends. Just from your browser. From any device. For free.',
      li3: 'Friends anonymously claim gifts - everyone sees what’s taken.',
      li4: 'Sign in with Google to manage your lists.',
      your: '📚 Your wishlists',
      noLists: 'No wishlists yet.',
      createOne: 'Create wishlist',
      createBtn: 'Create wishlist',
      deleteTitle: (name?: string) => `Delete “${name ?? 'Untitled'}”?`,
    },
    uk: {
      title: 'WishList App - створюйте та діліться вішлістами',
      desc:
        'Створюйте та діліться списками бажань для будь-якої події. Друзі можуть анонімно бронювати подарунки — усі бачать, що вже зайнято. Просто й безкоштовно.',
      what: '✨ Що це?',
      whatText: 'Лаконічний вішліст без зайвого - тільки головне. Безкоштовно. Все що тобі треба для створення вішлісту на День народження, Новий рік, Секретного Санту (або ж Таємного Миколая), Різдво, Одруження, або будь-які інші події у житті 😄',
      how: '🧭 Як це працює',
      li1: 'Створіть вішліст за секунди. Кнопка нижче. Дуже просто.',
      li2: 'Поділіться приватним посиланням із друзями - з будь-якого пристрою. І це повністю безкоштовно.',
      li3: 'Друзі анонімно бронюють подарунки - усі бачать, що вже зайнято.',
      li4: 'Увійдіть швидко через Google, щоб керувати своїми списками.',
      your: '📚 Ваші вішлісти',
      noLists: 'Поки що немає вішлістів.',
      createOne: 'Створити вішліст',
      createBtn: 'Створити вішлист',
      deleteTitle: (name?: string) => `Видалити "${name ?? 'Без назви'}"?`,
    },
  }[lang];

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wishlistapp.com.ua';
  const alternates = {
    en: `${origin}/`,
    uk: `${origin}/?lang=uk`,
  };

  return (
    <Box component="main" sx={{py: {xs: 6, md: 10}}}>
      <SEOHead
        lang={lang}
        title={props.title}
        description={props.desc}
        alternates={alternates}
      />

      <Container maxWidth="md">
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="h3" component="h1" sx={{fontWeight: 800, display: 'flex', gap: 1}}>
            🎁 WishList App
          </Typography>
          <Typography variant="h4" sx={{opacity: 0.8}}>
            Minimal wishlist app with only what matters.
          </Typography>

          <Card variant="outlined" sx={{bgcolor: 'background.paper'}}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{fontWeight: 700, fontSize: 24}}>
                  {props.what}
                </Typography>
                <Typography>{props.whatText}</Typography>

                <Divider/>

                <Typography variant="subtitle1" sx={{fontWeight: 700, fontSize: 24}}>
                  {props.how}
                </Typography>
                <Stack component="ul" sx={{pl: 3, m: 0}} spacing={1}>
                  <li><Typography>{props.li1}</Typography></li>
                  <li><Typography>{props.li2}</Typography></li>
                  <li><Typography>{props.li3}</Typography></li>
                  <li><Typography>{props.li4}</Typography></li>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Tooltip title={user ? '' : 'Sign in with Google to create a wishlist'} placement="top">
            <span>
              <Button size="large" variant="contained" onClick={handleOpenCreate} disabled={!user}
                      aria-label="Create wishlist">
                {props.createBtn}
              </Button>
            </span>
          </Tooltip>

          {user && (
            <Stack sx={{width: '100%', mt: 4}} spacing={2}>
              <Typography variant="h6" sx={{fontWeight: 700, fontSize: 24}}>
                {props.your}
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
                      <Typography>{props.noLists}</Typography>
                      <Button variant="outlined" onClick={handleOpenCreate}>{props.createOne}</Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {!isLoading && myLists && myLists.length > 0 && (
                <Grid container spacing={2}>
                  {myLists.map(wl => (
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
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {wl.title || (lang === 'uk' ? 'Без назви' : 'Untitled wishlist')}
                            </Typography>
                            <IconButton
                              aria-label="Delete"
                              size="small"
                              onClick={e => {
                                e.stopPropagation();
                                openDeleteDialog(wl.id, wl.title);
                              }}
                            >
                              <DeleteIcon/>
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
        </Stack>
      </Container>

      <CreateWishListDialog
        user={user ? {uid: user.uid} : null}
        open={createOpen}
        onClose={handleCloseCreate}/>
      <ConfirmDialog
        open={deleteDialog.open}
        title={props.deleteTitle(deleteDialog.title)}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        destructive
      />

      <Backdrop open={isDeleting} sx={{color: '#fff', zIndex: 9999}}>
        <CircularProgress color="inherit"/>
      </Backdrop>
    </Box>
  );
}