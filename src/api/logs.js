import {
  getAPIConfig,
  genCommonHeaders,
  getAPIBaseURL
} from 'm/request-helper';
const endpoint = '/logs';
const textDecoder = new TextDecoder('utf-8', { stream: true });

const getRandomStr = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16);
};

function getURLAndInit() {
  const c = getAPIConfig();
  const baseURL = getAPIBaseURL(c);
  const headers = genCommonHeaders(c);
  return {
    url: baseURL + endpoint,
    init: { headers }
  };
}

const Size = 300;

let even = false;
const store = {
  logs: [],
  size: Size,
  subscribers: [],
  appendData(o) {
    const now = new Date();
    const time = now.toLocaleString('zh-Hans');
    // mutate input param in place intentionally
    o.time = time;
    o.id = now - 0 + getRandomStr();
    o.even = even = !even;
    this.logs.unshift(o);
    if (this.logs.length > this.size) this.logs.pop();
    this.subscribers.forEach(f => f(o));
  },

  subscribe(listener) {
    const me = this;
    this.subscribers.push(listener);
    return function unsubscribe() {
      const idx = me.subscribers.indexOf(listener);
      me.subscribers.splice(idx, 1);
    };
  }
};

function pump(reader) {
  return reader.read().then(({ done, value }) => {
    if (done) {
      console.log('done');
      return;
    }
    const t = textDecoder.decode(value);
    const arrRawJSON = t.trim().split('\n');
    arrRawJSON.forEach(s => {
      try {
        store.appendData(JSON.parse(s));
      } catch (err) {
        console.log('JSON.parse error', JSON.parse(s));
      }
    });
    return pump(reader);
  });
}

let fetched = false;
function fetchLogs() {
  if (fetched) return store;
  const { url, init } = getURLAndInit();
  fetch(url, init).then(response => {
    fetched = true;
    const reader = response.body.getReader();
    pump(reader);
  });
  return store;
}

export { fetchLogs };
