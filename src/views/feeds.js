import onChange from 'on-change';
import i18next from 'i18next';

import { createHeader, createList } from './common';

const createFeedsListItemEl = ({ title, description }) => {
  const listItemEl = document.createElement('li');
  listItemEl.classList.add('list-group-item', 'border-0', 'border-end-0');
  listItemEl.innerHTML = `
    <h3 class="h6 m-0">${title}</h3>
    <p class="m-0 small text-black-50">${description}</p>
  `;
  return listItemEl;
};

const renderFeeds = (feeds) => {
  const feedsContainerEl = document.querySelector('.feeds');
  const headerEl = createHeader(i18next.t('headers.feedsHeader'));
  const feedsListEl = createList(feeds, createFeedsListItemEl);

  feedsContainerEl.innerHTML = '';
  feedsContainerEl.append(headerEl);
  feedsContainerEl.append(feedsListEl);
};

const watchFeedsState = (feeds) => {
  const watchedFeeds = onChange(feeds, (_, value) => {
    renderFeeds(value);
  });
  return watchedFeeds;
};

export default watchFeedsState;
