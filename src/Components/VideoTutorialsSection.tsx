import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

const VideoTutorialsSection = () => {
    const { t } = useTranslation('home');

    return (
        <Box sx={{ width: '100%', mt: 4, mb: 4 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={4}
                sx={{ width: '100%' }}
            >
                {/* Video 1: How to create wishlist */}
                <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography component="h3" variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                        {t('video1Title')}
                    </Typography>
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '56.25%', // 16:9 Aspect Ratio
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 3,
                            bgcolor: 'black',
                        }}
                    >
                        <iframe
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 0,
                            }}
                            src="https://www.youtube.com/embed/npDaaf1rS2k?si=UfNbDR2kvn-LcfKf"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </Box>
                </Box>

                {/* Video 2: How to pick gift */}
                <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography component="h3" variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                        {t('video2Title')}
                    </Typography>
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '56.25%', // 16:9 Aspect Ratio
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 3,
                            bgcolor: 'black',
                        }}
                    >
                        <iframe
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 0,
                            }}
                            src="https://www.youtube.com/embed/iM0W6UvTm8c?si=nwWeTtqSQN1kZ1YE"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default VideoTutorialsSection;
