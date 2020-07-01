import invariant from 'invariant';
import { getURLAndInit } from 'src/misc/request-helper';
import { ClashAPIConfig } from 'src/types';

// const endpoint = '/rules';

type RuleItem = RuleAPIItem & { id: number };

type RuleAPIItem = {
  type: string;
  payload: string;
  proxy: string;
};

function normalizeAPIResponse(json: {
  rules: Array<RuleAPIItem>;
}): Array<RuleItem> {
  invariant(
    json.rules && json.rules.length >= 0,
    'there is no valid rules list in the rules API response'
  );

  // attach an id
  return json.rules.map((r: RuleAPIItem, i: number) => ({ ...r, id: i }));
}

export async function fetchRules(endpoint: string, apiConfig: ClashAPIConfig) {
  let json = { rules: [] };
  try {
    const { url, init } = getURLAndInit(apiConfig);
    const res = await fetch(url + endpoint, init);
    if (res.ok) {
      json = await res.json();
    }
  } catch (err) {
    // log and ignore
    // eslint-disable-next-line no-console
    console.log('failed to fetch rules', err);
  }
  return normalizeAPIResponse(json);
}
