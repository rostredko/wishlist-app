import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTranslation } from 'react-i18next';

import SEOHead from '@components/SEOHead';
import { BLOG_LAST_UPDATED, resolveBlogAlternates } from '@constants/blogArticles';
import type { BlogArticleProps } from '@components/blog/blogArticleTypes';
import { BlogArticleFooter } from '@components/blog/BlogArticleFooter';

const SLUG = 'vishlist-chy-google-docs-telegram';

export default function VishlistChyGoogleDocsTelegramArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG)!;

  return (
    <>
      <SEOHead
        lang="uk"
        title="Вішліст чи Google Docs / Telegram - порівняння | WishList App Блог"
        description="Я автор WishList App і користуюся і Docs, і Telegram. Чесне порівняння: коли вистачає чату, а коли потрібен окремий інструмент для списку подарунків."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="вішліст google docs, список подарунків telegram, вішліст чи таблиця, де зробити список бажань, список побажань в телеграм"
        structured={{
          article: {
            headline: 'Вішліст чи Google Docs / Telegram - що обрати для списку подарунків',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          faq: [
            {
              q: 'Чи достатньо Telegram для списку подарунків?',
              a: 'Для малої групи до 5 осіб де всі одне одного знають - часто так. Але коли потрібне анонімне бронювання без дублів або список не повинен губитися в потоці чату - зручніший окремий інструмент.',
            },
            {
              q: 'Чим Google Docs гірший за спеціалізований вішліст?',
              a: 'Google Docs не має автоматичного бронювання. Хтось має вручну писати хто що купує, і є ризик що двоє купують одне й те саме одночасно. Для маленьких організованих груп це ок, для великих - проблема.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Вішліст чи Google Docs / Telegram', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Вішліст чи Google Docs / Telegram - що обрати для списку подарунків
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Я не проти Docs і Telegram - я сам ними користуюся для різних задач. Питання не «що краще
            взагалі», а «який інструмент для якої конкретної задачі». Ось як я це розмежовую.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Коли Telegram справляється
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Telegram - правильний вибір коли:
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body1">
                  - Гостей до 5 осіб і всі одне одного добре знають
                </Typography>
                <Typography variant="body1">
                  - Бронювання не потрібне - купують незалежно або просто питають
                </Typography>
                <Typography variant="body1">
                  - Список одноразовий і не треба до нього повертатися
                </Typography>
                <Typography variant="body1">
                  - Усі в одному активному чаті де і так усі читають
                </Typography>
              </Stack>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Де Telegram ламається
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body1">
                  - Гостей більше 6 - повідомлення про «я беру» губляться
                </Typography>
                <Typography variant="body1">
                  - Потрібне бронювання без спойлерів - власник побачить хто купив
                </Typography>
                <Typography variant="body1">
                  - Список надісланий 2 тижні тому - прокручувати вгору ніхто не буде
                </Typography>
                <Typography variant="body1">
                  - Хтось не в цьому конкретному чаті і треба надіслати окремо
                </Typography>
              </Stack>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Коли Google Docs - гарний вибір
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body1">
                  - Потрібна повна гнучкість: кастомні колонки, нотатки, форматування
                </Typography>
                <Typography variant="body1">
                  - Список складний: кілька категорій, пріоритети, варіанти
                </Typography>
                <Typography variant="body1">
                  - Внутрішнє корпоративне використання - всі у Google Workspace
                </Typography>
                <Typography variant="body1">
                  - Особисте планування для себе, не для публічного доступу
                </Typography>
              </Stack>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Де Google Docs не справляється
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body1">
                  - Автоматичного бронювання немає - хтось пише «я беру» в коментарі
                </Typography>
                <Typography variant="body1">
                  - Права доступу заплутані: «перегляд», «редагування», посилання з паролем
                </Typography>
                <Typography variant="body1">
                  - Мобільний досвід гірший - таблиця на телефоні некомфортна
                </Typography>
                <Typography variant="body1">
                  - Дві людини можуть одночасно написати «я беру» і не помітити одне одного
                </Typography>
              </Stack>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Детальне порівняння
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Критерій</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Telegram</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Google Docs</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>WishList App</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Анонімне бронювання</TableCell>
                      <TableCell>Немає</TableCell>
                      <TableCell>Немає</TableCell>
                      <TableCell>Так</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Гості без реєстрації</TableCell>
                      <TableCell>Так (всі там)</TableCell>
                      <TableCell>Так (посилання)</TableCell>
                      <TableCell>Так</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Список не губиться</TableCell>
                      <TableCell>Ні - тоне в чаті</TableCell>
                      <TableCell>Так</TableCell>
                      <TableCell>Так</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Будь-які магазини</TableCell>
                      <TableCell>Вручну</TableCell>
                      <TableCell>Вручну</TableCell>
                      <TableCell>Так</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Мобільний досвід</TableCell>
                      <TableCell>Добре для чату</TableCell>
                      <TableCell>Незручно в таблиці</TableCell>
                      <TableCell>Оптимізовано</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Гнучкість формату</TableCell>
                      <TableCell>Низька</TableCell>
                      <TableCell>Максимальна</TableCell>
                      <TableCell>Стандартна</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Мій підсумок
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Сценарій</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Інструмент</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>3-5 близьких, бронювання не важливе</TableCell>
                      <TableCell>Telegram</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Особистий складний список для себе</TableCell>
                      <TableCell>Google Docs</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Корпоративний список, всі в Google Workspace</TableCell>
                      <TableCell>Google Sheets</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>День народження, 6+ гостей, потрібне бронювання</TableCell>
                      <TableCell>WishList App</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Secret Santa з різними магазинами</TableCell>
                      <TableCell>WishList App</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3 }}>
                <Button component={RouterLink} to={`/${routeLang}`} variant="contained" size="large">
                  {th('createBtn')}
                </Button>
              </Box>
            </section>

            <section>
              <Typography variant="body1">
                Читайте також:{' '}
                <RouterLink to={`/${routeLang}/blog/najkrashchi-servisy-spysku-bazhan-v-ukraini`}>
                  найкращі сервіси для списку бажань в Україні
                </RouterLink>
                {' '}та{' '}
                <RouterLink to={`/${routeLang}/blog/yak-podilytysia-vishlistom-bez-dublikativ`}>
                  як поділитися вішлістом без дублів
                </RouterLink>
                .
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} />
        </Container>
      </Box>
    </>
  );
}
