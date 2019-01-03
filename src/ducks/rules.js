import * as rulesAPI from 'a/rules';
import { getClashAPIConfig } from 'd/app';
import invariant from 'invariant';
// import { createSelector } from 'reselect';

export const getRules = s => s.rules.allRules;

const CompletedFetchRules = 'rules/CompletedFetchRules';

export function fetchRules() {
  return async (dispatch, getState) => {
    const apiSetup = getClashAPIConfig(getState());
    const res = await rulesAPI.fetchRules(apiSetup);
    const json = await res.json();
    invariant(
      json.rules && json.rules.length >= 0,
      'there is no valid rules list in the rules API response'
    );

    // attach an id
    const allRules = json.rules.map((r, i) => {
      r.id = i;
      return r;
    });

    dispatch({
      type: CompletedFetchRules,
      payload: { allRules }
    });
  };
}

// {"type":"FINAL","payload":"","proxy":"Proxy"}
// {"type":"IPCIDR","payload":"172.16.0.0/12","proxy":"DIRECT"}
const initialState = {
  // filteredRules: [],
  allRules: []
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case CompletedFetchRules: {
      return { ...state, ...payload };
    }

    default:
      return state;
  }
}
