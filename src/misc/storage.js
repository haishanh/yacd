// manage localStorage

function loadState(key) {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    return undefined;
  }
}

function saveState(key, state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch (err) {
    // ignore
  }
}

function clearState(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    // ignore
  }
}

export { loadState, saveState, clearState };
