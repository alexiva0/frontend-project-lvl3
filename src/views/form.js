import onChange from 'on-change';
import i18next from 'i18next';

import { FORM_STATES } from '../helpers/constants';

const renderFormError = (formEl, error) => {
  const inputEl = formEl.querySelector('.form-control');
  const errMsg = i18next.t(error.message);
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

const handleFormErrorStateChange = (error, formEl) => {
  if (error) {
    renderFormError(formEl, error);
  } else {
    cleanFormError(formEl);
  }
};

const handleFormStateChange = (formState, formEl) => {
  const inputEl = formEl.querySelector('.form-control');
  const submitButtonEl = formEl.querySelector('button[type="submit"]');

  switch (formState) {
    case FORM_STATES.filling:
      submitButtonEl.disabled = false;
      formEl.reset();
      inputEl.focus();
      break;

    case FORM_STATES.sending:
      submitButtonEl.disabled = true;
      break;

    case FORM_STATES.failed:
      submitButtonEl.disabled = false;
      inputEl.focus();
      break;

    default:
      break;
  }
};

const watchFormState = (formState) => {
  const formEl = document.querySelector('form');

  const watchedFormState = onChange(formState, (path, value) => {
    switch (path) {
      case 'error':
        handleFormErrorStateChange(value, formEl);
        break;

      case 'state':
        handleFormStateChange(value, formEl);
        break;

      default:
        break;
    }
  });

  return watchedFormState;
};

export default watchFormState;
