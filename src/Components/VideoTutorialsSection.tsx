import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import LiteYouTube from '@components/LiteYouTube';

type Props = {
    lang: 'ua' | 'en';
};

const VideoTutorialsSection = ({ lang }: Props) => {
    const { t } = useTranslation('home', { lng: lang });

    return (
        <Box sx={{ width: '100%', mt: 4, mb: 4 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={4}
                sx={{ width: '100%' }}
            >
                <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography component="h3" variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                        {t('video1Title')}
                    </Typography>
                    <LiteYouTube videoId="npDaaf1rS2k" title={t('video1Title')} />
                </Box>

                <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography component="h3" variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                        {t('video2Title')}
                    </Typography>
                    <LiteYouTube videoId="iM0W6UvTm8c" title={t('video2Title')} />
                </Box>
            </Stack>
        </Box>
    );
};

export default VideoTutorialsSection;
