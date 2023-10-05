import { getURLAndInit } from 'src/misc/request-helper';
import { ClashAPIConfig } from 'src/types';

import { query, QueryCtx } from './fetch';

export type RuleProvider = RuleProviderAPIItem & { idx: number };

export type RuleProviderAPIItem = {
  behavior: string;
  name: string;
  ruleCount: number;
  type: 'Rule';
  // example value "2020-06-30T16:23:01.44143802+08:00"
  updatedAt: string;
  vehicleType: 'HTTP' | 'File';
};

type RuleProviderAPIData = {
  providers: Record<string, RuleProviderAPIItem>;
};

function normalizeAPIResponse(data: RuleProviderAPIData) {
  const providers = data.providers;
  const names = Object.keys(providers);
  const byName: Record<string, RuleProvider> = {};

  // attach an idx to each item
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    byName[name] = { ...providers[name], idx: i };
  }

  return { byName, names };
}

export async function fetchRuleProviders(ctx: QueryCtx) {
  const data = (await query(ctx)) || { providers: {} };
  return normalizeAPIResponse(data);
}

export async function refreshRuleProviderByName({
  name,
  apiConfig,
}: {
  name: string;
  apiConfig: ClashAPIConfig;
}) {
  const { url, init } = getURLAndInit(apiConfig);
  try {
    const res = await fetch(url + `/providers/rules/${name}`, {
      method: 'PUT',
      ...init,
    });
    return res.ok;
  } catch (err) {
    // log and ignore
    // eslint-disable-next-line no-console
    console.log('failed to PUT /providers/rules/:name', err);
    return false;
  }
}

export async function updateRuleProviders({
  names,
  apiConfig,
}: {
  names: string[];
  apiConfig: ClashAPIConfig;
}) {
  for (let i = 0; i < names.length; i++) {
    // run in sequence
    await refreshRuleProviderByName({ name: names[i], apiConfig });
  }
}
