import { createSelector } from 'reselect';
import { DispatchFn, GetStateFn, Log, State } from 'src/store/types';

const LogSize = 300;

const getLogs = (s: State) => s.logs.logs;
const getTail = (s: State) => s.logs.tail;
export const getSearchText = (s: State) => s.logs.searchText;
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
    return x.filter((r) => r.payload.toLowerCase().indexOf(searchText) >= 0);
  },
);

export function updateSearchText(text: string) {
  return (dispatch: DispatchFn) => {
    dispatch('logsUpdateSearchText', (s) => {
      s.logs.searchText = text.toLowerCase();
    });
  };
}

export function appendLog(log: Log) {
  return (dispatch: DispatchFn, getState: GetStateFn) => {
    const s = getState();
    const logs = getLogs(s);
    const tailCurr = getTail(s);
    const tail = tailCurr >= LogSize - 1 ? 0 : tailCurr + 1;
    // mutate intentionally for performance
    logs[tail] = log;

    dispatch('logsAppendLog', (s: State) => {
      s.logs.tail = tail;
    });
  };
}

export const initialState = {
  searchText: '',
  logs: [],
  // tail's initial value must be -1
  tail: -1,
};
