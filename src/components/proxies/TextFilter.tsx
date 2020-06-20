import * as React from 'react';
import { useRecoilState } from 'recoil';

import { proxyFilterText } from '../../store/proxies';
import shared from '../shared.module.css';

const { useCallback } = React;

export function TextFilter() {
  const [text, setText] = useRecoilState(proxyFilterText);
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    [setText]
  );

  return (
    <input
      className={shared.input}
      spellCheck={false}
      type="text"
      value={text}
      onChange={onChange}
    />
  );
}
