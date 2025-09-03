import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import confetti from 'canvas-confetti';

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
  const isLockedForGuest = !canEdit && item.claimed;

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
        mb: 2,
        p: 1,
        borderRadius: 3,
        border: '1px solid #2c2c2c',
        boxShadow: 'none',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
        '&:hover': {backgroundColor: '#2a2a2a', transform: 'scale(1.02)'},
      }}
    >
      <ListItem alignItems="flex-start">
        <ListItemButton
          aria-disabled={isLockedForGuest}
          onClick={onRowClick}
          sx={{
            borderRadius: '15px',
            ...(isLockedForGuest ? {opacity: 0.6} : {}),
            '&:hover': {backgroundColor: '#3d3d3d'},
            width: '100%',
            pr: 1.5,
          }}
        >
          <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 2, flexGrow: 1}}>
            <CustomCheckbox
              checked={item.claimed}
              disabled
              icon={<RadioButtonUncheckedIcon fontSize="small"/>}
              checkedIcon={<CheckCircleIcon fontSize="small"/>}
            />
            <ListItemText
              primary={
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: item.claimed ? 'line-through' : 'none',
                    color: item.claimed ? 'gray' : 'inherit',
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
                        Link
                      </MuiLink>
                      <br/>
                    </>
                  ) : null}
                  {item.description ? (
                    <Typography variant="body2" color="text.secondary" component="span">
                      {item.description}
                    </Typography>
                  ) : null}
                </>
              }
            />
          </Box>

          {canEdit && (
            <Box sx={{display: 'flex', gap: 0.5, ml: 1}}>
              <IconButton
                size="small"
                aria-label="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick();
                }}
              >
                <EditIcon sx={{fontSize: 18, color: '#bbb'}}/>
              </IconButton>
              <IconButton
                size="small"
                aria-label="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick();
                }}
              >
                <DeleteIcon sx={{fontSize: 18, color: '#999'}}/>
              </IconButton>
            </Box>
          )}
        </ListItemButton>
      </ListItem>
    </Paper>
  );
});

export function WishListItemList() {
  const {user, isAdmin} = useAuth();
  const {wishlistId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!wishlistId) return;
    const DEFAULT_WISHLIST_ID = import.meta.env.VITE_DEFAULT_WISHLIST_ID;
    if (wishlistId === 'default' && DEFAULT_WISHLIST_ID) {
      navigate(`/wishlist/${DEFAULT_WISHLIST_ID}`, {replace: true});
    }
  }, [wishlistId, navigate]);

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

  useEffect(() => {
    if (status === 'found' && wishlist) {
      setTitleState((t) => ({...t, current: wishlist.title || 'Unnamed Wishlist'}));
    }
    if (status === 'not_found') {
      setTitleState((t) => ({...t, current: 'Wishlist not found'}));
    }
  }, [status, wishlist]);

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
      setTitleState((t) => ({...t, isEditing: false}));
      return;
    }
    try {
      if (!wishlistId) return;
      await updateWishlistTitle(wishlistId, titleState.draft);
      setTitleState((t) => ({...t, current: titleState.draft, isEditing: false}));
    } catch (error) {
      console.error('Error updating title:', error);
      setTitleState((t) => ({...t, isEditing: false}));
    }
  }, [wishlistId, titleState.draft, titleState.current]);

  const handleBannerUpload = useCallback((newUrl: string) => {
    const delimiter = newUrl.includes('?') ? '&' : '?';
    setWishlist((prev) =>
      prev ? {...prev, bannerImage: `${newUrl}${delimiter}t=${Date.now()}`} : prev,
    );
  }, [setWishlist]);

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
              onClick={() => navigate('/')}
              variant="outlined"
              size="small"
            >
              Back to Home
            </Button>
            <Box/>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <>
      {headerContent}
      <Container maxWidth="sm">
        {user && (
          <Button
            variant="outlined"
            sx={{mb: 2}}
            onClick={() => setDialogs((d) => ({...d, createWishlistOpen: true}))}
          >
            ➕ Create new wishlist
          </Button>
        )}

        {status === 'found' ? (
          titleState.isEditing ? (
            <TextField
              value={titleState.draft}
              onChange={(e) => setTitleState((t) => ({...t, draft: e.target.value}))}
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
              InputProps={{
                sx: {fontSize: '2.5rem', color: 'inherit', p: 0, backgroundColor: 'transparent'},
              }}
              sx={{mt: 3}}
            />
          ) : (
            <Box sx={{display: 'flex', alignItems: 'center', mt: 4}}>
              <Typography
                variant="h3"
                gutterBottom
                onClick={() => {
                  if (canEdit) {
                    setTitleState((t) => ({...t, draft: titleState.current, isEditing: true}));
                  }
                }}
                sx={{cursor: canEdit ? 'pointer' : 'default'}}
              >
                {titleState.current}
                {canEdit && <EditIcon sx={{ml: 1, fontSize: 25, color: 'gray'}}/>}
              </Typography>
            </Box>
          )
        ) : status === 'not_found' ? (
          <Card variant="outlined" sx={{mt: 4, mb: 2}}>
            <CardContent>
              <Typography variant="h4" sx={{fontWeight: 700}}>
                Wishlist not found
              </Typography>
              <Typography variant="body2" sx={{mt: 1}} color="text.secondary">
                This wishlist may have been deleted or the link is incorrect.
              </Typography>
            </CardContent>
          </Card>
        ) : null}

        {status === 'found' && wishlist && canEdit && (
          <Button
            variant="contained"
            sx={{mb: 2}}
            onClick={() => setDialogs((d) => ({...d, addItemOpen: true}))}
          >
            ➕ Add Gift
          </Button>
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
        title={`Confirm deletion of "${selection.itemToDelete?.name}"?`}
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
        confirmText="Delete"
        cancelText="Cancel"
        destructive
      />

      <ConfirmDialog
        open={dialogs.claimConfirmOpen}
        title={`Confirm to take "${selection.selectedItem?.name}"?`}
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
        confirmText="Yes"
        cancelText="No"
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
    </>
  );
}