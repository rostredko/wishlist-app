import {useTranslation} from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  destructive?: boolean;
  loading?: boolean;
  disableBackdropClose?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDialog({
                                        open,
                                        title,
                                        description,
                                        destructive,
                                        loading,
                                        disableBackdropClose,
                                        onClose,
                                        onConfirm,
                                        confirmText,
                                        cancelText,
                                      }: Props) {
  const {t} = useTranslation('confirm');

  const _title = title ?? t('title');
  const _cancel = cancelText ?? t('cancel');
  const _confirm = confirmText ?? (destructive ? t('delete') : t('confirm'));
  const pleaseWait = t('pleaseWait');

  return (
    <Dialog
      open={open}
      onClose={disableBackdropClose || loading ? undefined : onClose}
      aria-labelledby="confirm-title"
    >
      <DialogTitle id="confirm-title" sx={{px: 3, pt: 2}}>
        {_title}
      </DialogTitle>

      {description ? (
        <DialogContent sx={{px: 3, pb: 0}}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </DialogContent>
      ) : null}

      <DialogActions sx={{px: 3, pb: 2}}>
        <Button onClick={onClose} disabled={loading}>
          {_cancel}
        </Button>
        <Button
          variant="contained"
          color={destructive ? 'error' : 'primary'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? pleaseWait : _confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}