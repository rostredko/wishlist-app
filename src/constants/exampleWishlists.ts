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
    title: 'Вішліст на Новий Рік 2026',
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
};

/**
 * Static items for each demo wishlist. Rendered immediately (no Firestore wait)
 * so search crawlers see unique, meaningful content on first render.
 */
export const DEMO_ITEMS: Record<string, WishListItem[]> = {
  'christmas-list': [
    { id: 'c1', name: 'AirPods Pro', claimed: false },
    { id: 'c2', name: 'Book: "Atomic Habits"', claimed: false },
    { id: 'c3', name: 'Cozy fleece blanket', claimed: false },
    { id: 'c4', name: 'Wireless charger', claimed: false },
    { id: 'c5', name: 'Gift card - Amazon', claimed: false },
  ],
  'christmas-list-ua': [
    { id: 'cu1', name: 'AirPods Pro', claimed: false },
    { id: 'cu2', name: 'Книга "Атомні звички"', claimed: false },
    { id: 'cu3', name: 'Тепла ковдра', claimed: false },
    { id: 'cu4', name: 'Бездротова зарядка', claimed: false },
    { id: 'cu5', name: 'Подарунковий сертифікат', claimed: false },
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
    { id: 's1', name: 'Scented candle set', claimed: false },
    { id: 's2', name: 'Insulated water bottle', claimed: false },
    { id: 's3', name: 'Chocolate assortment', claimed: false },
    { id: 's4', name: 'Funny desk calendar', claimed: false },
    { id: 's5', name: 'Cozy socks', claimed: false },
  ],
  'secret-santa-list-ua': [
    { id: 'su1', name: 'Набір ароматних свічок', claimed: false },
    { id: 'su2', name: 'Термопляшка', claimed: false },
    { id: 'su3', name: 'Набір шоколаду', claimed: false },
    { id: 'su4', name: 'Настільний календар', claimed: false },
    { id: 'su5', name: 'Теплі шкарпетки', claimed: false },
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
};

export function isDemoWishlistId(wishlistId: string): boolean {
  return Object.hasOwn(DEMO_WISHLISTS, wishlistId);
}

/** Guest-facing SEO overrides for known example IDs (when viewer cannot edit). */
export const EXAMPLE_SEO: Record<string, { title: string; description: string }> = {
  'christmas-list': {
    title: 'Christmas Wish List 2026 - Free Holiday Gift List | WishList App',
    description:
      'Browse a Christmas wish list example. Create your own free holiday gift list and share it with family - friends can anonymously claim gifts.',
  },
  'christmas-list-ua': {
    title: 'Вішліст на Новий Рік та Різдво 2026 - Безкоштовний | WishList App',
    description:
      'Перегляньте приклад новорічного вішліста. Зробіть свій список бажань безкоштовно та поділіться з друзями.',
  },
  'birthday-list': {
    title: 'Birthday Wishlist Example - Free Gift List Maker | WishList App',
    description:
      'Browse a birthday wishlist example. Create your own free birthday gift list and share the private link with friends.',
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
    description: 'Перегляньте приклад вішліста для Таємного Санти. Зробіть свій список подарунків безкоштовно.',
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
};
