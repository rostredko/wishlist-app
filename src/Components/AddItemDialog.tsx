import {useEffect, useMemo, useRef, useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  MenuItem,
  Typography,
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';

import type {GiftValues} from '@models/WishListItem';
import {parsePriceInput, SUPPORTED_CURRENCIES, type Currency} from '@utils/money';

function ensureProtocol(value: string): string {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w-]+(\.[\w-]+)+/i.test(value)) return `https://${value}`;
  return value;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const test = ensureProtocol(value.trim());
    if (!test) return false;
    const u = new URL(test);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: GiftValues) => Promise<void> | void;
  initialValues?: { name?: string | null; description?: string | null; link?: string | null; priceMinor?: number | null; currency?: Currency | null };
};

const AddItemDialog = ({open, onClose, onSubmit, initialValues}: Props) => {
  const {t} = useTranslation('addItem');
  const location = useLocation();

  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [link, setLink] = useState(initialValues?.link ?? '');
  const [price, setPrice] = useState(initialValues?.priceMinor != null ? (initialValues.priceMinor / 100).toFixed(2) : '');
  const [currency, setCurrency] = useState<Currency>(initialValues?.currency ?? 'UAH');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const savingRef = useRef(false);
  const generationRef = useRef(0);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    generationRef.current += 1;
    savingRef.current = false;
    setSaving(false);
    setSaveError(false);
    setPrice(initialValues?.priceMinor != null ? (initialValues.priceMinor / 100).toFixed(2) : '');
    setCurrency(initialValues?.currency ?? 'UAH');
    setName(initialValues?.name ?? '');
    setDescription(initialValues?.description ?? '');
    setLink(initialValues?.link ?? '');
    setLinkError(null);
    return () => { generationRef.current += 1; };
  }, [open, location.key, location.pathname, initialValues?.name, initialValues?.description, initialValues?.link, initialValues?.priceMinor, initialValues?.currency]);

  const isEdit = Boolean(initialValues);

  const reset = () => {
    setPrice('');
    setCurrency('UAH');
    setSaveError(false);
    setName('');
    setDescription('');
    setLink('');
    setLinkError(null);
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

  const handleConfirm = async () => {
    if (savingRef.current || !open) return;
    const parsedPrice = parsePriceInput(price);
    if (!parsedPrice.valid) return;
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

    if (parsedPrice.priceMinor !== null) {
      payload.priceMinor = parsedPrice.priceMinor;
      payload.currency = currency;
    } else if (initialValues?.priceMinor != null || initialValues?.currency != null) {
      payload.priceMinor = null;
      payload.currency = null;
    }

    const generation = generationRef.current;
    savingRef.current = true;
    setSaving(true);
    setSaveError(false);
    try {
      await onSubmit(payload);
      if (generation !== generationRef.current) return;
      if (!isEdit) reset();
      onClose();
    } catch {
      if (generation === generationRef.current) setSaveError(true);
    } finally {
      if (generation === generationRef.current) {
        savingRef.current = false;
        setSaving(false);
      }
    }
  };

  const canSubmit = useMemo(() => {
    const hasName = !!name.trim();
    const linkOk = !link.trim() || isValidHttpUrl(link.trim());
    return hasName && linkOk && parsePriceInput(price).valid && !saving;
  }, [name, link, price, saving]);

  return (
    <Dialog open={open} onClose={() => { if (!savingRef.current) onClose(); }} disableEscapeKeyDown={saving} maxWidth="xs" fullWidth>
      <DialogTitle sx={{px: 3, pt: 2, pb: 2}}>
        {isEdit ? t('titleEdit') : t('titleAdd')}
      </DialogTitle>
      <DialogContent sx={{px: 3, pt: '20px !important', pb: 0}}>
        <Stack spacing={2}>
          <TextField
            label={t('labelName')}
            fullWidth
            disabled={saving}
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
            disabled={saving}
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label={t('labelLink')}
            fullWidth
            disabled={saving}
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
          <Stack direction="row" spacing={1}>
            <TextField
              label={t('labelPrice')}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              disabled={saving}
              error={!parsePriceInput(price).valid}
              helperText={!parsePriceInput(price).valid ? t('priceError') : undefined}
              fullWidth
              slotProps={{htmlInput: {inputMode: 'decimal'}}}
            />
            <TextField
              select
              label={t('labelCurrency')}
              value={currency}
              onChange={(event) => setCurrency(event.target.value as Currency)}
              disabled={saving}
              sx={{minWidth: 100}}
            >
              {SUPPORTED_CURRENCIES.map((value) => <MenuItem key={value} value={value}>{t(`currencies.${value}`)}</MenuItem>)}
            </TextField>
          </Stack>
          <Typography variant="body2" color="text.secondary">{t('priceHelper')}</Typography>
          {saveError && <Alert severity="error">{t('saveError')}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{px: 3, py: 2}}>
        <Button
          disabled={saving}
          onClick={() => {
            if (savingRef.current) return;
            if (!isEdit) reset();
            onClose();
          }}
        >
          {t('cancel')}
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!canSubmit}>
          {saving ? t('saving') : isEdit ? t('save') : t('add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;