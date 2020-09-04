import { getURLAndInit } from 'src/misc/request-helper';
import { ClashAPIConfig } from 'src/types';

const endpoint = '/configs';

export async function fetchConfigs(apiConfig: ClashAPIConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, init);
}

// TODO support PUT /configs
// req body
// { Path: string }

type ClashConfigPartial = { 'socks-port'?: unknown };
function configsPatchWorkaround(o: ClashConfigPartial) {
  // backward compatibility for older clash  using `socket-port`
  if ('socks-port' in o) {
    o['socket-port'] = o['socks-port'];
  }
  return o;
}

export async function updateConfigs(
  apiConfig: ClashAPIConfig,
  o: ClashConfigPartial
) {
  const { url, init } = getURLAndInit(apiConfig);
  const body = JSON.stringify(configsPatchWorkaround(o));
  return await fetch(url + endpoint, { ...init, body, method: 'PATCH' });
}
