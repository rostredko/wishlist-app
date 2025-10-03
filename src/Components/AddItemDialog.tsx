import {useEffect, useMemo, useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import {useTranslation} from 'react-i18next';

type GiftValues = { name: string; description?: string; link?: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: GiftValues) => void;
  initialValues?: { name?: string | null; description?: string | null; link?: string | null };
};

const AddItemDialog = ({open, onClose, onSubmit, initialValues}: Props) => {
  const {t} = useTranslation('addItem');

  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [link, setLink] = useState(initialValues?.link ?? '');
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialValues?.name ?? '');
    setDescription(initialValues?.description ?? '');
    setLink(initialValues?.link ?? '');
    setLinkError(null);
  }, [open, initialValues?.name, initialValues?.description, initialValues?.link]);

  const isEdit = Boolean(initialValues);

  const reset = () => {
    setName('');
    setDescription('');
    setLink('');
    setLinkError(null);
  };

  const ensureProtocol = (value: string): string => {
    if (!value) return value;
    if (/^https?:\/\//i.test(value)) return value;
    if (/^[\w-]+(\.[\w-]+)+/i.test(value)) return `https://${value}`;
    return value;
  };

  const isValidHttpUrl = (value: string): boolean => {
    try {
      const test = ensureProtocol(value.trim());
      if (!test) return false;
      const u = new URL(test);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateLinkLive = (value: string) => {
    const v = value.trim();
    if (!v) {
      setLinkError(null);
      return true;
    }
    if (isValidHttpUrl(v)) {
      setLinkError(null);
      return true;
    }
    setLinkError(t('linkError'));
    return false;
  };

  const handleConfirm = () => {
    const _name = name.trim();
    if (!_name) return;

    const _description = description.trim();
    const _linkRaw = link.trim();

    let _link: string = _linkRaw;
    if (_linkRaw) {
      if (!isValidHttpUrl(_linkRaw)) {
        setLinkError(t('linkError'));
        return;
      }
      _link = ensureProtocol(_linkRaw);
    }

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

  const canSubmit = useMemo(() => {
    const hasName = !!name.trim();
    const linkOk = !link.trim() || isValidHttpUrl(link.trim());
    return hasName && linkOk;
  }, [name, link]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{px: 3, pt: 2, pb: 2}}>
        {isEdit ? t('titleEdit') : t('titleAdd')}
      </DialogTitle>
      <DialogContent sx={{px: 3, pt: 2, pb: 0}}>
        <Stack spacing={2}>
          <TextField
            label={t('labelName')}
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
            label={t('labelDesc')}
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label={t('labelLink')}
            fullWidth
            value={link}
            onChange={(e) => {
              const v = e.target.value;
              setLink(v);
              validateLinkLive(v);
            }}
            onBlur={(e) => validateLinkLive(e.target.value)}
            placeholder={t('placeholderLink')}
            error={!!linkError}
            helperText={linkError ?? t('linkHelper')}
            slotProps={{
              input: {
                inputMode: 'url',
              },
            }}
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
          {t('cancel')}
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!canSubmit}>
          {isEdit ? t('save') : t('add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;