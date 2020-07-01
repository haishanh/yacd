import * as React from 'react';
import { useTextInut } from 'src/hooks/useTextInput';
import { ruleFilterText } from 'src/store/rules';

import shared from '../shared.module.css';

export function TextFilter() {
  const [onChange, text] = useTextInut(ruleFilterText);
  return (
    <input
      className={shared.input}
      type="text"
      value={text}
      onChange={onChange}
      placeholder="Filter"
    />
  );
}
