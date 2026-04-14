import type { WishList } from '@models/WishList';

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
