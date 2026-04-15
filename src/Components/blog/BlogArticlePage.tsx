import { useParams, Link as RouterLink } from 'react-router-dom';
import type { ComponentType } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import SEOHead from '@components/SEOHead';
import type { BlogRouteLang } from '@constants/blogArticles';
import { findBlogPairBySlug } from '@constants/blogArticles';

import type { BlogArticleProps } from './blogArticleTypes';

import BestWishlistApps2026Article from './articles/en/BestWishlistApps2026Article';
import AmazonWishlistAlternativesArticle from './articles/en/AmazonWishlistAlternativesArticle';
import HowToCreateBirthdayWishlistArticle from './articles/en/HowToCreateBirthdayWishlistArticle';
import WishlistVsGiftRegistryArticle from './articles/en/WishlistVsGiftRegistryArticle';
import BestSecretSantaAppsArticle from './articles/en/BestSecretSantaAppsArticle';
import HowListsChangeYourLifeArticle from './articles/en/HowListsChangeYourLifeArticle';

import DeStvorytyVishlist2026Article from './articles/ua/DeStvorytyVishlist2026Article';
import NajkrashchiServisySpyskuBazhanArticle from './articles/ua/NajkrashchiServisySpyskuBazhanArticle';
import YakZrobytyVishlistNaDenNarodzhennyaArticle from './articles/ua/YakZrobytyVishlistNaDenNarodzhennyaArticle';
import VishlistChyGoogleDocsTelegramArticle from './articles/ua/VishlistChyGoogleDocsTelegramArticle';
import YakPodilytysiaVishlistomBezDublikativArticle from './articles/ua/YakPodilytysiaVishlistomBezDublikativArticle';
import YakSpyskyZminyuyutZhyttiaArticle from './articles/ua/YakSpyskyZminyuyutZhyttiaArticle';

const ARTICLE_BY_SLUG: Record<BlogRouteLang, Record<string, ComponentType<BlogArticleProps>>> = {
  en: {
    'best-wishlist-apps-2026': BestWishlistApps2026Article,
    'amazon-wishlist-alternatives': AmazonWishlistAlternativesArticle,
    'how-to-create-a-birthday-wishlist': HowToCreateBirthdayWishlistArticle,
    'wishlist-vs-gift-registry': WishlistVsGiftRegistryArticle,
    'best-secret-santa-apps': BestSecretSantaAppsArticle,
    'how-lists-change-your-life': HowListsChangeYourLifeArticle,
  },
  ua: {
    'de-stvoryty-vishlist-2026': DeStvorytyVishlist2026Article,
    'najkrashchi-servisy-spysku-bazhan-v-ukraini': NajkrashchiServisySpyskuBazhanArticle,
    'yak-zrobyty-vishlist-na-den-narodzhennya': YakZrobytyVishlistNaDenNarodzhennyaArticle,
    'vishlist-chy-google-docs-telegram': VishlistChyGoogleDocsTelegramArticle,
    'yak-podilytysia-vishlistom-bez-dublikativ': YakPodilytysiaVishlistomBezDublikativArticle,
    'yak-spysky-zminyuyut-zhyttia': YakSpyskyZminyuyutZhyttiaArticle,
  },
};

export default function BlogArticlePage() {
  const { lng, slug = '' } = useParams<{ lng: string; slug: string }>();
  const routeLang: BlogRouteLang = lng === 'en' || lng === 'ua' ? lng : 'ua';
  const seoLang = routeLang === 'ua' ? 'uk' : 'en';
  const { t } = useTranslation('blog', { lng: routeLang });

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://wishlistapp.com.ua';

  const pair = findBlogPairBySlug(routeLang, slug);
  const Article = ARTICLE_BY_SLUG[routeLang][slug];

  if (!slug || !pair || !Article) {
    const notFoundCanonical = `${origin}/${routeLang}/blog/${slug || 'unknown'}`;
    const hubAlternates = {
      en: `${origin}/en/blog`,
      uk: `${origin}/ua/blog`,
    };

    return (
      <Box component="main" sx={{ pt: { xs: 6, md: 10 }, pb: 8 }}>
        <SEOHead
          lang={seoLang}
          title={t('notFound.title')}
          description={t('notFound.description')}
          canonical={notFoundCanonical}
          alternates={hubAlternates}
          robots="noindex,follow"
        />
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 32 }, mb: 2 }}>
            {t('notFound.h1')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {t('notFound.body')}
          </Typography>
          <Button component={RouterLink} to={`/${routeLang}/blog`} variant="outlined" sx={{ mr: 2 }}>
            {t('breadcrumbBlog')}
          </Button>
          <Button component={RouterLink} to={`/${routeLang}`} variant="contained">
            {t('backHome')}
          </Button>
        </Container>
      </Box>
    );
  }

  return <Article key={slug} origin={origin} routeLang={routeLang} />;
}
