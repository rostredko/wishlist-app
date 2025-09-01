import {useEffect, useMemo, useState, useCallback} from 'react';
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

type Props = {
  open: boolean;
  onClose: () => void;
  user: { uid: string } | null;
};

export function CreateWishListDialog({open, onClose, user}: Props) {
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setTitle('');
      setIsCreating(false);
    }
  }, [open]);

  const canCreate = useMemo(
    () => !!user && !!title.trim() && !isCreating,
    [user, title, isCreating],
  );

  const safeClose = useCallback(() => {
    setTitle('');
    onClose();
  }, [onClose]);

  const handleCreate = useCallback(async () => {
    if (!user) return;
    const name = title.trim();
    if (!name || isCreating) return;

    try {
      setIsCreating(true);
      const id = await createWishlist(name, user.uid);
      safeClose();
      navigate(`/wishlist/${id}`);
    } catch (e) {
      console.error(e);
      setIsCreating(false);
    }
  }, [user, title, isCreating, safeClose, navigate]);

  return (
    <Dialog
      open={open}
      onClose={isCreating ? undefined : safeClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{px: 3, pt: 3, pb: 3}}>New wishlist</DialogTitle>

      <DialogContent sx={{px: 3, pt: 2, pb: 0}}>
        <TextField
          autoFocus
          label="Wishlist name"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canCreate) {
              e.preventDefault();
              void handleCreate();
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
          disabled={!canCreate}
          variant="contained"
        >
          {isCreating ? 'Creating…' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}