import * as yup from 'yup';
import { watchFormState, watchFeedsState, watchPostsState } from './views';
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

const subscribeToFeed = ({
  feedUrl, watchedFeeds, watchedPosts, watchedFormState,
}) => {
  const updateFeedData = () => {
    getFeedData(feedUrl)
      .then(({ feed, posts }) => {
        watchedFeeds.push(feed);
        watchedPosts.unshift(...posts);
        watchedFormState.processState = FORM_STATES.success;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setTimeout(() => {
          updateFeedData(feedUrl, watchedFeeds, watchedPosts, watchedFormState);
        }, 5000);
      });
  };

  updateFeedData();
};

const app = () => {
  const state = {
    feeds: [],
    posts: [],
    form: {
      error: null,
      processState: FORM_STATES.filling,
    },
  };

  const watchedFormState = watchFormState(state.form);
  const watchedFeeds = watchFeedsState(state.feeds);
  const watchedPosts = watchPostsState(state.posts);

  const schema = createValidationSchema(state.feeds);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    watchedFormState.processState = FORM_STATES.sending;

    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    schema
      .validate({ url })
      .then(() => {
        watchedFormState.error = null;
        subscribeToFeed({
          feedUrl: url,
          watchedFeeds,
          watchedPosts,
          watchedFormState,
        });
      })
      .catch((error) => {
        watchedFormState.error = error;
        watchedFormState.processState = FORM_STATES.failed;
      });
  };

  const formEl = document.querySelector('.rss-form');

  formEl.addEventListener('submit', handleFormSubmit);
};

export default app;
