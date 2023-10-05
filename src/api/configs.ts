import { getURLAndInit } from 'src/misc/request-helper';
import { ClashGeneralConfig } from 'src/store/types';
import { ClashAPIConfig } from 'src/types';

import { handleFetchError, query, QueryCtx, req } from './fetch';

const endpoint = '/configs';

export async function fetchConfigs2(ctx: QueryCtx) {
  const json = await query(ctx);
  if (!json) {
    throw new Error('TODO');
  }
  return json;
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
  try {
    return await req(url + endpoint, init);
  } catch (err) {
    handleFetchError(err, { endpoint, apiConfig });
  }
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
