import React from 'react';
import { useActions, useStoreState } from '../misc/store';
import Button from './Button';
import { FixedSizeList as List, areEqual } from 'react-window';
import { RotateCw } from 'react-feather';

import ContentHeader from './ContentHeader';
import Rule from './Rule';
import RuleSearch from './RuleSearch';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';

import { getRules, fetchRules, fetchRulesOnce } from '../ducks/rules';

const { memo, useEffect, useMemo } = React;

// import s from './Rules.module.css';
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
  const refreshIcon = useMemo(() => <RotateCw width={16} />, []);
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
      <div className="fabgrp">
        <Button text="Refresh" start={refreshIcon} onClick={fetchRules} />
      </div>
    </div>
  );
}
