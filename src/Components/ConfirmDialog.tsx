import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  destructive?: boolean;
  loading?: boolean;
  disableBackdropClose?: boolean;
};

const ConfirmDialog = ({
                         open,
                         title,
                         onClose,
                         onConfirm,
                         cancelText = 'Cancel',
                         confirmText = 'Confirm',
                         destructive = false,
                         loading = false,
                         disableBackdropClose = false,
                       }: ConfirmDialogProps) => (
  <Dialog
    open={open}
    onClose={disableBackdropClose ? undefined : onClose}
    aria-labelledby="confirm-dialog-title"
    disableEscapeKeyDown={disableBackdropClose}
  >
    <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>

    <DialogActions>
      <Button onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        autoFocus
        variant="contained"
        color={destructive ? 'error' : 'primary'}
        disabled={loading}
      >
        {loading ? 'Please wait…' : confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;