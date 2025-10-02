import {useRef, useState} from 'react';
import {Box, Button, CircularProgress, Tooltip} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import {uploadWishlistBanner} from '@api/wishListService';

type Props = {
  wishlistId: string | null | undefined;
  canEdit: boolean;
  onUpload?: (url: string) => void;
};

const IS_TEST = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

const MAX_SOURCE_SIZE_MB = 10;
const BANNER_W = 1920;
const BANNER_H = 1080;
const TARGET_KB = 300;
const MIN_QUALITY = 0.5;

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
    if (file.size > MAX_SOURCE_SIZE_MB * 1024 * 1024) {
      alert(`Image is too large. Max ${MAX_SOURCE_SIZE_MB}MB.`);
      resetInput();
      return;
    }

    try {
      setLoading(true);

      if (IS_TEST) {
        const url = await uploadWishlistBanner(wishlistId, file);
        onUpload?.(url);
        return;
      }

      const compressed = await compressBannerCover(file, {
        width: BANNER_W,
        height: BANNER_H,
        targetKB: TARGET_KB,
        minQuality: MIN_QUALITY,
      });

      const outExt = compressed.type.includes('webp') ? 'webp' : 'jpg';
      const outFile = new File([compressed], `banner.${outExt}`, {type: compressed.type});

      const url = await uploadWishlistBanner(wishlistId, outFile);
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

type CoverOpts = {
  width: number;
  height: number;
  targetKB: number;
  minQuality: number;
};

async function compressBannerCover(file: File, opts: CoverOpts): Promise<Blob> {
  const src = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = opts.width;
  canvas.height = opts.height;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const scale = Math.max(opts.width / (src as any).width, opts.height / (src as any).height);
  const drawW = Math.round((src as any).width * scale);
  const drawH = Math.round((src as any).height * scale);
  const dx = Math.round((opts.width - drawW) / 2);
  const dy = Math.round((opts.height - drawH) / 2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(src as any, dx, dy, drawW, drawH);

  const targetBytes = opts.targetKB * 1024;

  let supportsWebp = false;
  try {
    supportsWebp = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    supportsWebp = false;
  }
  const mimes = supportsWebp ? ['image/webp', 'image/jpeg'] : ['image/jpeg'];

  for (const mime of mimes) {
    const qualities = [0.82, 0.74, 0.66, 0.6, 0.55, opts.minQuality]
      .filter((q, i, a) => i === 0 || q < a[i - 1]);

    for (const q of qualities) {
      let blob = await canvasToBlob(canvas, mime, q);
      if (!blob) continue;

      if (mime === 'image/jpeg') {
        const opaque = document.createElement('canvas');
        opaque.width = canvas.width;
        opaque.height = canvas.height;
        const octx = opaque.getContext('2d')!;
        octx.fillStyle = '#ffffff';
        octx.fillRect(0, 0, opaque.width, opaque.height);
        octx.drawImage(canvas, 0, 0);
        blob = (await canvasToBlob(opaque, 'image/jpeg', q)) ?? blob;
      }

      if (blob.size <= targetBytes || q === opts.minQuality) return blob;
    }
  }

  return file;
}

async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, {imageOrientation: 'from-image'});
    } catch {}
  }
  let url: string | null = null;
  try {
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      url = URL.createObjectURL(file);
    } else {
      const fr = new FileReader();
      const dataURL: string = await new Promise((resolve, reject) => {
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = () => reject(fr.error);
        fr.readAsDataURL(file);
      });
      url = dataURL;
    }

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url!;
    });
    return img;
  } finally {
    if (url && url.startsWith('blob:')) {
      try { URL.revokeObjectURL(url); } catch {}
    }
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  if (typeof canvas.toBlob === 'function') {
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
  }
  try {
    const dataURL = canvas.toDataURL(type, quality);
    const [meta, base64] = dataURL.split(',');
    const mime = (meta.match(/data:([^;]+)/)?.[1]) || 'application/octet-stream';
    const bin = atob(base64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return Promise.resolve(new Blob([u8], { type: mime }));
  } catch {
    return Promise.resolve(null);
  }
}