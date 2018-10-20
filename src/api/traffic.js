'use strict';

const { getAPIURL } = require('../config');
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

function pump(reader) {
  return reader.read().then(({ done, value }) => {
    if (done) {
      console.log('done');
      return;
    }
    const t = textDecoder.decode(value);
    // console.log('response', t);
    const o = JSON.parse(t);

    traffic.appendData(o);

    return pump(reader);
  });
}

let fetched = false;
function fetchData() {
  if (fetched) return traffic;
  const apiURL = getAPIURL();
  fetch(apiURL.traffic).then(response => {
    fetched = true;
    const reader = response.body.getReader();
    pump(reader);
  });
  return traffic;
}

export { fetchData };
