import { getURLAndInit } from 'm/request-helper';
const endpoint = '/logs';
const textDecoder = new TextDecoder('utf-8');

const getRandomStr = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16);
};

let even = false;
let fetched = false;
let decoded = '';

function appendData(s, callback) {
  let o;
  try {
    o = JSON.parse(s);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('JSON.parse error', JSON.parse(s));
  }

  const now = new Date();
  const time = now.toLocaleString('zh-Hans');
  // mutate input param in place intentionally
  o.time = time;
  o.id = now - 0 + getRandomStr();
  o.even = even = !even;
  callback(o);
}

function pump(reader, appendLog) {
  return reader.read().then(({ done, value }) => {
    const str = textDecoder.decode(value, { stream: !done });
    decoded += str;

    const splits = decoded.split('\n');

    const lastSplit = splits[splits.length - 1];

    for (let i = 0; i < splits.length - 1; i++) {
      appendData(splits[i], appendLog);
    }

    if (done) {
      appendData(lastSplit, appendLog);
      decoded = '';

      // eslint-disable-next-line no-console
      console.log('GET /logs streaming done');
      fetched = false;
      return;
    } else {
      decoded = lastSplit;
    }
    return pump(reader, appendLog);
  });
}

function fetchLogs(apiConfig, appendLog) {
  if (fetched) return;
  fetched = true;
  const { url, init } = getURLAndInit(apiConfig);
  fetch(url + endpoint, init)
    .then(response => {
      const reader = response.body.getReader();
      pump(reader, appendLog);
    })
    .catch(err => {
      fetched = false;
      // eslint-disable-next-line no-console
      console.log('GET /logs error', err);
    });
}

export { fetchLogs };
