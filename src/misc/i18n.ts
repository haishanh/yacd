import type { ReadCallback } from 'i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const LngBackend = {
  type: 'backend' as const,
  read: (lng: string, _namespace: string, callback: ReadCallback) => {
    let p: PromiseLike<{ data: any }>;
    switch (lng) {
      case 'zh':
      case 'zh-CN':
        p = import('src/i18n/zh');
        break;
      case 'en':
      default:
        p = import('src/i18n/en');
        break;
    }
    if (p) {
      p.then(
        (d) => callback(null, d.data),
        (err) => callback(err, null),
      );
    } else {
      callback(new Error(`unable to load translation file for language ${lng}`), null);
    }
  },
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(LngBackend)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

if (process.env.NODE_ENV === 'development') {
  window.i18n = i18next;
}

export default i18next;
