import debounce from 'lodash-es/debounce';
import * as React from 'react';
import { useRecoilState } from 'recoil';

import { proxyFilterText } from '../../store/proxies';
import shared from '../shared.module.css';

const { useCallback, useState, useMemo } = React;

export function TextFilter() {
  const [, setTextGlobal] = useRecoilState(proxyFilterText);
  const [text, setText] = useState('');

  const setTextDebounced = useMemo(() => debounce(setTextGlobal, 300), [
    setTextGlobal,
  ]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
      setTextDebounced(e.target.value);
    },
    [setTextDebounced]
  );

  return (
    <input
      className={shared.input}
      type="text"
      value={text}
      onChange={onChange}
    />
  );
}
