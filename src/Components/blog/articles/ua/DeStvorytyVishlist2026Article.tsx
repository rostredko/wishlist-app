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

const SLUG = 'de-stvoryty-vishlist-2026';

export default function DeStvorytyVishlist2026Article({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG)!;

  return (
    <>
      <SEOHead
        lang="uk"
        title="Де створити вішліст у 2026 - найкращі варіанти | WishList App"
        description="Я розробив WishList App і протестував усі основні варіанти. Чесний огляд де створити вішліст у 2026: швидкість, зручність для гостей, бронювання."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="де створити вішліст, зробити вішліст онлайн, список бажань онлайн, вішліст безкоштовно, де зробити список бажань"
        structured={{
          article: {
            headline: 'Де створити вішліст у 2026 - мій погляд як автора',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          faq: [
            {
              q: 'Де зробити вішліст безкоштовно в Україні?',
              a: 'WishList App - безкоштовний сервіс без реклами. Власнику потрібен вхід через Google, гості можуть переглядати й бронювати без реєстрації.',
            },
            {
              q: 'Чи можна в вішліст додати товари з різних магазинів?',
              a: 'Так - WishList App приймає будь-яке посилання. Rozetka, Prom, Epicentr, Amazon, будь-який інший сайт - без обмежень.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Де створити вішліст у 2026', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Де створити вішліст у 2026 - мій погляд як автора
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Я веду WishList App і пишу це від першої особи. Я оцінював кілька варіантів - включно зі своїм -
            і хочу показати критерії, за якими я дивлюся на будь-який сервіс для списків бажань. Ніяких
            affiliate-посилань, тільки те, що я помітив під час реального використання.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                На що дивитися при виборі сервісу 🔍
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Коли я тестую інструменти - включно зі своїм - я завжди перевіряю ці шість речей.
                Вони прийшли з реального спостереження: де люди кидають процес і йдуть.
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Критерій</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Чому важливо</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Швидкий старт</TableCell>
                      <TableCell>Хвилина від ідеї до посилання - інакше людина закриває вкладку</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Гості без реєстрації</TableCell>
                      <TableCell>Кожен зайвий крок відсіває частину гостей - реєстрація відсіває найбільше</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Анонімне бронювання</TableCell>
                      <TableCell>Гість каже «я беру це» так, щоб власник не знав хто - сюрприз зберігається</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Будь-які магазини</TableCell>
                      <TableCell>Rozetka, Prom, невеликий локальний бренд - не треба обирати один магазин</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Безкоштовно / без реклами</TableCell>
                      <TableCell>Банери відволікають гостей і погіршують мобільний досвід</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Мобільний досвід</TableCell>
                      <TableCell>Більшість гостей відкриє посилання зі смартфона, не з ноутбука</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Порівняння основних варіантів 📊
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Варіант</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Будь-які магазини</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Гості без акаунту</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Бронювання без дублів</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Безкоштовно</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>WishList App</TableCell>
                      <TableCell>Так</TableCell>
                      <TableCell>Так</TableCell>
                      <TableCell>Так, анонімно</TableCell>
                      <TableCell>Так, без реклами</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Маркетплейс (Rozetka / Prom)</TableCell>
                      <TableCell>Лише один сайт</TableCell>
                      <TableCell>Так</TableCell>
                      <TableCell>Частково</TableCell>
                      <TableCell>Так</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Google Docs / Sheets</TableCell>
                      <TableCell>Вручну</TableCell>
                      <TableCell>Так (через посилання)</TableCell>
                      <TableCell>Немає</TableCell>
                      <TableCell>Так</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Telegram (чат / нотатки)</TableCell>
                      <TableCell>Вручну</TableCell>
                      <TableCell>Всі вже там</TableCell>
                      <TableCell>Немає</TableCell>
                      <TableCell>Так</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Детальніше про кожен варіант
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Маркетплейс (Rozetka, Prom, Epicentr)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Зручні, якщо всі покупки - з одного сайту. Але як тільки хочеш додати щось з іншого місця -
                наприклад, книгу з невеликого видавництва або річ з Instagram-магазину - система ламається.
                Доводиться або обмежувати себе, або вести паралельний список десь в іншому місці.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Google Docs / Sheets
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Гнучко і безкоштовно назавжди. Я сам так робив до того, як написав WishList App. Проблема
                одна: немає автоматики. Хтось має вручну написати «я беру» в коментарі або редагувати
                таблицю. Я особисто бачив, як двоє гостей купили одне й те саме, бо написали майже
                одночасно і не побачили один одного.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Telegram
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Усі вже там, і це реальна перевага. Якщо гостей мало і всі одне одного знають - Telegram
                справляється. Але список губиться в потоці повідомлень. Бронювання немає - доводиться
                писати в чат «я беру кавову машину» і сподіватися, що всі побачили.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                WishList App - мій вибір, буду чесним
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Я зробив цей сервіс, тому не можу бути повністю нейтральним. Але ось що я намагався
                вирішити: один лінк, будь-які магазини, гості без реєстрації, анонімне бронювання без
                дублів. Це не повноцінна платформа реєстрів - це мінімалістичний інструмент для одного
                завдання. Якщо вам потрібно більше, поєднуйте.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Коли що обрати
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Сценарій</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Мій вибір</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>День народження, товари з різних магазинів</TableCell>
                      <TableCell>WishList App</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Всі покупки лише з одного маркетплейсу</TableCell>
                      <TableCell>Вішліст маркетплейсу</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Мала група, бронювання не потрібне</TableCell>
                      <TableCell>Telegram або Google Docs</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Корпоратив, внутрішній Secret Santa</TableCell>
                      <TableCell>WishList App або Google Sheets</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Весільний реєстр в одному великому магазині</TableCell>
                      <TableCell>Реєстр магазину + WishList App для решти</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Box sx={{ mt: 2 }}>
                <Button component={RouterLink} to={`/${routeLang}`} variant="contained" size="large">
                  {th('createBtn')}
                </Button>
              </Box>
            </section>

            <section>
              <Typography variant="body1">
                Більше за темою:{' '}
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
