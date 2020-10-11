// from https://gist.github.com/ryanflorence/e10cc9dbc0e259759ec942ba82e5b57c
export function createResource(getPromise: (key: string) => Promise<any>) {
  let cache = {};
  const inflight = {};
  const errors = {};

  function load(key = 'default') {
    inflight[key] = getPromise(key)
      .then((val) => {
        delete inflight[key];
        cache[key] = val;
      })
      .catch((error) => {
        errors[key] = error;
      });
    return inflight[key];
  }

  function preload(key = 'default') {
    if (cache[key] !== undefined || inflight[key]) return;
    load(key);
  }

  function read(key = 'default') {
    if (cache[key] !== undefined) {
      return cache[key];
    } else if (errors[key]) {
      throw errors[key];
    } else if (inflight[key]) {
      throw inflight[key];
    } else {
      throw load(key);
    }
  }

  function clear(key: 'default') {
    if (key) {
      delete cache[key];
    } else {
      cache = {};
    }
  }

  return { preload, read, clear };
}
