export function req(url: string, init: RequestInit) {
  if (import.meta.env.DEV) {
    return import('./mock').then((mod) => mod.mock(url, init));
  }
  return fetch(url, init);
}
