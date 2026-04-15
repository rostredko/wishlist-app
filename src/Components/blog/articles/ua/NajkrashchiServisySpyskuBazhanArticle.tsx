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

const SLUG = 'najkrashchi-servisy-spysku-bazhan-v-ukraini';

export default function NajkrashchiServisySpyskuBazhanArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG)!;

  return (
    <>
      <SEOHead
        lang="uk"
        title="Найкращі сервіси для списку бажань в Україні | WishList App Блог"
        description="Я Ukrainian розробник WishList App. Порівняння сервісів для списку бажань, що реально працюють з українськими магазинами і Telegram."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="список бажань онлайн Україна, вішліст Україна, сервіс список бажань, де зробити список подарунків, безкоштовний вішліст"
        structured={{
          article: {
            headline: 'Найкращі сервіси для списку бажань в Україні - чесне порівняння',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Найкращі сервіси для списку бажань в Україні', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Найкращі сервіси для списку бажань в Україні - чесне порівняння
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Я український розробник і сам використовую те, що роблю. Коли я кажу «найкращі» - я маю на
            увазі: що реально працює з нашими магазинами, нашими месенджерами і нашими звичками. Не
            американський огляд з Amazon на першому місці.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що важливо саме в Україні
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Є кілька особливостей українського ринку, які ігнорують більшість зарубіжних оглядів:
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body1">
                  - Rozetka, Prom, Epicentr, Eva, Comfy - локальні ритейлери, яких немає в жодному
                  закордонному вішліст-сервісі за замовчуванням
                </Typography>
                <Typography variant="body1">
                  - Telegram домінує над WhatsApp - якщо ваш список не можна легко поділитися в
                  Telegram, це вже проблема
                </Typography>
                <Typography variant="body1">
                  - Купівля на день народження в Україні часто - це банківський переказ або дарунок
                  наживо, не доставка через кошик маркетплейсу
                </Typography>
                <Typography variant="body1">
                  - Інтерфейс українською мовою - не обов&apos;язково, але приємно
                </Typography>
              </Stack>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Огляд сервісів 📋
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Сервіс</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Укр. магазини</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Гості без акаунту</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Бронювання</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Ціна / реклама</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>WishList App</TableCell>
                      <TableCell>Будь-які URL</TableCell>
                      <TableCell>Так</TableCell>
                      <TableCell>Анонімне</TableCell>
                      <TableCell>Безкоштовно, без реклами</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Rozetka Вішліст</TableCell>
                      <TableCell>Тільки Rozetka</TableCell>
                      <TableCell>Так</TableCell>
                      <TableCell>Частково</TableCell>
                      <TableCell>Безкоштовно</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Google Docs / Sheets</TableCell>
                      <TableCell>Вручну</TableCell>
                      <TableCell>Так</TableCell>
                      <TableCell>Немає</TableCell>
                      <TableCell>Безкоштовно</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Telegram чат / нотатки</TableCell>
                      <TableCell>Вручну</TableCell>
                      <TableCell>Всі там є</TableCell>
                      <TableCell>Немає</TableCell>
                      <TableCell>Безкоштовно</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Amazon / Elfster</TableCell>
                      <TableCell>Переважно не укр.</TableCell>
                      <TableCell>Частково</TableCell>
                      <TableCell>Є</TableCell>
                      <TableCell>Безкоштовно / freemium</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Детально про кожну категорію
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Спеціалізований вішліст (WishList App)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Я зробив WishList App як відповідь на власний біль: хотів один лінк, без прив&apos;язки
                до магазину, з анонімним бронюванням. Що дає: будь-які посилання, швидкий старт,
                один URL для гостей, мобільний інтерфейс. Чого немає: вбудованого жеребкування
                для Secret Santa, глибокої інтеграції з кошиком магазину.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Вішліст маркетплейсу (Rozetka, Prom, Epicentr)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Зручно, якщо всі покупки - на одному сайті. Великий плюс - гості одразу можуть
                покласти товар у кошик і замовити доставку. Мінус - ти прив&apos;язаний до одного
                ритейлера. Якщо хочеш книгу з видавництва, крем з маленького бренду і техніку -
                три різних списки або компроміси.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Google Docs / Sheets
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Максимальна гнучкість і нульова вартість. Я сам так робив. Але немає автоматики:
                координація хто що купує - вручну. Для невеликої родини, де всі активно спілкуються,
                це ок. Для великої групи - ризик дублів і плутанини зростає з кожним учасником.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Telegram нотатки / канал
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Головна перевага - там уже є всі. Не потрібно нікого просити реєструватися. Але
                список губиться в потоці повідомлень через тиждень-два, бронювання - лише через
                текст у чаті, і ніхто не знає, хто що вже купив, якщо не слідкував.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Мій підсумок
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Для більшості українських сценаріїв - день народження, весілля, Secret Santa з
                товарами з різних магазинів - WishList App вирішує задачу без зайвих кроків.
                Якщо вам потрібно виключно Rozetka і доставка в кошик - їхній вішліст зручніший.
                Якщо гостей троє і всі в одному Telegram-чаті - Telegram справиться.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button component={RouterLink} to={`/${routeLang}`} variant="contained" size="large">
                  {th('createBtn')}
                </Button>
              </Box>
            </section>

            <section>
              <Typography variant="body1">
                Читайте також:{' '}
                <RouterLink to={`/${routeLang}/blog/vishlist-chy-google-docs-telegram`}>
                  вішліст чи Google Docs / Telegram
                </RouterLink>
                {' '}та{' '}
                <RouterLink to={`/${routeLang}/blog/de-stvoryty-vishlist-2026`}>
                  де створити вішліст у 2026
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
