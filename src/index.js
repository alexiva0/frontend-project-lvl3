import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal';
import i18next from 'i18next';
import * as yup from 'yup';
import app from './app';

import ru from './locales/ru';

const runApp = () => {
  // Setup yup locale
  yup.setLocale({
    string: { url: 'errors.notValidUrl' },
    mixed: { notOneOf: 'errors.notUnique' },
  });

  // Initialize localization
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    // Start the application
    app(i18nextInstance);
  });
};

export default runApp;
