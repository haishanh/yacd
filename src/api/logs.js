import { getURLAndInit } from 'm/request-helper';
const endpoint = '/logs';
const textDecoder = new TextDecoder('utf-8', { stream: true });

const getRandomStr = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16);
};

const Size = 300;

let even = false;
const store = {
  logs: [],
  size: Size,
  fetched: false,
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
      // eslint-disable-next-line no-console
      console.log('GET /logs streaming done');
      return;
    }
    const t = textDecoder.decode(value);
    const arrRawJSON = t.trim().split('\n');
    arrRawJSON.forEach(s => {
      try {
        store.appendData(JSON.parse(s));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('JSON.parse error', JSON.parse(s));
      }
    });
    return pump(reader);
  });
}

function fetchLogs(apiConfig) {
  if (store.fetched) return store;
  store.fetched = true;
  const { url, init } = getURLAndInit(apiConfig);
  fetch(url + endpoint, init)
    .then(response => {
      const reader = response.body.getReader();
      pump(reader);
    })
    .catch(err => {
      store.fetched = false;
      // eslint-disable-next-line no-console
      console.log('GET /logs error', err);
    });
  return store;
}

export { fetchLogs };
