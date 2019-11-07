const endpoint = '/connections';

let fetched = false;
let subscribers = [];

function appendData(s) {
  let o;
  try {
    o = JSON.parse(s);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('JSON.parse error', JSON.parse(s));
  }
  subscribers.forEach(f => f(o));
}

function getWsUrl(apiConfig) {
  const { hostname, port, secret } = apiConfig;
  let qs = '';
  if (typeof secret === 'string' && secret !== '') {
    qs += '?token=' + secret;
  }
  return `ws://${hostname}:${port}${endpoint}${qs}`;
}

let wsState;
function fetchData(apiConfig, listener) {
  if (fetched || wsState === 1) {
    if (listener) return subscribe(listener);
  }
  wsState = 1;
  const url = getWsUrl(apiConfig);
  const ws = new WebSocket(url);
  ws.addEventListener('error', function(_ev) {
    wsState = 3;
  });
  ws.addEventListener('message', function(event) {
    appendData(event.data);
  });
  if (listener) return subscribe(listener);
}

function subscribe(listener) {
  subscribers.push(listener);
  return function unsubscribe() {
    const idx = subscribers.indexOf(listener);
    subscribers.splice(idx, 1);
  };
}

export { fetchData };
