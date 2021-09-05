import onChange from 'on-change';
import i18next from 'i18next';

import { createHeader, createList } from './common';

const createPostsListItemEl = ({ title, link, id }) => {
  const listItemEl = document.createElement('li');
  listItemEl.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  listItemEl.innerHTML = `
    <a href="${link}" class="fw-bold" data-id="${id}" target="_blank" rel="noopener noreferrer">${title}</a>
  `;
  return listItemEl;
};

const renderPosts = (posts) => {
  const postsContainerEl = document.querySelector('.posts');
  const headerEl = createHeader(i18next.t('headers.postsHeader'));
  const postsListEl = createList(posts, createPostsListItemEl);

  postsContainerEl.innerHTML = '';
  postsContainerEl.append(headerEl);
  postsContainerEl.append(postsListEl);
};

const watchPostsState = (posts) => {
  const watchedPosts = onChange(posts, (_, value) => {
    renderPosts(value);
  });
  return watchedPosts;
};

export default watchPostsState;
