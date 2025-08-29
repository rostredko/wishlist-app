import {type ChangeEvent, useRef, useState} from 'react';
import {Button, CircularProgress, Box} from '@mui/material';
import {uploadWishlistBanner} from '@api/wishlistService';

type Props = {
  wishlistId: string;
  canEdit: boolean;
  onUpload?: (url: string) => void;
};

const MAX_SIZE_MB = 8;

const BannerUploader = ({wishlistId, canEdit, onUpload}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !wishlistId) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      resetInput();
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Image is too large. Max ${MAX_SIZE_MB} MB.`);
      resetInput();
      return;
    }

    setLoading(true);
    try {
      const url = await uploadWishlistBanner(wishlistId, file);
      onUpload?.(url);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload banner. Please try again.');
    } finally {
      setLoading(false);
      resetInput();
    }
  };

  if (!canEdit) return null;

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{display: 'none'}}
        onChange={handleFileChange}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        variant="outlined"
        disabled={loading}
        size="small"
      >
        {loading ? <CircularProgress size={20}/> : 'Upload Banner'}
      </Button>
    </Box>
  );
};

export default BannerUploader;