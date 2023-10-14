import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import HttpApi from 'i18next-http-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { nanoid } from 'nanoid';
import { initReactI18next } from 'react-i18next';

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const SUPPORTED_NAMESPACES = ['translation', 'common'];
const SUPPORTED_LANGUAGES = [
  { name: 'us', title: 'english' },
  { name: 'de', title: 'german' },
  { name: 'fr', title: 'france' },
  { name: 'ro', title: 'romania' },
];

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    nonExplicitSupportedLngs: false,
    cleanCode: true,
    load: 'languageOnly',
    fallbackLng: 'us',
    ns: SUPPORTED_NAMESPACES,
    debug: import.meta.env.DEV,
    supportedLngs: SUPPORTED_LANGUAGES.map(({ name }) => name),
    interpolation: {
      escapeValue: false,
    },
    backend: {
      backends: [LocalStorageBackend, HttpApi],
      backendOptions: [
        {
          prefix: 'i18next_',
          expirationTime: ONE_WEEK,
          defaultVersion: import.meta.env.DEV ? nanoid() : import.meta.env.VITE_LANGUAGE_VERSION,
          store: window?.localStorage ?? null,
        },
        {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      ],
    },
  });

export default i18next;
export { SUPPORTED_LANGUAGES, SUPPORTED_NAMESPACES };
