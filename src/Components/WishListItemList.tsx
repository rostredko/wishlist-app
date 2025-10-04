import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import confetti from 'canvas-confetti';
import SEOHead from '@components/SEOHead';
import {useTranslation} from 'react-i18next';

import {useAuth} from '@hooks/useAuth';

import type {WishListItem} from '@models/WishListItem';
import type {WishList} from '@models/WishList';

import CustomCheckbox from '@components/CustomCheckbox';
import ConfirmDialog from '@components/ConfirmDialog';
import AddItemDialog from '@components/AddItemDialog';
import {CreateWishListDialog} from '@components/CreateWishListDialog';
import WishlistHeader from '@components/WishListHeader';

import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
  Box,
  TextField,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Link as MuiLink,
  Paper,
  IconButton,
  Button,
  Skeleton,
  Stack,
  Card,
  CardContent,
  Tooltip,
  Snackbar,
  Menu,
  MenuItem,
  ListItemIcon as MuiListItemIcon,
} from '@mui/material';

import {
  getWishlistById,
  addGiftItem,
  deleteGiftItem,
  updateWishlistTitle,
  toggleGiftClaimStatus,
  subscribeWishlistItems,
  updateGiftItem,
} from '@api/wishListService';

type DialogsState = {
  claimConfirmOpen: boolean;
  deleteConfirmOpen: boolean;
  addItemOpen: boolean;
  createWishlistOpen: boolean;
  editItemOpen: boolean;
};

type SelectionState = {
  selectedItem: WishListItem | null;
  itemToDelete: WishListItem | null;
  itemToEdit: WishListItem | null;
};

type TitleState = {
  current: string;
  draft: string;
  isEditing: boolean;
};

type PageStatus = 'loading' | 'found' | 'not_found';

function useWishlistData(wishlistId: string | undefined) {
  const [items, setItems] = useState<WishListItem[]>([]);
  const [wishlist, setWishlist] = useState<WishList | null>(null);
  const [status, setStatus] = useState<PageStatus>('loading');

  useEffect(() => {
    if (!wishlistId) return;
    const unsub = subscribeWishlistItems(wishlistId, (list) => setItems(list));
    return unsub;
  }, [wishlistId]);

  useEffect(() => {
    const fetchWishlistData = async () => {
      if (!wishlistId) return;
      setStatus('loading');
      const result = await getWishlistById(wishlistId);
      if (result) {
        setWishlist(result);
        setStatus('found');
      } else {
        setWishlist(null);
        setStatus('not_found');
      }
    };
    fetchWishlistData();
  }, [wishlistId]);

  return {items, setItems, wishlist, setWishlist, status, setStatus};
}

