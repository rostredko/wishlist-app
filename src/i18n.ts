import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enHome from './locales/en/home.json';
import uaHome from './locales/ua/home.json';
import enAddItem from './locales/en/addItem.json';
import uaAddItem from './locales/ua/addItem.json';
import enWishlist from './locales/en/wishlist.json';
import uaWishlist from './locales/ua/wishlist.json';
import enConfirm from './locales/en/confirm.json';
import uaConfirm from './locales/ua/confirm.json';
import enCreate from './locales/en/create.json';
import uaCreate from './locales/ua/create.json';
import enAuth from './locales/en/auth.json';
import uaAuth from './locales/ua/auth.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        home: enHome,
        addItem: enAddItem,
        wishlist: enWishlist,
        confirm: enConfirm,
        create: enCreate,
        auth: enAuth
      },
      ua: {
        home: uaHome,
        addItem: uaAddItem,
        wishlist: uaWishlist,
        confirm: uaConfirm,
        create: uaCreate,
        auth: uaAuth
      }
    },
    lng: 'en',
    supportedLngs: ['en','ua'],
    fallbackLng: 'en',
    ns: ['home', 'addItem', 'wishlist', 'confirm', 'create', 'auth'],
    defaultNS: 'home',
    interpolation: { escapeValue: false },
    returnEmptyString: false
  });

export default i18n;