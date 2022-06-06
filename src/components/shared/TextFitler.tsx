import * as React from 'react';
import type { RecoilState } from 'recoil';
import { useTextInut } from 'src/hooks/useTextInput';

import s from './TextFitler.module.scss';

export function TextFilter(props: { textAtom: RecoilState<string>; placeholder?: string }) {
  const [onChange, text] = useTextInut(props.textAtom);
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
