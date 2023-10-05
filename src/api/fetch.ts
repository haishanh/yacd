import isNetworkError from 'is-network-error';

import {
  YacdBackendGeneralError,
  YacdBackendUnauthorizedError,
  YacdFetchNetworkError,
} from '$src/misc/errors';
import { getURLAndInit } from '$src/misc/request-helper';
import { ClashAPIConfig, FetchCtx } from '$src/types';

export type QueryCtx = {
  queryKey: readonly [string, ClashAPIConfig];
};

export function req(url: string, init: RequestInit) {
  if (import.meta.env.DEV) {
    return import('./mock').then((mod) => mod.mock(url, init));
  }
  return fetch(url, init);
}

export async function query(ctx: QueryCtx) {
  const endpoint = ctx.queryKey[0];
  const apiConfig = ctx.queryKey[1];
  const { url, init } = getURLAndInit(apiConfig);

  let res: Response;
  try {
    res = await req(url + endpoint, init);
  } catch (err) {
    handleFetchError(err, { endpoint, apiConfig });
  }
  await validateFetchResponse(res, { endpoint, apiConfig });
  if (res.ok) {
    return await res.json();
  }
  // can return undefined
}

export function handleFetchError(err: unknown, ctx: FetchCtx) {
  if (isNetworkError(err)) throw new YacdFetchNetworkError('', ctx);
  throw err;
}

async function validateFetchResponse(res: Response, ctx: FetchCtx) {
  if (res.status === 401) throw new YacdBackendUnauthorizedError('', ctx);
  if (!res.ok)
    throw new YacdBackendGeneralError('', {
      ...ctx,
      response: await simplifyRes(res),
    });
  return res;
}

export type SimplifiedResponse = {
  status: number;
  headers: string[];
  data?: any;
};

async function simplifyRes(res: Response): Promise<SimplifiedResponse> {
  const headers: string[] = [];
  for (const [k, v] of res.headers) {
    headers.push(`${k}: ${v}`);
  }

  let data: any;
  try {
    data = await res.text();
  } catch (e) {
    // ignore
  }

  return {
    status: res.status,
    headers,
    data,
  };
}
