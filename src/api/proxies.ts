import { ClashAPIConfig } from '$src/types';

import { getURLAndInit } from '../misc/request-helper';

const endpoint = '/proxies';

/*
$ curl "http://127.0.0.1:8080/proxies/Proxy" -XPUT -d '{ "name": "ss3" }' -i
HTTP/1.1 400 Bad Request
Content-Type: text/plain; charset=utf-8

{"error":"Selector update error: Proxy does not exist"}

~
$ curl "http://127.0.0.1:8080/proxies/GLOBAL" -XPUT -d '{ "name": "Proxy" }' -i
HTTP/1.1 204 No Content
*/

export async function fetchProxies(config: ClashAPIConfig) {
  const { url, init } = getURLAndInit(config);
  const res = await fetch(url + endpoint, init);
  return await res.json();
}

export async function requestToSwitchProxy(
  apiConfig: ClashAPIConfig,
  groupName: string,
  name: string,
) {
  const body = { name };
  const { url, init } = getURLAndInit(apiConfig);
  const group = encodeURIComponent(groupName);
  const fullURL = `${url}${endpoint}/${group}`;
  return await fetch(fullURL, {
    ...init,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function requestDelayForProxy(
  apiConfig: ClashAPIConfig,
  name: string,
  latencyTestUrl = 'http://www.gstatic.com/generate_204',
) {
  const { url, init } = getURLAndInit(apiConfig);
  const qs = `timeout=5000&url=${encodeURIComponent(latencyTestUrl)}`;
  const fullURL = `${url}${endpoint}/${encodeURIComponent(name)}/delay?${qs}`;
  return await fetch(fullURL, init);
}

export async function fetchProviderProxies(config: ClashAPIConfig) {
  const { url, init } = getURLAndInit(config);
  const res = await fetch(url + '/providers/proxies', init);
  if (res.status === 404) {
    return { providers: {} };
  }
  return await res.json();
}

export async function updateProviderByName(config: ClashAPIConfig, name: string) {
  const { url, init } = getURLAndInit(config);
  const options = { ...init, method: 'PUT' };
  return await fetch(url + '/providers/proxies/' + encodeURIComponent(name), options);
}

export async function healthcheckProviderByName(config: ClashAPIConfig, name: string) {
  const { url, init } = getURLAndInit(config);
  const options = { ...init, method: 'GET' };
  return await fetch(
    url + '/providers/proxies/' + encodeURIComponent(name) + '/healthcheck',
    options,
  );
}
