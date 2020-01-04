import React, { useState, useMemo, useCallback } from 'react';
import Icon from './Icon';

import search from '../svg/search.svg';

import debounce from 'lodash-es/debounce';

import s0 from './Search.module.css';

function RuleSearch({ dispatch, searchText, updateSearchText }) {
  const [text, setText] = useState(searchText);
  const updateSearchTextInternal = useCallback(
    v => {
      dispatch(updateSearchText(v));
    },
    [dispatch, updateSearchText]
  );
  const updateSearchTextDebounced = useMemo(
    () => debounce(updateSearchTextInternal, 300),
    [updateSearchTextInternal]
  );
  const onChange = e => {
    setText(e.target.value);
    updateSearchTextDebounced(e.target.value);
  };

  return (
    <div className={s0.RuleSearch}>
      <div className={s0.RuleSearchContainer}>
        <div className={s0.inputWrapper}>
          <input
            type="text"
            value={text}
            onChange={onChange}
            className={s0.input}
          />
        </div>
        <div className={s0.iconWrapper}>
          <Icon id={search.id} />
        </div>
      </div>
    </div>
  );
}

export default RuleSearch;
