import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { Alert, Box, TextField, Container, Typography, List, IconButton, Button, Skeleton, Stack, Card, CardContent, Tooltip, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ShareIcon from '@mui/icons-material/Share';
import SEOHead from '@components/SEOHead';
import ConfirmDialog from '@components/ConfirmDialog';
import AddItemDialog from '@components/AddItemDialog';
import { CreateWishListDialog } from '@components/CreateWishListDialog';
import WishlistHeader from '@components/WishListHeader';
import { WishListItemRow } from '@components/WishListItemRow';
import { useAuth } from '@hooks/useAuth';
import { useGoogleSignIn } from '@hooks/useGoogleSignIn';
import { useWishlistData } from '@hooks/useWishlistData';
import type { WishList } from '@models/WishList';
import type { GiftValues, WishListItem } from '@models/WishListItem';
import { addGiftItem, deleteGiftItem, updateWishlistTitle, toggleGiftClaimStatus, updateGiftItem } from '@api/wishListService';
import { DEMO_ITEMS, DEMO_WISHLISTS, EXAMPLE_SEO, EXAMPLE_WISHLIST_ALTERNATES, isDemoWishlistId } from '@constants/exampleWishlists';
import { trackEvent } from '@utils/analytics';
import { WISHLIST_AUTH_COMPLETE, consumePendingWishlistCreateAfterAuth, setPendingWishlistCreateAfterAuth } from '@utils/pendingWishlistCreate';

const activatedLists = new Set<string>();

export function WishListItemList() {
  const { wishlistId, lng } = useParams();
  const routeLang = lng === 'ua' ? 'ua' : 'en';
  const { t } = useTranslation('wishlist', { lng: routeLang });
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { signIn, loading: signInLoading, isTelegram } = useGoogleSignIn();
  const { pathname, key: visitKey } = useLocation();
  const navigate = useNavigate();
  const data = useWishlistData(wishlistId && wishlistId !== 'default' ? wishlistId : undefined);
  const { setWishlist, itemsLoaded, itemsError, retry } = data;
  const isExampleWishlist = Boolean(wishlistId && isDemoWishlistId(wishlistId));
  const demo = isExampleWishlist && wishlistId ? DEMO_WISHLISTS[wishlistId] : undefined;
  const wishlist = useMemo<WishList | null>(() => data.wishlist ?? (demo && wishlistId
    ? { id: wishlistId, title: demo.title ?? '', ownerUid: demo.ownerUid ?? 'demo', bannerImage: demo.bannerImage } : null), [data.wishlist, demo, wishlistId]);
  const status = data.wishlist ? data.status : demo ? 'found' : data.status;
  const items = useMemo(() => data.items.length ? data.items : demo && wishlistId ? DEMO_ITEMS[wishlistId] ?? [] : data.items, [data.items, demo, wishlistId]);
  const canEdit = status === 'found' && Boolean(isAdmin || !isExampleWishlist && user?.uid && wishlist?.ownerUid === user.uid);
  const viewerRole = isAdmin ? 'admin' : canEdit ? 'owner' : 'guest';
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<WishListItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<WishListItem | null>(null);
  const [claimItem, setClaimItem] = useState<WishListItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [copyExample, setCopyExample] = useState(false);
  const [copyShared, setCopyShared] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [copySnackOpen, setCopySnackOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const operationLock = useRef(false);
  const visit = useMemo(() => ({ active: true, wishlistId, visitKey }), [wishlistId, visitKey]);
  const [exampleClaims, setExampleClaims] = useState<Set<string>>(new Set());
  const viewedVisit = useRef('');
  const origin = window.location.origin;
  const canonicalUrl = wishlistId ? `${origin}/${routeLang}/wishlist/${wishlistId}` : '';

  useEffect(() => {
    if (wishlistId === 'default' && import.meta.env.VITE_DEFAULT_WISHLIST_ID) {
      navigate(`/${routeLang}/wishlist/${import.meta.env.VITE_DEFAULT_WISHLIST_ID}`, { replace: true });
    }
  }, [wishlistId, routeLang, navigate]);

  useEffect(() => {
    visit.active = true;
    operationLock.current = false;
    setPending(false);
    setExampleClaims(new Set());
    setNotice(null);
    setAddOpen(false);
    setEditItem(null);
    setDeleteItem(null);
    setClaimItem(null);
    setCreateOpen(false);
    setCopyShared(false);
    setEditingTitle(false);
    setCopySnackOpen(false);
    return () => { visit.active = false; };
  }, [visit]);

  useEffect(() => {
    const resume = () => {
      if (!user || status !== 'found' || (isExampleWishlist && (!itemsLoaded || itemsError || data.error))) return;
      const intent = consumePendingWishlistCreateAfterAuth(pathname);
      if (!intent) return;
      setCopyShared(false);
      setCopyExample(intent.action === 'copy_demo' && intent.demoId === wishlistId && isExampleWishlist);
      setCreateOpen(true);
    };
    resume();
    window.addEventListener(WISHLIST_AUTH_COMPLETE, resume);
    return () => window.removeEventListener(WISHLIST_AUTH_COMPLETE, resume);
  }, [user, status, isExampleWishlist, itemsLoaded, itemsError, data.error, pathname, wishlistId]);

  useEffect(() => {
    const key = `${visitKey}:${pathname}`;
    if (status !== 'found' || authLoading || !itemsLoaded || itemsError || data.error || viewedVisit.current === key) return;
    viewedVisit.current = key;
    void trackEvent('wishlist_view', { viewer_role: viewerRole, is_demo: isExampleWishlist });
  }, [status, authLoading, itemsLoaded, itemsError, data.error, visitKey, pathname, viewerRole, isExampleWishlist]);

  const handleCreate = async (useExample: boolean) => {
    if (signInLoading || authLoading) return;
    const source = useExample ? 'demo' : 'guest_list';
    void trackEvent('create_wishlist_start', { source, is_demo: isExampleWishlist });
    setNotice(null);
    setCopyShared(false);
    if (user) {
      setCopyExample(useExample);
      setCreateOpen(true);
      return;
    }
    if (isTelegram) {
      setNotice(t('signInBrowserHint'));
      return;
    }
    setPendingWishlistCreateAfterAuth({ action: useExample ? 'copy_demo' : 'create', ...(useExample ? { demoId: wishlistId } : {}), language: routeLang, path: pathname, source });
    await signIn();
  };

  const actualClaimed = (item: WishListItem) => isExampleWishlist ? exampleClaims.has(item.id) : item.claimed;

  const handleClaim = async (item: WishListItem) => {
    if (!wishlistId || operationLock.current) return;
    const current = actualClaimed(item);
    if (!canEdit && current) return;
    operationLock.current = true;
    setPending(true);
    setNotice(null);
    try {
      if (isExampleWishlist) {
        setExampleClaims(previous => {
          const next = new Set(previous);
          if (current) next.delete(item.id); else next.add(item.id);
          return next;
        });
      } else {
        await toggleGiftClaimStatus(wishlistId, item.id, current);
      }
      if (!visit.active) return;
      if (!canEdit && !current) {
        if (!isExampleWishlist) void trackEvent('gift_reserve_success', { viewer_role: 'guest', is_demo: false });
        confetti({ particleCount: 200, spread: 120, gravity: 0.8 });
      }
      setClaimItem(null);
    } catch {
      if (!visit.active) return;
      setNotice(t('reservationFailed'));
      void trackEvent('wishlist_operation_failed', { operation: 'reserve', error_category: 'persistence' });
    } finally {
      if (visit.active) { operationLock.current = false; setPending(false); }
    }
  };

  const handleAdd = async (values: GiftValues) => {
    if (!wishlistId || !canEdit) throw new Error('Wishlist is not editable');
    try {
      await addGiftItem(wishlistId, values);
      if (!visit.active) return;
      void trackEvent('wishlist_item_add', { has_link: Boolean(values.link), has_price: values.priceMinor != null, viewer_role: viewerRole, is_demo: isExampleWishlist });
      if (itemsLoaded && !items.length && !isExampleWishlist && wishlist?.creationMethod === 'manual' && !activatedLists.has(wishlistId)) {
        activatedLists.add(wishlistId);
        void trackEvent('wishlist_first_item_added', { creation_method: 'manual', has_link: Boolean(values.link), has_price: values.priceMinor != null });
      } else if (!isExampleWishlist && wishlist?.creationMethod === 'demo_copy') {
        void trackEvent('wishlist_copy_personalized', { operation: 'add_item', creation_method: 'demo_copy' });
      }
    } catch (error) {
      void trackEvent('wishlist_operation_failed', { operation: 'add_item', error_category: 'persistence' });
      throw error;
    }
  };

  const handleEdit = async (values: GiftValues) => {
    if (!wishlistId || !editItem || !canEdit) throw new Error('Wishlist is not editable');
    try {
      await updateGiftItem(wishlistId, editItem.id, values);
      if (!visit.active) return;
      if (!isExampleWishlist && wishlist?.creationMethod === 'demo_copy') void trackEvent('wishlist_copy_personalized', { operation: 'edit_item', creation_method: 'demo_copy' });
    } catch (error) {
      void trackEvent('wishlist_operation_failed', { operation: 'edit_item', error_category: 'persistence' });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!wishlistId || !deleteItem || operationLock.current) return;
    operationLock.current = true;
    setPending(true);
    setNotice(null);
    try {
      await deleteGiftItem(wishlistId, deleteItem.id);
      if (visit.active) setDeleteItem(null);
    } catch {
      if (visit.active) setNotice(t('deleteFailed'));
      void trackEvent('wishlist_operation_failed', { operation: 'delete', error_category: 'persistence' });
    } finally {
      if (visit.active) { operationLock.current = false; setPending(false); }
    }
  };

  const handleSaveTitle = async () => {
    if (!wishlistId || !canEdit || operationLock.current) return;
    const value = titleDraft.trim();
    if (!value) { setNotice(t('titleRequired')); return; }
    if (value === wishlist?.title) { setEditingTitle(false); return; }
    operationLock.current = true;
    setPending(true);
    try {
      await updateWishlistTitle(wishlistId, value);
      if (!visit.active) return;
      setWishlist(previous => previous ? { ...previous, title: value } : previous);
      setEditingTitle(false);
      setNotice(null);
    } catch {
      if (visit.active) setNotice(t('titleSaveFailed'));
      void trackEvent('wishlist_operation_failed', { operation: 'title', error_category: 'persistence' });
    } finally {
      if (visit.active) { operationLock.current = false; setPending(false); }
    }
  };

  const handleBannerUpload = useCallback((url: string) => {
    if (!visit.active) return;
    setWishlist(previous => previous && previous.id === wishlistId ? { ...previous, bannerImage: url } : previous);
  }, [setWishlist, wishlistId, visit]);

  const handleCopyLink = async () => {
    if (!canonicalUrl) return;
    void trackEvent('wishlist_share_attempt', { method: 'clipboard', is_demo: isExampleWishlist, viewer_role: viewerRole });
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      if (!visit.active) return;
      setCopySnackOpen(true);
      void trackEvent('wishlist_share_copy', { method: 'clipboard', is_demo: isExampleWishlist, viewer_role: viewerRole });
    } catch {
      if (!visit.active) return;
      window.prompt(t('copyFallbackPrompt'), canonicalUrl);
    }
  };

  const handleShare = async () => {
    if (!canonicalUrl || operationLock.current) return;
    if (typeof navigator.share !== 'function') { await handleCopyLink(); return; }
    operationLock.current = true;
    setPending(true);
    setNotice(null);
    void trackEvent('wishlist_share_attempt', { method: 'native', is_demo: isExampleWishlist, viewer_role: viewerRole });
    try {
      await navigator.share({ title: t('shareTitle'), text: t('shareInvitation'), url: canonicalUrl });
      if (!visit.active) return;
      void trackEvent('wishlist_share_handoff', { method: 'native', is_demo: isExampleWishlist, viewer_role: viewerRole });
    } catch (error) {
      if (!visit.active) return;
      if (!(error instanceof DOMException && error.name === 'AbortError') && !(error instanceof Error && error.name === 'AbortError')) {
        setNotice(t('shareFailed'));
        void trackEvent('wishlist_operation_failed', { operation: 'share', error_category: 'unavailable' });
      }
    } finally {
      if (visit.active) { operationLock.current = false; setPending(false); }
    }
  };

  const exampleSeo = !canEdit && wishlistId ? EXAMPLE_SEO[wishlistId] : undefined;
  const pageTitle = exampleSeo?.title ?? (wishlist ? `${wishlist.title} - WishList App` : `${t(status === 'not_found' ? 'notFoundTitle' : status === 'error' ? 'loadFailedTitle' : 'brandName')} - WishList App`);
  const pageDescription = exampleSeo?.description ?? (wishlist ? t('pageDescriptionView', { name: wishlist.title }) : t(status === 'not_found' ? 'pageDescriptionNotFound' : 'pageDescriptionLoading'));
  const alternateIds = wishlistId ? EXAMPLE_WISHLIST_ALTERNATES[wishlistId] : undefined;
  const beginTitleEdit = () => { setTitleDraft(wishlist?.title ?? ''); setEditingTitle(true); };
  const readFailed = Boolean(data.error || itemsError);

  return <>
    <SEOHead lang={routeLang === 'ua' ? 'uk' : 'en'} title={pageTitle} description={pageDescription} canonical={canonicalUrl}
      image={wishlist?.bannerImage || `${origin}/og-image.webp`}
      alternates={alternateIds ? { en: `${origin}/en/wishlist/${alternateIds.en}`, uk: `${origin}/ua/wishlist/${alternateIds.uk}` } : undefined}
      robots={!isExampleWishlist || status === 'not_found' || status === 'error' ? 'noindex,follow' : undefined}
      structured={isExampleWishlist && wishlist ? { website: true, webapp: true, itemList: { name: wishlist.title, items: items.map(item => item.name) } } : undefined} />

    {status === 'loading' ? <Skeleton variant="rectangular" height={200} data-testid="skeleton" /> : wishlist && status === 'found'
      ? <WishlistHeader wishlist={wishlist} canEdit={canEdit} isExampleWishlist={isExampleWishlist} isAdmin={isAdmin} onBannerUpload={handleBannerUpload} />
      : <Container maxWidth="sm" sx={{ pt: 4 }}><Button startIcon={<ArrowBackIosNewIcon />} onClick={() => navigate(`/${routeLang}`)} variant="outlined" size="small">{t('backToHome')}</Button></Container>}

    <Container maxWidth="sm">
      {status === 'found' && canEdit && <Button variant="outlined" sx={{ mb: 2 }} onClick={() => void handleCreate(false)}>{t('createNewWishlist')}</Button>}
      {readFailed && <Alert severity={demo ? 'warning' : 'error'} sx={{ my: 2 }} action={<Button color="inherit" onClick={retry}>{t('retry')}</Button>}>{t('loadFailed')}</Alert>}
      {notice && <Alert severity="error" sx={{ my: 2 }} onClose={() => setNotice(null)}>{notice}</Alert>}
      {status === 'not_found' && <Card variant="outlined" sx={{ mt: 4, mb: 2 }}><CardContent>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>{t('notFoundTitle')}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">{t('notFoundText')}</Typography>
      </CardContent></Card>}
      {status === 'error' && <Typography component="h1" variant="h4" sx={{ my: 3 }}>{t('loadFailedTitle')}</Typography>}
      {status === 'found' && wishlist && <>
        {editingTitle ? <Stack direction="row" spacing={1} sx={{ mt: 3, mb: 2 }}>
          <TextField value={titleDraft} label={t('editTitleAria')} onChange={event => setTitleDraft(event.target.value)} disabled={pending}
            onBlur={() => void handleSaveTitle()} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void handleSaveTitle(); } }} autoFocus fullWidth variant="standard" />
          <Button disabled={pending} onClick={() => void handleSaveTitle()}>{t('saveTitle')}</Button>
        </Stack> : <Stack direction="row" alignItems="center" spacing={1} sx={{ my: 2.5 }}>
          <Typography variant="h3" component="h1" onClick={canEdit ? beginTitleEdit : undefined} sx={{ flex: 1, minWidth: 0, wordBreak: 'break-word', cursor: canEdit ? 'pointer' : 'default' }}>{wishlist.title || t('unnamed')}</Typography>
          {canEdit && <Tooltip title={t('editTitleTooltip')}><IconButton aria-label={t('editTitleAria')} onClick={beginTitleEdit}><EditIcon fontSize="small" /></IconButton></Tooltip>}
          {user && wishlist.ownerUid !== user.uid && !isExampleWishlist && <Tooltip title={t('copyWishlistTooltip')}><IconButton aria-label={t('copyWishlistAria')} disabled={!itemsLoaded || readFailed} onClick={() => {
            void trackEvent('create_wishlist_start', { source: 'guest_list', is_demo: false });
            setCopyExample(false); setCopyShared(true); setCreateOpen(true);
          }}><FileCopyIcon fontSize="small" /></IconButton></Tooltip>}
          <Tooltip title={t('copyLinkTooltip')}><IconButton aria-label={t('copyLinkAria')} onClick={() => void handleCopyLink()}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
        </Stack>}
        {canEdit && <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <Button size="large" variant="contained" onClick={() => setAddOpen(true)} disabled={pending || !itemsLoaded || readFailed}>{t('addGift')}</Button>
          <Button variant="outlined" startIcon={<ShareIcon />} onClick={() => void handleShare()} disabled={pending}>{t('share')}</Button>
        </Stack>}
        {(!itemsLoaded && !demo && !itemsError) ? <Skeleton height={100} data-testid="items-skeleton" /> : <List>
          {items.map(item => {
            const claimed = actualClaimed(item);
            return <WishListItemRow key={item.id} item={{ ...item, claimed }} canEdit={canEdit} isDemo={isExampleWishlist}
              onRowClick={() => { if (pending || (!canEdit && claimed)) return; if (canEdit) void handleClaim(item); else setClaimItem(item); }}
              onEditClick={() => setEditItem(item)} onDeleteClick={() => setDeleteItem(item)} />;
          })}
        </List>}
        {(isExampleWishlist || !canEdit) && <Box sx={{ mt: 2, mb: 4 }}>
          <Button variant="outlined" onClick={() => void handleCreate(isExampleWishlist)} disabled={Boolean(signInLoading || authLoading || isExampleWishlist && (!itemsLoaded || readFailed))} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {signInLoading ? t('signingIn') : isExampleWishlist ? t('useExample') : t('createMyWishlist')}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t('guestCreateHint')}</Typography>
        </Box>}
      </>}
    </Container>

    <ConfirmDialog open={Boolean(deleteItem)} title={t('confirmDeleteTitle', { name: deleteItem?.name ?? '' })} description={notice ?? undefined}
      onClose={() => setDeleteItem(null)} onConfirm={handleDelete} confirmText={t('delete')} cancelText={t('cancel')} destructive loading={pending} />
    <ConfirmDialog open={Boolean(claimItem)} title={t('confirmClaimTitle', { name: claimItem?.name ?? '' })} description={notice ?? undefined}
      onClose={() => setClaimItem(null)} onConfirm={() => claimItem ? handleClaim(claimItem) : undefined} confirmText={t('yes')} cancelText={t('no')} loading={pending} />
    <AddItemDialog open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
    <AddItemDialog open={Boolean(editItem)} onClose={() => setEditItem(null)} onSubmit={handleEdit} initialValues={editItem ?? undefined} />
    <CreateWishListDialog open={createOpen} onClose={() => setCreateOpen(false)} user={user ? { uid: user.uid } : null}
      initialTitle={copyExample || copyShared ? wishlist?.title : undefined} copyItems={copyExample || copyShared ? items : undefined} copyMethod={copyShared ? 'shared_copy' : 'demo_copy'} source={copyExample ? 'demo' : 'guest_list'} />
    <Snackbar open={copySnackOpen} onClose={() => setCopySnackOpen(false)} autoHideDuration={2000} message={t('linkCopied')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
  </>;
}
