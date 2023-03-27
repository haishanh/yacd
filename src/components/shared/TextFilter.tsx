import * as React from 'react';
import type { RecoilState } from 'recoil';
import { useTextInput } from 'src/hooks/useTextInput';

import s from './TextFilter.module.scss';

export function TextFilter(props: { textAtom: RecoilState<string>; placeholder?: string }) {
  const [onChange, text] = useTextInput(props.textAtom);
  return (
    <input
      className={s.input}
      type="text"
      value={text}
      onChange={onChange}
      placeholder={props.placeholder}
    />
  );
}
