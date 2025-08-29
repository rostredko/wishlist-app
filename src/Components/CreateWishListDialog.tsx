import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { createWishlist } from '@api/wishlistService';

export function CreateWishListDialog({open, onClose, user}: {
  open: boolean;
  onClose: () => void;
  user: { uid: string } | null;
}) {
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const safeClose = () => {
    setTitle('');
    onClose();
  };

  const handleCreate = async () => {
    if (!user) return;
    const name = title.trim();
    if (!name || isCreating) return;

    try {
      setIsCreating(true);
      const id = await createWishlist(name, user.uid); // сервис
      safeClose();
      navigate(`/wishlist/${id}`);
    } catch (e) {
      console.error('Failed to create wishlist', e);
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onClose={safeClose} fullWidth maxWidth="sm">
      <DialogTitle>New wishlist</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Wishlist name"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={safeClose} disabled={isCreating}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={!title.trim() || !user || isCreating}
          variant="contained"
        >
          {isCreating ? 'Creating…' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}