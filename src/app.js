import * as yup from 'yup';
import watchState from './view';
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
              (existingPost) => existingPost.link === fetchedPost.link,
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

const app = (i18nextInstance) => {
  const state = {
    feeds: [],
    posts: {
      list: [],
      visitedPostsIds: [],
    },
    modal: {
      currentPost: null,
    },
    form: {
      error: null,
      processState: FORM_STATES.filling,
    },
  };

  const watchedState = watchState(state, i18nextInstance);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    watchedState.form.processState = FORM_STATES.sending;

    const schema = createValidationSchema(watchedState.feeds);
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    schema
      .validate({ url })
      .then(() => {
        watchedState.form.error = null;
        return getFeedData(url);
      })
      .then(({ feed, posts }) => {
        watchedState.form.processState = FORM_STATES.success;
        watchedState.feeds.push(feed);
        watchedState.posts.list.unshift(...posts);

        subscribeToNewPosts(url, watchedState.posts.list);
      })
      .catch((error) => {
        watchedState.form.error = error;
        watchedState.form.processState = FORM_STATES.failed;
      });
  };

  const handleModalOpen = (e) => {
    const postId = e.relatedTarget?.dataset?.id;

    if (postId) {
      const post = getPostById(watchedState.posts.list, postId);
      watchedState.modal.currentPost = post;
    }
  };

  const handlePostClick = (e) => {
    const postId = e.target.dataset.id;

    if (postId) {
      watchedState.posts.visitedPostsIds.push(Number(postId));
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
