import * as yup from 'yup';
import { watchFormState, watchFeedUrlsState } from './view';

const createValidationSchema = (feedUrls) => yup
  .object()
  .shape({
    url: yup
      .string()
      .url('Ссылка должна быть валидным URL')
      .required()
      .test('Unique', 'RSS уже существует', (value) => !feedUrls.includes(value)),
  });

const app = () => {
  const state = {
    feedUrls: [],
    form: {
      error: null,
    },
  };

  const watchedFormState = watchFormState(state.form);
  const watchedFeedUrls = watchFeedUrlsState(state.feedUrls);

  const schema = createValidationSchema(state.feedUrls);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    schema
      .validate({ url })
      .then(() => {
        watchedFormState.error = null;
        watchedFeedUrls.push(url);
      })
      .catch((error) => {
        watchedFormState.error = error;
      });
  };

  const formEl = document.querySelector('form');

  formEl.addEventListener('submit', handleFormSubmit);
};

export default app;
