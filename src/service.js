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

const parseFeedXml = (feedXML) => {
  const posts = Array.from(feedXML.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }));
  return {
    title: feedXML.querySelector('title').textContent,
    description: feedXML.querySelector('description').textContent,
    posts,
  };
};

const mapFeedData = (feedData, feedUrl) => {
  const feedId = generateFeedId();

  const posts = feedData.posts.map((post) => ({
    ...post,
    feedId,
    id: generatePostId(),
  }));

  const feed = {
    ...feedData,
    posts,
    id: feedId,
    url: feedUrl,
    visited: false,
  };

  return {
    feed,
    posts,
  };
};

const getFeedData = (feedUrl) => axios
  .get(getUrlWithProxy(feedUrl))
  .then((feedResponse) => {
    const parser = new DOMParser();
    const feedXML = parser.parseFromString(
      feedResponse?.data?.contents,
      'application/xml',
    );

    const parseError = feedXML.querySelector('parsererror');
    if (parseError) {
      const error = new Error(parseError.textContent);
      error.isParseError = true;
      throw error;
    }

    const feedData = parseFeedXml(feedXML);
    return mapFeedData(feedData, feedUrl);
  });

export default getFeedData;
