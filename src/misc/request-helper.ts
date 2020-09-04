import { trimTrailingSlash } from 'src/misc/utils';
import { ClashAPIConfig } from 'src/types';

const headersCommon = { 'Content-Type': 'application/json' };

function genCommonHeaders({ secret }: { secret?: string }) {
  const h = { ...headersCommon };
  if (secret) {
    h['Authorization'] = `Bearer ${secret}`;
  }
  return h;
}

export function getURLAndInit({ baseURL, secret }: ClashAPIConfig) {
  const headers = genCommonHeaders({ secret });
  return {
    url: baseURL,
    init: { headers },
  };
}

export function buildWebSocketURL(apiConfig: ClashAPIConfig, endpoint: string) {
  const { baseURL, secret } = apiConfig;
  let qs = '';
  if (typeof secret === 'string' && secret !== '') {
    qs += '?token=' + encodeURIComponent(secret);
  }
  const url = new URL(baseURL);
  url.protocol === 'https:' ? (url.protocol = 'wss:') : (url.protocol = 'ws:');
  return `${trimTrailingSlash(url.href)}${endpoint}${qs}`;
}
