import {
  getAPIConfig,
  genCommonHeaders,
  getAPIBaseURL
} from 'm/request-helper';

const endpoint = '/configs';

function getURLAndInit() {
  const c = getAPIConfig();
  const baseURL = getAPIBaseURL(c);
  const headers = genCommonHeaders(c);
  return {
    url: baseURL + endpoint,
    init: { headers }
  };
}

export async function fetchConfigs() {
  const { url, init } = getURLAndInit();
  return await fetch(url, init);
}

export async function updateConfigs(o) {
  const { url, init } = getURLAndInit();
  return await fetch(url, {
    ...init,
    method: 'PUT',
    // mode: 'cors',
    body: JSON.stringify(o)
  });
}
