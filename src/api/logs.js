import { getURLAndInit } from 'm/request-helper';
const endpoint = '/logs';
const textDecoder = new TextDecoder('utf-8', { stream: true });

const getRandomStr = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16);
};

let even = false;
let fetched = false;

function appendData(o, callback) {
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
    if (done) {
      // eslint-disable-next-line no-console
      console.log('GET /logs streaming done');
      return;
    }
    const t = textDecoder.decode(value);
    const arrRawJSON = t.trim().split('\n');
    arrRawJSON.forEach(s => {
      try {
        appendData(JSON.parse(s), appendLog);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('JSON.parse error', JSON.parse(s));
      }
    });
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
