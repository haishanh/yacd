import { getURLAndInit } from '../misc/request-helper';

const endpoint = '/connections';

const fetched = false;
const subscribers = [];

// see also https://github.com/Dreamacro/clash/blob/dev/constant/metadata.go#L41
type UUID = string;
type ConnectionItem = {
  id: UUID,
  metadata: {
    network: 'tcp' | 'udp',
    type: 'HTTP' | 'HTTP Connect' | 'Socks5' | 'Redir' | 'Unknown',
    sourceIP: string,
    destinationIP: string,
    sourcePort: string,
    destinationPort: string,
    host: string,
  },
  upload: number,
  download: number,
  // e.g. "2019-11-30T22:48:13.416668+08:00",
  start: string,
  chains: Array<string>,
  // e.g. 'Match', 'DomainKeyword'
  rule: string,
};
type ConnectionsData = {
  downloadTotal: number,
  uploadTotal: number,
  connections: Array<ConnectionItem>,
};

function appendData(s) {
  let o: ConnectionsData;
  try {
    o = JSON.parse(s);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('JSON.parse error', JSON.parse(s));
  }
  subscribers.forEach((f) => f(o));
}

function getWsUrl(apiConfig) {
  const { hostname, port, secret } = apiConfig;
  let qs = '';
  if (typeof secret === 'string' && secret !== '') {
    qs += '?token=' + encodeURIComponent(secret);
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
  ws.addEventListener('error', function (_ev) {
    wsState = 3;
  });
  ws.addEventListener('message', function (event) {
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

async function closeAllConnections(apiConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, { ...init, method: 'DELETE' });
}

export async function fetchConns(apiConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, { ...init });
}

export async function closeConnById(apiConfig, id) {
  const { url: baseURL, init } = getURLAndInit(apiConfig);
  const url = `${baseURL}${endpoint}/${id}`;
  return await fetch(url, { ...init, method: 'DELETE' });
}

export { fetchData, closeAllConnections };
