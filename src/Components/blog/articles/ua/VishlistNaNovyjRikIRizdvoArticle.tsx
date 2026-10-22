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

const SLUG = 'vishlist-na-novyj-rik-i-rizdvo';
const PUBLISHED = '2026-10-22';

export default function VishlistNaNovyjRikIRizdvoArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG);

  return (
    <>
      <SEOHead
        lang="uk"
        title="Вішліст на Новий рік 2027 і Різдво: як скласти і поділитися з рідними"
        description="Як зробити вішліст на Новий рік і Різдво: що додати, як поділитися одним посиланням і уникнути однакових подарунків. Безкоштовно, без реклами."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="вішліст на новий рік, вішліст на різдво, новорічний вішліст, список бажань на новий рік, вішліст на новий рік приклад, вишлист на новий рік"
        structured={{
          article: {
            headline: 'Вішліст на Новий рік і Різдво: як скласти і поділитися з рідними',
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
          },
          howTo: {
            name: 'Зробити вішліст на Новий рік і Різдво',
            description: 'П’ять кроків: назва зі святом, 8-15 подарунків, посилання і ціни в різних бюджетах, примітки про розмір і колір, одне посилання для всієї родини.',
            steps: [
              { text: 'Назвіть список так, щоб було зрозуміло свято, наприклад «Новий рік і Різдво 2027».' },
              { text: 'Додайте 8-15 подарунків, щоб вибір залишився навіть для тих, хто відкриє список останнім.' },
              { text: 'Додайте до кожного подарунка посилання на магазин і орієнтовну ціну, змішуючи різні бюджети.' },
              { text: 'Впишіть в опис розмір, колір або модель, щоб рідним не довелося перепитувати.' },
              { text: 'Надішліть одне посилання в сімейний чат і попросіть бронювати вибрані подарунки.' },
            ],
          },
          faq: [
            {
              q: 'Коли надсилати вішліст на Новий рік?',
              a: 'Найкраще до кінця листопада. Чорна п’ятниця у 2026 році - 27 листопада, і багато хто купує подарунки саме на знижках. До того ж у грудні доставка повільніша, тож три-чотири тижні запасу не зашкодять.',
            },
            {
              q: 'Чи потрібна рідним реєстрація?',
              a: 'Ні. Акаунт Google потрібен лише вам, щоб створити список. Рідні відкривають посилання в будь-якому браузері, переглядають список і бронюють подарунки без реєстрації.',
            },
            {
              q: 'Чи побачу я, хто забронював подарунок?',
              a: 'Ні, імен у списку не бачить ніхто. Але ви бачите, які подарунки вже заброньовано, бо вони позначаються однаково для всіх. Якщо хочете сюрпризу, не відкривайте список після того, як поділилися ним.',
            },
            {
              q: 'Скільки подарунків додати у новорічний вішліст?',
              a: 'Для зимових свят я раджу 8-15. Менше - і тим, хто відкриє список останнім, нічого не залишиться. Більше - і список перетворюється на каталог, у якому важко вибрати.',
            },
            {
              q: 'Чи можна зробити один вішліст на Новий рік і Різдво?',
              a: 'Так, для дорослих це найзручніше: один список і одне посилання на всі зимові свята. Окремий список має сенс для дітей на Миколая і для Таємного Санти, де в групи свій бюджет.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Вішліст на Новий рік і Різдво', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Вішліст на Новий рік і Різдво: як скласти і поділитися з рідними
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            Щоб зробити вішліст на Новий рік, створіть список у WishList App через Google, додайте
            8-15 подарунків із посиланнями, цінами й примітками про розмір чи колір, і надішліть
            одне посилання в сімейний чат. Рідні відкриють його без реєстрації та забронюють
            подарунок - заброньоване бачать усі, тож однакових подарунків не буде.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Зимові свята - єдиний час на рік, коли подарунки вам купують усі одночасно. Батьки,
            сестра, хрещена, колеги - і всі в один і той самий тиждень грудня питають «що тобі
            подарувати?». Історію про три однакові книжки я вже розповідав у статті{' '}
            <RouterLink to={`/${routeLang}/blog/yak-zrobyty-vishlist`}>як зробити вішліст</RouterLink>,
            і сталася вона саме на зимові свята. Відтоді в мене щороку є новорічний вішліст. Нижче -
            як я його складаю і чим він відрізняється від списку на день народження.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як зробити вішліст на Новий рік: 5 кроків
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                1. Назвіть список так, щоб було зрозуміло свято
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                «Новий рік і Різдво 2027» або «Вішліст Олі на свята» - так людина, яка відкриє
                посилання через тиждень, одразу зрозуміє, про що це. Рік у назві списку теж корисний:
                наступної зими ви створите новий список, і рідні не переплутають його зі старим. Назву
                можна змінити будь-коли - достатньо натиснути на неї на сторінці списку.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                2. Додайте 8-15 подарунків
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                На день народження мені вистачає п’яти-семи позицій. На зимові свята список має бути
                довшим, бо дарувальників більше і купують вони майже одночасно. Якщо в списку п’ять
                речей, а родина велика, той, хто відкриє посилання останнім, побачить, що все вже
                заброньовано. Якщо позицій тридцять, список читається як каталог, і з нього важко
                вибрати. Між 8 і 15 - якраз: вибір є, хаосу немає.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                3. Посилання і ціни в різних бюджетах
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Кожен подарунок - з посиланням на конкретний товар у будь-якому магазині. У WishList
                App є необов’язкове поле для орієнтовної ціни й валюти, і я ним користуюся: так рідним
                простіше вибрати річ під свій бюджет, а не вгадувати. Змішуйте ціни навмисно: кілька
                дрібниць, кілька речей середнього рівня і одна-дві дорожчі, на які можна скластися.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Є ще одна причина не відкладати. Чорна п’ятниця у 2026 році припадає на 27 листопада,
                і частина рідних купує новорічні подарунки саме тоді, на знижках. Якщо ваш список
                з’явиться на початку грудня, ці покупки вже будуть зроблені навмання.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                4. Впишіть розмір, колір і модель
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Поле «Опис» - найкорисніше в усьому списку. «Светр, розмір M, тільки не червоний»,
                «Навушники накладні, вкладиші мені незручні», «Книжка українською, паперова». Один
                рядок прибирає десять повідомлень у стилі «а який саме?». Для одягу і взуття я завжди
                пишу розмір: рідні найчастіше його не знають, але соромляться спитати.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                5. Поділіться одним посиланням
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Скопіюйте посилання на список і надішліть його в сімейний чат - один раз, в одне
                місце. Рідним не потрібно реєструватися чи встановлювати застосунок: вони відкривають
                сторінку в браузері, вибирають подарунок і бронюють його. Моє повідомлення виглядає
                приблизно так:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  «Якщо думали, що мені подарувати на свята - ось список: [посилання]. Нічого не
                  обов’язково. Якщо щось обрали, натисніть на подарунок і забронюйте його, щоб ніхто
                  не купив те саме».
                </Typography>
              </Paper>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що додати у вішліст на Новий рік?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Новорічний список трохи відрізняється від списку на день народження. Людей більше,
                бюджети різні, а ще - зима: теплі речі, світло і зарядка на випадок відключень,
                враження на довгі вихідні. Ось як я розкладаю ідеї за бюджетом:
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', '& .MuiTableCell-root': { px: { xs: 1, sm: 2 } } }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Бюджет</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Що підходить</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Для кого</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>До 500 грн</TableCell>
                      <TableCell>Теплі шкарпетки, чай або кава в зернах, ялинкова іграшка, книжка</TableCell>
                      <TableCell>Колеги, племінники і всі, хто хоче подарувати щось невелике</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>500-1500 грн</TableCell>
                      <TableCell>Настільна гра, ковдра, термочашка, сертифікат у книгарню</TableCell>
                      <TableCell>Основна частина списку: тут вибирає більшість рідних</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>1500-3000 грн</TableCell>
                      <TableCell>Павербанк, навушники, квитки на концерт чи у театр</TableCell>
                      <TableCell>Батьки або кілька людей, які скинуться разом</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Понад 3000 грн</TableCell>
                      <TableCell>Одна чесно підписана мрія</TableCell>
                      <TableCell>Примітка «тільки якщо хтось захоче скластися»</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Не додавайте те, що й так купите собі до свят, і речі, потрібні «вже завтра». Готовий
                приклад із дванадцятьма такими подарунками є в демо-списку наприкінці статті - його
                можна скопіювати собі й переробити.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Окремо раджу додати хоча б одне враження: квитки, майстер-клас, сертифікат на
                ковзанку. Зимові вихідні довгі, і вечір, проведений разом, часто запам’ятовується
                краще за річ. У списку враження оформлюється так само, як товар: назва, посилання на
                сторінку з квитками і примітка про зручні дати.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Більше ідей - у статті{' '}
                <RouterLink to={`/${routeLang}/blog/shcho-poprosyty-na-novyj-rik`}>
                  що попросити на Новий рік
                </RouterLink>
                : 70 варіантів у різних бюджетах, від теплих шкарпеток до вражень і донатів.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Які помилки псують новорічний вішліст?
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', '& .MuiTableCell-root': { px: { xs: 1, sm: 2 } } }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Помилка</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Що стається</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Як виправити</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Список надіслали в середині грудня</TableCell>
                      <TableCell>Половину подарунків уже купили навмання</TableCell>
                      <TableCell>Діліться посиланням до кінця листопада</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Тільки дорогі подарунки</TableCell>
                      <TableCell>Рідні соромляться і купують щось своє</TableCell>
                      <TableCell>Додайте кілька речей до 500 грн</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Без розмірів і моделей</TableCell>
                      <TableCell>Светр не того розміру, навушники не того типу</TableCell>
                      <TableCell>Пишіть розмір і колір у примітці</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Різні копії списку в різних чатах</TableCell>
                      <TableCell>Бронювання в одній копії не видно в іншій</TableCell>
                      <TableCell>Одне посилання для всієї родини</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Не попросили бронювати</TableCell>
                      <TableCell>Бронювання ніхто не помічає, і дублікати повертаються</TableCell>
                      <TableCell>Одне речення про бронювання в повідомленні</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Чи нормально надсилати вішліст рідним?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Нормально, якщо вас про це питають. А на зимові свята питають майже завжди. Мені теж
                спочатку було ніяково: здавалося, що список виглядає як вимога. Але з боку того, хто
                дарує, все навпаки. Вибрати подарунок зі списку - п’ять хвилин. Вгадувати - кілька
                вечорів у магазинах і ризик не влучити.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Кілька правил, щоб список не виглядав як рахунок до сплати:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Надсилайте його у відповідь на «що тобі подарувати?» або один раз у сімейний чат, а
                  не кожному окремо з нагадуванням.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Пишіть «нічого не обов’язково» - і щиро так думайте.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Додавайте дрібниці поруч із дорогими речами, щоб кожен знайшов щось під свій бюджет.
                </Typography>
                <Typography component="li" variant="body1">
                  Не нагадуйте більше одного разу.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як уникнути однакових подарунків?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Через бронювання. Коли хтось із рідних вибирає подарунок, він натискає на нього і
                підтверджує бронювання. Після цього подарунок показується як заброньований для всіх,
                хто відкриває список. Другий родич побачить це і вибере інше.
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', '& .MuiTableCell-root': { px: { xs: 1, sm: 2 } }, mb: 2 }}>
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
                      <TableCell>Ви, власник списку</TableCell>
                      <TableCell>Усі подарунки і які з них заброньовано, без імен</TableCell>
                      <TableCell>Додавати й редагувати подарунки, зняти бронювання</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Рідні з посиланням</TableCell>
                      <TableCell>Які подарунки вільні, а які вже зайняті</TableCell>
                      <TableCell>Забронювати вільний подарунок без реєстрації</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Чесно скажу про важливий нюанс: ви як власник теж бачите, що саме заброньовано. Імен
                не видно нікому, але сам факт бронювання видно всім. Якщо хочете, щоб подарунки були
                повною несподіванкою, просто не відкривайте свій список після того, як надіслали
                посилання.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                І ще: бронювання працює, тільки якщо ним користуються. Подарунок, куплений поза
                списком, застосунок не побачить. Тому в повідомленні з посиланням я завжди прошу саме
                бронювати. Детальніше про механіку - у статті{' '}
                <RouterLink to={`/${routeLang}/blog/yak-podilytysia-vishlistom-bez-dublikativ`}>
                  як поділитися вішлістом без однакових подарунків
                </RouterLink>
                .
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як оновлювати вішліст до і після свят?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Список живе кілька тижнів, і його варто підтримувати. Якщо купили щось собі самі,
                видаліть цю позицію, поки її ніхто не забронював. А от заброньований подарунок краще
                не видаляти: людина, яка його забронювала, могла вже оплатити покупку. Нові ідеї
                додавайте спокійно - вони з’являться в списку для всіх, хто відкриває те саме
                посилання, без повторної розсилки.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Після свят список не потрібно видаляти. Наступної зими створіть новий, з новим роком у
                назві, а старий залиште собі як нагадування, що вам уже дарували.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Новий рік, Різдво і Миколай: один список чи кілька?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                В Україні зимові свята тепер ідуть одне за одним. День Святого Миколая - 6 грудня.
                Різдво з 2023 року офіційно святкують 25 грудня: відповідний закон підписали в липні
                2023-го. Далі Новий рік. А частина родин досі відзначає Різдво 7 січня. Подарунки
                можуть знадобитися на кожну з цих дат.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Я раджу розділити так:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Для дорослих - один список «Новий рік і Різдво». Рідні дарують тоді, коли у вашій
                  родині заведено обмінюватися подарунками, а список однаково працює і 25 грудня, і 1
                  січня.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Для дітей - окремий список на Миколая. Подарунки на 6 грудня зазвичай інші, і купувати
                  їх треба раніше. Як скласти такий список разом із дитиною, я розписав у статті{' '}
                  <RouterLink to={`/${routeLang}/blog/lyst-svyatomu-mykolayu`}>
                    лист Святому Миколаю
                  </RouterLink>
                  .
                </Typography>
                <Typography component="li" variant="body1">
                  Для обміну подарунками з колегами чи друзями - окремий список на Таємного Санту в
                  бюджеті групи. Про правила і жеребкування -{' '}
                  <RouterLink to={`/${routeLang}/blog/tayemnyj-santa-pravyla`}>
                    Таємний Санта: правила, бюджет і вішліст
                  </RouterLink>
                  .
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Окремі списки - це не бюрократія. Просто колега не бачить ваш список для мами, а
                бабуся не губиться між подарунками для онука і для вас. Назвіть їх так, щоб у чаті
                не переплутати: «Новий рік і Різдво 2027 - Оля», «Миколай 2026 - Марійка».
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Часті питання
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Коли надсилати вішліст на Новий рік?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Найкраще до кінця листопада. Чорна п’ятниця у 2026 році - 27 листопада, і багато хто
                купує подарунки саме на знижках. До того ж у грудні доставка повільніша, тож
                три-чотири тижні запасу не зашкодять.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Чи потрібна рідним реєстрація?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ні. Акаунт Google потрібен лише вам, щоб створити список. Рідні відкривають посилання
                в будь-якому браузері, переглядають список і бронюють подарунки без реєстрації.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Чи побачу я, хто забронював подарунок?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ні, імен у списку не бачить ніхто. Але ви бачите, які подарунки вже заброньовано, бо
                вони позначаються однаково для всіх. Якщо хочете сюрпризу, не відкривайте список після
                того, як поділилися ним.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Скільки подарунків додати у новорічний вішліст?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Для зимових свят я раджу 8-15. Менше - і тим, хто відкриє список останнім, нічого не
                залишиться. Більше - і список перетворюється на каталог, у якому важко вибрати.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Чи можна зробити один вішліст на Новий рік і Різдво?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Так, для дорослих це найзручніше: один список і одне посилання на всі зимові свята.
                Окремий список має сенс для дітей на Миколая і для Таємного Санти, де в групи свій
                бюджет.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Почніть із готового прикладу
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Не хочеться починати з порожньої сторінки? Відкрийте{' '}
                <RouterLink to={`/${routeLang}/wishlist/christmas-list-ua`}>
                  приклад вішліста на Новий рік і Різдво
                </RouterLink>
                : дванадцять подарунків у різних бюджетах, з примітками і цінами. Натисніть
                «Використати цей приклад», увійдіть через Google і перевірте назву - копія з’явиться у
                вашому акаунті. Залишиться замінити подарунки на свої і надіслати посилання рідним.
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}/wishlist/christmas-list-ua`}
                variant="contained"
                size="large"
              >
                Відкрити приклад вішліста
              </Button>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Або створіть порожній{' '}
                <RouterLink to={`/${routeLang}`} state={{ creationSource: 'blog' }}>вішліст</RouterLink>{' '}
                на головній сторінці - безкоштовно і без реклами.
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} date={PUBLISHED} />
        </Container>
      </Box>
    </>
  );
}
