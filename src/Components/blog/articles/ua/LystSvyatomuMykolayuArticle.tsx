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

const SLUG = 'lyst-svyatomu-mykolayu';
const PUBLISHED = '2026-10-22';

const SAMPLE_LETTER = [
  'Дорогий Святий Миколаю!',
  'Мене звати Марійка, мені 7 років. Цього року я навчилася сама читати і допомагала мамі доглядати за котом.',
  'Я дуже хочу:',
  '1. Набір, щоб вирощувати кристали.',
  '2. Книжку про тварин із великими малюнками.',
  '3. Рукавички, щоб гратися в сніжки.',
  'А ще я прошу, щоб у бабусі не боліла спина і щоб усі в нашій родині були здорові.',
  'Дякую тобі! Я й далі допомагатиму вдома.',
  'Марійка',
];

export default function LystSvyatomuMykolayuArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG);

  return (
    <>
      <SEOHead
        lang="uk"
        title="Лист Святому Миколаю: як допомогти дитині скласти список бажань (+ зразок)"
        description="Як написати лист Святому Миколаю разом із дитиною: зразок листа, ідеї за віком і як поділитися списком з бабусею та хрещеними."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="лист святому миколаю, лист святому миколаю зразок, як написати лист святому миколаю, що попросити у миколая, подарунок на миколая дитині"
        structured={{
          article: {
            headline: 'Лист Святому Миколаю: як допомогти дитині скласти список бажань',
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
          },
          howTo: {
            name: 'Перетворити лист Святому Миколаю на вішліст для рідних',
            description: 'П’ять кроків від дитячого листа до списку, з якого бабусі, дідусі й хрещені вибирають подарунки без дублікатів.',
            steps: [
              { text: 'Прочитайте лист разом із дитиною і виберіть 3-5 головних бажань.' },
              { text: 'Створіть вішліст на своєму акаунті, наприклад «Миколай 2026 - Марійка».' },
              { text: 'Додайте кожне бажання з посиланням, орієнтовною ціною і приміткою про розмір чи вік.' },
              { text: 'Додайте 2-3 запасні ідеї в меншому бюджеті для тих, хто хоче подарувати щось невелике.' },
              { text: 'Надішліть посилання дорослим, які дарують, і не показуйте список дитині.' },
            ],
          },
          faq: [
            {
              q: 'Коли писати лист Святому Миколаю?',
              a: 'За три-чотири тижні до 6 грудня, тобто на початку листопада. Тоді рідні встигнуть купити подарунки до кінця листопада, ще до грудневих черг на пошті.',
            },
            {
              q: 'Скільки бажань має бути в листі?',
              a: 'Три-п’ять. Дитині легше вибрати головне, а дорослим - зрозуміти, що для неї справді важливо. У вішлісті можна додати ще 2-3 запасні ідеї.',
            },
            {
              q: 'Хто має створювати вішліст - дитина чи батьки?',
              a: 'Краще батьки, на своєму акаунті Google. Так ви вирішуєте, хто отримає посилання, а дитина не бачить, які подарунки вже заброньовано.',
            },
            {
              q: 'Чи побачить дитина, що подарунок уже заброньовано?',
              a: 'Тільки якщо відкриє посилання на список. Заброньовані подарунки позначаються для всіх, хто його відкриває, тому надсилайте посилання лише дорослим.',
            },
            {
              q: 'Що робити, якщо двоє родичів хочуть подарувати одне й те саме?',
              a: 'Хто перший забронює подарунок у списку, той його і купує. Другий побачить, що подарунок уже зайнятий, і вибере інший.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Лист Святому Миколаю', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Лист Святому Миколаю: як допомогти дитині скласти список бажань
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            Щоб написати лист Святому Миколаю, сядьте з дитиною за кілька тижнів до 6 грудня,
            допоможіть їй назвати 3-5 бажань і пояснити, чому саме їх. Потім перенесіть бажання у
            вішліст із посиланнями й розмірами та надішліть його бабусям і хрещеним. Дитина пише
            лист, а координацію подарунків ви берете на себе.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Свій перший вішліст я написав у шість років, і це був саме лист Миколаю: три бажання на
            клаптику паперу біля вікна. Про це я розповідав у статті{' '}
            <RouterLink to={`/${routeLang}/blog/yak-spysky-zminyuyut-zhyttia`}>
              чому я веду списки з дитинства
            </RouterLink>
            . Сьогодні батьки роблять те саме, тільки після листа є ще один крок: перетворити дитячі
            бажання на список, яким зможуть скористатися бабусі, дідусі й хрещені. Ось як це зробити
            і не зіпсувати диво.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Навіщо дитині писати лист Миколаю?
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Лист - це не тільки про подарунки. Для дитини це маленький ритуал, а для батьків -
                найпростіший спосіб дізнатися, чого вона справді хоче. Ось що він дає:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Дитина вчиться вибирати. Три-п’ять бажань замість «хочу все з реклами» - це вже
                  рішення, а не каталог.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Згадує, що доброго зробила за рік. Це приємніше, ніж слухати «а ти поводилася
                  чемно?».
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Думає не лише про себе: у багатьох листах з’являються побажання для бабусі чи
                  молодшого брата.
                </Typography>
                <Typography component="li" variant="body1">
                  Ви отримуєте точний список, а не здогадки за тиждень до свята.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як написати лист Святому Миколаю: зразок
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Простий лист складається з п’яти частин. Не обов’язково дотримуватися їх суворо, але
                така структура допомагає дитині не загубитися:
              </Typography>
              <Box component="ol" sx={{ pl: 3, mt: 0, mb: 2 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Привітання і кілька слів про себе: ім’я, вік.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Що доброго дитина зробила цього року, чого навчилася.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Три-п’ять бажань, кожне - окремим рядком.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Побажання для когось іншого.
                </Typography>
                <Typography component="li" variant="body1">
                  Подяка і підпис.
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Ось зразок, який можна скопіювати і переписати разом із дитиною:
              </Typography>
              <Paper component="blockquote" variant="outlined" sx={{ m: 0, mb: 2, p: { xs: 2, sm: 3 }, bgcolor: 'background.paper' }}>
                {SAMPLE_LETTER.map((line) => (
                  <Typography key={line} variant="body1" sx={{ mb: 1 }}>{line}</Typography>
                ))}
              </Paper>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Нехай дитина пише сама, навіть із помилками. Ваше завдання - підказати структуру і
                поставити запитання, коли бажання надто загальне. «Іграшку» можна уточнити: яку саме,
                для чого, з ким нею гратися.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Якщо дитина ще не вміє писати, нехай малює. Малюнок конструктора чи ковзанів - теж
                лист. Ви підпишете бажання під малюнками, а сам лист залишиться її власним.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що попросити у Миколая: ідеї за віком
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Миколай традиційно приносить невеликі подарунки, тож бажання варто тримати в межах
                розумного. Ось що зазвичай просять діти різного віку і на що звернути увагу:
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Вік</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Що часто просять</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>На що звернути увагу</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>3-5 років</TableCell>
                      <TableCell>Іграшки для рольових ігор, великі пазли, книжки з картонними сторінками, пластилін</TableCell>
                      <TableCell>Жодних дрібних деталей; перевіряйте вікове маркування на упаковці</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>6-9 років</TableCell>
                      <TableCell>Конструктори, набори для експериментів, енциклопедії, настільні ігри, ковзани</TableCell>
                      <TableCell>Запишіть розміри шолома, рукавичок і ковзанів заздалегідь</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>10-13 років</TableCell>
                      <TableCell>Книжки улюбленої серії, набори для творчості, спортивне спорядження, навушники</TableCell>
                      <TableCell>Дитина вже хоче конкретну модель - попросіть показати її</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Як це виглядає в готовому вигляді, можна подивитися в{' '}
                <RouterLink to={`/${routeLang}/wishlist/st-nicholas-list-ua`}>
                  прикладі вішліста на Миколая для дитини 6-9 років
                </RouterLink>
                .
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як перетворити лист на вішліст: версія для батьків
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Дитячий лист - про бажання. Рідним потрібні подробиці: який саме набір, якого розміру,
                де купити. Тому з листа я б робив окремий список для дорослих. «Ковзани» з листа
                стають «Ковзани, розмір 31, з регулюванням» із посиланням на магазин.
              </Typography>
              <Box component="ol" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Прочитайте лист разом із дитиною і виберіть 3-5 головних бажань.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Створіть вішліст на своєму акаунті Google, наприклад «Миколай 2026 - Марійка».
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Додайте кожне бажання з посиланням, орієнтовною ціною і приміткою: розмір, вік на
                  упаковці, колір, мова книжки.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Додайте 2-3 запасні ідеї в меншому бюджеті - для тих, хто хоче подарувати щось
                  невелике.
                </Typography>
                <Typography component="li" variant="body1">
                  Надішліть посилання дорослим, які дарують. Не дитині.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як поділитися списком із бабусею та хрещеними?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Одним повідомленням у сімейний чат. Реєструватися нікому не потрібно: бабуся відкриває
                посилання в браузері, вибирає подарунок, натискає на нього і підтверджує бронювання.
                Після цього подарунок показується як зайнятий для всіх, і хрещений уже не купить те
                саме. Повідомлення може бути таким:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  «Марійка написала лист Миколаю - ось що вона просить: [посилання]. Якщо щось обрали,
                  натисніть на подарунок і забронюйте його, щоб не купити двічі. І, будь ласка, не
                  показуйте список Марійці».
                </Typography>
              </Paper>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Надсилайте список до середини листопада: 6 грудня настає швидко, а доставка перед
                святами повільніша. Якщо бабуся не користується месенджерами, відкрийте список на її
                телефоні разом або забронюйте подарунок замість неї - ви як власник списку теж можете
                це зробити.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Особливо корисний список для хрещених з іншого міста чи з-за кордону. Вони замовляють
                подарунок із доставкою на вашу адресу, а з примітки знають, який саме розмір чи колір
                потрібен.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як зберегти диво?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Головне правило: список належить батькам, а не дитині. Ви створюєте його на своєму
                акаунті, і посилання отримують лише дорослі. Якщо дитина відкриє список, вона побачить,
                які подарунки вже заброньовано, і магія закінчиться раніше, ніж треба. Тож тримайте
                посилання в дорослих чатах.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ви як власник бачите, які подарунки заброньовано, але не бачите, хто саме їх забронював.
                Для батьків це навіть зручно: видно, що все розібрано, і не треба нікого перепитувати.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ще одна порада: вирішіть заздалегідь, який подарунок буде «від Миколая», а які - від
                рідних. Додайте до нього примітку «від Миколая, купуємо ми» і забронюйте його самі.
                Тоді ніхто з родичів його не купить, а під подушкою вранці 6 грудня опиниться саме те,
                що дитина просила в листі.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що робити, якщо дитина просить надто дорогий подарунок?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Не сперечайтеся з листом - він для Миколая, а не для бюджету. Краще чесно поговоріть
                до того, як лист буде дописаний. Можна пояснити, що Миколай приносить невеликі
                подарунки, а великі бажання чекають Нового року або дня народження. Тоді дорога річ
                переїжджає в інший список, а в листі залишається те, що реально з’явиться під
                подушкою.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Другий варіант - скластися кільком рідним. Додайте таку річ у вішліст із приміткою
                «на цей подарунок скидаємося разом» і домовтеся в чаті, хто його купує. Одна людина
                бронює подарунок, щоб він показувався зайнятим для решти, а інші передають їй свою
                частину. Головне - не обіцяйте дитині того, чого не буде: розчарування 6 грудня
                запам’ятовується довше за будь-який подарунок.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Часті питання
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Коли писати лист Святому Миколаю?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                За три-чотири тижні до 6 грудня, тобто на початку листопада. Тоді рідні встигнуть
                купити подарунки до кінця листопада, ще до грудневих черг на пошті.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Скільки бажань має бути в листі?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Три-п’ять. Дитині легше вибрати головне, а дорослим - зрозуміти, що для неї справді
                важливо. У вішлісті можна додати ще 2-3 запасні ідеї.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Хто має створювати вішліст - дитина чи батьки?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Краще батьки, на своєму акаунті Google. Так ви вирішуєте, хто отримає посилання, а
                дитина не бачить, які подарунки вже заброньовано.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Чи побачить дитина, що подарунок уже заброньовано?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Тільки якщо відкриє посилання на список. Заброньовані подарунки позначаються для всіх,
                хто його відкриває, тому надсилайте посилання лише дорослим.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Що робити, якщо двоє родичів хочуть подарувати одне й те саме?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Хто перший забронює подарунок у списку, той його і купує. Другий побачить, що
                подарунок уже зайнятий, і вибере інший.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Готовий приклад для дитини 6-9 років
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Щоб не починати з нуля, відкрийте{' '}
                <RouterLink to={`/${routeLang}/wishlist/st-nicholas-list-ua`}>
                  приклад вішліста на Миколая
                </RouterLink>
                : десять ідей із розмірами, примітками і цінами. Натисніть «Використати цей приклад»,
                увійдіть через Google - і копія з’явиться у вашому акаунті. Залишиться вписати бажання з
                листа і надіслати посилання рідним.
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}/wishlist/st-nicholas-list-ua`}
                variant="contained"
                size="large"
              >
                Відкрити приклад вішліста
              </Button>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Або створіть порожній{' '}
                <RouterLink to={`/${routeLang}`} state={{ creationSource: 'blog' }}>вішліст</RouterLink>{' '}
                на головній сторінці. Список для дорослих на зимові свята я розписав окремо - у статті{' '}
                <RouterLink to={`/${routeLang}/blog/vishlist-na-novyj-rik-i-rizdvo`}>
                  вішліст на Новий рік і Різдво
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
