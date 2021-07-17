import onChange from 'on-change';

import { IState } from './types';

const renderForm = (formEl: HTMLFormElement | null, watchedState: IState) => {
  if (!formEl) {
    return;
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.feeds.push('one');
  });
};

const renderFeed = (feedContainerEl: HTMLElement | null, watchedState: IState) => {
  if (!feedContainerEl) {
    return;
  }
  feedContainerEl.append('Hello');
};

const app = (): void => {
  const state: IState = {
    feeds: [],
  };

  const formEl: HTMLFormElement | null = document.querySelector('.form-container form');
  const feedContainerEl: HTMLElement | null = document.querySelector('.feed-container');

  const watchedState = onChange(state, (path, value) => {
    console.log(
      '<------------------------stateChanged------------------------------>',
    );
    console.log('path', path);
    console.log('value', value);
    console.log(
      '<------------------------------------------------------------------>',
    );
  });

  renderForm(formEl, watchedState);
  renderFeed(feedContainerEl, watchedState);
};

export default app;
