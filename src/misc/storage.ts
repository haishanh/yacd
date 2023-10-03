// manage localStorage

import { StateApp } from '$src/store/types';

const StorageKey = 'yacd.haishan.me';

export function loadState() {
  try {
    const serialized = localStorage.getItem(StorageKey);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    return undefined;
  }
}

export function saveState(state: StateApp) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(StorageKey, serialized);
  } catch (err) {
    // ignore
  }
}

export function clearState() {
  try {
    localStorage.removeItem(StorageKey);
  } catch (err) {
    // ignore
  }
}
