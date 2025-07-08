import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: { name: string; description?: string; link?: string }) => void;
};

const AddItemDialog = ({ open, onClose, onSubmit }: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  const handleConfirm = () => {
    if (!name.trim()) return;
    onSubmit({ name, description, link });
    setName('');
    setDescription('');
    setLink('');
    onClose();
  };

  return (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
    >
      <DialogTitle>Add your desired gift</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="What is it?"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description (not required)"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Link (not required)"
            fullWidth
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;