function logClickAndOpen(url: string, payload: { id: string; name?: string | null }) {
  const g = (typeof window !== 'undefined' ? (window as any).gtag : undefined) as
    | ((...args: any[]) => void)
    | undefined;

  let opened = false;
  const open = () => {
    if (opened) return;
    opened = true;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (g) {
    try {
      g('event', 'click_gift_link', {
        event_category: 'engagement',
        event_label: payload.name ?? '',
        item_id: payload.id,
        url,
        event_callback: open,
      });
      setTimeout(open, 500);
      return;
    } catch {
    }
  }
  open();
}

type RowProps = {
  item: WishListItem;
  canEdit: boolean;
  onRowClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

const WishListItemRow = memo(function WishListItemRow({
                                                        item,
                                                        canEdit,
                                                        onRowClick,
                                                        onEditClick,
                                                        onDeleteClick,
                                                      }: RowProps) {
  const {t} = useTranslation('wishlist');
  const isLockedForGuest = !canEdit && item.claimed;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);
  const openMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };
  const closeMenu = (
    event?: React.MouseEvent<HTMLElement> | {},
    _reason?: 'escapeKeyDown' | 'backdropClick' | 'tabKeyDown'
  ) => {
    if (event && 'stopPropagation' in event) {
      (event as React.MouseEvent).stopPropagation();
    }
    setMenuAnchor(null);
  };

  const handleGiftClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const url = item.link ?? undefined;
    if (!url) return;
    logClickAndOpen(url, {id: item.id, name: item.name ?? ''});
  };

  return (
    <Paper
      sx={{
        mb: 1.5,
        p: {xs: 0.5, sm: 1},
        borderRadius: 3,
        border: '1px solid #2c2c2c',
        boxShadow: 'none',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
        '&:hover': {backgroundColor: '#2a2a2a', transform: 'scale(1.02)'},
      }}
    >
      <ListItem alignItems="flex-start" sx={{py: {xs: 0.25, sm: 0.5}}}>
        <ListItemButton
          aria-disabled={isLockedForGuest}
          onClick={onRowClick}
          sx={{
            borderRadius: '15px',
            ...(isLockedForGuest ? {opacity: 0.6} : {}),
            '&:hover': {backgroundColor: '#3d3d3d'},
            width: '100%',
            px: {xs: 1, sm: 1.5},
            py: {xs: 0.5, sm: 1},
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              gap: {xs: 0.5, sm: 2},
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Box sx={{flex: '0 0 auto', display: 'flex', alignItems: 'center'}}>
              <CustomCheckbox
                checked={item.claimed}
                disabled
                icon={<RadioButtonUncheckedIcon fontSize="small"/>}
                checkedIcon={<CheckCircleIcon fontSize="small"/>}
              />
            </Box>

            <ListItemText
              sx={{minWidth: 0, flex: '1 1 auto'}}
              primary={
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: item.claimed ? 'line-through' : 'none',
                    color: item.claimed ? 'gray' : 'inherit',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {item.name}
                </Typography>
              }
              secondary={
                <>
                  {item.link ? (
                    <>
                      <MuiLink
                        href={item.link ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        underline="hover"
                        onClick={handleGiftClick}
                      >
                        {t('link')}
                      </MuiLink>
                      <br/>
                    </>
                  ) : null}
                  {item.description ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                      sx={{
                        display: 'block',
                        mt: 0.25,
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {item.description}
                    </Typography>
                  ) : null}
                </>
              }
            />
          </Box>

          {canEdit && (
            <>
              <Box
                sx={{
                  display: {xs: 'none', sm: 'flex'},
                  gap: 0.5,
                  ml: 1,
                  flex: '0 0 auto',
                  alignSelf: 'center',
                }}
              >
                <Tooltip title={t('editTitleTooltip')} arrow>
                  <IconButton
                    size="small"
                    aria-label={t('editAria')}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick();
                    }}
                  >
                    <EditIcon sx={{fontSize: 18, color: '#bbb'}}/>
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('deleteTitleTooltip')} arrow>
                  <IconButton
                    size="small"
                    aria-label={t('deleteAria')}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick();
                    }}
                  >
                    <DeleteIcon sx={{fontSize: 18, color: '#999'}}/>
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{display: {xs: 'flex', sm: 'none'}, ml: 0.25, alignSelf: 'center'}}>
                <IconButton
                  size="small"
                  aria-label={t('moreActionsAria', {defaultValue: 'More actions'})}
                  onClick={openMenu}
                >
                  <MoreVertIcon sx={{fontSize: 18, color: '#aaa'}}/>
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={menuOpen}
                  onClose={closeMenu}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                  transformOrigin={{vertical: 'top', horizontal: 'right'}}
                >
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      closeMenu(e);
                      onEditClick();
                    }}
                  >
                    <MuiListItemIcon>
                      <EditIcon fontSize="small"/>
                    </MuiListItemIcon>
                    {t('editTitleTooltip')}
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      closeMenu(e);
                      onDeleteClick();
                    }}
                  >
                    <MuiListItemIcon>
                      <DeleteIcon fontSize="small"/>
                    </MuiListItemIcon>
                    {t('deleteTitleTooltip')}
                  </MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </ListItemButton>
      </ListItem>
    </Paper>
  );
});

type RouteLang = 'ua' | 'en';
const toSeoLang = (lng: RouteLang): 'uk' | 'en' => (lng === 'ua' ? 'uk' : 'en');

