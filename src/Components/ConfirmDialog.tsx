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
                                        title = 'Are you sure?',
                                        description,
                                        destructive,
                                        loading,
                                        disableBackdropClose,
                                        onClose,
                                        onConfirm,
                                        confirmText = 'Confirm',
                                        cancelText = 'Cancel',
                                      }: Props) {
  return (
    <Dialog
      open={open}
      onClose={disableBackdropClose || loading ? undefined : onClose}
      aria-labelledby="confirm-title"
    >
      <DialogTitle id="confirm-title" sx={{px: 3, pt: 2}}>
        {title}
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
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color={destructive ? 'error' : 'primary'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Please wait…' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}