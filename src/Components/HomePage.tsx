import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@utils/analytics';
import type { CreationSource } from '@utils/pendingWishlistCreate';
import { Alert, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import SEOHead from '@components/SEOHead';
import { HomePageBrandBar } from '@components/HomePageBrandBar';
import { HomePageHero } from '@components/HomePageHero';
import { HomePageInfoCard } from '@components/HomePageInfoCard';
import { HomePageGuestCta } from '@components/HomePageGuestCta';
import { HomePageMyListsSection } from '@components/HomePageMyListsSection';
import { HomePageFaq } from '@components/HomePageFaq';
import { CreateWishListDialog } from '@components/CreateWishListDialog';
import ConfirmDialog from '@components/ConfirmDialog';
import type { WishList } from '@models/WishList';
import { useAuth } from '@hooks/useAuth';
import { useGoogleSignIn } from '@hooks/useGoogleSignIn';
import { subscribeMyWishlists, deleteWishlistDeep } from '@api/wishListService';
import {
  WISHLIST_AUTH_COMPLETE,
  consumePendingWishlistCreateAfterAuth,
  setPendingWishlistCreateAfterAuth,
} from '@utils/pendingWishlistCreate';

type WLItem = WishList & { id: string };
type RouteLang = 'ua' | 'en';
type Props = { lang: RouteLang };

function toSeoLang(lng: RouteLang): 'uk' | 'en' {
  return lng === 'ua' ? 'uk' : 'en';
}

export default function HomePage({ lang }: Props) {
  const { t } = useTranslation(['home', 'examples'], { lng: lang });
  const { t: tAuth } = useTranslation('auth', { lng: lang });
  const { signIn, loading: signInLoading, isTelegram } = useGoogleSignIn();

  const seoLang = toSeoLang(lang);
  const { user } = useAuth();
  const { pathname, state: navigationState } = useLocation();
  const [creationSource, setCreationSource] = useState<CreationSource>('home');

  const [createOpen, setCreateOpen] = useState(false);
  const [myListsError, setMyListsError] = useState(false);
  const [myListsAttempt, setMyListsAttempt] = useState(0);
  const [myLists, setMyLists] = useState<WLItem[] | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; title?: string }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    setMyLists(null);
    setMyListsError(false);
    if (!user?.uid) return;
    const unsub = subscribeMyWishlists(user.uid, lists => {
      if (active) { setMyLists(lists); setMyListsError(false); }
    }, () => {
      if (active) setMyListsError(true);
      void trackEvent('wishlist_operation_failed', { operation: 'load', error_category: 'persistence' });
    });
    return () => { active = false; unsub(); };
  }, [user?.uid, myListsAttempt]);

  useEffect(() => {
    const resume = () => {
      if (!user?.uid) return;
      const intent = consumePendingWishlistCreateAfterAuth(pathname);
      if (intent?.action === 'create') { setCreationSource(intent.source); setCreateOpen(true); }
    };
    resume();
    window.addEventListener(WISHLIST_AUTH_COMPLETE, resume);
    return () => window.removeEventListener(WISHLIST_AUTH_COMPLETE, resume);
  }, [user?.uid, pathname]);

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
    const source = navigationState?.creationSource === 'blog' ? 'blog' : 'home';
    setCreationSource(source);
    void trackEvent('create_wishlist_start', { source });
    if (user) {
      openCreateDialog();
      return;
    }
    if (isTelegram) {
      setPendingWishlistCreateAfterAuth({ action: 'create', language: lang, path: pathname, source });
      handleTelegramOpenBrowser();
      return;
    }
    setPendingWishlistCreateAfterAuth({ action: 'create', language: lang, path: pathname, source });
    await signIn();
  }, [user, isTelegram, signIn, openCreateDialog, handleTelegramOpenBrowser, lang, pathname, navigationState]);

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

  const canonicalUrl = `${origin}/${lang === 'ua' ? 'ua' : 'en'}`;

  const alternates = {
    en: `${origin}/en`,
    uk: `${origin}/ua`,
  };

  const deleteName =
    deleteDialog.title && deleteDialog.title.trim().length > 0 ? deleteDialog.title : t('untitled');

  const faqData = useMemo(() => {
    const faq = t('faq', { returnObjects: true }) as Array<{ q: string; a: string }>;
    if (!Array.isArray(faq) || faq.length === 0) return null;
    return faq;
  }, [t]);

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
        }}
        keywords={
          lang === 'ua'
            ? 'вішліст, список бажань, подарунки, день народження, різдво, весілля, безкоштовно, створити вішліст'
            : 'wishlist, gift list, birthday, christmas, wedding, free, create wishlist, share wishlist'
        }
      />

      <Container maxWidth="md">
        <HomePageBrandBar
          lang={lang}
          user={user ? { uid: user.uid } : null}
          signInLoading={signInLoading}
          isTelegram={isTelegram}
          onCreateClick={handleCreateWishlistFlow}
        />

        <HomePageHero lang={lang} />

        <Stack spacing={3} alignItems="stretch">
          <HomePageInfoCard lang={lang} />

          {!user && (
            <HomePageGuestCta lang={lang} signInLoading={signInLoading} onCreateClick={handleCreateWishlistFlow} />
          )}

          {user && myListsError && <Alert severity="error" action={<Button color="inherit" onClick={() => setMyListsAttempt(value => value + 1)}>{t('retryLists')}</Button>}>{t('loadListsFailed')}</Alert>}
          {user && !myListsError && (
            <HomePageMyListsSection
              lang={lang}
              isLoading={isLoading}
              myLists={myLists}
              signInLoading={signInLoading}
              onCreateClick={handleCreateWishlistFlow}
              onDeleteRequest={openDeleteDialog}
            />
          )}
        </Stack>

        <HomePageFaq lang={lang} faqData={faqData} />
      </Container>

      <CreateWishListDialog
        user={user ? { uid: user.uid } : null}
        open={createOpen}
        onClose={handleCloseCreate}
        source={creationSource}
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

      <Backdrop open={isDeleting} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
