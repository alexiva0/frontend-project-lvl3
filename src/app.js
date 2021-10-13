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
      .notOneOf(feeds.map(({ url }) => url)),
  });

const subscribeToNewPosts = (feedUrl, postsList) => {
  const updatePosts = () => {
    setTimeout(() => {
      getFeedData(feedUrl)
        .then(({ posts }) => {
          const newPosts = posts
            .filter((fetchedPost) => !postsList.find(
              (existingPost) => existingPost.guid === fetchedPost.guid,
            ));

          postsList.unshift(...newPosts);
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

const getPostById = (posts, postId) => posts.find(({ id }) => id === Number(postId));

const app = () => {
  const state = {
    feeds: [],
    posts: {
      list: [],
      currentPost: null,
    },
    form: {
      error: null,
      processState: FORM_STATES.filling,
    },
  };

  const watchedFormState = watchFormState(state.form);
  const watchedFeeds = watchFeedsState(state.feeds);
  const watchedPosts = watchPostsState(state.posts);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    watchedFormState.processState = FORM_STATES.sending;

    const schema = createValidationSchema(watchedFeeds);
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
        watchedPosts.list.unshift(...posts);

        subscribeToNewPosts(url, watchedPosts.list);
      })
      .catch((error) => {
        watchedFormState.error = error;
        watchedFormState.processState = FORM_STATES.failed;
      });
  };

  const handleModalOpen = (e) => {
    const postId = e.relatedTarget?.dataset?.id;

    if (postId) {
      const post = getPostById(watchedPosts.list, postId);
      watchedPosts.currentPost = post;
    }
  };

  const handlePostClick = (e) => {
    const postId = e.target.dataset.id;

    if (postId) {
      const post = getPostById(watchedPosts.list, postId);
      post.visited = true;
    }
  };

  const formEl = document.querySelector('.rss-form');
  const modalEl = document.querySelector('.modal');
  const postsContainerEl = document.querySelector('.posts');

  formEl?.addEventListener('submit', handleFormSubmit);
  modalEl?.addEventListener('show.bs.modal', handleModalOpen);
  postsContainerEl?.addEventListener('click', handlePostClick);
};

export default app;
