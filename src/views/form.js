import onChange from 'on-change';
import i18next from 'i18next';

import { FORM_STATES } from '../helpers/constants';

const renderErrorMessage = (inputEl, feedbackEl, error) => {
  const errMsg = error?.message ?? 'errors.default';

  inputEl.classList.add('is-invalid');
  feedbackEl.classList.add('text-danger');
  feedbackEl.textContent = i18next.t(errMsg);
};

const renderSuccessMessage = (feedbackEl) => {
  feedbackEl.classList.add('text-success');
  feedbackEl.textContent = i18next.t('successMsg');
};

const cleanFormMessage = (inputEl, feedbackEl) => {
  feedbackEl.classList.remove('text-success');
  feedbackEl.classList.remove('text-danger');
  feedbackEl.textContent = '';
  inputEl.classList.remove('is-invalid');
};

const handleFormStateChange = (processState, formState, formEl) => {
  const inputEl = formEl.querySelector('#url-input');
  const submitButtonEl = formEl.querySelector('button[type="submit"]');
  const feedbackEl = document.querySelector('.feedback-container');

  switch (processState) {
    case FORM_STATES.sending:
      cleanFormMessage(inputEl, feedbackEl);
      submitButtonEl.disabled = true;
      inputEl.readOnly = true;
      break;

    case FORM_STATES.success:
      renderSuccessMessage(feedbackEl);
      submitButtonEl.disabled = false;
      inputEl.readOnly = false;
      formEl.reset();
      inputEl.focus();
      break;

    case FORM_STATES.failed:
      renderErrorMessage(inputEl, feedbackEl, formState.error);
      submitButtonEl.disabled = false;
      inputEl.readOnly = false;
      inputEl.focus();
      break;

    default:
      break;
  }
};

const watchFormState = (formState) => {
  const formEl = document.querySelector('form');

  const watchedFormState = onChange(formState, function onChangeHandler(path, value) {
    if (path === 'processState') {
      handleFormStateChange(value, this, formEl);
    }
  });

  return watchedFormState;
};

export default watchFormState;
