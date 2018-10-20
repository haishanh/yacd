'use strict';

const { getAPIURL } = require('../config');
const textDecoder = new TextDecoder('utf-8');

const Size = 300;

const store = {
  logs: [],
  size: Size,
  updateCallback: null,
  appendData(o) {
    const now = new Date();
    const time = now.toLocaleString('zh-Hans');
    // mutate input param in place intentionally
    o.time = time;
    o.id = now - 0;
    this.logs.unshift(o);
    if (this.logs.length > this.size) this.logs.pop();
    // TODO consider throttle this
    if (this.updateCallback) this.updateCallback();
  }
};

function pump(reader) {
  return reader.read().then(({ done, value }) => {
    if (done) {
      console.log('done');
      return;
    }
    const t = textDecoder.decode(value);
    // console.log(t);
    const l = t[t.length - 1];
    let o;
    try {
      o = JSON.parse(t);
    } catch (err) {
      console.log(
        'lastchar',
        t.length,
        ' is r',
        l === '\r',
        ' is n',
        l === '\n'
      );
    }
    store.appendData(o);
    return pump(reader);
  });
}

let fetched = false;
function fetchLogs() {
  if (fetched) return store;
  const apiURL = getAPIURL();
  fetch(apiURL.logs).then(response => {
    fetched = true;
    const reader = response.body.getReader();
    pump(reader);
  });
  return store;
}

export { fetchLogs };