export function WishListItemList() {
  const {t, i18n} = useTranslation('wishlist');
  const {user, isAdmin} = useAuth();
  const {wishlistId, lng} = useParams();
  const routeLang = (lng === 'ua' || lng === 'en' ? lng : 'en') as RouteLang;
  const navigate = useNavigate();

  useEffect(() => {
    if (i18n.language !== routeLang) i18n.changeLanguage(routeLang).catch(() => {
    });
  }, [routeLang, i18n]);

  useEffect(() => {
    if (!wishlistId) return;
    const DEFAULT_WISHLIST_ID = import.meta.env.VITE_DEFAULT_WISHLIST_ID;
    if (wishlistId === 'default' && DEFAULT_WISHLIST_ID) {
      navigate(`/${routeLang}/wishlist/${DEFAULT_WISHLIST_ID}`, {replace: true});
    }
  }, [wishlistId, navigate, routeLang]);

  const {items, wishlist, setWishlist, status} = useWishlistData(
    wishlistId && wishlistId !== 'default' ? wishlistId : undefined,
  );

  const [dialogs, setDialogs] = useState<DialogsState>({
    claimConfirmOpen: false,
    deleteConfirmOpen: false,
    addItemOpen: false,
    createWishlistOpen: false,
    editItemOpen: false,
  });

  const [selection, setSelection] = useState<SelectionState>({
    selectedItem: null,
    itemToDelete: null,
    itemToEdit: null,
  });

  const [titleState, setTitleState] = useState<TitleState>({
    current: '',
    draft: '',
    isEditing: false,
  });

  const [copySnackOpen, setCopySnackOpen] = useState(false);

  useEffect(() => {
    if (status === 'found' && wishlist) {
      setTitleState((tst) => ({...tst, current: wishlist.title || t('unnamed')}));
    }
    if (status === 'not_found') {
      setTitleState((tst) => ({...tst, current: t('notFoundTitle')}));
    }
  }, [status, wishlist, t]);

  const canEdit: boolean = useMemo(
    () =>
      status === 'found' &&
      ((isAdmin ?? false) || (user ? wishlist?.ownerUid === user.uid : false)),
    [status, isAdmin, user, wishlist],
  );

  const handleClaimToggle = useCallback(
    async (item: WishListItem) => {
      try {
        if (!canEdit && item.claimed) return;
        if (!wishlistId) return;
        await toggleGiftClaimStatus(wishlistId, item.id, item.claimed);
        if (!canEdit && !item.claimed) {
          confetti({particleCount: 200, spread: 120, gravity: 0.8});
        }
      } catch (error) {
        console.error('Claim toggle error:', error);
      }
    },
    [canEdit, wishlistId],
  );

  const handleAddItem = useCallback(
    async (item: { name: string; description?: string; link?: string }) => {
      try {
        if (!wishlistId) return;
        await addGiftItem(wishlistId, item);

        const g = (typeof window !== 'undefined' ? (window as any).gtag : undefined) as
          | ((...args: any[]) => void)
          | undefined;
        if (g) {
          g('event', 'wishlist_item_add', {
            event_category: 'engagement',
            event_label: item.name,
            wishlist_id: wishlistId,
            item_name: item.name,
            has_link: Boolean(item.link),
          });
        }
      } catch (error) {
        console.error('Error adding item:', error);
      }
    },
    [wishlistId],
  );

  const handleEditItem = useCallback(
    async (values: { name: string; description?: string; link?: string }) => {
      try {
        if (!wishlistId || !selection.itemToEdit) return;
        await updateGiftItem(wishlistId, selection.itemToEdit.id, values);
      } catch (error) {
        console.error('Error updating item:', error);
      }
    },
    [wishlistId, selection.itemToEdit],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        if (!wishlistId) return;
        await deleteGiftItem(wishlistId, id);
      } catch (error) {
        console.error('Error while deleting the gift:', error);
      }
    },
    [wishlistId],
  );

  const handleSaveTitle = useCallback(async () => {
    if (titleState.draft.trim() === titleState.current) {
      setTitleState((tst) => ({...tst, isEditing: false}));
      return;
    }
    try {
      if (!wishlistId) return;
      await updateWishlistTitle(wishlistId, titleState.draft);
      setTitleState((tst) => ({...tst, current: titleState.draft, isEditing: false}));
    } catch (error) {
      console.error('Error updating title:', error);
      setTitleState((tst) => ({...tst, isEditing: false}));
    }
  }, [wishlistId, titleState.draft, titleState.current]);

  const handleBannerUpload = useCallback((newUrl: string) => {
    const delimiter = newUrl.includes('?') ? '&' : '?';
    setWishlist((prev) =>
      prev ? {...prev, bannerImage: `${newUrl}${delimiter}t=${Date.now()}`} : prev,
    );
  }, [setWishlist]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl =
    typeof window !== 'undefined'
      ? (() => {
        try {
          const u = new URL(window.location.href);
          u.hash = '';
          u.search = '';
          return u.toString();
        } catch {
          return window.location.href;
        }
      })()
      : '';

  const pageTitle =
    status === 'found' && wishlist
      ? `${wishlist.title} - WishList App`
      : status === 'not_found'
        ? `${t('notFoundTitle')} - WishList App`
        : 'WishList App';

  const pageDescription =
    status === 'found' && wishlist
      ? t('pageDescriptionView', {name: wishlist.title})
      : status === 'not_found'
        ? t('pageDescriptionNotFound')
        : t('pageDescriptionLoading');

  const ogImage =
    wishlist && wishlist.bannerImage ? wishlist.bannerImage : `${origin}/og-image.webp`;

  const handleCopyShareLink = useCallback(async () => {
    const shareUrl =
      canonicalUrl ||
      (origin && wishlistId ? `${origin}/${routeLang}/wishlist/${wishlistId}` : '');
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySnackOpen(true);

      const g = (typeof window !== 'undefined' ? (window as any).gtag : undefined) as
        | ((...args: any[]) => void)
        | undefined;
      if (g) {
        g('event', 'wishlist_share_copy', {
          event_category: 'engagement',
          wishlist_id: wishlistId,
          url: shareUrl,
        });
      }
    } catch {
      window.prompt(t('copyFallbackPrompt'), shareUrl);
    }
  }, [canonicalUrl, origin, wishlistId, routeLang, t]);

  const alternates =
    wishlistId && origin
      ? {
        en: `${origin}/en/wishlist/${wishlistId}`,
        uk: `${origin}/ua/wishlist/${wishlistId}`,
      }
      : undefined;

  const itemNames = useMemo(
    () =>
      items
        .map((i) => (i?.name ?? '').trim())
        .filter((n) => n.length > 0),
    [items]
  );

  let headerContent;
  if (status === 'loading') {
    headerContent = <Skeleton variant="rectangular" height={200} data-testid="skeleton"/>;
  } else if (status === 'found' && wishlist) {
    headerContent = (
      <WishlistHeader wishlist={wishlist} canEdit={canEdit} onBannerUpload={handleBannerUpload}/>
    );
  } else {
    headerContent = (
      <Box sx={{height: 200, bgcolor: 'background.default', display: 'flex', alignItems: 'end'}}>
        <Container maxWidth="sm">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{pb: 2}}>
            <Button
              startIcon={<ArrowBackIosNewIcon/>}
              onClick={() => navigate(`/${routeLang}`)}
              variant="outlined"
              size="small"
            >
              {t('backToHome')}
            </Button>
            <Box/>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <SEOHead
        lang={toSeoLang(routeLang)}
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        image={ogImage}
        alternates={alternates}
        structured={{
          website: true,
          webapp: true,
          itemList:
            status === 'found' && wishlist && itemNames.length > 0
              ? {name: wishlist.title || 'Wishlist', items: itemNames}
              : null
        }}
      />

      {headerContent}
      <Container maxWidth="sm">
        {user && (
          <Button
            variant="outlined"
            sx={{mb: 2}}
            onClick={() => setDialogs((d) => ({...d, createWishlistOpen: true}))}
          >
            ➕ {t('createNewWishlist')}
          </Button>
        )}

        {status === 'found' ? (
          titleState.isEditing ? (
            <TextField
              value={titleState.draft}
              onChange={(e) => setTitleState((tst) => ({...tst, draft: e.target.value}))}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveTitle();
                }
              }}
              autoFocus
              fullWidth
              variant="standard"
              slotProps={{
                input: {
                  sx: {
                    fontSize: '2.5rem',
                    color: 'inherit',
                    p: 0,
                    backgroundColor: 'transparent',
                  },
                },
              }}
              sx={{mt: 3, mb: 1.5}}
            />
          ) : (
            <Box
              sx={{
                mt: 2.5,
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box sx={{minWidth: 0, flex: '1 1 auto'}}>
                <Typography
                  variant="h3"
                  gutterBottom
                  onClick={() => {
                    if (canEdit) {
                      setTitleState((tst) => ({...tst, draft: titleState.current, isEditing: true}));
                    }
                  }}
                  sx={{
                    cursor: canEdit ? 'pointer' : 'default',
                    mb: 0,
                    wordBreak: 'break-word',
                  }}
                >
                  {titleState.current}
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: '0 0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  ml: 1,
                }}
              >
                {canEdit && (
                  <Tooltip title={t('editTitleTooltip')} arrow>
                    <IconButton
                      aria-label={t('editTitleAria')}
                      size="small"
                      onClick={() =>
                        setTitleState((tst) => ({...tst, draft: titleState.current, isEditing: true}))
                      }
                      sx={{
                        color: 'text.secondary',
                        opacity: 0.6,
                        '&:hover': {
                          opacity: 1,
                          color: 'text.primary',
                        },
                      }}
                    >
                      <EditIcon fontSize="small"/>
                    </IconButton>
                  </Tooltip>
                )}

                {status === 'found' && wishlist && (
                  <Tooltip title={t('copyLinkTooltip')} arrow>
                    <IconButton
                      aria-label={t('copyLinkAria')}
                      size="small"
                      onClick={handleCopyShareLink}
                      sx={{
                        color: 'text.secondary',
                        opacity: 0.6,
                        '&:hover': {
                          opacity: 1,
                          color: 'text.primary',
                        },
                      }}
                    >
                      <ContentCopyIcon fontSize="small"/>
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          )
        ) : status === 'not_found' ? (
          <Card variant="outlined" sx={{mt: 4, mb: 2}}>
            <CardContent>
              <Typography variant="h4" sx={{fontWeight: 700}}>
                {t('notFoundTitle')}
              </Typography>
              <Typography variant="body2" sx={{mt: 1}} color="text.secondary">
                {t('notFoundText')}
              </Typography>
            </CardContent>
          </Card>
        ) : null}

        {status === 'found' && wishlist && canEdit && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: {xs: 'center', sm: 'flex-start'},
              width: '100%',
              mb: 2,
              mt: 2,
            }}
          >
            <Button
              size="large"
              variant="contained"
              onClick={() => setDialogs((d) => ({...d, addItemOpen: true}))}
              aria-label={t('addGift')}
              sx={{width: {xs: '100%', sm: 'auto'}}}
            >
              ➕ {t('addGift')}
            </Button>
          </Box>
        )}

        {status === 'found' && (
          <List>
            {items.map((item) => {
              const isLockedForGuest = !canEdit && item.claimed;
              return (
                <WishListItemRow
                  key={item.id}
                  item={item}
                  canEdit={canEdit}
                  onRowClick={() => {
                    if (isLockedForGuest) return;
                    if (canEdit) {
                      handleClaimToggle(item);
                    } else if (!item.claimed) {
                      setSelection((s) => ({...s, selectedItem: item}));
                      setDialogs((d) => ({...d, claimConfirmOpen: true}));
                    }
                  }}
                  onEditClick={() => {
                    setSelection((s) => ({...s, itemToEdit: item}));
                    setDialogs((d) => ({...d, editItemOpen: true}));
                  }}
                  onDeleteClick={() => {
                    setSelection((s) => ({...s, itemToDelete: item}));
                    setDialogs((d) => ({...d, deleteConfirmOpen: true}));
                  }}
                />
              );
            })}
          </List>
        )}
      </Container>

      <ConfirmDialog
        open={dialogs.deleteConfirmOpen}
        title={t('confirmDeleteTitle', {name: selection.itemToDelete?.name ?? ''})}
        onClose={() => {
          setDialogs((d) => ({...d, deleteConfirmOpen: false}));
          setSelection((s) => ({...s, itemToDelete: null}));
        }}
        onConfirm={() => {
          if (!selection.itemToDelete) return;
          handleDelete(selection.itemToDelete.id);
          setDialogs((d) => ({...d, deleteConfirmOpen: false}));
          setSelection((s) => ({...s, itemToDelete: null}));
        }}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        destructive
      />

      <ConfirmDialog
        open={dialogs.claimConfirmOpen}
        title={t('confirmClaimTitle', {name: selection.selectedItem?.name ?? ''})}
        onClose={() => {
          setDialogs((d) => ({...d, claimConfirmOpen: false}));
          setSelection((s) => ({...s, selectedItem: null}));
        }}
        onConfirm={() => {
          if (selection.selectedItem) {
            handleClaimToggle(selection.selectedItem);
          }
          setDialogs((d) => ({...d, claimConfirmOpen: false}));
          setSelection((s) => ({...s, selectedItem: null}));
        }}
        confirmText={t('yes')}
        cancelText={t('no')}
      />

      <AddItemDialog
        open={dialogs.addItemOpen}
        onClose={() => setDialogs((d) => ({...d, addItemOpen: false}))}
        onSubmit={handleAddItem}
      />

      <AddItemDialog
        open={dialogs.editItemOpen}
        onClose={() => {
          setDialogs((d) => ({...d, editItemOpen: false}));
          setSelection((s) => ({...s, itemToEdit: null}));
        }}
        onSubmit={async (values) => {
          await handleEditItem(values);
          setDialogs((d) => ({...d, editItemOpen: false}));
          setSelection((s) => ({...s, itemToEdit: null}));
        }}
        initialValues={
          selection.itemToEdit
            ? {
              name: selection.itemToEdit.name ?? '',
              description: selection.itemToEdit.description ?? '',
              link: selection.itemToEdit.link ?? '',
            }
            : undefined
        }
      />

      <CreateWishListDialog
        open={dialogs.createWishlistOpen}
        onClose={() => setDialogs((d) => ({...d, createWishlistOpen: false}))}
        user={user ? {uid: user.uid} : null}
      />

      <Snackbar
        open={copySnackOpen}
        onClose={() => setCopySnackOpen(false)}
        autoHideDuration={2000}
        message={t('linkCopied')}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      />
    </>
  );
}