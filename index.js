import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal';
import i18next from 'i18next';
import * as yup from 'yup';
import app from './src/app';

import ru from './src/locales/ru';

const runApp = async () => {
  // Setup yup locale
  yup.setLocale({
    string: { url: 'errors.notValidUrl' },
  });

  // Initialize localization
  await i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  // Start the application
  app();
};

runApp();
