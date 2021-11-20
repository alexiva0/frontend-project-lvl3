import onChange from 'on-change';

import { FORM_STATES } from './helpers/constants';

const renderErrorMessage = (inputEl, feedbackEl, errorMsg, i18nextInstance) => {
  inputEl.classList.add('is-invalid');
  feedbackEl.classList.add('text-danger');
  feedbackEl.textContent = i18nextInstance.t(errorMsg || 'errors.default');
};

const renderSuccessMessage = (feedbackEl, i18nextInstance) => {
  feedbackEl.classList.add('text-success');
  feedbackEl.textContent = i18nextInstance.t('successMsg');
};

const cleanFormMessage = (inputEl, feedbackEl) => {
  feedbackEl.classList.remove('text-success');
  feedbackEl.classList.remove('text-danger');
  feedbackEl.textContent = '';
  inputEl.classList.remove('is-invalid');
};

const handleFormStateChange = (processState, formState, i18nextInstance) => {
  const formEl = document.querySelector('form');
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
      renderSuccessMessage(feedbackEl, i18nextInstance);
      submitButtonEl.disabled = false;
      inputEl.readOnly = false;
      formEl.reset();
      inputEl.focus();
      break;

    case FORM_STATES.failed:
      renderErrorMessage(inputEl, feedbackEl, formState.errorMsg, i18nextInstance);
      submitButtonEl.disabled = false;
      inputEl.readOnly = false;
      inputEl.focus();
      break;

    default:
      break;
  }
};

const createHeader = (text) => {
  const containerEl = document.createElement('div');
  containerEl.classList.add('card-body');
  const headerEl = document.createElement('h2');
  headerEl.classList.add('card-title', 'h4');
  headerEl.textContent = text;
  containerEl.append(headerEl);
  return containerEl;
};

const createList = (items, createListItem) => {
  const listEl = document.createElement('ul');
  listEl.classList.add('list-group', 'border-0', 'rounded-0');

  items.forEach((item) => {
    const listItemEl = createListItem(item);
    listEl.append(listItemEl);
  });

  return listEl;
};

const createFeedsListItemEl = ({ title, description }) => {
  const listItemEl = document.createElement('li');
  listItemEl.classList.add('list-group-item', 'border-0', 'border-end-0');

  const listItemHeaderEl = document.createElement('h3');
  listItemHeaderEl.classList.add('h6', 'm-0');
  listItemHeaderEl.textContent = title;

  const listItemDescriptionEl = document.createElement('p');
  listItemDescriptionEl.classList.add('text-black-50', 'small', 'm-0');
  listItemDescriptionEl.textContent = description;

  listItemEl.append(listItemHeaderEl, listItemDescriptionEl);

  return listItemEl;
};

const renderFeeds = (feeds, i18nextInstance) => {
  const feedsContainerEl = document.querySelector('.feeds');
  const headerEl = createHeader(i18nextInstance.t('headers.feedsHeader'));
  const feedsListEl = createList(feeds, createFeedsListItemEl);

  feedsContainerEl.innerHTML = '';
  feedsContainerEl.append(headerEl);
  feedsContainerEl.append(feedsListEl);
};

const createPostsListItemGenerator = (visitedPostsIds, i18nextInstance) => ({
  title, link, id,
}) => {
  const visited = visitedPostsIds.includes(id);
  const listItemEl = document.createElement('li');
  listItemEl.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );

  const listItemLinkEl = document.createElement('a');
  const linkClasses = visited ? ['fw-normal', 'link-secondary'] : ['fw-bold'];
  listItemLinkEl.classList.add(...linkClasses);
  listItemLinkEl.setAttribute('data-id', id);
  listItemLinkEl.href = link;
  listItemLinkEl.target = '_blank';
  listItemLinkEl.rel = 'noopener noreferrer';
  listItemLinkEl.textContent = title;

  const listItemButtonEl = document.createElement('button');
  listItemButtonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  listItemButtonEl.setAttribute('data-id', id);
  listItemButtonEl.setAttribute('data-bs-toggle', 'modal');
  listItemButtonEl.setAttribute('data-bs-target', '#postModal');
  listItemButtonEl.type = 'button';
  listItemButtonEl.textContent = i18nextInstance.t('postButton');

  listItemEl.append(listItemLinkEl, listItemButtonEl);

  return listItemEl;
};

const renderPosts = (posts, i18nextInstance) => {
  const { list: postsList, visitedPostsIds } = posts;
  const postsContainerEl = document.querySelector('.posts');
  const headerEl = createHeader(i18nextInstance.t('headers.postsHeader'));
  const postsListEl = createList(
    postsList,
    createPostsListItemGenerator(visitedPostsIds, i18nextInstance),
  );

  postsContainerEl.innerHTML = '';
  postsContainerEl.append(headerEl);
  postsContainerEl.append(postsListEl);
};

const updateModalContent = (post) => {
  const modalEl = document.querySelector('#postModal');
  const modalTitleEl = modalEl.querySelector('.modal-title');
  const modalBodyEl = modalEl.querySelector('.modal-body');
  const modalLinkEl = modalEl.querySelector('.full-article');

  modalTitleEl.textContent = post.title;
  modalBodyEl.textContent = post.description;
  modalLinkEl.href = post.link;
};

const watchState = (state, i18nextInstance) => {
  const watchedState = onChange(state, function onChangeHandler(path, value) {
    switch (path) {
      case 'feeds':
        renderFeeds(value, i18nextInstance);
        break;

      case 'form.processState':
        handleFormStateChange(value, this.form, i18nextInstance);
        break;

      case 'modal.currentPost':
        updateModalContent(value);
        break;

      // Any other changes should trigger posts rerender
      default:
        renderPosts(this.posts, i18nextInstance);
        break;
    }
  });

  return watchedState;
};

export default watchState;
