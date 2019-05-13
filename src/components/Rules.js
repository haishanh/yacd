import React, { memo, useEffect } from 'react';
import { useActions, useStoreState } from 'm/store';
import Button from 'c/Button';
import { FixedSizeList as List, areEqual } from 'react-window';

import ContentHeader from 'c/ContentHeader';
import Rule from 'c/Rule';
import RuleSearch from 'c/RuleSearch';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';

import { getRules, fetchRules, fetchRulesOnce } from 'd/rules';

import s0 from './Rules.module.css';
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
  useEffect(() => {
    fetchRulesOnce();
  }, [fetchRulesOnce]);
  const [refRulesContainer, containerHeight] = useRemainingViewPortHeight();

  return (
    <div>
      <ContentHeader title="Rules" />
      <RuleSearch />
      <div ref={refRulesContainer} style={{ paddingBottom }}>
        <List
          height={containerHeight - paddingBottom}
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
