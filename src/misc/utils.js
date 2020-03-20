export function throttle(fn, timeout) {
  let pending = false;

  return (...args) => {
    if (!pending) {
      pending = true;
      fn(...args);
      setTimeout(() => {
        pending = false;
      }, timeout);
    }
  };
}

export function debounce(fn, timeout) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
}
