import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import arTranslations from './ar/translations';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    resources: {
      ar: {
        translation: arTranslations
      }
    },
    // RTL support
    dir: {
      ar: 'rtl',
      en: 'ltr'
    },
    // Number formatting
    number: {
      ar: {
        currency: {
          style: 'currency',
          currency: 'KWD'
        }
      }
    },
    // Date formatting
    datetime: {
      ar: {
        formats: {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }
        }
      }
    }
  });

// Helper function for RTL detection
export const isRTL = (language) => {
  return language === 'ar';
};

// Helper for number formatting
export const formatNumber = (number, language) => {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-KW' : 'en-US').format(number);
};

// Helper for date formatting
export const formatDate = (date, language) => {
  return new Intl.DateTimeFormat(
    language === 'ar' ? 'ar-KW' : 'en-US',
    { dateStyle: 'short' }
  ).format(date);
};

export default i18next;