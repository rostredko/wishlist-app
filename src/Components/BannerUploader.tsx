import {useRef, useState} from 'react';
import {Box, Button, CircularProgress, Tooltip} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import {uploadWishlistBanner} from '@api/wishListService';

type Props = {
  wishlistId: string | null | undefined;
  canEdit: boolean;
  onUpload?: (url: string) => void;
};

const MAX_SIZE_MB = 5;

export default function BannerUploader({wishlistId, canEdit, onUpload}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  if (!canEdit) return null;

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const handlePick = () => inputRef.current?.click();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !wishlistId) {
      resetInput();
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      resetInput();
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Image is too large. Max ${MAX_SIZE_MB}MB.`);
      resetInput();
      return;
    }

    try {
      setLoading(true);
      const url = await uploadWishlistBanner(wishlistId, file);
      onUpload?.(url);
    } catch (err) {
      console.error('Failed to upload banner', err);
      alert('Failed to upload banner. Please try again.');
    } finally {
      setLoading(false);
      resetInput();
    }
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{display: 'none'}}
        onChange={handleFileChange}
      />
      <Tooltip title="Upload banner">
        <span>
          <Button
            size="small"
            variant="outlined"
            onClick={handlePick}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16}/> : <UploadIcon/>}
            aria-label="Upload banner"
          >
            {loading ? 'Uploading…' : 'Upload'}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
}