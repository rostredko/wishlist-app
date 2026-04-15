import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import type { BlogRouteLang } from '@constants/blogArticles';
import { BLOG_LAST_UPDATED } from '@constants/blogArticles';

type Props = { routeLang: BlogRouteLang };

export function BlogArticleFooter({ routeLang }: Props) {
  const { t } = useTranslation('blog', { lng: routeLang });
  const { t: tp } = useTranslation('privacy', { lng: routeLang });

  return (
    <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
        <Button component={RouterLink} to={`/${routeLang}`} variant="outlined">
          {tp('backHome')}
        </Button>
        <Button component={RouterLink} to={`/${routeLang}/blog`} variant="outlined">
          {t('navBlog')}
        </Button>
      </Stack>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        {t('byline')}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {t('lastUpdated', { date: BLOG_LAST_UPDATED })}
      </Typography>
      <Typography variant="body2">
        <RouterLink to={`/${routeLang}/privacy`} style={{ color: 'inherit' }}>
          {tp('title')}
        </RouterLink>
      </Typography>
    </Box>
  );
}
