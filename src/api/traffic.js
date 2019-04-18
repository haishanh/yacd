import { getURLAndInit } from 'm/request-helper';
const endpoint = '/traffic';
const textDecoder = new TextDecoder('utf-8');

const Size = 150;

const traffic = {
  labels: Array(Size),
  // labels: [],
  up: Array(Size),
  down: Array(Size),

  size: Size,
  subscribers: [],
  appendData(o) {
    this.up.push(o.up);
    this.down.push(o.down);
    const t = new Date();
    const l = '' + t.getMinutes() + t.getSeconds();
    this.labels.push(l);
    if (this.up.length > this.size) this.up.shift();
    if (this.down.length > this.size) this.down.shift();
    if (this.labels.length > this.size) this.labels.shift();

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

let fetched = false;
let decoded = '';

function parseAndAppend(x) {
  traffic.appendData(JSON.parse(x));
}

function pump(reader) {
  return reader.read().then(({ done, value }) => {
    const str = textDecoder.decode(value, { stream: !done });
    decoded += str;

    const splits = decoded.split('\n');

    const lastSplit = splits[splits.length - 1];

    for (let i = 0; i < splits.length - 1; i++) {
      parseAndAppend(splits[i]);
    }

    if (done) {
      parseAndAppend(lastSplit);
      decoded = '';

      // eslint-disable-next-line no-console
      console.log('GET /traffic streaming done');
      fetched = false;
      return;
    } else {
      decoded = lastSplit;
    }
    return pump(reader);
  });
}

function fetchData(apiConfig) {
  if (fetched) return traffic;
  const { url, init } = getURLAndInit(apiConfig);
  fetch(url + endpoint, init).then(response => {
    if (response.ok) {
      fetched = true;
      const reader = response.body.getReader();
      pump(reader);
    }
  });
  return traffic;
}

export { fetchData };
