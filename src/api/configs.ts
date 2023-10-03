import { getURLAndInit } from 'src/misc/request-helper';
import { ClashGeneralConfig } from 'src/store/types';
import { ClashAPIConfig } from 'src/types';

const endpoint = '/configs';

export async function fetchConfigs2(ctx: { queryKey: readonly [string, ClashAPIConfig] }) {
  const endpoint = ctx.queryKey[0];
  const apiConfig = ctx.queryKey[1];
  const { url, init } = getURLAndInit(apiConfig);
  const res = await fetch(url + endpoint, init);
  if (!res.ok) {
    throw new Error('TODO');
  }
  return await res.json();
}

export function updateConfigs(apiConfig: ClashAPIConfig) {
  return async (o: Partial<ClashGeneralConfig>) => {
    const { url, init } = getURLAndInit(apiConfig);
    const body = JSON.stringify(configsPatchWorkaround(o));
    return await fetch(url + endpoint, { ...init, body, method: 'PATCH' });
  };
}

export async function fetchConfigs(apiConfig: ClashAPIConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, init);
}

// TODO support PUT /configs
// req body
// { Path: string }

type ClashConfigPartial = Partial<ClashGeneralConfig>;
function configsPatchWorkaround(o: ClashConfigPartial) {
  // backward compatibility for older clash  using `socket-port`
  if ('socks-port' in o) {
    o['socket-port'] = o['socks-port'];
  }
  return o;
}
