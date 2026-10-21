import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import SEOHead from '@components/SEOHead';
import { BLOG_LAST_UPDATED } from '@constants/blogArticles';
import type { BlogArticleProps } from '@components/blog/blogArticleTypes';
import { BlogArticleFooter } from '@components/blog/BlogArticleFooter';

const SLUG = 'najkrashchi-servisy-spysku-bazhan-v-ukraini';

export default function NajkrashchiServisySpyskuBazhanArticle({ origin, routeLang }: BlogArticleProps) {
  const { t } = useTranslation('blog', { lng: routeLang });
  const { t: th } = useTranslation('home', { lng: routeLang });
  const canonical = `${origin}/ua/blog/${SLUG}`;
  return (
    <>
      <SEOHead lang="uk"
        title="Сервіси для списку бажань в Україні - порівняння | WishList App"
        description="Порівняння Wishpicks, Bazhannya та WishList App за офіційними описами: українська мова, бронювання, додавання товарів і вхід. Перевірено 9 жовтня 2026."
        canonical={canonical}
        structured={{ article: { headline: t('ukraineComparison.h1'), datePublished: '2026-04-15', dateModified: BLOG_LAST_UPDATED } }} />
      <Container component="article" maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: 26, md: 34 }, fontWeight: 800, mb: 2 }}>{t('ukraineComparison.h1')}</Typography>
        <Typography sx={{ mb: 2 }}>{t('ukraineComparison.intro')}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>{t('research.checked')}</Typography>
        <Stack spacing={3}>
          <section>
            <Typography variant="h2" sx={{ fontSize: 22 }}>Wishpicks</Typography>
            <Typography>{t('ukraineComparison.wishpicks')}</Typography>
            <a href="https://wishpicks.com/uk">Wishpicks</a>
          </section>
          <section>
            <Typography variant="h2" sx={{ fontSize: 22 }}>Bazhannya</Typography>
            <Typography>{t('ukraineComparison.bazhannya')}</Typography>
            <a href="https://bazhannya.com/">Bazhannya</a>
          </section>
          <section>
            <Typography variant="h2" sx={{ fontSize: 22 }}>WishList App</Typography>
            <Typography>{t('ukraineComparison.own')}</Typography>
          </section>
          <section>
            <Typography variant="h2" sx={{ fontSize: 22 }}>{t('ukraineComparison.choice')}</Typography>
            <Typography sx={{ mb: 2 }}>{t('ukraineComparison.choiceBody')}</Typography>
            <Typography>{t('ukraineComparison.related')} <RouterLink to="/ua/blog/de-stvoryty-vishlist-2026">{t('cards.best-wishlist-apps-2026.title')}</RouterLink></Typography>
          </section>
          <Button component={RouterLink} to="/ua/blog/yak-zrobyty-vishlist">{t('ukraineComparison.guide')}</Button>
          <Button component={RouterLink} to="/ua/wishlist/birthday-list-ua" variant="outlined">{t('ukraineComparison.example')}</Button>
          <Button component={RouterLink} to="/ua" state={{ creationSource: 'blog' }} variant="contained">{th('createBtn')}</Button>
        </Stack>
        <BlogArticleFooter routeLang={routeLang} />
      </Container>
    </>
  );
}
