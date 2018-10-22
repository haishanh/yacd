import { store } from '../store/configureStore';
import { getClashAPIConfig } from 'd/app';

const headersCommon = {
  'Content-Type': 'application/json'
};

export function getAPIConfig() {
  // this is cheating...
  return getClashAPIConfig(store.getState());
}

export function genCommonHeaders({ secret }) {
  const h = { ...headersCommon };
  if (secret) {
    h['Authorization'] = `Bearer ${secret}`;
  }
  return h;
}

export function getAPIBaseURL({ hostname, port }) {
  return `http://${hostname}:${port}`;
}
