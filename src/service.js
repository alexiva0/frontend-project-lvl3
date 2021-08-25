import axios from 'axios';

const PROXY_GET_URL = 'https://hexlet-allorigins.herokuapp.com/get';
const PROXY_URL_SEARCH_PARAM = 'url';

const getUrlWithProxy = (feedUrl) => {
  const url = new URL(PROXY_GET_URL);
  url.searchParams.append(PROXY_URL_SEARCH_PARAM, feedUrl);
  return url.toString();
};

const parseFeedResponse = (feedResponse) => {
  const parser = new DOMParser();
  const feedXML = parser.parseFromString(
    feedResponse.data.contents,
    'application/xml',
  );
  const posts = Array.from(feedXML.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
  }));

  return {
    title: feedXML.querySelector('title').textContent,
    description: feedXML.querySelector('description').textContent,
    posts,
  };
};

const getFeedData = (feedUrl) => {
  console.log(getUrlWithProxy(feedUrl));
  return axios
    .get(getUrlWithProxy(feedUrl))
    .then((feedResponse) => parseFeedResponse(feedResponse))
    .catch((err) => {
      console.log(err);
    });
};

export default getFeedData;
