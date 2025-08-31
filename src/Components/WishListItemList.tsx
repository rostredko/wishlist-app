import {useEffect, useState} from 'react';
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
} from '@api/wishListService.ts';

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

export function WishListItemList() {
  const [items, setItems] = useState<WishListItem[]>([]);
  const [wishlist, setWishlist] = useState<WishList | null>(null);
  const [status, setStatus] = useState<PageStatus>('loading');

  const {user, isAdmin} = useAuth();
  const {wishlistId} = useParams();
  const navigate = useNavigate();

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

  const canEdit: boolean =
    status === 'found' &&
    ((isAdmin ?? false) || (user ? wishlist?.ownerUid === user.uid : false));

  const handleClaimToggle = async (item: WishListItem) => {
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
  };

  const handleAddItem = async (item: { name: string; description?: string; link?: string }) => {
    try {
      if (!wishlistId) return;
      await addGiftItem(wishlistId, item);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = async (values: { name: string; description?: string; link?: string }) => {
    try {
      if (!wishlistId || !selection.itemToEdit) return;
      await updateGiftItem(wishlistId, selection.itemToEdit.id, values);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!wishlistId) return;
      await deleteGiftItem(wishlistId, id);
    } catch (error) {
      console.error('Error while deleting the gift:', error);
    }
  };

  const handleSaveTitle = async () => {
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
  };

  const handleBannerUpload = (newUrl: string) => {
    const delimiter = newUrl.includes('?') ? '&' : '?';
    setWishlist((prev) =>
      prev ? {...prev, bannerImage: `${newUrl}${delimiter}t=${Date.now()}`} : prev
    );
  };

  useEffect(() => {
    if (!wishlistId) return;

    const DEFAULT_WISHLIST_ID = import.meta.env.VITE_DEFAULT_WISHLIST_ID;
    if (wishlistId === 'default') {
      navigate(`/wishlist/${DEFAULT_WISHLIST_ID}`, {replace: true});
      return;
    }

    const unsub = subscribeWishlistItems(wishlistId, (list) => setItems(list));
    return unsub;
  }, [wishlistId, navigate]);

  useEffect(() => {
    const fetchWishlistData = async () => {
      if (!wishlistId || wishlistId === 'default') return;
      setStatus('loading');

      const result = await getWishlistById(wishlistId);

      if (result) {
        setWishlist(result);
        setTitleState((t) => ({...t, current: result.title || 'Unnamed Wishlist'}));
        setStatus('found');
      } else {
        setWishlist(null);
        setTitleState((t) => ({...t, current: 'Wishlist not found'}));
        setStatus('not_found');
      }
    };

    fetchWishlistData();
  }, [wishlistId]);

  return (
    <>
      {status === 'loading' ? (
        <Skeleton data-testid="skeleton" variant="rectangular" height={200}/>
      ) : status === 'found' && wishlist ? (
        <WishlistHeader wishlist={wishlist} canEdit={canEdit} onBannerUpload={handleBannerUpload}/>
      ) : (
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
      )}

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
        ) : (
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
        )}

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
                <Paper
                  key={item.id}
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
                      onClick={() => {
                        if (isLockedForGuest) return;
                        if (canEdit) {
                          handleClaimToggle(item);
                        } else if (!item.claimed) {
                          setSelection((s) => ({...s, selectedItem: item}));
                          setDialogs((d) => ({...d, claimConfirmOpen: true}));
                        }
                      }}
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
                              {item.link && (
                                <>
                                  <MuiLink
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="primary"
                                    underline="hover"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Link
                                  </MuiLink>
                                  <br/>
                                </>
                              )}

                              {item.description && (
                                <Typography variant="body2" color="text.secondary" component="span">
                                  {item.description}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </Box>

                      {canEdit && (
                        <Box sx={{display: 'flex', gap: 0.5, ml: 1}}>
                          <IconButton
                            size="small"
                            aria-label={`Edit ${item.name ?? 'item'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelection((s) => ({...s, itemToEdit: item}));
                              setDialogs((d) => ({...d, editItemOpen: true}));
                            }}
                          >
                            <EditIcon sx={{fontSize: 18, color: '#bbb'}}/>
                          </IconButton>

                          <IconButton
                            size="small"
                            aria-label="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelection((s) => ({...s, itemToDelete: item}));
                              setDialogs((d) => ({...d, deleteConfirmOpen: true}));
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
        onSubmit={async (v) => {
          await handleEditItem(v);
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