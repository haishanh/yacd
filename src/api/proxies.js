'use strict';

const { getAPIURL } = require('../config');

const headers = {
  'Content-Type': 'application/json'
};

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
  const apiURL = getAPIURL();
  const res = await fetch(apiURL.proxies);
  return await res.json();
}

async function requestToSwitchProxy(name1, name2) {
  const body = { name: name2 };
  const apiURL = getAPIURL();
  const url = `${apiURL.proxies}/${name1}`;
  return await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });
}

async function requestDelayForProxy(name) {
  const apiURL = getAPIURL();
  const qs = `timeout=5000&url=http://www.google.com/generate_204`;
  const url = `${apiURL.proxies}/${name}/delay?${qs}`;
  return await fetch(url);
}

export { fetchProxies, requestToSwitchProxy, requestDelayForProxy };
