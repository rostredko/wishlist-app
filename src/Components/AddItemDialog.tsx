import {useEffect, useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';

type GiftValues = { name: string; description?: string; link?: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: GiftValues) => void;
  initialValues?: { name?: string | null; description?: string | null; link?: string | null };
};

const AddItemDialog = ({open, onClose, onSubmit, initialValues}: Props) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [link, setLink] = useState(initialValues?.link ?? '');

  useEffect(() => {
    setName(initialValues?.name ?? '');
    setDescription(initialValues?.description ?? '');
    setLink(initialValues?.link ?? '');
  }, [open, initialValues?.name, initialValues?.description, initialValues?.link]);

  const isEdit = Boolean(initialValues);

  const reset = () => {
    setName('');
    setDescription('');
    setLink('');
  };

  const handleConfirm = () => {
    const _name = name.trim();
    if (!_name) return;
    const _description = description.trim();
    const _link = link.trim();

    const payload: GiftValues = {name: _name};
    if (isEdit) {
      payload.description = _description;
      payload.link = _link;
    } else {
      if (_description) payload.description = _description;
      if (_link) payload.link = _link;
    }

    onSubmit(payload);
    if (!isEdit) reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{px: 3, pt: 2, pb: 0}}>
        {isEdit ? 'Edit gift' : 'Add your desired gift'}
      </DialogTitle>
      <DialogContent sx={{px: 3, pt: 2, pb: 0}}>
        <Stack spacing={2}>
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
      <DialogActions sx={{px: 3, py: 2}}>
        <Button
          onClick={() => {
            if (!isEdit) reset();
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!name.trim()}>
          {isEdit ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;
