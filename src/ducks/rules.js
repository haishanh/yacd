import * as rulesAPI from '../api/rules';
import { getClashAPIConfig } from '../ducks/app';
import invariant from 'invariant';
import { createSelector } from 'reselect';

export const getAllRules = s => s.rules.allRules;
export const getSearchText = s => s.rules.searchText;
export const getRules = createSelector(
  getSearchText,
  getAllRules,
  (searchText, allRules) => {
    if (searchText === '') return allRules;
    return allRules.filter(r => r.payload.indexOf(searchText) >= 0);
  }
);

const CompletedFetchRules = 'rules/CompletedFetchRules';
const UpdateSearchText = 'rule/UpdateSearchText';

export function updateSearchText(text) {
  return {
    type: UpdateSearchText,
    payload: { searchText: text.toLowerCase() }
  };
}

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

export function fetchRulesOnce() {
  return async (dispatch, getState) => {
    const allRules = getAllRules(getState());
    if (allRules.length === 0) return await dispatch(fetchRules());
  };
}

// {"type":"FINAL","payload":"","proxy":"Proxy"}
// {"type":"IPCIDR","payload":"172.16.0.0/12","proxy":"DIRECT"}
const initialState = {
  // filteredRules: [],
  allRules: [],
  searchText: ''
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case UpdateSearchText:
    case CompletedFetchRules: {
      return { ...state, ...payload };
    }

    default:
      return state;
  }
}
