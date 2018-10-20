'use strict';

const { getAPIURL } = require('../config');

const headers = {
  'Content-Type': 'application/json'
};

export async function fetchConfigs() {
  const apiURL = getAPIURL();
  return await fetch(apiURL.configs);
}

export async function updateConfigs(o) {
  const apiURL = getAPIURL();
  return await fetch(apiURL.configs, {
    method: 'PUT',
    // mode: 'cors',
    headers,
    body: JSON.stringify(o)
  });
}
