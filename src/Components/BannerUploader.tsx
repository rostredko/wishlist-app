import { ChangeEvent, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import { Button, CircularProgress } from '@mui/material';

type Props = {
  wishlistId: string;
  canEdit: boolean;
  onUpload?: (url: string) => void;
};

const BannerUploader = ({ wishlistId, canEdit, onUpload }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !wishlistId) return;

    setLoading(true);

    try {
      const fileName = `${wishlistId}-${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `banners/${fileName}`);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);

      const wishlistDocRef = doc(db, 'wishlists', wishlistId);
      await updateDoc(wishlistDocRef, { bannerImage: url });

      console.log('Banner updated:', url);

      onUpload?.(url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canEdit) return null;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        variant="outlined"
        disabled={loading}
        size="small"
      >
        {loading ? <CircularProgress size={20} /> : 'Upload Banner'}
      </Button>
    </div>
  );
};

export default BannerUploader;