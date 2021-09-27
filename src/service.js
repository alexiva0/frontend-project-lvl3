import axios from 'axios';
import createIdGenerator from './helpers/create-id-generator';

import {
  PROXY_GET_URL,
  PROXY_URL_SEARCH_PARAM,
  PROXY_DISABLE_CACHE_SEARCH_PARAM,
  NETWORK_ERROR_MSG,
  PARSING_ERROR_MSG,
} from './helpers/constants';

const generateFeedId = createIdGenerator();
const generatePostId = createIdGenerator();

const getUrlWithProxy = (feedUrl) => {
  const url = new URL(PROXY_GET_URL);
  url.searchParams.append(PROXY_URL_SEARCH_PARAM, feedUrl);
  url.searchParams.append(PROXY_DISABLE_CACHE_SEARCH_PARAM, true);
  return url.toString();
};

const parseFeedResponse = (feedResponse, feedUrl) => {
  const feedId = generateFeedId();
  const parser = new DOMParser();
  const feedXML = parser.parseFromString(
    feedResponse.data.contents,
    'application/xml',
  );
  const posts = Array.from(feedXML.querySelectorAll('item')).map((item) => ({
    feedId,
    id: generatePostId(),
    guid: item.querySelector('guid').textContent,
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }));

  const feed = {
    id: feedId,
    url: feedUrl,
    title: feedXML.querySelector('title').textContent,
    description: feedXML.querySelector('description').textContent,
    visited: false,
  };

  return {
    feed,
    posts,
  };
};

const getFeedData = (feedUrl) => axios
  .get(getUrlWithProxy(feedUrl))
  .then((feedResponse) => parseFeedResponse(feedResponse, feedUrl))
  .catch((err) => {
    if (err.message.includes(NETWORK_ERROR_MSG)) {
      throw new Error('errors.networkError');
    }

    if (err.message.includes(PARSING_ERROR_MSG)) {
      throw new Error('errors.parseError');
    }

    throw err;
  });

export default getFeedData;
