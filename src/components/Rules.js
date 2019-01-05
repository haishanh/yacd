import React, {
  memo,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback
} from 'react';
import { useActions, useStoreState } from 'm/store';
import Button from 'c/Button';
import { FixedSizeList as List, areEqual } from 'react-window';

import ContentHeader from 'c/ContentHeader';
import Rule from 'c/Rule';
import RuleSearch from 'c/RuleSearch';

import { getRules, fetchRules, fetchRulesOnce } from 'd/rules';

import s0 from './Rules.module.scss';
const paddingBottom = 30;

const mapStateToProps = s => ({
  rules: getRules(s)
});

const actions = {
  fetchRules,
  fetchRulesOnce
};

function itemKey(index, data) {
  const item = data[index];
  return item.id;
}

const Row = memo(({ index, style, data }) => {
  const r = data[index];
  return (
    <div style={style}>
      <Rule {...r} />
    </div>
  );
}, areEqual);

export default function Rules() {
  const { fetchRulesOnce, fetchRules } = useActions(actions);
  const { rules } = useStoreState(mapStateToProps);
  const refRulesContainer = useRef(null);
  const [containerHeight, setContainerHeight] = useState(200);
  function _updateContainerHeight() {
    const { top } = refRulesContainer.current.getBoundingClientRect();
    setContainerHeight(window.innerHeight - top - paddingBottom);
  }
  const updateContainerHeight = useCallback(_updateContainerHeight, []);

  useEffect(() => {
    fetchRulesOnce();
  }, []);
  useLayoutEffect(() => {
    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, []);

  return (
    <div>
      <ContentHeader title="Rules" />
      <RuleSearch />
      <div ref={refRulesContainer} style={{ paddingBottom }}>
        <List
          height={containerHeight}
          width="100%"
          itemCount={rules.length}
          itemSize={80}
          itemData={rules}
          itemKey={itemKey}
        >
          {Row}
        </List>
      </div>
      <div className={s0.fabgrp}>
        <Button label="Refresh" onClick={fetchRules} />
      </div>
    </div>
  );
}
