import React from 'react';
import { RotateCw } from 'react-feather';
import { queryCache, useQuery } from 'react-query';
import { areEqual, VariableSizeList } from 'react-window';
import { useRecoilState } from 'recoil';
import { fetchRuleProviders } from 'src/api/rule-provider';
import { fetchRules } from 'src/api/rules';
import { RuleProviderItem } from 'src/components/rules/RuleProviderItem';
import { TextFilter } from 'src/components/rules/TextFilter';
import { ruleFilterText } from 'src/store/rules';

import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import { getClashAPIConfig } from '../store/app';
import ContentHeader from './ContentHeader';
import Rule from './Rule';
import s from './Rules.module.css';
import { Fab, position as fabPosition } from './shared/Fab';
import { connect } from './StateProvider';

const { memo, useMemo, useCallback } = React;

const paddingBottom = 30;

function itemKey(index, { rules, provider }) {
  const providerQty = provider.names.length;

  if (index < providerQty) {
    return provider.names[index];
  }
  const item = rules[index - providerQty];
  return item.id;
}

function getItemSizeFactory({ provider }) {
  return function getItemSize(idx) {
    const providerQty = provider.names.length;
    if (idx < providerQty) {
      // provider
      return 90;
    }
    // rule
    return 80;
  };
}

const Row = memo(({ index, style, data }) => {
  const { rules, provider, apiConfig } = data;
  const providerQty = provider.names.length;

  if (index < providerQty) {
    const name = provider.names[index];
    const item = provider.byName[name];
    return (
      <div style={style} className={s.RuleProviderItemWrapper}>
        <RuleProviderItem apiConfig={apiConfig} {...item} />
      </div>
    );
  }

  const r = rules[index - providerQty];
  return (
    <div style={style}>
      <Rule {...r} />
    </div>
  );
}, areEqual);

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
});

export default connect(mapState)(Rules);

function useRuleAndProvider(apiConfig) {
  const { data: rules } = useQuery(['/rules', apiConfig], fetchRules, {
    suspense: true,
  });
  const { data: provider } = useQuery(
    ['/providers/rules', apiConfig],
    fetchRuleProviders,
    { suspense: true }
  );

  const [filterText] = useRecoilState(ruleFilterText);
  if (filterText === '') {
    return { rules, provider };
  } else {
    const f = filterText.toLowerCase();
    return {
      rules: rules.filter((r) => r.payload.toLowerCase().indexOf(f) >= 0),
      provider: {
        byName: provider.byName,
        names: provider.names.filter((t) => t.toLowerCase().indexOf(f) >= 0),
      },
    };
  }
}

function useInvalidateQueries() {
  return useCallback(() => {
    queryCache.invalidateQueries('/rules');
    queryCache.invalidateQueries('/providers/rules');
  }, []);
}

function Rules({ apiConfig }) {
  const [refRulesContainer, containerHeight] = useRemainingViewPortHeight();
  const refreshIcon = useMemo(() => <RotateCw width={16} />, []);

  const { rules, provider } = useRuleAndProvider(apiConfig);
  const invalidateQueries = useInvalidateQueries();

  const getItemSize = getItemSizeFactory({ rules, provider });

  return (
    <div>
      <div className={s.header}>
        <ContentHeader title="Rules" />
        <TextFilter />
      </div>
      <div ref={refRulesContainer} style={{ paddingBottom }}>
        <VariableSizeList
          height={containerHeight - paddingBottom}
          width="100%"
          itemCount={rules.length + provider.names.length}
          itemSize={getItemSize}
          itemData={{ rules, provider, apiConfig }}
          itemKey={itemKey}
        >
          {Row}
        </VariableSizeList>
      </div>

      <Fab
        icon={refreshIcon}
        text="Refresh"
        position={fabPosition}
        onClick={invalidateQueries}
      />
    </div>
  );
}
