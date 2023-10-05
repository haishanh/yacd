export function throttle<T extends any[]>(fn: (...args: T) => unknown, timeout: number) {
  let pending = false;

  return (...args: T) => {
    if (!pending) {
      pending = true;
      fn(...args);
      setTimeout(() => {
        pending = false;
      }, timeout);
    }
  };
}

export function debounce<T extends any[]>(fn: (...args: T) => unknown, timeout: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
}

export function trimTrailingSlash(s: string) {
  return s.replace(/\/$/, '');
}

export function pad0(number: number | string, len: number): string {
  let output = String(number);
  while (output.length < len) {
    output = '0' + output;
  }
  return output;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
