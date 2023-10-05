import { ClashAPIConfig } from '$src/types';

import { buildWebSocketURL } from '../misc/request-helper';

const endpoint = '/traffic';

const Size = 150;

type Traffic = { up: number; down: number };

let ws: WebSocket;

const traffic = {
  labels: Array(Size).fill(0),
  up: Array(Size),
  down: Array(Size),

  size: Size,
  subscribers: [],
  appendData(o: Traffic) {
    this.up.shift();
    this.down.shift();
    this.labels.shift();

    const l = Date.now();
    this.up.push(o.up);
    this.down.push(o.down);
    this.labels.push(l);

    this.subscribers.forEach((f: (x: Traffic) => void) => f(o));
  },

  subscribe(listener: (x: any) => void) {
    this.subscribers.push(listener);
    return () => {
      const idx = this.subscribers.indexOf(listener);
      this.subscribers.splice(idx, 1);
    };
  },
};

function parseAndAppend(x: string) {
  traffic.appendData(JSON.parse(x));
}

export function fetchData(apiConfig: ClashAPIConfig) {
  // TODO if apiConfig changed, should we reset?
  if (ws && ws.readyState <= WebSocket.OPEN) return traffic;

  const url = buildWebSocketURL(apiConfig, endpoint);
  ws = new WebSocket(url);

  const onFrozen = () => {
    if (ws.readyState <= WebSocket.OPEN) ws.close();
  };

  const onResume = () => {
    if (ws.readyState <= WebSocket.OPEN) return;
    document.removeEventListener('freeze', onFrozen);
    document.removeEventListener('resume', onResume);

    traffic.up.fill(0);
    traffic.down.fill(undefined);
    traffic.labels.fill(undefined);
    fetchData(apiConfig);
  };

  document.addEventListener('freeze', onFrozen, { capture: true, once: true });
  document.addEventListener('resume', onResume, { capture: true, once: true });

  ws.addEventListener('error', function (_ev) {
    console.log('error', _ev);
    //
  });
  // ws.addEventListener('close', (_ev) => {});
  ws.addEventListener('message', function (event) {
    parseAndAppend(event.data);
  });
  return traffic;
}
