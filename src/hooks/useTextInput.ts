import { PrimitiveAtom, useAtom } from 'jotai';
import debounce from 'lodash-es/debounce';
import * as React from 'react';

const { useCallback, useState, useMemo } = React;

export function useTextInput(
  x: PrimitiveAtom<string>,
): [(e: React.ChangeEvent<HTMLInputElement>) => void, string] {
  const [, setTextGlobal] = useAtom(x);
  const [text, setText] = useState('');
  const setTextDebounced = useMemo(() => debounce(setTextGlobal, 300), [setTextGlobal]);
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
      setTextDebounced(e.target.value);
    },
    [setTextDebounced],
  );
  return [onChange, text];
}
