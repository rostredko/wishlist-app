import { useEffect, useMemo, useState, useCallback, lazy, Suspense } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteIcon from '@mui/icons-material/Delete';

import SEOHead from '@components/SEOHead';
import { useAuth } from '@hooks/useAuth';
import { useGoogleSignIn } from '@hooks/useGoogleSignIn';
import { CreateWishListDialog } from '@components/CreateWishListDialog';
import ConfirmDialog from '@components/ConfirmDialog';
import type { WishList } from '@models/WishList';
import { subscribeMyWishlists, deleteWishlistDeep } from '@api/wishListService';

const VideoTutorialsSection = lazy(() => import('@components/VideoTutorialsSection'));

/** After Google sign-in, open Create wishlist dialog (popup + redirect return + Telegram return). */
const WL_PENDING_CREATE_KEY = 'wl_pending_create_wishlist';
const WL_PENDING_CREATE_MAX_AGE_MS = 30 * 60 * 1000;

function setPendingWishlistCreateAfterAuth() {
  try {
    sessionStorage.setItem(WL_PENDING_CREATE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function clearPendingWishlistCreateAfterAuth() {
  try {
    sessionStorage.removeItem(WL_PENDING_CREATE_KEY);
  } catch {
    /* ignore */
  }
}

/** If a valid pending intent exists, remove it and return true. */
function consumePendingWishlistCreateAfterAuth(): boolean {
  try {
    const raw = sessionStorage.getItem(WL_PENDING_CREATE_KEY);
    if (raw == null) return false;
    sessionStorage.removeItem(WL_PENDING_CREATE_KEY);
    const t = parseInt(raw, 10);
    if (Number.isNaN(t) || Date.now() - t > WL_PENDING_CREATE_MAX_AGE_MS) return false;
    return true;
  } catch {
    return false;
  }
}

type WLItem = WishList & { id: string };
type RouteLang = 'ua' | 'en';
type Props = { lang: RouteLang };

function toSeoLang(lng: RouteLang): 'uk' | 'en' {
  return lng === 'ua' ? 'uk' : 'en';
}

export default function HomePage({ lang }: Props) {
  const { t, i18n } = useTranslation(['home', 'examples']);
  const { t: tAuth } = useTranslation('auth');
  const { signIn, loading: signInLoading, isTelegram } = useGoogleSignIn();

  // Translation sync (if needed, but usually redundant with route change)
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang).catch(() => { });
  }

  const seoLang = toSeoLang(lang);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [myLists, setMyLists] = useState<WLItem[] | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; title?: string }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setMyLists(null);
      return;
    }
    const unsub = subscribeMyWishlists(user.uid, lists => setMyLists(lists));
    return unsub;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    if (!consumePendingWishlistCreateAfterAuth()) return;
    setCreateOpen(true);
  }, [user?.uid]);

  const isLoading = useMemo(() => !!user && myLists === null, [user, myLists]);

  const handleCloseCreate = useCallback(() => setCreateOpen(false), []);

  const openCreateDialog = useCallback(() => setCreateOpen(true), []);

  const handleTelegramOpenBrowser = useCallback(() => {
    const currentUrl = window.location.href;
    try {
      window.open(currentUrl, '_system');
    } catch {
      alert(`${tAuth('telegramInstructionCta')}: ${currentUrl}`);
    }
  }, [tAuth]);

  const handleCreateWishlistFlow = useCallback(async () => {
    if (user) {
      openCreateDialog();
      return;
    }
    if (isTelegram) {
      setPendingWishlistCreateAfterAuth();
      handleTelegramOpenBrowser();
      return;
    }
    setPendingWishlistCreateAfterAuth();
    const result = await signIn();
    if (result === 'cancelled') {
      clearPendingWishlistCreateAfterAuth();
    }
  }, [user, isTelegram, signIn, openCreateDialog, handleTelegramOpenBrowser]);

  const openDeleteDialog = useCallback((id: string, title?: string) => {
    setDeleteDialog({ open: true, id, title });
  }, []);
  const closeDeleteDialog = useCallback(() => setDeleteDialog({ open: false }), []);

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

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://wishlistapp.com.ua';

  const canonicalUrl = `${origin}/${lang === 'ua' ? 'ua' : 'en'}/`;

  const alternates = {
    en: `${origin}/en/`,
    uk: `${origin}/ua/`,
  };

  const deleteName = deleteDialog.title && deleteDialog.title.trim().length > 0
    ? deleteDialog.title
    : t('untitled');

  const exampleCards = useMemo(() => {
    const cards = t('examples:cards', { returnObjects: true }) as Array<{ title: string; emoji: string; wishlistId: string }>;
    if (!Array.isArray(cards)) {
      return [];
    }
    return cards.map(card => ({
      path: `/${lang}/wishlist/${card.wishlistId}`,
      title: card.title,
      emoji: card.emoji,
      wishlistId: card.wishlistId
    }));
  }, [lang, t, i18n.language]);

  const faqData = useMemo(() => {
    const faq = t('faq', { returnObjects: true }) as Array<{ q: string; a: string }>;
    if (!Array.isArray(faq) || faq.length === 0) return null;
    return faq;
  }, [t, i18n.language]);

  return (
    <Box component="main" sx={{ pt: { xs: 6, md: 10 }, pb: 2 }}>
      <SEOHead
        lang={seoLang}
        title={t('title')}
        description={t('desc')}
        canonical={canonicalUrl}
        alternates={alternates}
        image={`${origin}/og-image.webp`}
        structured={{
          website: true,
          webapp: true,
          organization: true,
          faq: faqData,
          howTo: true
        }}
        keywords={lang === 'ua'
          ? 'вішліст, список бажань, подарунки, день народження, різдво, весілля, безкоштовно, створити вішліст'
          : 'wishlist, gift list, birthday, christmas, wedding, free, create wishlist, share wishlist'}
      />

      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 2,
            flexWrap: 'wrap',
            rowGap: 1.5,
          }}
        >
          <Box
            component={RouterLink}
            to={`/${lang}`}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              minWidth: 0,
              textDecoration: 'none',
              color: 'inherit',
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 1 },
            }}
          >
            <Box
              aria-hidden
              sx={{ fontSize: { xs: '2.25rem', sm: '2.75rem' }, lineHeight: 1, userSelect: 'none' }}
            >
              🎁
            </Box>
            <Typography variant="h6" component="span" sx={{ fontWeight: 800, letterSpacing: 0.02 }}>
              {t('brandName')}
            </Typography>
          </Box>

          {!user ? (
            <Tooltip
              title={isTelegram ? tAuth('telegramInstructionTitle') : t('createTooltip')}
              placement="bottom-end"
            >
              <Box
                component="span"
                sx={{
                  ml: { xs: 0, sm: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  flexShrink: 0,
                  display: 'inline-block',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{
                    fontWeight: 700,
                    width: { xs: '100%', sm: 'auto' },
                  }}
                  onClick={() => void handleCreateWishlistFlow()}
                  disabled={signInLoading}
                  aria-label={t('createBtn')}
                >
                  {t('createBtn')}
                </Button>
              </Box>
            </Tooltip>
          ) : (
            <Box
              sx={{
                ml: { xs: 0, sm: 'auto' },
                width: { xs: '100%', sm: 'auto' },
                flexShrink: 0,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="medium"
                sx={{
                  fontWeight: 700,
                  width: { xs: '100%', sm: 'auto' },
                }}
                onClick={() => void handleCreateWishlistFlow()}
                disabled={signInLoading}
                aria-label={t('createBtn')}
              >
                {t('createBtn')}
              </Button>
            </Box>
          )}
        </Box>

        <Box className="hero" sx={{ width: '100%' }}>
          <Stack spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, display: 'flex', gap: 1 }}>
              {t('heroH1')}
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 500,
                opacity: 0.88,
                pb: 3,
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                lineHeight: 1.45,
                maxWidth: '42rem',
              }}
            >
              {t('heroH2')}
            </Typography>
          </Stack>
        </Box>

        <Stack spacing={3} alignItems="stretch">
          <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography
                  component="h2"
                  variant="subtitle1"
                  sx={{ fontWeight: 700, fontSize: { xs: 22, sm: 25 } }}
                >
                  {t('what')}
                </Typography>

                <Stack
                  spacing={2}
                  sx={{
                    pl: { xs: 2, sm: 4, md: 4 },
                    m: 0,
                  }}
                >
                  {(t('whatList', { returnObjects: true }) as string[]).map((item, idx) => (
                    <Typography
                      key={idx}
                      variant="body1"
                      sx={{ fontSize: 18, display: 'flex', alignItems: 'flex-start', gap: 1 }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>

                <Divider />

                <Typography
                  component="h2"
                  variant="subtitle1"
                  sx={{ fontWeight: 700, fontSize: { xs: 20, sm: 22 } }}
                >
                  {t('how')}
                </Typography>

                <Stack
                  component="ul"
                  spacing={2}
                  sx={{
                    pl: { xs: 3, sm: 5, md: 6 },
                    m: 0,
                    listStylePosition: 'outside',
                  }}
                >
                  {(['li1', 'li2', 'li3', 'li4'] as const).map(key => (
                    <li key={key}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: 18, display: 'flex', alignItems: 'flex-start', gap: 1 }}
                      >
                        {t(key)}
                      </Typography>
                    </li>
                  ))}
                </Stack>

                <Divider />

                <Suspense fallback={
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="rectangular" height={0} sx={{ paddingTop: '56.25%', borderRadius: 2 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="rectangular" height={0} sx={{ paddingTop: '56.25%', borderRadius: 2 }} />
                    </Box>
                  </Stack>
                }>
                  <VideoTutorialsSection />
                </Suspense>

                <Divider />

                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24 }}>
                  {t('examplesTitle')}
                </Typography>
                <Box sx={{ mb: 8 }}>
                  <Grid container spacing={2}>
                    {exampleCards.map((ex) => (
                      <Grid key={ex.path} size={{ xs: 12, md: 6 }}>
                        <Card
                          variant="outlined"
                          component={RouterLink}
                          to={ex.path}
                          sx={{
                            height: '100%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textDecoration: 'none',
                            color: 'inherit',
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1.5, sm: 2 },
                            '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                            transition: 'all 120ms ease',
                            gap: 2,
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: { xs: 24, sm: 28 }, lineHeight: 1 }}>{ex.emoji}</Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                pr: 1,
                                overflow: 'hidden',
                                whiteSpace: { xs: 'normal', sm: 'normal' },
                                display: { sm: '-webkit-box' },
                                WebkitLineClamp: { sm: 2 } as any,
                                WebkitBoxOrient: { sm: 'vertical' } as any,
                              }}
                            >
                              {ex.title}
                            </Typography>
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {!user && (
            <Stack sx={{ width: '100%', mt: 4, pb: 4 }} spacing={0}>
              <Tooltip title={t('createTooltip')} placement="top">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    mt: 6,
                  }}
                >
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => void handleCreateWishlistFlow()}
                    disabled={signInLoading}
                    aria-label={t('createBtn')}
                    sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 300 }, px: { md: 5 } }}
                  >
                    {t('createBtn')}
                  </Button>
                </Box>
              </Tooltip>
            </Stack>
          )}

          {user && (
            <Stack sx={{ width: '100%', mt: 4, pb: 4 }} spacing={0}>
              <Stack spacing={2}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: 26, sm: 30, md: 32 },
                    lineHeight: 1.25,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  {t('your')}
                </Typography>

                {isLoading && (
                  <Grid container spacing={2}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
                        <Skeleton variant="rounded" height={96} />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {!isLoading && myLists && myLists.length === 0 && (
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography>{t('noLists')}</Typography>
                        <Button variant="outlined" onClick={() => void handleCreateWishlistFlow()}>
                          {t('createOne')}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {!isLoading && myLists && myLists.length > 0 && (
                  <Grid container spacing={2}>
                    {myLists.map(wl => (
                      <Grid key={wl.id} size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card
                          variant="outlined"
                          onClick={() => navigate(`/${lang}/wishlist/${wl.id}`)}
                          sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            transition: 'transform 120ms ease, box-shadow 120ms ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
                          }}
                        >
                          <CardContent
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 2,
                              '&:last-child': { pb: 2 },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                pr: 1,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {wl.title || t('untitled')}
                            </Typography>
                            <IconButton
                              aria-label={t('deleteAria')}
                              size="small"
                              onClick={e => {
                                e.stopPropagation();
                                openDeleteDialog(wl.id, wl.title);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Stack>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  mt: 6,
                }}
              >
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => void handleCreateWishlistFlow()}
                  disabled={signInLoading}
                  aria-label={t('createBtn')}
                  sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 300 }, px: { md: 5 } }}
                >
                  {t('createBtn')}
                </Button>
              </Box>
            </Stack>
          )}

        </Stack>
      </Container>

      <CreateWishListDialog
        user={user ? { uid: user.uid } : null}
        open={createOpen}
        onClose={handleCloseCreate}
      />
      <ConfirmDialog
        open={deleteDialog.open}
        title={t('deleteTitle', { name: deleteName })}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        confirmText={t('confirmDelete')}
        cancelText={t('cancel')}
        destructive
        loading={isDeleting}
        disableBackdropClose={isDeleting}
      />

      <Backdrop open={isDeleting} sx={{ color: '#fff', zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}