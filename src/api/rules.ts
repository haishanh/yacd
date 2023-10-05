import invariant from 'invariant';
import { ClashAPIConfig } from 'src/types';

import { query } from './fetch';

type RuleItem = RuleAPIItem & { id: number };

type RuleAPIItem = {
  type: string;
  payload: string;
  proxy: string;
};

function normalizeAPIResponse(json: { rules: Array<RuleAPIItem> }): Array<RuleItem> {
  invariant(
    json.rules && json.rules.length >= 0,
    'there is no valid rules list in the rules API response',
  );

  // attach an id
  return json.rules.map((r: RuleAPIItem, i: number) => ({ ...r, id: i }));
}

export async function fetchRules(ctx: { queryKey: readonly [string, ClashAPIConfig] }) {
  const json = (await query(ctx)) || { rules: [] };
  return normalizeAPIResponse(json);
}
