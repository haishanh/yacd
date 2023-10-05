import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { areEqual, VariableSizeList } from 'react-window';

import { RuleProviderItem } from '$src/components/rules/RuleProviderItem';
import { useRuleAndProvider } from '$src/components/rules/rules.hooks';
import { RulesPageFab } from '$src/components/rules/RulesPageFab';
import { TextFilter } from '$src/components/shared/TextFilter';
import { useApiConfig } from '$src/store/app';
import { ruleFilterTextAtom } from '$src/store/rules';
import { ClashAPIConfig, RuleType } from '$src/types';

import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import { ContentHeader } from './ContentHeader';
import Rule from './Rule';
import s from './Rules.module.scss';

const { memo } = React;

const paddingBottom = 30;

type ItemData = {
  rules: any[];
  provider: any;
  apiConfig: ClashAPIConfig;
};

function itemKey(index: number, { rules, provider }: ItemData) {
  const providerQty = provider.names.length;

  if (index < providerQty) {
    return provider.names[index];
  }
  const item = rules[index - providerQty];
  return item.id;
}

function getItemSizeFactory({ provider }) {
  return function getItemSize(idx: number) {
    const providerQty = provider.names.length;
    if (idx < providerQty) {
      // provider
      return 110;
    }
    // rule
    return 80;
  };
}

type RowProps = {
  index: number;
  style: React.CSSProperties;
  data: {
    apiConfig: ClashAPIConfig;
    rules: RuleType[];
    provider: { names: string[]; byName: any };
  };
};

const Row = memo(({ index, style, data }: RowProps) => {
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

Row.displayName = 'MemoRow';

export default function Rules() {
  const apiConfig = useApiConfig();
  const [refRulesContainer, containerHeight] = useRemainingViewPortHeight();
  const { rules, provider } = useRuleAndProvider(apiConfig);
  const getItemSize = getItemSizeFactory({ provider });

  const { t } = useTranslation();

  return (
    <div>
      <div className={s.header}>
        <ContentHeader title={t('Rules')} />
        <TextFilter placeholder="Filter" textAtom={ruleFilterTextAtom} />
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
      {provider && provider.names && provider.names.length > 0 ? (
        <RulesPageFab apiConfig={apiConfig} />
      ) : null}
    </div>
  );
}
