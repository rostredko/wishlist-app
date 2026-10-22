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

const SLUG = 'tayemnyj-santa-pravyla';
const PUBLISHED = '2026-10-22';

const QUESTIONNAIRE = [
  'Як вас називати в листівці?',
  'Чим ви любите займатися у вільний вечір?',
  'Кава, чай чи какао?',
  'Ваш розмір одягу і шкарпеток?',
  'Чого у вас уже забагато: чашок, свічок, шкарпеток?',
  'На що у вас алергія або що ви не їсте?',
  'Що вам точно не дарувати?',
];

export default function TayemnyjSantaPravylaArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/ua/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'ua', SLUG);

  return (
    <>
      <SEOHead
        lang="uk"
        title="Таємний Санта: правила, бюджет, жеребкування і вішліст для кожного"
        description="Як організувати Таємного Санту на роботі, з друзями чи онлайн: правила, бюджет, жеребкування і вішліст, щоб подарунок точно сподобався."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="таємний санта правила, таємний санта на роботі, таємний миколай, бюджет таємного санти, жеребкування таємний санта, вішліст таємного санти"
        structured={{
          article: {
            headline: 'Таємний Санта: правила, бюджет, жеребкування і вішліст',
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
          },
          howTo: {
            name: 'Організувати Таємного Санту',
            description: 'П’ять кроків: учасники і бюджет, чесне жеребкування, вішліст від кожного, посилання організатору і вручення в домовлений день.',
            steps: [
              { text: 'Зберіть учасників і домовтеся про бюджет, дату і спосіб вручення подарунків.' },
              { text: 'Проведіть жеребкування так, щоб кожен знав лише ім’я свого отримувача.' },
              { text: 'Попросіть кожного учасника скласти вішліст на 3-5 подарунків у межах бюджету.' },
              { text: 'Зберіть посилання на вішлісти в організатора або в спільному чаті.' },
              { text: 'Санта вибирає подарунок зі списку свого отримувача і вручає його в домовлений день.' },
            ],
          },
          faq: [
            {
              q: 'Як грати в Таємного Санту онлайн?',
              a: 'Проведіть жеребкування через онлайн-генератор, який надсилає кожному лише ім’я його отримувача, зберіть посилання на вішлісти в чаті і домовтеся про дату відправлення. Вартість доставки краще одразу включити в бюджет.',
            },
            {
              q: 'Скільки витрачати на Таємного Санту?',
              a: 'Стільки, скільки комфортно кожному учаснику. Для колег я б орієнтувався на 300-500 грн, для друзів - на 500-1000 грн. Головне, щоб бюджет був однаковий для всіх і включав доставку.',
            },
            {
              q: 'Що подарувати, якщо людина не зробила вішліст?',
              a: 'Попросіть організатора нагадати їй або передати кілька запитань з анкети. Якщо відповіді немає, вибирайте щось нейтральне і корисне в межах бюджету: чай, теплі шкарпетки, блокнот.',
            },
            {
              q: 'Чи можна дізнатися, хто твій Таємний Санта?',
              a: 'За правилами гри - ні, принаймні до вручення. Якщо група домовилася розкривати імена після свята, це теж нормально, але про це краще вирішити заздалегідь.',
            },
            {
              q: 'Чи проводить WishList App жеребкування?',
              a: 'Ні. WishList App не розподіляє пари. Він допомагає на наступному кроці: кожен учасник складає вішліст, і Санта бачить, що справді варто подарувати.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/ua` },
            { name: tb('breadcrumbBlog'), url: `${origin}/ua/blog` },
            { name: 'Таємний Санта: правила і вішліст', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Таємний Санта: правила, бюджет, жеребкування і вішліст
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            Таємний Санта - це обмін подарунками, де кожен учасник через жеребкування отримує ім’я
            людини, якій таємно дарує подарунок у межах спільного бюджету. Щоб гра вдалася,
            домовтеся про бюджет і дату, проведіть чесне жеребкування, а кожен учасник нехай складе
            короткий вішліст на 3-5 подарунків.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Механіка проста, але ламається гра зазвичай в одному місці: подарунок, якому ніхто не
            радіє. Ще одна свічка, ще одна чашка, шоколад для людини з алергією на горіхи. Тому в цій
            статті більше про правила, бюджет і вішліст, ніж про святкову магію. Магія з’явиться сама,
            коли подарунок влучить.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що таке Таємний Санта і Таємний Миколай?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Це одна й та сама гра під двома назвами. Група людей - колеги, друзі, однокласники чи
                родина - випадково розподіляє, хто кому дарує. Кожен знає лише свого отримувача, а
                хто дарує йому самому, дізнається тільки під час вручення або не дізнається взагалі.
                Подарунок один, бюджет спільний, тому ніхто не витрачається на десяток подарунків і
                ніхто не залишається без уваги.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Які правила Таємного Санти?
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Я б тримався п’яти правил. Їх варто написати в чат ще до жеребкування:
              </Typography>
              <Box component="ol" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Один бюджет для всіх. Не «приблизно 500», а «до 500 грн разом із доставкою».
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Дата і спосіб вручення відомі заздалегідь: корпоратив, зустріч друзів, відправка
                  поштою до певного дня.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Чесне жеребкування: ніхто не тягне сам себе, а пари в групі можна виключити одне
                  для одного.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Кожен учасник складає короткий вішліст на 3-5 подарунків у межах бюджету.
                </Typography>
                <Typography component="li" variant="body1">
                  Таємниця до вручення: не розповідайте, кого ви витягнули, навіть найкращому другові
                  в групі.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Який бюджет для Таємного Санти?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Бюджет залежить від того, наскільки добре учасники знають одне одного і чи доведеться
                щось відправляти поштою. Орієнтири, від яких я б відштовхувався:
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Група</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Бюджет</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Що вкладається</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Колеги, які мало знайомі</TableCell>
                      <TableCell>300-500 грн</TableCell>
                      <TableCell>Чай, кава в зернах, свічка, теплі шкарпетки, блокнот</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Друзі</TableCell>
                      <TableCell>500-1000 грн</TableCell>
                      <TableCell>Книжка, настільна гра на двох, термочашка, пазл</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Близькі друзі або родина</TableCell>
                      <TableCell>1000-1500 грн</TableCell>
                      <TableCell>Ковдра, навушники, сертифікат на враження</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Онлайн-група з різних міст</TableCell>
                      <TableCell>300-700 грн + доставка</TableCell>
                      <TableCell>Те, що легко відправити поштою і що не розіб’ється</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Найважливіше - щоб бюджет був однаковий для всіх. Подарунок за 1500 грн у групі, де
                домовлялися про 500, ставить у незручне становище і отримувача, і решту учасників.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Як провести жеребкування?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Скажу одразу: WishList App не проводить жеребкування і не розподіляє пари. Для цього є
                кілька простих способів, а вішліст знадобиться на наступному кроці.
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Спосіб</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Як працює</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Коли підходить</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Папірці в шапці</TableCell>
                      <TableCell>Імена на папірцях, кожен тягне один. Витягнули себе - тягнете ще раз</TableCell>
                      <TableCell>Усі в одному офісі або на одній зустрічі</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Організатор у чаті</TableCell>
                      <TableCell>Організатор розподіляє пари і пише кожному особисто</TableCell>
                      <TableCell>Маленька група; організатор знає всі пари, тож краще, щоб він сам не грав</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Онлайн-генератор</TableCell>
                      <TableCell>Сайт або бот у месенджері надсилає кожному тільки ім’я його отримувача</TableCell>
                      <TableCell>Віддалені команди, великі групи, пари, яких треба розвести</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Який би спосіб ви не вибрали, перевірте дві речі: ніхто не дарує сам собі, і ніхто,
                крім самого Санти, не знає його отримувача.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Коли починати підготовку?
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Найчастіше Таємний Санта зривається не через подарунки, а через час. Ось план, який я
                б рахував назад від дня вручення:
              </Typography>
              <Box component="ol" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  За чотири тижні: зібрати учасників, домовитися про бюджет і дату.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  За три тижні: провести жеребкування.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Протягом тижня після жеребкування: кожен надсилає посилання на свій вішліст.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  За тиждень до вручення: усі подарунки куплені, а поштові вже відправлені.
                </Typography>
                <Typography component="li" variant="body1">
                  День вручення: усі отримують подарунки одночасно.
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Якщо вручення в середині грудня, жеребкування варто провести ще в листопаді. Тоді
                учасники встигнуть купити подарунки на Чорну п’ятницю, яка у 2026 році припадає на 27
                листопада.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Що написати у своєму вішлісті для Таємного Санти?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ваш Санта може знати вас дуже мало. Колега з іншого відділу не здогадається, що ви не
                п’єте каву, а знайомий із компанії друзів - що у вас удома вже п’ять свічок. Короткий вішліст знімає ці
                питання. Я б складав його так:
              </Typography>
              <Box component="ol" sx={{ pl: 3, mt: 0, mb: 2 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Назвіть список зрозуміло, наприклад «Таємний Санта 2026 - Оля, бухгалтерія».
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Додайте 3-5 подарунків у межах бюджету групи, кожен з посиланням на магазин.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Впишіть у примітки розмір, колір або смак, а також алергії: «чорний шоколад, без
                  горіхів».
                </Typography>
                <Typography component="li" variant="body1">
                  Надішліть посилання організатору або в спільний чат - так його побачить ваш Санта,
                  хоч ви й не знаєте, хто це.
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Якщо не знаєте, що додати, дайте відповідь на кілька запитань. Цю коротку анкету можна
                скопіювати в чат групи:
              </Typography>
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 2, bgcolor: 'background.paper' }}>
                <Box component="ol" sx={{ pl: 3, m: 0 }}>
                  {QUESTIONNAIRE.map((question) => (
                    <Typography key={question} component="li" variant="body1" sx={{ mb: 1 }}>
                      {question}
                    </Typography>
                  ))}
                </Box>
              </Paper>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Відповіді на запитання про розміри й алергії перенесіть у примітки до подарунків. Тоді
                Санті не доведеться нічого перепитувати.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Чи треба Санті бронювати подарунок? У Таємному Санті дарувальник у вас один, тож це
                не обов’язково. Але якщо той самий список ви надіслали ще й родині на свята, бронювання
                врятує від двох однакових подарунків. Заброньований подарунок бачать як зайнятий усі,
                хто відкриває список, разом із вами. Хто саме забронював, не бачить ніхто, але якщо
                хочете повної несподіванки, не відкривайте свій список після жеребкування.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Таємний Санта на роботі: етикет
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                В офісі гра трохи складніша, бо учасники різні, а стосунки після свят тривають. Кілька
                правил, які рятують атмосферу:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Участь добровільна. Ніхто не має пояснювати, чому не грає.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Бюджет не перевищують, щоб когось вразити.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Жодних надто особистих подарунків і жартів про вік, вагу чи зовнішність.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Алкоголь - тільки якщо людина сама додала його у свій вішліст.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Віддаленим колегам подарунок відправляють заздалегідь, а доставку включають у бюджет.
                </Typography>
                <Typography component="li" variant="body1">
                  Вручайте всі подарунки в один день, щоб ніхто не почувався забутим.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Часті питання
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Як грати в Таємного Санту онлайн?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Проведіть жеребкування через онлайн-генератор, який надсилає кожному лише ім’я його
                отримувача, зберіть посилання на вішлісти в чаті і домовтеся про дату відправлення.
                Вартість доставки краще одразу включити в бюджет.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Скільки витрачати на Таємного Санту?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Стільки, скільки комфортно кожному учаснику. Для колег я б орієнтувався на 300-500
                грн, для друзів - на 500-1000 грн. Головне, щоб бюджет був однаковий для всіх і
                включав доставку.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Що подарувати, якщо людина не зробила вішліст?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Попросіть організатора нагадати їй або передати кілька запитань з анкети. Якщо
                відповіді немає, вибирайте щось нейтральне і корисне в межах бюджету: чай, теплі
                шкарпетки, блокнот.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Чи можна дізнатися, хто твій Таємний Санта?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                За правилами гри - ні, принаймні до вручення. Якщо група домовилася розкривати імена
                після свята, це теж нормально, але про це краще вирішити заздалегідь.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Чи проводить WishList App жеребкування?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ні. WishList App не розподіляє пари. Він допомагає на наступному кроці: кожен учасник
                складає вішліст, і Санта бачить, що справді варто подарувати.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Готовий вішліст для Таємного Санти
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Подивіться{' '}
                <RouterLink to={`/${routeLang}/wishlist/secret-santa-list-ua`}>
                  приклад вішліста Таємного Санти
                </RouterLink>
                : десять недорогих подарунків із примітками про розмір, смак і алергії. Натисніть
                «Використати цей приклад», увійдіть через Google, залиште 3-5 позицій у бюджеті вашої
                групи - і надсилайте посилання організатору.
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}/wishlist/secret-santa-list-ua`}
                variant="contained"
                size="large"
              >
                Відкрити приклад вішліста
              </Button>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Або створіть порожній{' '}
                <RouterLink to={`/${routeLang}`} state={{ creationSource: 'blog' }}>вішліст</RouterLink>{' '}
                на головній сторінці. Якщо крім Таємного Санти вам дарує ще й родина, прочитайте{' '}
                <RouterLink to={`/${routeLang}/blog/vishlist-na-novyj-rik-i-rizdvo`}>
                  як скласти вішліст на Новий рік і Різдво
                </RouterLink>{' '}
                і{' '}
                <RouterLink to={`/${routeLang}/blog/yak-podilytysia-vishlistom-bez-dublikativ`}>
                  як поділитися вішлістом без однакових подарунків
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
