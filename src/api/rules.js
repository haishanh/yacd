import { getURLAndInit } from 'm/request-helper';

const endpoint = '/rules';

export async function fetchRules(apiConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, init);
}
