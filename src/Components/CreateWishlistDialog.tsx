import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Checkbox, FormControlLabel
} from '@mui/material';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase.ts';
import { useNavigate } from 'react-router-dom';

export function CreateWishListDialog({ open, onClose, user }: {
  open: boolean;
  onClose: () => void;
  user: { uid: string } | null;
}) {
  const [title, setTitle] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, 'wishlists'), {
      title,
      isHidden,
      bannerImage: '',
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
    });

    onClose(); // Закрываем модалку
    navigate(`/wishlist/${docRef.id}`);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Новий вишлист</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Wishlist name"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isHidden}
              onChange={(e) => setIsHidden(e.target.checked)}
            />
          }
          label="Make it hidden for now"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!title.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}