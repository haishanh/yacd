'use strict';

import {
  getAPIConfig,
  genCommonHeaders,
  getAPIBaseURL
} from 'm/request-helper';
const endpoint = '/proxies';

function getURLAndInit() {
  const c = getAPIConfig();
  const baseURL = getAPIBaseURL(c);
  const headers = genCommonHeaders(c);
  return {
    url: baseURL + endpoint,
    init: { headers }
  };
}

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

async function fetchProxies() {
  const { url, init } = getURLAndInit();
  const res = await fetch(url, init);
  return await res.json();
}

async function requestToSwitchProxy(name1, name2) {
  const body = { name: name2 };
  const { url, init } = getURLAndInit();
  const fullURL = `${url}/${name1}`;
  return await fetch(fullURL, {
    ...init,
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

async function requestDelayForProxy(name) {
  const { url, init } = getURLAndInit();
  const qs = `timeout=5000&url=http://www.google.com/generate_204`;
  const fullURL = `${url}/${name}/delay?${qs}`;
  return await fetch(fullURL, init);
}

export { fetchProxies, requestToSwitchProxy, requestDelayForProxy };
