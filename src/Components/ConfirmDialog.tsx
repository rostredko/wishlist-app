import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
};

const ConfirmDialog = ({
                         open,
                         title,
                         onClose,
                         onConfirm,
                         cancelText = "No",
                         confirmText = "Yes",
                       }: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogActions>
      <Button onClick={onClose}>{cancelText}</Button>
      <Button onClick={onConfirm} autoFocus>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;