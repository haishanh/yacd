import { getURLAndInit } from 'm/request-helper';
const endpoint = '/proxies';

/*
$ curl "http://127.0.0.1:8080/proxies/Proxy" -XPUT -d '{ "name": "ss3" }' -i
HTTP/1.1 400 Bad Request
Vary: Origin
Date: Tue, 16 Oct 2018 16:38:20 GMT
Content-Length: 56
Content-Type: text/plain; charset=utf-8

{"error":"Selector update error: Proxy does not exist"}

~
$ curl "http://127.0.0.1:8080/proxies/GLOBAL" -XPUT -d '{ "name": "Proxy" }' -i
HTTP/1.1 204 No Content
Vary: Origin
Date: Tue, 16 Oct 2018 16:38:33 GMT
*/

export async function fetchProxies(config) {
  const { url, init } = getURLAndInit(config);
  const res = await fetch(url + endpoint, init);
  return await res.json();
}

export async function requestToSwitchProxy(apiConfig, name1, name2) {
  const body = { name: name2 };
  const { url, init } = getURLAndInit(apiConfig);
  const fullURL = `${url}${endpoint}/${name1}`;
  return await fetch(fullURL, {
    ...init,
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

export async function requestDelayForProxy(apiConfig, name) {
  const { url, init } = getURLAndInit(apiConfig);
  const qs = 'timeout=5000&url=http://www.google.com/generate_204';
  const fullURL = `${url}${endpoint}/${name}/delay?${qs}`;
  return await fetch(fullURL, init);
}

export async function fetchProviderProxies(config) {
  const { url, init } = getURLAndInit(config);
  const res = await fetch(url + '/providers/proxies', init);
  if (res.status === 404) {
    return { providers: {} };
  }
  return await res.json();
}

export async function updateProviderByName(config, name) {
  const { url, init } = getURLAndInit(config);
  const options = { ...init, method: 'PUT' };
  return await fetch(url + '/providers/proxies/' + name, options);
}

export async function healthcheckProviderByName(config, name) {
  const { url, init } = getURLAndInit(config);
  const options = { ...init, method: 'GET' };
  return await fetch(
    url + '/providers/proxies/' + name + '/healthcheck',
    options
  );
}
