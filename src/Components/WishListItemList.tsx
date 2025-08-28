import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { WishListItem } from '../types/WishListItem';
import type { WishList } from '../types/WishList';
import { CustomCheckbox } from './CustomCheckbox';
import confetti from 'canvas-confetti';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../hooks/useAuth';
import ConfirmDialog from './ConfirmDialog';
import AddItemDialog from './AddItemDialog';
import { CreateWishListDialog } from './CreateWishlistDialog';
import WishlistHeader from './WishListHeader';
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
} from '@mui/material';
import {
  getWishlistById,
  addGiftItem,
  deleteGiftItem,
  updateWishlistTitle,
  toggleGiftClaimStatus,
} from '../services/wishlistService';

type DialogsState = {
  claimConfirmOpen: boolean;
  deleteConfirmOpen: boolean;
  addItemOpen: boolean;
  createWishlistOpen: boolean;
};

type SelectionState = {
  selectedItem: WishListItem | null;
  itemToDelete: WishListItem | null;
};

type TitleState = {
  current: string;
  draft: string;
  isEditing: boolean;
};

export function WishListItemList() {
  const [items, setItems] = useState<WishListItem[]>([]);
  const [wishlist, setWishlist] = useState<WishList | null>(null);

  const { user, isAdmin } = useAuth();
  const { wishlistId } = useParams();
  const navigate = useNavigate();

  const [dialogs, setDialogs] = useState<DialogsState>({
    claimConfirmOpen: false,
    deleteConfirmOpen: false,
    addItemOpen: false,
    createWishlistOpen: false,
  });

  const [selection, setSelection] = useState<SelectionState>({
    selectedItem: null,
    itemToDelete: null,
  });

  const [titleState, setTitleState] = useState<TitleState>({
    current: '',
    draft: '',
    isEditing: false,
  });

  // строго boolean: сначала проверяем наличие user
  const canEdit: boolean =
    (isAdmin ?? false) || (user ? wishlist?.ownerUid === user.uid : false);

  const handleClaimToggle = async (item: WishListItem) => {
    try {
      if (!canEdit && item.claimed) {
        console.warn('Gift already claimed. Guests cannot unclaim.');
        return;
      }
      if (!wishlistId) return;

      await toggleGiftClaimStatus(wishlistId, item.id, item.claimed);

      if (!canEdit && !item.claimed) {
        confetti({ particleCount: 200, spread: 120, gravity: 0.8 });
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
      setTitleState((t) => ({ ...t, isEditing: false }));
      return;
    }

    try {
      if (!wishlistId) return;
      await updateWishlistTitle(wishlistId, titleState.draft);
      setTitleState((t) => ({ ...t, current: titleState.draft, isEditing: false }));
    } catch (error) {
      console.error('Error updating title:', error);
      setTitleState((t) => ({ ...t, isEditing: false }));
    }
  };

  const handleBannerUpload = (newUrl: string) => {
    const delimiter = newUrl.includes('?') ? '&' : '?';
    setWishlist((prev) =>
      prev ? { ...prev, bannerImage: `${newUrl}${delimiter}t=${Date.now()}` } : prev,
    );
  };

  useEffect(() => {
    if (!wishlistId) return;

    const DEFAULT_WISHLIST_ID = import.meta.env.VITE_DEFAULT_WISHLIST_ID;
    if (wishlistId === 'default') {
      navigate(`/wishlist/${DEFAULT_WISHLIST_ID}`, { replace: true });
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'wishlists', wishlistId, 'items'), (snapshot) => {
      const result: WishListItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WishListItem[];

      setItems(result);
    });

    return () => unsubscribe();
  }, [wishlistId, navigate]);

  useEffect(() => {
    const fetchWishlistData = async () => {
      if (!wishlistId || wishlistId === 'default') return;
      const result = await getWishlistById(wishlistId);

      if (result) {
        setWishlist(result);
        setTitleState((t) => ({ ...t, current: result.title || 'Unnamed Wishlist' }));
      } else {
        setTitleState((t) => ({ ...t, current: 'Wishlist not found' }));
      }
    };

    fetchWishlistData();
  }, [wishlistId]);

  return (
    <>
      {wishlist === null ? (
        <Skeleton variant="rectangular" height={200} />
      ) : (
        <WishlistHeader wishlist={wishlist} canEdit={canEdit} onBannerUpload={handleBannerUpload} />
      )}

      <Container maxWidth="sm">
        {user && (
          <Button
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={() => setDialogs((d) => ({ ...d, createWishlistOpen: true }))}
          >
            ➕ Create new wishlist
          </Button>
        )}

        {titleState.isEditing ? (
          <TextField
            value={titleState.draft}
            onChange={(e) => setTitleState((t) => ({ ...t, draft: e.target.value }))}
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
              sx: {
                fontSize: '2.5rem',
                color: 'inherit',
                padding: 0,
                backgroundColor: 'transparent',
              },
            }}
            sx={{ mt: 3 }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            <Typography
              variant="h3"
              gutterBottom
              onClick={() => {
                if (canEdit) {
                  setTitleState((t) => ({ ...t, draft: titleState.current, isEditing: true }));
                }
              }}
              sx={{ cursor: canEdit ? 'pointer' : 'default' }}
            >
              {titleState.current}
              {canEdit && <EditIcon sx={{ ml: 1, fontSize: 25, color: 'gray' }} />}
            </Typography>
          </Box>
        )}

        {wishlist && canEdit && (
          <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => setDialogs((d) => ({ ...d, addItemOpen: true }))}
          >
            ➕ Add Gift
          </Button>
        )}

        <List>
          {items.map((item) => (
            <Paper
              key={item.id}
              sx={{
                mb: 2,
                p: 1,
                borderRadius: 3,
                border: '1px solid #2c2c2c',
                boxShadow: 'none',
                transition: 'background-color 0.2s ease, transform 0.2s ease',
                '&:hover': {
                  backgroundColor: '#2a2a2a',
                  transform: 'scale(1.02)',
                },
              }}
            >
              <ListItem
                disablePadding
                secondaryAction={
                  canEdit && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setSelection((s) => ({ ...s, itemToDelete: item }));
                        setDialogs((d) => ({ ...d, deleteConfirmOpen: true }));
                      }}
                    >
                      <DeleteIcon sx={{ color: '#999' }} />
                    </IconButton>
                  )
                }
              >
                <ListItemButton
                  onClick={() => {
                    if (canEdit) {
                      handleClaimToggle(item);
                    } else if (!item.claimed) {
                      setSelection((s) => ({ ...s, selectedItem: item }));
                      setDialogs((d) => ({ ...d, claimConfirmOpen: true }));
                    }
                  }}
                  disabled={!canEdit && item.claimed}
                  sx={{
                    borderRadius: '15px',
                    '&:hover': {
                      backgroundColor: '#3d3d3d',
                    },
                  }}
                >
                  <CustomCheckbox
                    checked={item.claimed}
                    disabled
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
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
                            <br />
                          </>
                        )}

                        {item.description && (
                          <Typography variant="body2" color="textSecondary" component="span">
                            {item.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Container>

      <ConfirmDialog
        open={dialogs.deleteConfirmOpen}
        title={`Confirm deletion of "${selection.itemToDelete?.name}"?`}
        onClose={() => {
          setDialogs((d) => ({ ...d, deleteConfirmOpen: false }));
          setSelection((s) => ({ ...s, itemToDelete: null }));
        }}
        onConfirm={() => {
          if (!selection.itemToDelete) return;
          handleDelete(selection.itemToDelete.id);
          setDialogs((d) => ({ ...d, deleteConfirmOpen: false }));
          setSelection((s) => ({ ...s, itemToDelete: null }));
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={dialogs.claimConfirmOpen}
        title={`Confirm to take "${selection.selectedItem?.name}"?`}
        onClose={() => {
          setDialogs((d) => ({ ...d, claimConfirmOpen: false }));
          setSelection((s) => ({ ...s, selectedItem: null }));
        }}
        onConfirm={() => {
          if (selection.selectedItem) {
            handleClaimToggle(selection.selectedItem);
          }
          setDialogs((d) => ({ ...d, claimConfirmOpen: false }));
          setSelection((s) => ({ ...s, selectedItem: null }));
        }}
        confirmText="Yes"
        cancelText="No"
      />

      <AddItemDialog
        open={dialogs.addItemOpen}
        onClose={() => setDialogs((d) => ({ ...d, addItemOpen: false }))}
        onSubmit={handleAddItem}
      />

      <CreateWishListDialog
        open={dialogs.createWishlistOpen}
        onClose={() => setDialogs((d) => ({ ...d, createWishlistOpen: false }))}
        user={user}
      />
    </>
  );
}