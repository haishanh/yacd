import * as rulesAPI from '../api/rules';
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
export function updateSearchText(text) {
  return dispatch => {
    dispatch('rulesUpdateSearchText', s => {
      s.rules.searchText = text.toLowerCase();
    });
  };
}

export function fetchRules(apiConfig) {
  return async dispatch => {
    const res = await rulesAPI.fetchRules(apiConfig);
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

    dispatch('rulesFetchRules', s => {
      s.rules.allRules = allRules;
    });
  };
}

export function fetchRulesOnce(apiConfig) {
  return async (dispatch, getState) => {
    const allRules = getAllRules(getState());
    if (allRules.length === 0) return await dispatch(fetchRules(apiConfig));
  };
}

// {"type":"FINAL","payload":"","proxy":"Proxy"}
// {"type":"IPCIDR","payload":"172.16.0.0/12","proxy":"DIRECT"}
export const initialState = {
  // filteredRules: [],
  allRules: [],
  searchText: ''
};
