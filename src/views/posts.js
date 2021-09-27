import onChange from 'on-change';
import i18next from 'i18next';

import { createHeader, createList } from './common';

const createPostsListItemEl = ({
  title, link, id, visited,
}) => {
  const listItemEl = document.createElement('li');
  const linkClass = visited ? 'fw-normal link-secondary' : 'fw-bold';
  listItemEl.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  listItemEl.innerHTML = `
    <a href="${link}" class="${linkClass}" data-id="${id}" target="_blank" rel="noopener noreferrer">${title}</a>
    <button
      type="button"
      class="btn btn-outline-primary btn-sm"
      data-id="${id}"
      data-bs-toggle="modal"
      data-bs-target="#postModal"
    >
      ${i18next.t('postButton')}
    </button>
  `;
  return listItemEl;
};

const renderPosts = (postsList) => {
  const postsContainerEl = document.querySelector('.posts');
  const headerEl = createHeader(i18next.t('headers.postsHeader'));
  const postsListEl = createList(postsList, createPostsListItemEl);

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

const watchPostsState = (posts) => {
  const watchedPosts = onChange(posts, function onChangeHandler(path, value) {
    switch (path) {
      case 'currentPost':
        updateModalContent(value);
        break;

      // Any changes other than currentPostId value should trigger posts list rerender
      default:
        renderPosts(this.list);
        break;
    }
  });
  return watchedPosts;
};

export default watchPostsState;
