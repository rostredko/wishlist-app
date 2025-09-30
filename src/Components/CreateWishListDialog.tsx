import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import {createWishlist} from '@api/wishListService';

type Props = {
  open: boolean;
  onClose: () => void;
  user: { uid: string } | null;
};

export function CreateWishListDialog({open, onClose, user}: Props) {
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const safeClose = useCallback(() => {
    setTitle('');
    setIsCreating(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setIsCreating(false);
    }
  }, [open]);

  const canCreate = useMemo(
    () => Boolean(user) && title.trim().length > 0 && !isCreating,
    [user, title, isCreating],
  );

  const handleCreate = useCallback(async () => {
    if (!user) return;
    const name = title.trim();
    if (!name || isCreating) return;

    try {
      setIsCreating(true);
      const id = await createWishlist(name, user.uid);

      const g = (typeof window !== 'undefined' ? (window as any).gtag : undefined) as
        | ((...args: any[]) => void)
        | undefined;
      if (g) {
        g('event', 'wishlist_create', {
          event_category: 'engagement',
          event_label: name,
          wishlist_id: id,
          user_id: user.uid,
        });
      }

      safeClose();
      navigate(`/wishlist/${id}`);
    } catch (e) {
      console.error('Failed to create wishlist', e);
      setIsCreating(false);
    }
  }, [user, title, isCreating, navigate, safeClose]);

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      onClose={isCreating ? undefined : safeClose}
      aria-labelledby="create-wishlist"
    >
      <DialogTitle id="create-wishlist" sx={{px: 3, pt: 2}}>
        New wishlist
      </DialogTitle>

      <DialogContent sx={{px: 3, pt: 2}}>
        <Stack spacing={2}>
          <TextField
            label="Wishlist name"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            fullWidth
            disabled={isCreating}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCreate();
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{px: 3, pb: 2}}>
        <Button onClick={safeClose} disabled={isCreating}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained" disabled={!canCreate}>
          {isCreating ? 'Creating…' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}