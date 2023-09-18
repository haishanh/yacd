import * as React from 'react';
import { useTextInput } from 'src/hooks/useTextInput';

import { TextAtom } from '$src/store/rules';

import s from './TextFilter.module.scss';

export function TextFilter(props: { textAtom: TextAtom; placeholder?: string }) {
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
