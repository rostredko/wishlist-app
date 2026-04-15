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

const SLUG = 'yak-spysky-zminyuyut-zhyttia';

export default function YakSpyskyZminyuyutZhyttiaArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG)!;

  return (
    <>
      <SEOHead
        lang="uk"
        title="Чому я веду списки з дитинства - і як вони справді змінюють життя | WishList App"
        description="Я писав списки відтоді, як пам'ятаю себе. Вішлісти на Святого Миколая, Різдво, день народження, 1 вересня. Ось що я дізнався про те, як списки впливають на продуктивність і структурують думки."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="сила списків, як списки впливають на продуктивність, вішліст на свята, вішліст на Святого Миколая, вішліст на Різдво, вішліст на день народження, як вести списки"
        structured={{
          article: {
            headline: 'Чому я веду списки з дитинства - і як вони справді змінюють життя',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Чому я веду списки з дитинства', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Чому я веду списки з дитинства - і як вони справді змінюють життя
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Свій перший вішліст я написав у шість років. Це був список для Святого Миколая - аркуш
            паперу, який я акуратно поклав на підвіконня 5 грудня ввечері. Три позиції, найкращий почерк.
            Я вже не пам&apos;ятаю, що саме просив, але добре пам&apos;ятаю, яке відчуття дало це написати:
            ясність, зосередженість, майже полегшення. Це відчуття зі мною до сьогодні.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як усе починалося - списки з самого дитинства
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Зростаючи, я писав списки для всього. Список шкільного приладдя на 1 вересня. Вішліст
                на Різдво в грудні. Список бажань на Новий рік - наполовину мрії, наполовину наміри.
                Список подарунків на день народження, який я уважно оновлював щороку: завжди за
                пріоритетом, завжди з принаймні приблизним розумінням, де це можна купити.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Батьки посміхалися. Друзі трохи дивувалися. Але ось що я помітив: мені ніколи не дарували
                дві однакові речі. Я ніколи не забував, чого насправді хочу. І сам процес написання
                робив бажання більш реальним - ніби воно вже наполовину здійснилося.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Це не стосувалося тільки вішлістів. Я вів списки продуктів, книг, фільмів, що подивитися,
                речей для поїздки. До старшої школи в мене вже був окремий зошит тільки для списків. Без
                щоденникових записів, без есе - тільки списки. Акуратні, конкретні, регулярно переглянуті.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що я зрозумів за роки ведення списків
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                З часом я почав звертати увагу на те, що робить список корисним, а що перетворює
                його на марно витрачений папір. Помічав закономірності. Читав про психологію і
                продуктивність. І виявив, що те, що я робив за інтуїцією, добре збігається з тим,
                як насправді працює наш мозок.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ключова ідея проста: робоча пам&apos;ять людини невелика. Мозок може активно утримувати
                приблизно чотири-сім елементів одночасно. Коли намагаєшся тримати в голові більше -
                список продуктів, робочий дедлайн, подарунок, який треба купити, - все конкурує
                за простір. Ти щось пропускаєш. Відчуваєш тривогу без чіткої причини.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Список знімає цей тиск. Ти переносиш елементи з голови на папір або екран - і мозок
                перестає гнати їх по колу. Психологи називають це ефектом Зейгарнік: незавершені
                завдання створюють ментальний шум. Список закриває цей цикл. Ти записав - можна
                більше не хвилюватися, що забудеш.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Саме тому я завжди краще сплю після того, як написав докладний список завдань на
                завтра. Список запам&apos;ятовує замість мене.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Списки і продуктивність - що насправді працює
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Тип списку</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Коли використовувати</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Користь</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Список завдань на день</TableCell>
                      <TableCell>Щоранку, максимум 5-7 пунктів</TableCell>
                      <TableCell>Перетворює розмиті наміри на конкретний план</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Список &quot;колись потім&quot;</TableCell>
                      <TableCell>Ідеї, на які зараз немає часу або ресурсів</TableCell>
                      <TableCell>Зупиняє ідеї від того, щоб займати місце в голові сьогодні</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Чеклист проєкту</TableCell>
                      <TableCell>Будь-яке багатоетапне завдання</TableCell>
                      <TableCell>Не дає пропустити кроки під тиском</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Вішліст</TableCell>
                      <TableCell>Перед будь-яким святом або днем народження</TableCell>
                      <TableCell>Координує подарунки без незручних розмов</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Список &quot;не робити&quot;</TableCell>
                      <TableCell>Коли раз за разом потрапляєш в одні пастки</TableCell>
                      <TableCell>Робить шкідливі звички помітними та легшими для зміни</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Список книг / фільмів</TableCell>
                      <TableCell>Постійно, коли хтось щось рекомендує</TableCell>
                      <TableCell>Зберігає рекомендації до того, як ти забудеш, хто радив</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                Ключова різниця між списком, що допомагає, і списком, що перетворюється на архів
                провини, - конкретність. &quot;Прибрати квартиру&quot; - це не пункт списку, це ціла задача.
                &quot;Протерти стільницю на кухні&quot; - це пункт списку. Одна дія, одна позиція. Чітко
                і без зайвого.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Вішлісти по святах - що популярно в Україні
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Я роблю вішлісти приблизно так само, як інші роблять плейлисти - з увагою, сезонно,
                і завжди заздалегідь. Ось що я бачу в українському контексті для кожного свята.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                День народження
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Головний привід для вішліста цілий рік. Я веду постійний список і оновлюю його, коли
                знаходжу щось, чого хочу. Перед днем народження ділюся посиланням. Після свята
                архівую те, що отримав, і тримаю решту на наступний рік. Живий документ, не
                одноразова нотатка.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Святий Миколай (6 грудня)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Для мене це завжди було першим справжнім зимовим святом. Особливо для дітей - Миколай
                несе подарунки в ніч з 5 на 6 грудня, і список для нього треба підготувати заздалегідь.
                Діти пишуть листи Миколаю, батьки використовують ці листи як вішлісти. Кілька конкретних
                бажань, реалістичні ціни - і радість гарантована.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Новий рік (31 грудня - 1 січня)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Головне зимове свято в Україні. Я завжди пишу два списки. Один - вішліст з подарунками
                (поки актуальний між Миколаєм і Новим роком). Другий - те, що я хочу зробити в
                наступному році. Не &quot;буду ходити в спортзал&quot;, а &quot;хочу прочитати 12 книг, відвідати
                одне нове місто, навчитися готувати квасолевий суп&quot;. Таке формулювання змінює
                відчуття: від зобов&apos;язання до наміру.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Різдво (25 грудня і 7 січня)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                В Україні відзначають обидві дати - і католицьке, і православне Різдво. Це означає
                ще одну хвилю подарунків після Нового року. Хороший вішліст на Різдво - це коротко і
                тепло: книги, домашні речі, щось для відпочинку. Ділитися ним краще за 2-3 тижні до
                свята, щоб все встигло доїхати поштою.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                1 вересня - День знань
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                1 вересня - одне з моїх найулюбленіших дитячих свят. Нові зошити, ручки, запах
                навчального року. Список до 1 вересня практичний за своєю природою: канцелярія,
                електроніка, рюкзак. Але він також чудово працює як координаційний інструмент -
                надіслати бабусі або дідусеві, які хочуть допомогти, але не знають, що потрібно
                сьомокласнику цього року.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Великдень (березень-квітень)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Традиційно більше свято для дітей, але в багатьох родинах дорослі теж отримують
                подарунки. Тут добре підходять короткі списки - щось маленьке і приємне: хороший
                чай, крем, книга, річ для дому. Нічого практичного - тільки те, що радує.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                День матері і День батька
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ці два свята мають одну й ту саму проблему: той, кому дарують, рідко каже, чого хоче,
                а той, хто дарує, не знає що обрати. Вішліст від батька чи мами - це подарунок сам
                по собі. Якщо ваші батьки не звикли складати списки, просто запитайте їх - навіть
                три пункти повністю змінюють ситуацію.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Маланка і Старий Новий рік (13-14 січня)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Традиційно українське свято, яке мало де відзначають у світі так само. Здебільшого
                без обміну подарунками, але для тих, хто святкує в родинному колі, - це ще одна
                тепла нагода згадати, чого хочуть близькі.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як почати - звичка до списків на практиці
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1">
                  - Почни з одного списку, а не п&apos;яти. Вибери той формат, який зараз створює
                  найбільше проблем: подарунки до свята, планування дня або збори у поїздку.
                </Typography>
                <Typography variant="body1">
                  - Записуй одразу. Те, що ти ось-ось забудеш прямо зараз, - перше, що треба
                  занотувати.
                </Typography>
                <Typography variant="body1">
                  - Переглядай і скорочуй. Список із 40 позицій - це рецепт тривоги. Тримай список
                  завдань коротким. Тримай вішліст реалістичним.
                </Typography>
                <Typography variant="body1">
                  - Ділися вішлістом заздалегідь. За 2-3 тижні до свята - мінімум для всього,
                  що потрібно замовити поштою.
                </Typography>
                <Typography variant="body1">
                  - Не вибачайся за те, що маєш вішліст. Це полегшує вибір подарунків усім -
                  і тобі, і тим, хто тебе любить.
                </Typography>
              </Stack>
            </section>

            <section>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Я зробив{' '}
                <RouterLink to={`/${routeLang}`}>WishList App</RouterLink>{' '}
                саме тому, що хотів просте місце для таких списків - зручне для поширення, легке в
                оновленні, з анонімним бронюванням, яке не дає двом людям купити одне й те саме. Якщо
                хочеш подивитися як виглядає готовий вішліст,{' '}
                <RouterLink to={`/${routeLang}/wishlist/birthday-list-ua`}>
                  демо-вішліст на день народження
                </RouterLink>{' '}
                - хороший старт.
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
