import { ClashAPIConfig } from 'src/types';

import { buildWebSocketURL, getURLAndInit } from '../misc/request-helper';

const endpoint = '/connections';

const subscribers = [];

let ws: WebSocket;

// see also https://github.com/Dreamacro/clash/blob/dev/constant/metadata.go#L41
type UUID = string;
type ConnNetwork = 'tcp' | 'udp';
type ConnType = 'HTTP' | 'HTTP Connect' | 'Socks5' | 'Redir' | 'Unknown';
export type ConnectionItem = {
  id: UUID;
  metadata: {
    network: ConnNetwork;
    type: ConnType;
    sourceIP: string;
    destinationIP: string;
    sourcePort: string;
    destinationPort: string;
    host: string;
    processPath: string;
  };
  upload: number;
  download: number;
  // e.g. "2019-11-30T22:48:13.416668+08:00",
  start: string;
  chains: string[];
  // e.g. 'Match', 'DomainKeyword'
  rule: string;
  rulePayload?: string;
};
type ConnectionsData = {
  downloadTotal: number;
  uploadTotal: number;
  connections: Array<ConnectionItem>;
};

function appendData(s: string) {
  let o: ConnectionsData;
  try {
    o = JSON.parse(s);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('JSON.parse error', JSON.parse(s));
  }
  subscribers.forEach((f) => f(o));
}

type UnsubscribeFn = () => void;

export function fetchData(apiConfig: ClashAPIConfig, listener?: unknown): UnsubscribeFn | void {
  if (ws && ws.readyState <= WebSocket.OPEN) {
    if (listener) return subscribe(listener);
    return;
  }

  const url = buildWebSocketURL(apiConfig, endpoint);
  ws = new WebSocket(url);

  const onFrozen = () => {
    if (ws.readyState <= WebSocket.OPEN) ws.close();
  };
  const onResume = () => {
    if (ws.readyState <= WebSocket.OPEN) return;
    document.removeEventListener('freeze', onFrozen);
    document.removeEventListener('resume', onResume);
    fetchData(apiConfig);
  };

  document.addEventListener('freeze', onFrozen, { capture: true, once: true });
  document.addEventListener('resume', onResume, { capture: true, once: true });

  ws.addEventListener('message', (event) => appendData(event.data));
  if (listener) return subscribe(listener);
}

function subscribe(listener: unknown): UnsubscribeFn {
  const x = subscribers.indexOf(listener);
  if (x < 0) subscribers.push(listener);
  return function unsubscribe() {
    const idx = subscribers.indexOf(listener);
    subscribers.splice(idx, 1);
  };
}

export async function closeAllConnections(apiConfig: ClashAPIConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, { ...init, method: 'DELETE' });
}

export async function fetchConns(apiConfig: ClashAPIConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, { ...init });
}

export async function closeConnById(apiConfig: ClashAPIConfig, id: string) {
  const { url: baseURL, init } = getURLAndInit(apiConfig);
  const url = `${baseURL}${endpoint}/${id}`;
  return await fetch(url, { ...init, method: 'DELETE' });
}
