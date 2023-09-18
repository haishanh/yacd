import { pad0 } from 'src/misc/utils';
import { Log } from 'src/store/types';
import { LogsAPIConfig } from 'src/types';

import { buildLogsWebSocketURL, getURLAndInit } from '../misc/request-helper';

type AppendLogFn = (x: Log) => void;
enum WebSocketReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

const endpoint = '/logs';
const textDecoder = new TextDecoder('utf-8');

const getRandomStr = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16);
};

let even = false;
let fetched = false;
let decoded = '';
let ws: WebSocket;
let prevAppendLogFn: AppendLogFn;

function appendData(s: string, callback: AppendLogFn) {
  let o: Partial<Log>;
  try {
    o = JSON.parse(s);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('JSON.parse error', JSON.parse(s));
  }

  const now = new Date();
  const time = formatDate(now);
  // mutate input param in place intentionally
  o.time = time;
  o.id = +now - 0 + getRandomStr();
  o.even = even = !even;
  callback(o as Log);
}

function formatDate(d: Date) {
  // 19-03-09 12:45
  const YY = d.getFullYear() % 100;
  const MM = pad0(d.getMonth() + 1, 2);
  const dd = pad0(d.getDate(), 2);
  const HH = pad0(d.getHours(), 2);
  const mm = pad0(d.getMinutes(), 2);
  const ss = pad0(d.getSeconds(), 2);
  return `${YY}-${MM}-${dd} ${HH}:${mm}:${ss}`;
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

/** loose hashing of the connection configuration */
function makeConnStr(c: LogsAPIConfig) {
  const keys = Object.keys(c);
  keys.sort();
  return keys.map((k) => c[k]).join('|');
}

let prevConnStr: string;
let controller: AbortController;

export function fetchLogs(apiConfig: LogsAPIConfig, appendLog: AppendLogFn) {
  if (apiConfig.logLevel === 'uninit') return;
  if (fetched || (ws && ws.readyState === WebSocketReadyState.Open)) return;
  prevAppendLogFn = appendLog;
  const url = buildLogsWebSocketURL(apiConfig, endpoint);
  ws = new WebSocket(url);
  ws.addEventListener('error', () => {
    fetchLogsWithFetch(apiConfig, appendLog);
  });
  ws.addEventListener('message', function (event) {
    appendData(event.data, appendLog);
  });
}

export function stop() {
  ws.close();
  if (controller) controller.abort();
}

export function reconnect(apiConfig: LogsAPIConfig) {
  if (!prevAppendLogFn || !ws) return;
  ws.close();
  fetched = false;
  fetchLogs(apiConfig, prevAppendLogFn);
}

function fetchLogsWithFetch(apiConfig: LogsAPIConfig, appendLog: AppendLogFn) {
  if (controller && makeConnStr(apiConfig) !== prevConnStr) {
    controller.abort();
  } else if (fetched) {
    return;
  }

  fetched = true;
  prevConnStr = makeConnStr(apiConfig);

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
    },
  );
}
