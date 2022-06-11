import * as React from 'react';

const { useState, useCallback } = React;

export function useToggle(initialValue = false): [boolean, () => void] {
  const [isOn, setState] = useState(initialValue);
  const toggle = useCallback(() => setState((x) => !x), []);
  return [isOn, toggle];
}

export function useState2<T>(v: T) {
  const [value, set] = useState(v);
  return { value, set };
}
