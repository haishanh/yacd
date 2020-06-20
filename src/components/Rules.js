import React from 'react';
import { RotateCw } from 'react-feather';
import { areEqual, FixedSizeList as List } from 'react-window';

import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import { getClashAPIConfig } from '../store/app';
import { fetchRules, fetchRulesOnce, getRules } from '../store/rules';
import ContentHeader from './ContentHeader';
import Rule from './Rule';
import RuleSearch from './RuleSearch';
import { Fab, position as fabPosition } from './shared/Fab';
import { connect } from './StateProvider';

const { memo, useEffect, useMemo, useCallback } = React;

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

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
  rules: getRules(s),
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

      <Fab
        icon={refreshIcon}
        text="Refresh"
        onClick={fetchRulesHooked}
        position={fabPosition}
      />
    </div>
  );
}
