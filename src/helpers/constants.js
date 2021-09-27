const FORM_STATES = {
  filling: 'FILLING',
  sending: 'SENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
};

const PROXY_GET_URL = 'https://hexlet-allorigins.herokuapp.com/get';
const PROXY_URL_SEARCH_PARAM = 'url';
const PROXY_DISABLE_CACHE_SEARCH_PARAM = 'disableCache';

const NETWORK_ERROR_MSG = 'Network Error';
const PARSING_ERROR_MSG = 'XML Parsing Error';
const NOT_RSS_ERROR_MSG = 'Cannot read property \'textContent\' of null';

export {
  FORM_STATES,

  PROXY_GET_URL,
  PROXY_URL_SEARCH_PARAM,
  PROXY_DISABLE_CACHE_SEARCH_PARAM,
  NETWORK_ERROR_MSG,
  PARSING_ERROR_MSG,
  NOT_RSS_ERROR_MSG,
};
