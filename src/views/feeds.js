import onChange from 'on-change';

import { createHeader, createList } from './common';

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

const watchFeedsState = (feeds, i18nextInstance) => {
  const watchedFeeds = onChange(feeds, (_, value) => {
    renderFeeds(value, i18nextInstance);
  });
  return watchedFeeds;
};

export default watchFeedsState;
