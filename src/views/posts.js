import onChange from 'on-change';
import i18next from 'i18next';

import { createHeader, createList } from './common';

const createPostsListItemEl = ({
  title, link, id, visited,
}) => {
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
  listItemButtonEl.textContent = i18next.t('postButton');

  listItemEl.append(listItemLinkEl, listItemButtonEl);

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
