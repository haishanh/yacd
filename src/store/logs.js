import { createSelector } from 'reselect';

const LogSize = 300;

const getLogs = s => s.logs.logs;
const getTail = s => s.logs.tail;
export const getSearchText = s => s.logs.searchText;
export const getLogsForDisplay = createSelector(
  getLogs,
  getTail,
  getSearchText,
  (logs, tail, searchText) => {
    const x = [];
    for (let i = tail; i >= 0; i--) {
      x.push(logs[i]);
    }
    if (logs.length === LogSize) {
      for (let i = LogSize - 1; i > tail; i--) {
        x.push(logs[i]);
      }
    }

    if (searchText === '') return x;
    return x.filter(r => r.payload.toLowerCase().indexOf(searchText) >= 0);
  }
);

export function updateSearchText(text) {
  return dispatch => {
    dispatch('logsUpdateSearchText', s => {
      s.logs.searchText = text.toLowerCase();
    });
  };
}

export function appendLog(log) {
  return (dispatch, getState) => {
    const s = getState();
    const logs = getLogs(s);
    const tailCurr = getTail(s);
    const tail = tailCurr >= LogSize - 1 ? 0 : tailCurr + 1;
    // mutate intentionally for performance
    logs[tail] = log;

    dispatch('logsAppendLog', s => {
      s.logs.tail = tail;
    });
  };
}

export const initialState = {
  searchText: '',
  logs: [],
  // tail's initial value must be -1
  tail: -1
};
