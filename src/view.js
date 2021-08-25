import onChange from 'on-change';

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

const handleErrorStateChange = (error, formEl) => {
  if (error) {
    renderFormError(formEl, error);
  } else {
    cleanFormError(formEl);
  }
};

const watchFormState = (formState) => {
  const formEl = document.querySelector('form');

  const watchedFormState = onChange(formState, (path, value) => {
    switch (path) {
      case 'error':
        handleErrorStateChange(value, formEl);
        break;

      default:
        break;
    }
  });

  return watchedFormState;
};

const watchFeedUrlsState = (feedUrls) => {
  const formEl = document.querySelector('form');
  const inputEl = document.querySelector('.form-control');

  const watchedFeedUrls = onChange(feedUrls, (_, value) => {
    formEl.reset();
    inputEl.focus();
    console.log(value);
  });
  return watchedFeedUrls;
};

export { watchFormState, watchFeedUrlsState };
