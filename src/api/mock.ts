const MOCK_HANDLERS = [
  {
    key: 'GET/',
    enabled: false,
    handler: (_u: string, _i: RequestInit) => {
      // throw new Error();
      return deserializeError();
      // return json({ hello: 'clash' });
    },
  },
  {
    key: 'GET/configs',
    enabled: false,
    handler: (_u: string, _i: RequestInit) =>
      json({
        port: 0,
        'socks-port': 7891,
        'redir-port': 0,
        'tproxy-port': 0,
        'mixed-port': 7890,
        'allow-lan': true,
        'bind-address': '*',
        mode: 'rule',
        'log-level': 'info',
        authentication: [],
        ipv6: false,
      }),
  },
];

export async function mock(url: string, init: RequestInit) {
  const method = init.method || 'GET';
  const pathname = new URL(url).pathname;
  const key = `${method}${pathname}`;
  const item = MOCK_HANDLERS.find((h) => {
    if (h.enabled && h.key === key) return h;
  });
  if (item) {
    console.warn('Using mocked API', key);
    return (await item?.handler(url, init)) as Response;
  }
  return fetch(url, init);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function json<T = any>(data: T) {
  await sleep(1);
  return {
    ok: true,
    json: async () => {
      await sleep(16);
      return data;
    },
  };
}

async function deserializeError() {
  await sleep(1);
  return {
    ok: true,
    json: async () => {
      await sleep(16);
      throw new Error();
    },
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
