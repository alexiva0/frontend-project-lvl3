import * as yup from 'yup';
import { watchFormState, watchFeedsState, watchPostsState } from './view';
import getFeedData from './service';

import { FORM_STATES } from './helpers/constants';

const createValidationSchema = (feeds) => yup
  .object()
  .shape({
    url: yup
      .string()
      .url()
      .required()
      .test('uniqueUrl', 'errors.notUnique', (value) => !feeds.find(({ url }) => url === value)),
  });

const app = () => {
  const state = {
    feeds: [],
    posts: [],
    form: {
      error: null,
      state: FORM_STATES.filling,
    },
  };

  const watchedFormState = watchFormState(state.form);
  const watchedFeeds = watchFeedsState(state.feeds);
  const watchedPosts = watchPostsState(state.posts);

  const schema = createValidationSchema(state.feeds);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    watchedFormState.state = FORM_STATES.sending;

    const formData = new FormData(e.target);
    const url = formData.get('url');

    schema
      .validate({ url })
      .then(() => {
        watchedFormState.error = null;
        return getFeedData(url);
      })
      .then(({ feed, posts }) => {
        watchedFeeds.push(feed);
        watchedPosts.unshift(...posts);
        watchedFormState.state = FORM_STATES.filling;
      })
      .catch((error) => {
        watchedFormState.error = error;
        watchedFormState.state = FORM_STATES.failed;
      });
  };

  const formEl = document.querySelector('form');

  formEl.addEventListener('submit', handleFormSubmit);
};

export default app;
