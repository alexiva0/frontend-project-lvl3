import onChange from 'on-change';
import * as yup from 'yup';

// import getFeedData from './service';

// const NETWORK_ERR_MESSAGE = 'Network error occured. Please, try again.';
const DUPLICATE_URL_ERR_MESSAGE = 'Url was already added to the list of the feeds.';

const FORM_STATES = {
  filling: 'filling',
  sending: 'sending',
  failed: 'failed',
  finished: 'finished',
};

const schema = yup.object().shape({
  url: yup.string().url().required(),
});

const renderFormError = (formEl, error) => {
  const inputEl = formEl.querySelector('.form-control');
  const errMsg = error.message;
  const inputContainerEl = formEl.querySelector('.input-container');
  const invalidFeedbackEl = document.createElement('div');
  invalidFeedbackEl.classList.add('invalid-feedback');
  invalidFeedbackEl.textContent = errMsg;
  inputContainerEl.append(invalidFeedbackEl);
  inputEl.classList.add('is-invalid');
};

const cleanFormError = (formEl) => {
  const inputEl = formEl.querySelector('.form-control');
  const invalidFeedbackEl = formEl.querySelector('.invalid-feedback');

  if (invalidFeedbackEl) {
    invalidFeedbackEl.remove();
  }
  inputEl.classList.remove('is-invalid');
};

const renderForm = (formEl, watchedState) => {
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    schema
      .validate({ url })
      .then(() => {
        if (watchedState.feedUrls.includes(url)) {
          throw new Error(DUPLICATE_URL_ERR_MESSAGE);
        } else {
          watchedState.form.error = null;
          watchedState.feedUrls.push(url);
          watchedState.form.processState = FORM_STATES.sending;
          // There would be API requiest
          watchedState.form.processState = FORM_STATES.finished;
        }
      })
      .catch((err) => {
        watchedState.form.error = err;
      });
  });
};

const processStateHandler = (formProcessState, formEl) => {
  const inputEl = formEl.querySelector('.form-control');
  const submitEl = formEl.querySelector('button');

  switch (formProcessState) {
    case FORM_STATES.filling:
      inputEl.disabled = false;
      submitEl.disabled = false;
      break;

    case FORM_STATES.sending:
      inputEl.disabled = true;
      submitEl.disabled = true;
      break;

    case FORM_STATES.failed:
      // Handle network error
      break;

    case FORM_STATES.finished:
      inputEl.disabled = false;
      submitEl.disabled = false;
      inputEl.focus();
      formEl.reset();
      break;

    default:
      break;
  }
};

// const handleNewFeed = (feedUrls, watchedState) => {
//   const newFeedUrl = feedUrls[feedUrls.length - 1];
//   getFeedData(newFeedUrl)
//     .then((feedData) => {
//       watchedState.form.processState = FORM_STATES.finished;
//       console.log(feedData);
//     })
//     .catch((err) => {
//       watchedState.form.formProcessState = FORM_STATES.failed;
//       watchedState.form.error = new Error(NETWORK_ERR_MESSAGE);
//     });
// };

const app = () => {
  const state = {
    form: {
      processState: FORM_STATES.filling,
      error: null,
    },
    feedUrls: [],
    feeds: [],
  };

  const formEl = document.querySelector('.form-container form');
  // const feedContainerEl = document.querySelector('.feed-container');

  const watchedState = onChange(state, (path, value) => {
    console.log(
      '<------------------------stateChanged------------------------------>',
    );
    console.log('path', path);
    console.log('value', value);
    console.log(
      '<------------------------------------------------------------------>',
    );

    switch (path) {
      case 'feedUrls':
        // handleNewFeed(value, watchedState);
        break;

      case 'form.processState':
        processStateHandler(value, formEl);
        break;

      case 'form.error':
        if (value) {
          renderFormError(formEl, value);
        } else {
          cleanFormError(formEl);
        }
        break;

      default:
        break;
    }
  });

  renderForm(formEl, watchedState);
  // renderFeed(feedContainerEl, watchedState);
};

export default app;
