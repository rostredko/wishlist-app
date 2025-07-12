import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { WishListItem } from '../types/WishListItem';
import { CustomCheckbox } from './CustomCheckbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../hooks/useAuth.ts';
import ConfirmDialog from './ConfirmDialog.tsx';
import AddItemDialog from './AddItemDialog.tsx';
import confetti from 'canvas-confetti';
import GiftLogo from '/public/favicon.png';
import EditIcon from '@mui/icons-material/Edit';
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
  Button
} from '@mui/material';
import type { WishList } from '../types/WishList.ts';
import { CreateWishListDialog } from './CreateWishlistDialog.tsx';

export function WishListItemList() {
  const [items, setItems] = useState<WishListItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WishListItem | null>(null);
  const [claimConfirmOpen, setClaimConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<WishListItem | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [wishlistTitle, setWishlistTitle] = useState('');
  const [createWishlistDialogOpen, setCreateWishlistDialogOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [wishlist, setWishlist] = useState<WishList | null>(null);
  const {user, isAdmin} = useAuth();
  const { wishlistId } = useParams();
  const navigate = useNavigate();
  const canEdit = user && wishlist?.ownerUid === user.uid || isAdmin;

  const handleClaimToggle = async (item: WishListItem) => {
    try {
      if (!canEdit && item.claimed) {
        console.warn('Gift already claimed. Guests cannot unclaim.');
        return;
      }

      if (!wishlistId) return;

      const itemRef = doc(db, 'wishlists', wishlistId, 'items', item.id);
      await updateDoc(itemRef, { claimed: !item.claimed });

      if (!canEdit && !item.claimed) {
        confetti({
          particleCount: 200,
          spread: 120,
          gravity: 0.8
        });
      }
    } catch (error) {
      console.error('Claim toggle error:', error);
    }
  };

  const handleAddItem = async (item: { name: string; description?: string; link?: string }) => {
    try {
      if (!wishlistId) return;

      await addDoc(collection(db, 'wishlists', wishlistId, 'items'), {
        name: item.name,
        description: item.description || '',
        link: item.link || '',
        claimed: false,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!wishlistId) return;

      await deleteDoc(doc(db, 'wishlists', wishlistId, 'items', id));
    } catch (error) {
      console.error('Error while deleting the gift:', error);
    }
  };

  const handleSaveTitle = async () => {
    if (newTitle.trim() === wishlistTitle) {
      setIsEditingTitle(false);
      return;
    }

    try {
      const wishlistRef = doc(db, 'wishlists', wishlistId!);
      await updateDoc(wishlistRef, { title: newTitle });
      setWishlistTitle(newTitle);
    } catch (error) {
      console.error('Error updating title:', error);
    } finally {
      setIsEditingTitle(false);
    }
  };

  useEffect(() => {
    if (!wishlistId) return;

    if (wishlistId === 'default') {
      const fetchAndRedirect = async () => {
        const wishlistsRef = collection(db, 'wishlists');
        const snapshot = await getDocs(wishlistsRef);

        if (!snapshot.empty) {
          const visibleWishlist = snapshot.docs.find(doc => !doc.data().isHidden);

          if (visibleWishlist) {
            navigate(`/wishlist/${visibleWishlist.id}`, { replace: true });
          }
        }
      };

      fetchAndRedirect();
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'wishlists', wishlistId, 'items'),
      (snapshot) => {
        const result: WishListItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WishListItem[];

        setItems(result);
      }
    );

    return () => unsubscribe();
  }, [wishlistId]);

  useEffect(() => {
    const fetchTitle = async () => {
      if (!wishlistId || wishlistId === 'default') return;

      const wishlistDocRef = doc(db, 'wishlists', wishlistId);
      const snapshot = await getDoc(wishlistDocRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as WishList;
        setWishlist(data);
        setWishlistTitle(data.title || 'Unnamed Wishlist');
      } else {
        setWishlistTitle('Wishlist not found');
      }
    };

    fetchTitle();
  }, [wishlistId]);

  return (
    <>
      <Container maxWidth="sm" sx={{mt: 6}}>
        <img src={GiftLogo} alt="WishList Logo" width={80} height={80} style={{marginTop: 10}} />
        <Typography variant="h2" gutterBottom>
          MyWishList App
        </Typography>
        {user && (
          <Button
            variant="outlined"
            sx={{mb: 1, mt: 2}}
            onClick={() => setCreateWishlistDialogOpen(true)}
          >
            ➕ Create new wishlist
          </Button>
        )}
        {isEditingTitle ? (
          <TextField
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
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
            <Typography variant="h3" gutterBottom onClick={() => {
              if (canEdit) {
                setNewTitle(wishlistTitle);
                setIsEditingTitle(true);
              }
            }} sx={{ cursor: canEdit ? 'pointer' : 'default' }}>
              {wishlistTitle}
              {canEdit && <EditIcon sx={{ ml: 1, fontSize: 25, color: 'gray' }} />}
            </Typography>
          </Box>
        )}
        {wishlist && canEdit && (
          <Button
            variant="contained"
            sx={{mb: 1, mt: 2, mr: 2}}
            onClick={() => setAddDialogOpen(true)}
          >
            ➕ Add Gift
          </Button>
        )}
        <List>
          {items.map((item) => (
            <Paper key={item.id}
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
                        setItemToDelete(item);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon sx={{color: '#999'}}/>
                    </IconButton>
                  )
                }
              >
                <ListItemButton
                  onClick={() => {
                    if (canEdit) {
                      handleClaimToggle(item);
                    } else if (!item.claimed) {
                      setSelectedItem(item);
                      setClaimConfirmOpen(true);
                    }
                  }}
                  disabled={!canEdit && item.claimed}
                  sx={{
                    borderRadius: '15px',
                    '&:hover': {
                      backgroundColor: '#3d3d3d'
                    }
                  }}
                >
                  <CustomCheckbox
                    checked={item.claimed}
                    disabled
                    icon={<RadioButtonUncheckedIcon/>}
                    checkedIcon={<CheckCircleIcon/>}
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
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="span"
                          >
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
        open={deleteConfirmOpen}
        title={`Confirm deletion of "${itemToDelete?.name}"?`}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={() => {
          if (!itemToDelete) return;

          handleDelete(itemToDelete.id);
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={claimConfirmOpen}
        title={`Confirm to take "${selectedItem?.name}"?`}
        onClose={() => {
          setClaimConfirmOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={() => {
          if (selectedItem) {
            handleClaimToggle(selectedItem);
          }
          setClaimConfirmOpen(false);
          setSelectedItem(null);
        }}
        confirmText="Yes"
        cancelText="No"
      />

      <AddItemDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddItem}
      />

      <CreateWishListDialog
        open={createWishlistDialogOpen}
        onClose={() => setCreateWishlistDialogOpen(false)}
        user={user}
      />
    </>
  );
}