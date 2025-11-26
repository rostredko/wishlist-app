import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
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
import {trackEvent} from '@utils/analytics';

type Props = {
  open: boolean;
  onClose: () => void;
  user: { uid: string } | null;
};

export function CreateWishListDialog({open, onClose, user}: Props) {
  const {t, i18n} = useTranslation('create');
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const routeLang = i18n.language === 'ua' ? 'ua' : 'en';

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

      // Track wishlist creation event with improved parameters
      trackEvent('wishlist_create', {
        event_category: 'engagement',
        event_label: name,
        wishlist_id: id,
        user_id: user.uid,
        value: 1, // Conversion value
      }).catch((error) => {
        console.error('Failed to track wishlist_create event:', error);
      });

      safeClose();
      
      // Small delay to ensure event is sent before navigation
      // This helps prevent event loss during page transition
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate(`/${routeLang}/wishlist/${id}`);
    } catch (e) {
      console.error('Failed to create wishlist', e);
      setIsCreating(false);
    }
  }, [user, title, isCreating, navigate, safeClose, routeLang]);

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      onClose={isCreating ? undefined : safeClose}
      aria-labelledby="create-wishlist"
    >
      <DialogTitle id="create-wishlist" sx={{px: 3, pt: 2}}>
        {t('title')}
      </DialogTitle>

      <DialogContent sx={{px: 3, pt: 2}}>
        <Stack spacing={2}>
          <TextField
            label={t('labelName')}
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
        <Button onClick={safeClose} disabled={isCreating}>{t('cancel')}</Button>
        <Button onClick={handleCreate} variant="contained" disabled={!canCreate}>
          {isCreating ? t('creating') : t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}