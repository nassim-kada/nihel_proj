import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from '../locales/fr.json';
import ar from '../locales/ar.json';

const resources = {
  fr: { translation: fr },
  ar: { translation: ar }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Force 'fr' on initial render for SSR safe hydration
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
