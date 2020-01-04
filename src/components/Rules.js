import React from 'react';
import Button from './Button';
import { FixedSizeList as List, areEqual } from 'react-window';
import { RotateCw } from 'react-feather';

import { connect } from './StateProvider';
import { getClashAPIConfig } from '../store/app';
import ContentHeader from './ContentHeader';
import Rule from './Rule';
import RuleSearch from './RuleSearch';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';

import { getRules, fetchRules, fetchRulesOnce } from '../store/rules';

const { memo, useEffect, useMemo, useCallback } = React;

// import s from './Rules.module.css';
const paddingBottom = 30;

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

const mapState = s => ({
  apiConfig: getClashAPIConfig(s),
  rules: getRules(s)
});

export default connect(mapState)(Rules);

function Rules({ dispatch, apiConfig, rules }) {
  const fetchRulesHooked = useCallback(() => {
    dispatch(fetchRules(apiConfig));
  }, [apiConfig, dispatch]);
  useEffect(() => {
    dispatch(fetchRulesOnce(apiConfig));
  }, [dispatch, apiConfig]);
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
        <Button text="Refresh" start={refreshIcon} onClick={fetchRulesHooked} />
      </div>
    </div>
  );
}
