import { ClashAPIConfig } from 'src/types';

import { buildWebSocketURL, getURLAndInit } from '../misc/request-helper';

type LogsAPIConfig = ClashAPIConfig & { logLevel: string };
type LogEntry = {
  time?: string;
  id?: string;
  even?: boolean;
  // and some other props
};
type AppendLogFn = (x: LogEntry) => void;

const endpoint = '/logs';
const textDecoder = new TextDecoder('utf-8');

const getRandomStr = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16);
};

let even = false;
let fetched = false;
let decoded = '';

function appendData(s: string, callback: AppendLogFn) {
  let o: LogEntry;
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
  o.id = +now - 0 + getRandomStr();
  o.even = even = !even;
  callback(o);
}

function pump(reader: ReadableStreamDefaultReader, appendLog: AppendLogFn) {
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

let apiConfigSnapshot: LogsAPIConfig;
let controller: AbortController;

// 1 OPEN
// other value CLOSED
// similar to ws readyState but not the same
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
let wsState: number;
export function fetchLogs(apiConfig: LogsAPIConfig, appendLog: AppendLogFn) {
  if (fetched || wsState === 1) return;
  wsState = 1;
  const url = buildWebSocketURL(apiConfig, endpoint);
  const ws = new WebSocket(url);
  ws.addEventListener('error', () => (wsState = 3));
  ws.addEventListener('close', function (_ev) {
    wsState = 3;
    fetchLogsWithFetch(apiConfig, appendLog);
  });
  ws.addEventListener('message', function (event) {
    appendData(event.data, appendLog);
  });
}

function fetchLogsWithFetch(apiConfig: LogsAPIConfig, appendLog: AppendLogFn) {
  if (
    controller &&
    (apiConfigSnapshot.baseURL !== apiConfig.baseURL ||
      apiConfigSnapshot.secret !== apiConfig.secret ||
      apiConfigSnapshot.logLevel !== apiConfig.logLevel)
  ) {
    controller.abort();
  } else if (fetched) {
    return;
  }

  fetched = true;
  apiConfigSnapshot = { ...apiConfig };

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
