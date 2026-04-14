import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';

type Props = {
  videoId: string;
  title: string;
};

/**
 * Click-to-play YouTube facade.
 * Loads zero YouTube JS until the user clicks play — eliminates ~1.9 MB of eager
 * third-party script from the initial page load (main TTI blocker).
 */
export default function LiteYouTube({ videoId, title }: Props) {
  const [active, setActive] = useState(false);

  const activate = useCallback(() => setActive(true), []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    },
    [activate],
  );

  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        bgcolor: 'black',
      }}
    >
      {active ? (
        <iframe
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <Box
          role="button"
          tabIndex={0}
          aria-label={title}
          onClick={activate}
          onKeyDown={handleKeyDown}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            backgroundImage: `url(${thumbUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover .yt-play-btn': { bgcolor: '#f00' },
            '&:focus-visible': {
              outline: '3px solid',
              outlineColor: 'primary.main',
              outlineOffset: 2,
            },
          }}
        >
          <Box
            className="yt-play-btn"
            aria-hidden
            sx={{
              width: 68,
              height: 48,
              bgcolor: 'rgba(23,23,23,0.85)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s',
            }}
          >
            <svg viewBox="0 0 68 48" width="68" height="48" aria-hidden focusable="false">
              <path
                d="M66.52 7.74C65.69 4.58 63.35 2.18 60.24 1.39 54.94 0 34 0 34 0S13.06 0 7.76 1.39C4.65 2.18 2.31 4.58 1.48 7.74 0 13.14 0 24 0 24s0 10.86 1.48 16.26c.83 3.16 3.17 5.56 6.28 6.35C13.06 48 34 48 34 48s20.94 0 26.24-1.39c3.11-.79 5.45-3.19 6.28-6.35C68 34.86 68 24 68 24s0-10.86-1.48-16.26z"
                fill="#ff0000"
              />
              <path d="M45 24 27 14v20z" fill="#fff" />
            </svg>
          </Box>
        </Box>
      )}
    </Box>
  );
}
