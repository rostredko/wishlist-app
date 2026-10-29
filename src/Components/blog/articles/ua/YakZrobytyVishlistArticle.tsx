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
import { resolveBlogAlternates } from '@constants/blogArticles';
import type { BlogArticleProps } from '@components/blog/blogArticleTypes';
import { BlogArticleFooter } from '@components/blog/BlogArticleFooter';

const SLUG = 'yak-zrobyty-vishlist';
const PUBLISHED = '2026-07-03';

export default function YakZrobytyVishlistArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG);

  return (
    <>
      <SEOHead
        lang="uk"
        title="Як зробити вішліст, з якого справді дарують | WishList App Blog"
        description="Одного року я отримав три однакові книжки. Розповідаю, як зробити вішліст, який це виправляє: де зробити безкоштовно, що додати і як поділитися без незручності."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="як зробити вішліст, де зробити вішліст, що таке вішліст, зробити список бажань, вішліст безкоштовно, як поділитися вішлістом"
        structured={{
          article: {
            headline: 'Як зробити вішліст, з якого справді дарують',
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
          },
          howTo: {
            name: 'Зробити вішліст онлайн',
            description: "П'ять кроків від порожньої сторінки до списку бажань, яким реально користуються гості.",
            steps: [
              { text: 'Увійдіть у сервіс вішлістів - у WishList App достатньо Google-акаунта, створення списку займає близько 30 секунд.' },
              { text: 'Назвіть список за приводом: «День народження 2026», «Новосілля» - чітка назва одразу пояснює гостям контекст.' },
              { text: 'Додайте кожен товар з прямим посиланням на магазин і коротким описом - орієнтовна ціна, розмір чи колір, щоб ніхто не вгадував.' },
              { text: 'Поділіться одним приватним лінком у чаті, де вже спілкуються ваші близькі - гостям не потрібна реєстрація.' },
              { text: 'Поясніть гостям про анонімне бронювання - всі бачать, що зайнято, але ніхто не бачить, хто саме забронював. Дублікатів не буде.' },
            ],
          },
          faq: [
            {
              q: 'Що таке вішліст?',
              a: "Вішліст (список бажань) - це перелік речей, які ви хотіли б отримати в подарунок, з посиланнями на магазини. Ви ділитеся ним перед днем народження, святом чи весіллям, щоб близькі не вгадували. У хорошому сервісі гості ще й бронюють подарунки анонімно - тому два однакові подарунки не трапляються.",
            },
            {
              q: 'Де зробити вішліст безкоштовно?',
              a: 'WishList App повністю безкоштовний і без реклами: вхід через Google, товари з будь-якого магазину, один лінк для всіх гостей. Вішлісти в магазинах теж безкоштовні, але прив’язують вас до одного магазину.',
            },
            {
              q: 'Чи потрібна гостям реєстрація?',
              a: 'Ні. Будь-хто з посиланням відкриває список і анонімно бронює подарунок без жодної реєстрації. Акаунт потрібен лише власнику списку.',
            },
            {
              q: 'Що додати у вішліст?',
              a: 'Конкретні речі з прямими посиланнями: точна модель, колір, розмір. Додайте короткий опис з орієнтовною ціною і змішайте кілька цінових рівнів, щоб кожен гість знайшов варіант під свій бюджет.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Як зробити вішліст', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Як зробити вішліст, з якого справді дарують
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Одного року я розгорнув ту саму книжку тричі. Та сама обкладинка, те саме видання, троє
            різних родичів - і кожен щиро пишався ідеєю. Першого разу я сміявся. На третьому вже
            робив те обличчя, яким вдають здивування. Увечері мама сказала: «Ну а що ти хотів,
            треба було сказати, що тобі дарувати». І вона мала рацію, і мене це роздратувало на
            роки вперед - аж поки не перетворилося на цей сервіс. Тож це не нейтральна інструкція.
            Це все, що я встиг зробити неправильно, поки не вийшло правильно.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що я пробував спочатку (щоб ви пропустили ці етапи)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                До того як щось будувати, я пройшов усю еволюцію вішліст-технологій. Кожен етап
                помер по-своєму:
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Спроба</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Як воно померло</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Сказати вголос</TableCell>
                      <TableCell>Ніхто в грудні не пам&apos;ятає відповідь, сказану в жовтні</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Google Doc, закріплений у сімейному чаті</TableCell>
                      <TableCell>Тітка користувалася скриншотом двотижневої давності. Дублікат все одно трапився</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Вішліст в одному магазині</TableCell>
                      <TableCell>Річ, яку я хотів найбільше, продавалася в маленькій місцевій крамниці. У каталозі її не було - отже, і в списку</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>«Та здивуйте мене»</TableCell>
                      <TableCell>Три однакові книжки. Дивіться вище</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2 }}>
                У кожного провалу один корінь: список і координація жили в різних місцях. Люди
                бачили, що я хочу, але не бачили, що вже купив хтось інший. Ця друга половина - і є
                вся суть проблеми.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що таке вішліст насправді 🎁
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Вішліст (від англ. wishlist; ще пишуть «вишлист», «вішлист», «віш лист» або «віш
                ліст») - це список бажань, або список побажань: подарунки з посиланнями на магазини,
                якими ви ділитеся одним посиланням. Все. Весільні реєстри працюють так уже сто років, інтернет лише прибрав
                із схеми універмаг. Єдине справді нове - анонімне бронювання: гості тихенько
                позначають, що купують, інші бачать «зайнято», а ви не бачите нічого. Подарунки
                перестають дублюватися, сюрприз живий.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                І ні, це не жадібність. Мені теж спершу було ніяково. А потім я подивився на це з
                боку тих, хто дарує: друзі перестали панікувати. Вибрати подарунок зі списку - дві
                хвилини, і влучання гарантоване. Вгадувати - вихідні, і шанси п&apos;ятдесят на
                п&apos;ятдесят. Список - це послуга тому, хто дарує, а не вимога від вас. Мені
                знадобилося соромно багато часу, щоб у це повірити.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як я роблю вішліст тепер - версія на 30 секунд
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Технічна частина справді швидка. Думати треба над наповненням - до нього й дійдемо.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                1. Увійти і назвати список за приводом
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Вхід через Google, новий список, готово. Називаю як файли: «День народження 2026»,
                «Новосілля». Мій перший список називався «всяке», і друг цілком серйозно спитав, чи
                це не список для переїзду. Називайте привід.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                2. Реальні посилання, а не настрій
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                «Класні навушники» - це настрій. Посилання на конкретну модель у конкретному
                кольорі - це подарунок. Я вставляю сторінку товару з будь-якого магазину, будь-якої
                країни, і додаю один рядок контексту: «~1500 грн, зелені, розмір M». Цей рядок
                працює більше за все інше в списку.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                3. Змішати ціни навмисно
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Кілька дрібниць, кілька середніх позицій, одна чесна мрія з підписом «мрія». Список,
                де все дороге, читається як рахунок до сплати. А пачка хорошої кави за 300 грн у
                списку каже студентові-племіннику: тобі тут теж раді.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                4. Один лінк для всіх
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Надсилаю той самий URL у кожен чат. Ніколи не дві копії у двох місцях: саме так
                скриншот тітки переміг мій Google Doc. Гості відкривають у браузері, без акаунта і
                без встановлення застосунків.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                5. Сказати про бронювання вголос
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Кнопку бронювання самостійно не знаходить ніхто, тому я прямо пишу в повідомленні:
                «можна тицьнути на подарунок і позначити, що береш - я не побачу, хто саме». Одне
                речення відділяє вішліст від лотереї. Детальніше про це - у статті{' '}
                <RouterLink to={`/${routeLang}/blog/yak-podilytysia-vishlistom-bez-dublikativ`}>
                  як поділитися вішлістом без дублікатів
                </RouterLink>
                .
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Повідомлення, яке я реально надсилаю
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Слово в слово, з мого минулого дня народження:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  «Якщо збиралися щось дарувати - ось що мені справді згодиться: [лінк]. Зовсім не
                  обов&apos;язково. Там можна позначити подарунок, щоб ніхто не купив однакове. Я
                  не побачу, хто що обрав».
                </Typography>
              </Paper>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Три речення. Найгірше, що мені на це відповідали - лайк. Страх, що хтось подумає
                «ну й нахаба»? За чотири роки і тисячі списків, які пройшли через сервіс, я не
                бачив цього жодного разу. Важливіший за формулювання - момент:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Надсилайте за 3-4 тижні, щоб повільна доставка не стала проблемою гостей.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Найкращий момент - коли хтось сам питає «що тобі подарувати?». Це питання і є
                  підписаний дозвіл.
                </Typography>
                <Typography component="li" variant="body1">
                  Прибирайте зайве вчасно. Я якось на місяць залишив у списку чайник, який уже
                  купив собі сам. Друг був не в захваті.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Питання, які мені ставлять постійно
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Де зробити вішліст безкоштовно?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                WishList App безкоштовний, без реклами і без платних тарифів - так задумано, і це
                тема для окремого поста. Вішлісти в магазинах теж безкоштовні, але прив&apos;язують
                до одного каталогу - саме так я колись втратив подарунок із місцевої крамниці.
                Чесне порівняння сервісів - у статті{' '}
                <RouterLink to={`/${routeLang}/blog/de-stvoryty-vishlist-2026`}>
                  де створити вішліст у 2026
                </RouterLink>
                .
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Чи потрібна гостям реєстрація?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ні. Для мене це принципово: щойно гість бачить форму реєстрації - ви втратили
                подарунок. Акаунт потрібен лише власнику списку, гості просто відкривають лінк і
                бронюють.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Що додати у вішліст?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Для протоколу, мій список просто зараз: хороші бігові шкарпетки (ті дорогі, які сам
                собі ніколи не куплю), конкретна настільна гра, темпер для кави на 51 мм, бо
                минулого разу я помилився з розміром, і одна чесно підписана мрія - офісне крісло,
                яке ніхто не зобов&apos;язаний купувати. Конкретно, з лінками, різні ціни, одна
                мрія. Ця формула мене ще не підводила.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Підгляньте готовий список замість порожньої сторінки
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Порожня сторінка - місце, де вішлісти помирають, тому в нас є живі приклади:{' '}
                <RouterLink to={`/${routeLang}/wishlist/birthday-list-ua`}>день народження</RouterLink>,{' '}
                <RouterLink to={`/${routeLang}/wishlist/christmas-list-ua`}>Новий рік</RouterLink>,{' '}
                <RouterLink to={`/${routeLang}/wishlist/wedding-list-ua`}>весілля</RouterLink> та{' '}
                <RouterLink to={`/${routeLang}/wishlist/secret-santa-list-ua`}>Таємний Санта</RouterLink>.
                А для дня народження є{' '}
                <RouterLink to={`/${routeLang}/blog/yak-zrobyty-vishlist-na-den-narodzhennya`}>
                  окремий чекліст
                </RouterLink>{' '}
                з нюансами. Збираєте список на зимові свята? У статті{' '}
                <RouterLink to={`/${routeLang}/blog/vishlist-na-novyj-rik-i-rizdvo`}>
                  вішліст на Новий рік і Різдво
                </RouterLink>{' '}
                - що змінюється, коли подарунки купує вся родина одночасно.
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}`} state={{ creationSource: 'blog' }}
                variant="contained"
                size="large"
              >
                {th('createBtn')}
              </Button>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Схожі статті
              </Typography>
              <Typography variant="body1">
                Порівнюєте українські сервіси -{' '}
                <RouterLink to={`/${routeLang}/blog/najkrashchi-servisy-spysku-bazhan-v-ukraini`}>
                  найкращі сервіси для списку бажань в Україні
                </RouterLink>
                . Вагаєтесь між вішлістом і табличкою -{' '}
                <RouterLink to={`/${routeLang}/blog/vishlist-chy-google-docs-telegram`}>
                  вішліст чи Google Docs / Telegram
                </RouterLink>
                . А якщо цікаво, звідки взагалі ця любов до списків -{' '}
                <RouterLink to={`/${routeLang}/blog/yak-spysky-zminyuyut-zhyttia`}>
                  вона з дитинства
                </RouterLink>
                .
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} date={PUBLISHED} />
        </Container>
      </Box>
    </>
  );
}
