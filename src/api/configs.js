import {
  getURLAndInit,
  genCommonHeaders,
  getAPIBaseURL
} from 'm/request-helper';

const endpoint = '/configs';

export async function fetchConfigs(apiConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, init);
}

// TODO support PUT /configs
// req body
// { Path: string }

export async function updateConfigs(apiConfig, o) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, {
    ...init,
    method: 'PATCH',
    // mode: 'cors',
    body: JSON.stringify(o)
  });
}
