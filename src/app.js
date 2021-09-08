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

const subscribeToNewPosts = (feedUrl, watchedPosts) => {
  const updatePosts = () => {
    setTimeout(() => {
      getFeedData(feedUrl)
        .then(({ posts }) => {
          const newPosts = posts
            .filter((fetchedPost) => !watchedPosts.find(
              (existingPost) => existingPost.guid === fetchedPost.guid,
            ));

          watchedPosts.unshift(...newPosts);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          updatePosts();
        });
    }, 5000);
  };

  updatePosts();
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

  const schema = createValidationSchema(watchedFeeds);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    watchedFormState.processState = FORM_STATES.sending;

    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    schema
      .validate({ url })
      .then(() => {
        watchedFormState.error = null;
        return getFeedData(url);
      })
      .then(({ feed, posts }) => {
        watchedFormState.processState = FORM_STATES.success;
        watchedFeeds.push(feed);
        watchedPosts.unshift(...posts);

        subscribeToNewPosts(url, watchedPosts);
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
