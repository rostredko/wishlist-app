import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import {createWishlist} from '@api/wishListService.ts';

export function CreateWishListDialog({
                                       open,
                                       onClose,
                                       user,
                                     }: {
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
      const id = await createWishlist(name, user.uid);
      safeClose();
      navigate(`/wishlist/${id}`);
    } catch (e) {
      console.error('Failed to create wishlist', e);
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onClose={safeClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{px: 3, pt: 3, pb: 3}}>New wishlist</DialogTitle>

      <DialogContent sx={{px: 3, pt: 2, pb: 0}}>
        <TextField
          autoFocus
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

      <DialogActions sx={{px: 3, py: 3}}>
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