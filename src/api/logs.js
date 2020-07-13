import { getURLAndInit } from '../misc/request-helper';
const endpoint = '/logs';
const textDecoder = new TextDecoder('utf-8');

const getRandomStr = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16);
};

let even = false;
let fetched = false;
let decoded = '';

function appendData(s, callback) {
  let o;
  try {
    o = JSON.parse(s);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('JSON.parse error', JSON.parse(s));
  }

  const now = new Date();
  const time = now.toLocaleString('zh-Hans');
  // mutate input param in place intentionally
  o.time = time;
  o.id = now - 0 + getRandomStr();
  o.even = even = !even;
  callback(o);
}

function pump(reader, appendLog) {
  return reader.read().then(({ done, value }) => {
    const str = textDecoder.decode(value, { stream: !done });
    decoded += str;

    const splits = decoded.split('\n');

    const lastSplit = splits[splits.length - 1];

    for (let i = 0; i < splits.length - 1; i++) {
      appendData(splits[i], appendLog);
    }

    if (done) {
      appendData(lastSplit, appendLog);
      decoded = '';

      // eslint-disable-next-line no-console
      console.log('GET /logs streaming done');
      fetched = false;
      return;
    } else {
      decoded = lastSplit;
    }
    return pump(reader, appendLog);
  });
}

const apiConfigSnapshot = {};
let controller;

function getWsUrl(apiConfig) {
  const { hostname, port, secret, logLevel } = apiConfig;
  let qs = '?level=' + logLevel;
  if (typeof secret === 'string' && secret !== '') {
    qs += '&token=' + encodeURIComponent(secret);
  }
  return `ws://${hostname}:${port}${endpoint}${qs}`;
}

// 1 OPEN
// other value CLOSED
// similar to ws readyState but not the same
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
let wsState;
function fetchLogs(apiConfig, appendLog) {
  if (fetched || wsState === 1) return;
  wsState = 1;
  const url = getWsUrl(apiConfig);
  const ws = new WebSocket(url);
  ws.addEventListener('error', function (_ev) {
    wsState = 3;
  });
  ws.addEventListener('close', function (_ev) {
    wsState = 3;
    fetchLogsWithFetch(apiConfig, appendLog);
  });
  ws.addEventListener('message', function (event) {
    appendData(event.data, appendLog);
  });
}

function fetchLogsWithFetch(apiConfig, appendLog) {
  if (
    controller &&
    (apiConfigSnapshot.hostname !== apiConfig.hostname ||
      apiConfigSnapshot.port !== apiConfig.port ||
      apiConfigSnapshot.secret !== apiConfig.secret ||
      apiConfigSnapshot.logLevel !== apiConfig.logLevel)
  ) {
    controller.abort();
  } else if (fetched) {
    return;
  }

  fetched = true;

  apiConfigSnapshot.hostname = apiConfig.hostname;
  apiConfigSnapshot.port = apiConfig.port;
  apiConfigSnapshot.secret = apiConfig.secret;
  apiConfigSnapshot.logLevel = apiConfig.logLevel;

  controller = new AbortController();
  const signal = controller.signal;

  const { url, init } = getURLAndInit(apiConfig);
  fetch(url + endpoint + '?level=' + apiConfig.logLevel, {
    ...init,
    signal,
  }).then(
    (response) => {
      const reader = response.body.getReader();
      pump(reader, appendLog);
    },
    (err) => {
      fetched = false;
      if (signal.aborted) return;

      // eslint-disable-next-line no-console
      console.log('GET /logs error:', err.message);
    }
  );
}

export { fetchLogs };
