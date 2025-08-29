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

  const reset = () => {
    setName('');
    setDescription('');
    setLink('');
  };

  const handleConfirm = () => {
    const _name = name.trim();
    const _description = description.trim();
    const _link = link.trim();
    if (!_name) return;

    onSubmit({ name: _name, description: _description || undefined, link: _link || undefined });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add your desired gift</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="What is it?"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirm();
              }
            }}
          />
          <TextField
            label="Description (optional)"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Link (optional)"
            fullWidth
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com/item"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { reset(); onClose(); }}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!name.trim()}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;