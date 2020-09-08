const headersCommon = {
  'Content-Type': 'application/json'
};

export function genCommonHeaders({ secret }) {
  const h = { ...headersCommon };
  if (secret) {
    h['Authorization'] = `Bearer ${secret}`;
  }
  return h;
}

export function getAPIBaseURL({ hostname, port }) {
  return `//${hostname}:${port}`;
}

export function getURLAndInit({ hostname, port, secret }) {
  const baseURL = getAPIBaseURL({ hostname, port });
  const headers = genCommonHeaders({ secret });
  return {
    url: baseURL,
    init: { headers }
  };
}

export function getWsUrl(apiConfig) {
  const { hostname, port, secret } = apiConfig;
  let qs = '';
  if (typeof secret === 'string' && secret !== '') {
    qs += '?token=' + encodeURIComponent(secret);
  }
  return `ws${/s:$/.test(location.protocol)?'s':''}://${hostname}:${port}${endpoint}${qs}`;
}