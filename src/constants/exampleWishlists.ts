import type { WishList } from '@models/WishList';
import type { WishListItem } from '@models/WishListItem';

/** Fallback wishlists when Firestore has no document (demo / SEO examples). */
export const DEMO_WISHLISTS: Record<string, Partial<WishList>> = {
  'christmas-list': {
    title: 'Christmas Wish List 2026',
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
  'christmas-list-ua': {
    title: 'Вішліст на Новий рік та Різдво',
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
  'birthday-list': {
    title: 'Birthday Wishlist Example',
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
  'birthday-list-ua': {
    title: 'Вішліст на День Народження',
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
  'secret-santa-list': {
    title: 'Secret Santa Wishlist',
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1512474932049-782b70437cae?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
  'secret-santa-list-ua': {
    title: 'Вішліст Таємного Санти',
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1512474932049-782b70437cae?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
  'wedding-list': {
    title: 'Wedding Wishlist & Gift Registry',
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
  'wedding-list-ua': {
    title: 'Весільний Вішліст',
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
  'kids-christmas-list': {
    title: "Kids' Christmas List (Ages 6-9)",
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
  'st-nicholas-list-ua': {
    title: 'Вішліст на Миколая для дитини 6-9 років',
    ownerUid: 'demo',
    bannerImage: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=80',
    isHidden: false,
  },
};

/**
 * Static items for each demo wishlist. Rendered immediately (no Firestore wait)
 * so search crawlers see unique, meaningful content on first render.
 */
// Demo amounts are illustrative, not current retailer quotes.
export const DEMO_ITEMS: Record<string, WishListItem[]> = {
  'christmas-list': [
    { id: 'c1', name: 'AirPods Pro', description: 'Any recent generation - a refurbished pair is fine too.', claimed: false },
    { id: 'c2', name: 'Book: "Atomic Habits"', description: 'Paperback, not the e-book.', claimed: false, priceMinor: 2000, currency: 'USD' },
    { id: 'c3', name: 'Cozy fleece blanket', description: 'Grey or dark green, at least 150 x 200 cm.', claimed: false, priceMinor: 3500, currency: 'USD' },
    { id: 'c4', name: 'Wireless charger', description: 'A stand for the bedside table, not a flat pad.', claimed: false },
    { id: 'c5', name: 'Gift card - Amazon', description: 'Any amount. Good if you would rather not guess.', claimed: false },
    { id: 'c6', name: 'Board game for 2-4 players', description: 'Something we can finish in under an hour after dinner.', claimed: false, priceMinor: 3000, currency: 'USD' },
    { id: 'c7', name: 'Wool socks, size M', description: 'Plain colors. You can never have too many.', claimed: false, priceMinor: 1500, currency: 'USD' },
    { id: 'c8', name: 'Tickets to a winter concert', description: 'Two tickets, any date in January. An experience counts as a gift.', claimed: false },
    { id: 'c9', name: 'Specialty coffee beans', description: 'Medium roast, whole beans - I grind them myself.', claimed: false, priceMinor: 1800, currency: 'USD' },
    { id: 'c10', name: 'Insulated travel mug', description: '350-450 ml, fits a car cup holder.', claimed: false },
    { id: 'c11', name: 'Cooking class for two', description: 'The dream item - only if a few of you want to share it.', claimed: false },
  ],
  'christmas-list-ua': [
    { id: 'cu1', name: 'AirPods Pro', description: 'Підійде будь-яке з останніх поколінь, можна й відновлені.', claimed: false },
    { id: 'cu2', name: 'Книга "Атомні звички"', description: 'Паперова, не електронна.', claimed: false, priceMinor: 50000, currency: 'UAH' },
    { id: 'cu3', name: 'Тепла ковдра', description: 'Сіра або темно-зелена, від 150 x 200 см.', claimed: false, priceMinor: 120000, currency: 'UAH' },
    { id: 'cu4', name: 'Бездротова зарядка', description: 'Підставка на тумбочку, а не плоска.', claimed: false },
    { id: 'cu5', name: 'Подарунковий сертифікат', description: 'У книгарню або кав’ярню, сума будь-яка.', claimed: false },
    { id: 'cu6', name: 'Павербанк на 20 000 мА·год', description: 'Для відключень світла: з USB-C і швидким заряджанням.', claimed: false, priceMinor: 140000, currency: 'UAH' },
    { id: 'cu7', name: 'Настільна гра на 2-4 гравців', description: 'Щоб партія тривала до години - граємо після вечері.', claimed: false, priceMinor: 90000, currency: 'UAH' },
    { id: 'cu8', name: 'Вовняні шкарпетки, розмір 42-44', description: 'Однотонні. Шкарпеток забагато не буває.', claimed: false, priceMinor: 35000, currency: 'UAH' },
    { id: 'cu9', name: 'Квитки на зимовий концерт', description: 'Два квитки, будь-яка дата в січні. Враження - теж подарунок.', claimed: false },
    { id: 'cu10', name: 'Кава в зернах від місцевої обсмажувальні', description: 'Середнє обсмаження, саме зерно - мелю сам.', claimed: false, priceMinor: 45000, currency: 'UAH' },
    { id: 'cu11', name: 'Термочашка', description: '350-450 мл, щоб стояла в підстаканнику в авто.', claimed: false },
    { id: 'cu12', name: 'Ялинкова іграшка ручної роботи', description: 'Будь-яка, головне - не пластикова.', claimed: false, priceMinor: 30000, currency: 'UAH' },
  ],
  'birthday-list': [
    { id: 'b1', name: 'Kindle Paperwhite', claimed: false },
    { id: 'b2', name: 'Running shoes', claimed: false },
    { id: 'b3', name: 'Coffee subscription (3 months)', claimed: false },
    { id: 'b4', name: 'Fitness tracker', claimed: false },
    { id: 'b5', name: 'Dinner experience for two', claimed: false },
  ],
  'birthday-list-ua': [
    { id: 'bu1', name: 'Kindle Paperwhite', claimed: false },
    { id: 'bu2', name: 'Кросівки для бігу', claimed: false },
    { id: 'bu3', name: 'Підписка на каву (3 місяці)', claimed: false },
    { id: 'bu4', name: 'Фітнес-браслет', claimed: false },
    { id: 'bu5', name: 'Вечеря у ресторані на двох', claimed: false },
  ],
  'secret-santa-list': [
    { id: 's1', name: 'Scented candle set', description: 'Woody or citrus scents, nothing too sweet.', claimed: false, priceMinor: 1500, currency: 'USD' },
    { id: 's2', name: 'Insulated water bottle', description: '500 ml, fits a bike bottle cage.', claimed: false },
    { id: 's3', name: 'Chocolate assortment', description: 'Dark chocolate, no nuts - allergy.', claimed: false },
    { id: 's4', name: 'Funny desk calendar', description: 'For 2027, any theme.', claimed: false },
    { id: 's5', name: 'Cozy socks', description: 'Size M, the softer the better.', claimed: false },
    { id: 's6', name: 'Pocket notebook, dotted pages', description: 'A5 or smaller.', claimed: false, priceMinor: 1200, currency: 'USD' },
    { id: 's7', name: 'Loose-leaf tea sampler', description: 'Herbal or green - no caffeine after lunch for me.', claimed: false },
    { id: 's8', name: 'Desk plant in a small pot', description: 'Something hard to kill.', claimed: false },
    { id: 's9', name: 'Jigsaw puzzle, 500 pieces', description: 'A landscape or a map.', claimed: false, priceMinor: 1800, currency: 'USD' },
    { id: 's10', name: 'Phone stand for the desk', description: 'Adjustable, holds a phone with a case on.', claimed: false },
  ],
  'secret-santa-list-ua': [
    { id: 'su1', name: 'Набір ароматних свічок', description: 'Деревні або цитрусові аромати, не надто солодкі.', claimed: false, priceMinor: 45000, currency: 'UAH' },
    { id: 'su2', name: 'Термопляшка', description: '500 мл, щоб влазила в тримач на велосипеді.', claimed: false },
    { id: 'su3', name: 'Набір шоколаду', description: 'Чорний шоколад, без горіхів - алергія.', claimed: false },
    { id: 'su4', name: 'Настільний календар', description: 'На 2027 рік, тема будь-яка.', claimed: false },
    { id: 'su5', name: 'Теплі шкарпетки', description: 'Розмір 38-40, чим м’якші, тим краще.', claimed: false },
    { id: 'su6', name: 'Блокнот у крапку', description: 'Формат A5 або менший.', claimed: false, priceMinor: 30000, currency: 'UAH' },
    { id: 'su7', name: 'Набір листового чаю', description: 'Трав’яний або зелений - після обіду я без кофеїну.', claimed: false },
    { id: 'su8', name: 'Кімнатна рослина в маленькому горщику', description: 'Щось невибагливе, що переживе відпустку.', claimed: false },
    { id: 'su9', name: 'Пазл на 500 елементів', description: 'Пейзаж або карта.', claimed: false, priceMinor: 40000, currency: 'UAH' },
    { id: 'su10', name: 'Підставка для телефона', description: 'Регульована, щоб тримала телефон у чохлі.', claimed: false },
  ],
  'wedding-list': [
    { id: 'w1', name: 'Kitchen stand mixer', claimed: false },
    { id: 'w2', name: 'Hotel stay voucher', claimed: false },
    { id: 'w3', name: 'Dinnerware set (8 pieces)', claimed: false },
    { id: 'w4', name: 'Espresso machine', claimed: false },
    { id: 'w5', name: 'Smart home speaker', claimed: false },
  ],
  'wedding-list-ua': [
    { id: 'wu1', name: 'Кухонний міксер', claimed: false },
    { id: 'wu2', name: 'Ваучер у готель', claimed: false },
    { id: 'wu3', name: 'Набір посуду (8 предметів)', claimed: false },
    { id: 'wu4', name: 'Кавова машина', claimed: false },
    { id: 'wu5', name: 'Смарт-колонка', claimed: false },
  ],
  'kids-christmas-list': [
    { id: 'k1', name: 'Building blocks set, ages 6+', description: '300-500 pieces. Space or animals.', claimed: false, priceMinor: 3000, currency: 'USD' },
    { id: 'k2', name: 'Science kit for kids', description: 'Growing crystals or a volcano - a bit of mess at home is fine.', claimed: false, priceMinor: 2500, currency: 'USD' },
    { id: 'k3', name: 'Illustrated encyclopedia of animals', description: 'Hardback, big pictures, for ages 6-9.', claimed: false },
    { id: 'k4', name: 'Drawing set with markers and a sketchbook', description: 'Washable markers, please.', claimed: false },
    { id: 'k5', name: 'Board game for the whole family', description: 'Simple rules, 20-30 minutes a round.', claimed: false, priceMinor: 2000, currency: 'USD' },
    { id: 'k6', name: 'Scooter helmet, size S', description: 'Head size 50-54 cm. Any bright color.', claimed: false },
    { id: 'k7', name: 'Waterproof winter gloves, age 7-8', description: 'For snowball fights.', claimed: false },
    { id: 'k8', name: 'Headphones for kids with a volume limit', description: 'Over-ear, limited to 85 dB.', claimed: false },
    { id: 'k9', name: 'Jigsaw puzzle, 200 pieces', description: 'A world map or space.', claimed: false, priceMinor: 1200, currency: 'USD' },
    { id: 'k10', name: 'Ice-skating lesson voucher', description: 'An experience instead of another toy.', claimed: false },
  ],
  'st-nicholas-list-ua': [
    { id: 'nu1', name: 'Конструктор для дітей від 6 років', description: '300-500 деталей. Космос або тварини.', claimed: false, priceMinor: 90000, currency: 'UAH' },
    { id: 'nu2', name: 'Набір юного науковця', description: 'Вирощування кристалів або вулкан - трохи безладу вдома не страшно.', claimed: false, priceMinor: 70000, currency: 'UAH' },
    { id: 'nu3', name: 'Ілюстрована енциклопедія про тварин', description: 'Українською, тверда обкладинка, великі малюнки.', claimed: false },
    { id: 'nu4', name: 'Набір для малювання з фломастерами й скетчбуком', description: 'Фломастери, що відмиваються з одягу.', claimed: false },
    { id: 'nu5', name: 'Настільна гра для всієї родини', description: 'Прості правила, партія на 20-30 хвилин.', claimed: false, priceMinor: 60000, currency: 'UAH' },
    { id: 'nu6', name: 'Шолом для самоката, розмір S', description: 'Обхват голови 50-54 см. Будь-який яскравий колір.', claimed: false },
    { id: 'nu7', name: 'Непромокальні зимові рукавички на 7-8 років', description: 'Для гри в сніжки.', claimed: false },
    { id: 'nu8', name: 'Дитячі навушники з обмеженням гучності', description: 'Накладні, обмеження до 85 дБ.', claimed: false },
    { id: 'nu9', name: 'Пазл на 200 елементів', description: 'Карта світу або космос.', claimed: false, priceMinor: 25000, currency: 'UAH' },
    { id: 'nu10', name: 'Сертифікат на урок катання на ковзанах', description: 'Враження замість ще однієї іграшки.', claimed: false },
  ],
};

export function isDemoWishlistId(wishlistId: string): boolean {
  return Object.hasOwn(DEMO_WISHLISTS, wishlistId);
}

/** Guest-facing SEO overrides for known example IDs (when viewer cannot edit). */
export const EXAMPLE_SEO: Record<string, { title: string; description: string }> = {
  'christmas-list': {
    title: 'Christmas Wish List 2026 - Example and Free Template | WishList App',
    description:
      'Browse a Christmas wish list example. Create your own free holiday gift list and share it with family - friends can anonymously claim gifts.',
  },
  'christmas-list-ua': {
    title: 'Вішліст на Новий рік 2027 і Різдво - приклад і шаблон | WishList App',
    description:
      'Перегляньте приклад новорічного вішліста. Зробіть свій список бажань безкоштовно та поділіться з друзями.',
  },
  'birthday-list': {
    title: 'Birthday Wishlist Example - Free Gift List Maker | WishList App',
    description:
      'Browse a birthday wishlist example. Create your own free birthday gift list and share the link with friends.',
  },
  'birthday-list-ua': {
    title: 'Вішліст на День Народження - Безкоштовний Приклад | WishList App',
    description: 'Перегляньте приклад вішліста на день народження. Зробіть свій список побажань безкоштовно.',
  },
  'secret-santa-list': {
    title: 'Secret Santa Wishlist Example - Free Gift List | WishList App',
    description:
      'Browse a Secret Santa wishlist example. Create your own free Secret Santa gift list and share it with your group.',
  },
  'secret-santa-list-ua': {
    title: 'Вішліст Таємного Санти - Безкоштовний Приклад | WishList App',
    description: 'Перегляньте приклад вішліста для Таємного Санти (Таємного Миколая). Зробіть свій список подарунків безкоштовно.',
  },
  'wedding-list': {
    title: 'Wedding Wishlist Example - Free Wedding Gift Registry | WishList App',
    description:
      'Browse a wedding wishlist example. Create your free wedding gift registry and share it with guests.',
  },
  'wedding-list-ua': {
    title: 'Весільний Вішліст - Безкоштовний Приклад | WishList App',
    description: 'Перегляньте приклад весільного вішліста. Зробіть свій список побажань до весілля безкоштовно.',
  },
  'kids-christmas-list': {
    title: "Kids' Christmas List Example (Ages 6-9) | WishList App",
    description:
      "A kids' Christmas list example for ages 6-9. Copy it, add your child's wishes and share one link with grandparents - they claim gifts without duplicates.",
  },
  'st-nicholas-list-ua': {
    title: 'Вішліст на Святого Миколая для дитини - приклад | WishList App',
    description:
      'Приклад вішліста на Миколая для дитини 6-9 років. Скопіюйте собі, додайте бажання з листа дитини і надішліть рідним - вони забронюють подарунки без дублікатів.',
  },
};

export const EXAMPLE_WISHLIST_ALTERNATES: Record<string, { en: string; uk: string }> = {
  'christmas-list': { en: 'christmas-list', uk: 'christmas-list-ua' },
  'christmas-list-ua': { en: 'christmas-list', uk: 'christmas-list-ua' },
  'birthday-list': { en: 'birthday-list', uk: 'birthday-list-ua' },
  'birthday-list-ua': { en: 'birthday-list', uk: 'birthday-list-ua' },
  'secret-santa-list': { en: 'secret-santa-list', uk: 'secret-santa-list-ua' },
  'secret-santa-list-ua': { en: 'secret-santa-list', uk: 'secret-santa-list-ua' },
  'wedding-list': { en: 'wedding-list', uk: 'wedding-list-ua' },
  'wedding-list-ua': { en: 'wedding-list', uk: 'wedding-list-ua' },
  'kids-christmas-list': { en: 'kids-christmas-list', uk: 'st-nicholas-list-ua' },
  'st-nicholas-list-ua': { en: 'kids-christmas-list', uk: 'st-nicholas-list-ua' },
};
