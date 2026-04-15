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

const SLUG = 'yak-zrobyty-vishlist-na-den-narodzhennya';

export default function YakZrobytyVishlistNaDenNarodzhennyaArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG)!;

  return (
    <>
      <SEOHead
        lang="uk"
        title="Як зробити вішліст на день народження - 4 кроки | WishList App"
        description="Я проєктував WishList App саме для ДН. Ось мій 4-кроковий метод: чітка назва, реальні посилання, опис із деталями і анонімне бронювання."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="як зробити вішліст на день народження, вішліст день народження, список бажань дн, список подарунків онлайн, зробити вішліст"
        structured={{
          article: {
            headline: 'Як зробити вішліст на день народження - метод, яким користуюся сам',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          howTo: {
            name: 'Зробити вішліст на день народження',
            description: 'Чотири кроки: назва з роком, товари з посиланнями і описом, одне повідомлення в чат, пояснення про бронювання.',
            steps: [
              { text: 'Дайте назву з роком або віком - наприклад, «День народження 2026». Гості одразу розуміють контекст.' },
              { text: 'Додайте кожен товар з реальним посиланням і описом. В описі можна вказати орієнтовну ціну, колір, модель - окремого поля для ціни немає, але вільний текст підходить для цього.' },
              { text: 'Підготуйте одне коротке повідомлення з лінком на вішліст і надішліть у той чат де збираються гості.' },
              { text: 'Поясніть гостям що можна анонімно забронювати подарунок - вони побачать що вже зайнято, ти не побачиш хто купив.' },
            ],
          },
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Як зробити вішліст на день народження', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Як зробити вішліст на день народження - метод, яким користуюся сам
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            День народження - це сценарій номер один у WishList App. Я бачив багато списків, які «вмирали»:
            посилання загубилося в чаті, товари були без URL, ніхто не знав що вже куплено. Ось
            чотири кроки, які я виробив для себе і закладав у логіку сервісу.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Мій 4-кроковий метод
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                1. Чітка назва з роком або віком
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                «Список» або «Мій вішліст» - погані назви. «День народження 2026» або «30 років -
                список бажань» одразу дають гостю контекст. Особливо корисно, якщо людина відкриє
                посилання через місяць після того, як ви його надіслали.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                2. Кожен товар - реальне посилання і опис
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Товар без посилання - це загадка для гостя. Він не знає де купити, яка точно модель,
                який колір. Я завжди додаю посилання навіть якщо «і так зрозуміло». В полі «Опис»
                пишу що важливо: орієнтовну ціну, колір, розмір. Окремого поля для ціни немає -
                але вільний текст дозволяє написати все що потрібно.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                3. Одне повідомлення-шаблон з лінком
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Я роблю так: одне коротке повідомлення в той чат де є всі гості. Не окремо кожному.
                Не три різних посилання. Одне - і всі мають доступ. Щось на кшталт: «Зробив список
                бажань якщо хочете підказку для подарунка - ось посилання».
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                4. Поясни гостям про анонімне бронювання
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Це не очевидно для людей, які вперше бачать вішліст. Треба коротко пояснити:
                кожен може натиснути «Забронювати» на тому, що планує купити. Інші побачать що
                ця позиція вже зайнята. Власник вішліста не бачить хто саме забронював - сюрприз
                залишається сюрпризом.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що включати, а що ні
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Тип товару</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Включати</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Чому</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Конкретна річ з посиланням</TableCell>
                      <TableCell>Так</TableCell>
                      <TableCell>Гість знає що і де купити</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Загальна категорія («шарф», «книга»)</TableCell>
                      <TableCell>Краще ні</TableCell>
                      <TableCell>Без конкретики гість губиться або купить не те</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Дорогі речі (понад 3000 грн)</TableCell>
                      <TableCell>Так, але 1-2 штуки</TableCell>
                      <TableCell>Можливість скластися кільком людям</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Дрібниці до 200-300 грн</TableCell>
                      <TableCell>Так, кілька варіантів</TableCell>
                      <TableCell>Для тих, хто хоче подарувати щось невелике</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Послуги (масаж, курс)</TableCell>
                      <TableCell>Так, якщо є посилання на оплату</TableCell>
                      <TableCell>Нестандартно і запам&apos;ятовується</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як ефективно поділитися
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Кілька практичних порад із досвіду:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1">
                  - Надсилайте за 2-3 тижні до події. Не за 2 дні - гостям потрібен час на замовлення
                </Typography>
                <Typography variant="body1">
                  - Один чат - одне посилання. Не дублюйте в кількох місцях, бо втратите контроль хто що бачив
                </Typography>
                <Typography variant="body1">
                  - Telegram, Viber, або будь-який месенджер де є всі - підходять однаково
                </Typography>
                <Typography variant="body1">
                  - Якщо є гості з-за кордону - WishList App відкривається без VPN і регіональних обмежень
                </Typography>
              </Stack>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Типові помилки
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Помилка</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Що відбувається</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Як виправити</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Товари без посилань</TableCell>
                      <TableCell>Гость не знає де купити, пише в чат, ти відволікаєшся</TableCell>
                      <TableCell>Завжди додавай конкретний URL</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Надто дорогі речі без альтернатив</TableCell>
                      <TableCell>Гості соромляться і нічого не беруть</TableCell>
                      <TableCell>Додай речі в різних цінових категоріях</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Надіслали за 2 дні до події</TableCell>
                      <TableCell>Нічого не встигає доїхати поштою</TableCell>
                      <TableCell>Надсилати за 2-3 тижні заздалегідь</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Не пояснили про бронювання</TableCell>
                      <TableCell>Двоє купують одне й те саме</TableCell>
                      <TableCell>Додай одне речення в повідомлення з посиланням</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Хочеш подивитися як це виглядає -{' '}
                <RouterLink to={`/${routeLang}/wishlist/birthday-list-ua`}>
                  ось демо-вішліст на день народження
                </RouterLink>
                .
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
                <RouterLink to={`/${routeLang}/blog/yak-podilytysia-vishlistom-bez-dublikativ`}>
                  як поділитися вішлістом без однакових подарунків
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
