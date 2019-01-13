import React, { memo, useState, useMemo } from 'react';
import Icon from 'c/Icon';

import search from 's/search.svg';
import { useActions, useStoreState } from 'm/store';

import debounce from 'lodash-es/debounce';

import s0 from './Search.module.scss';

function getSerachComponent({ mapStateToProps, actions }) {
  return memo(function RuleSearch() {
    const { updateSearchText } = useActions(actions);
    const updateSearchTextDebounced = useMemo(
      () => debounce(updateSearchText, 300),
      [updateSearchText]
    );
    const { searchText } = useStoreState(mapStateToProps);
    const [text, setText] = useState(searchText);
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
  });
}

export default getSerachComponent;
