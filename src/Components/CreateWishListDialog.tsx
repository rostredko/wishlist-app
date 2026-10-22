import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Chip } from '@mui/material';
import { createWishlist, copyWishlist } from '@api/wishListService';
import { isTitleSuggestionSeason } from '@constants/season';
import type { WishListItem } from '@models/WishListItem';
import { trackEvent } from '@utils/analytics';
import type { CreationSource } from '@utils/pendingWishlistCreate';

type Props = {
  open: boolean;
  onClose: () => void;
  user: { uid: string } | null;
  initialTitle?: string;
  copyItems?: WishListItem[];
  copyMethod?: 'demo_copy' | 'shared_copy';
  source?: CreationSource;
};

const TITLE_SUGGESTIONS = ['new_year', 'st_nicholas', 'secret_santa'] as const;

export function CreateWishListDialog({ open, onClose, user, initialTitle = '', copyItems, copyMethod = 'demo_copy', source = 'home' }: Props) {
  const { t, i18n } = useTranslation('create');
  const [title, setTitle] = useState(initialTitle);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(false);
  const inFlight = useRef(false);
  const generation = useRef(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const routeLang = pathname.startsWith('/ua') ? 'ua' : pathname.startsWith('/en') ? 'en' : i18n.language === 'ua' ? 'ua' : 'en';
  const now = new Date();
  const showSuggestions = !copyItems && isTitleSuggestionSeason(now);
  const yearParams = { year: now.getFullYear(), nextYear: now.getFullYear() + 1 };

  useEffect(() => {
    generation.current += 1;
    inFlight.current = false;
    setTitle(open ? initialTitle : '');
    setIsCreating(false);
    setError(false);
    return () => { generation.current += 1; };
  }, [open, initialTitle, pathname, user?.uid]);

  const safeClose = useCallback(() => {
    if (inFlight.current) return;
    setTitle('');
    setError(false);
    onClose();
  }, [onClose]);

  const handleCreate = async () => {
    if (!user || !title.trim() || inFlight.current) return;
    inFlight.current = true;
    setIsCreating(true);
    setError(false);
    const requestGeneration = generation.current;
    const method = copyItems ? copyMethod : 'manual';
    try {
      const id = copyItems
        ? await copyWishlist(title.trim(), user.uid, copyItems, copyMethod)
        : await createWishlist(title.trim(), user.uid);
      void trackEvent('wishlist_create', { creation_method: method, source });
      if (copyItems && copyMethod === 'demo_copy') void trackEvent('copy_example_wishlist', { creation_method: method, source: 'demo', is_demo: true });
      if (requestGeneration !== generation.current) return;
      inFlight.current = false;
      setIsCreating(false);
      safeClose();
      navigate(`/${routeLang}/wishlist/${id}`);
    } catch (failure) {
      void trackEvent('wishlist_operation_failed', { operation: copyItems ? 'copy' : 'create', error_category: 'persistence' });
      if (requestGeneration !== generation.current) return;
      console.error('Failed to create wishlist', failure);
      inFlight.current = false;
      setIsCreating(false);
      setError(true);
    }
  };

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={isCreating ? undefined : safeClose} aria-labelledby="create-wishlist">
      <DialogTitle id="create-wishlist" sx={{ px: 3, pt: 2 }}>{copyItems ? t(copyMethod === 'demo_copy' ? 'copyTitle' : 'copySharedTitle') : t('title')}</DialogTitle>
      <DialogContent sx={{ px: 3, pt: '20px !important' }}>
        <Stack spacing={2}>
          {copyItems && <Alert severity="info">{t('copyHint')}</Alert>}
          {error && <Alert severity="error">{t('createFailed')}</Alert>}
          <TextField label={t('labelName')} value={title} onChange={e => setTitle(e.target.value)} autoFocus fullWidth
            disabled={isCreating} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); void handleCreate(); } }} />
          {showSuggestions && (
            <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1} role="group" aria-label={t('suggestionsLabel')}>
              {TITLE_SUGGESTIONS.map(suggestion => {
                const label = t(`suggestions.${suggestion}`, yearParams);
                return (
                  <Chip key={suggestion} label={label} variant="outlined" size="small" disabled={isCreating}
                    onClick={() => {
                      setTitle(label);
                      void trackEvent('title_suggestion_click', { suggestion });
                    }} />
                );
              })}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={safeClose} disabled={isCreating}>{t('cancel')}</Button>
        <Button onClick={() => void handleCreate()} variant="contained" disabled={!user || !title.trim() || isCreating}>
          {isCreating ? t('creating') : t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
