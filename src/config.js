'use strict';

// const apiBaseURL = 'http://127.0.0.1:1234';
let apiBaseURL = 'http://127.0.0.1:7899';
const updateAPIBaseURL = url => (apiBaseURL = url);
const getAPIURL = () => ({
  proxies: apiBaseURL + '/proxies',
  logs: apiBaseURL + '/logs',
  traffic: apiBaseURL + '/traffic',
  configs: apiBaseURL + '/configs'
});

export { apiBaseURL, getAPIURL, updateAPIBaseURL };
