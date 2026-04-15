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

const SLUG = 'yak-podilytysia-vishlistom-bez-dublikativ';

export default function YakPodilytysiaVishlistomBezDublikativArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG)!;

  return (
    <>
      <SEOHead
        lang="uk"
        title="Як поділитися вішлістом і уникнути однакових подарунків | WishList App"
        description="Я спроєктував анонімне бронювання у WishList App саме для цього. Пояснюю як поділитися вішлістом так, щоб гості не купили одне й те саме."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="поділитися вішлістом, як поділитися списком бажань, уникнути однакових подарунків, анонімне бронювання подарунків, вішліст без дублів"
        structured={{
          article: {
            headline: 'Як поділитися вішлістом і не отримати два однакові подарунки',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          howTo: {
            name: 'Поділитися вішлістом без однакових подарунків',
            description: 'П\'ять кроків від створення списку до успішного свята: товари з посиланнями, одне посилання для гостей, анонімне бронювання.',
            steps: [
              { text: 'Створіть список і додайте товари з посиланнями та описом. В описі можна вказати орієнтовну ціну або деталі товару.' },
              { text: 'Скопіюйте одне посилання на вішліст - воно не потребує реєстрації від гостей.' },
              { text: 'Надішліть посилання в той чат де збираються гості - один раз, одне місце.' },
              { text: 'Гість відкриває список і натискає «Забронювати» навпроти того що планує купити.' },
              { text: 'Список оновлюється для всіх - заброньовані позиції позначені, дублів не буде.' },
            ],
          },
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Як поділитися вішлістом без дублів', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Як поділитися вішлістом і не отримати два однакові подарунки
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Це питання я чую найчастіше після «чи безкоштовно». Проблема дублів - це реальна болячка
            будь-якого дня народження. Я проєктував механіку бронювання саме для цього, і хочу
            пояснити як це працює зсередини.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як це технічно працює
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Хто</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Що бачить</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Що може зробити</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Власник (ти)</TableCell>
                      <TableCell>Список і які позиції заброньовано - без імен покупців</TableCell>
                      <TableCell>Редагувати список, додавати товари</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Гість</TableCell>
                      <TableCell>Повний список, які позиції вільні, які зайняті</TableCell>
                      <TableCell>Забронювати вільну позицію анонімно</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Інші гості</TableCell>
                      <TableCell>Оновлений список з актуальним статусом бронювання</TableCell>
                      <TableCell>Бронювати інші вільні позиції</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Покроково: від списку до успішного свята 🎉
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                1. Створіть список і додайте товари з посиланнями
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Кожен товар повинен мати посилання - без нього гість не знає де купити. Додай також
                В полі «Опис» можна написати орієнтовну ціну або інші деталі (колір, розмір) -
                гості одразу розуміють що саме ви хочете і чи вписується це в їхній бюджет.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                2. Скопіюйте одне посилання
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                WishList App дає одне приватне посилання на твій список. Гостям не потрібно реєструватися
                або мати акаунт - просто відкрити лінк у браузері. Це знижує тертя до мінімуму.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                3. Надішліть у той чат де збираються гості
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Одне повідомлення, один лінк, один чат - і всі мають доступ. Telegram, Viber, будь-який
                месенджер підходить. Надсилайте за 2-3 тижні щоб гості встигли замовити поштою.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                4. Гість натискає «Забронювати» на тому, що купує
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Гість відкриває список, бачить вільні позиції, вибирає що купує і натискає
                «Забронювати». Більше нічого не потрібно - жодної реєстрації, жодного пароля.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                5. Список автоматично оновлюється для всіх
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Після бронювання позиція одразу показується як зайнята для всіх інших гостей.
                В реальному часі - немає затримок, немає ризику що двоє забронюють одне.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Типові сценарії
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Сценарій</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Що відбувається</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Результат</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Двоє гостей одночасно відкрили список</TableCell>
                      <TableCell>Обидва бачать однакові вільні позиції</TableCell>
                      <TableCell>Перший хто забронює - отримує позицію, другий бачить що зайнято</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Гість забронював і передумав</TableCell>
                      <TableCell>Гість не може скасувати - тільки власник вішліста може зняти бронювання</TableCell>
                      <TableCell>Власник натискає на заброньовану позицію і вона знову стає вільною</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Власник хоче дізнатися хто купив</TableCell>
                      <TableCell>Система не показує імена покупців власнику</TableCell>
                      <TableCell>Сюрприз залишається сюрпризом до свята</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Гість не розуміє як бронювати</TableCell>
                      <TableCell>Кнопка «Забронювати» є на кожній вільній позиції</TableCell>
                      <TableCell>Один клік - позиція заброньована</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що я навмисно приховую від власника - і чому
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Це свідоме дизайн-рішення: власник вішліста бачить що певна позиція вже заброньована,
                але не бачить хто саме це зробив. Причина проста - якщо власник знає що «Іван купує
                навушники», сюрприз зіпсований. Анонімність бронювання захищає інтригу.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Це також знижує соціальний тиск на гостей: ніхто не дізнається що ти взяв недорогу
                річ або що ти взагалі нічого не взяв. Кожен вирішує для себе.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Часті питання
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Що робити якщо хтось помилково забронював не ту річ?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Гість не може скасувати своє бронювання самостійно - після того як позиція зайнята,
                гість більше не може її змінити. Власник вішліста може зняти бронювання, натиснувши
                на заброньовану позицію. Власник не бачить хто саме бронював - тільки факт бронювання.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Чи може власник скасувати бронювання?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Так - власник може натиснути на будь-яку позицію і переключити її стан. Це корисно
                коли бронювання було помилковим або подарунок вже куплено іншим способом. При цьому
                власник не дізнається хто саме бронював - анонімність зберігається.
              </Typography>
            </section>

            <section>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Можна подивитися як це виглядає на практиці -{' '}
                <RouterLink to={`/${routeLang}/wishlist/birthday-list-ua`}>
                  демо-вішліст на день народження
                </RouterLink>
                {' '}або{' '}
                <RouterLink to={`/${routeLang}/wishlist/secret-santa-list-ua`}>
                  демо для Secret Santa
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
                <RouterLink to={`/${routeLang}/blog/yak-zrobyty-vishlist-na-den-narodzhennya`}>
                  як зробити вішліст на день народження
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
