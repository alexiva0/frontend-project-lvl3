import axios from 'axios';
import createIdGenerator from './helpers/create-id-generator';

import {
  PROXY_GET_URL,
  PROXY_URL_SEARCH_PARAM,
  PROXY_DISABLE_CACHE_SEARCH_PARAM,
} from './helpers/constants';

const generateFeedId = createIdGenerator();
const generatePostId = createIdGenerator();

const getUrlWithProxy = (feedUrl) => {
  const url = new URL(PROXY_GET_URL);
  url.searchParams.append(PROXY_URL_SEARCH_PARAM, feedUrl);
  url.searchParams.append(PROXY_DISABLE_CACHE_SEARCH_PARAM, true);
  return url.toString();
};

const parseFeed = (feedString) => {
  const parser = new DOMParser();
  return parser.parseFromString(
    feedString,
    'application/xml',
  );
};

const generateFeedData = (feedResponse, feedUrl) => {
  try {
    const feedXML = parseFeed(feedResponse?.data?.contents);
    const feedId = generateFeedId();

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
  } catch (_) {
    throw new Error('errors.parseError');
  }
};

const getFeedData = (feedUrl) => axios
  .get(getUrlWithProxy(feedUrl))
  .catch(() => {
    throw new Error('errors.networkError');
  })
  .then((feedResponse) => generateFeedData(feedResponse, feedUrl));

export default getFeedData;
