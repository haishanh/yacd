import React from 'react';
import { useTranslation } from 'react-i18next';
import { areEqual, VariableSizeList } from 'react-window';
import { RuleProviderItem } from 'src/components/rules/RuleProviderItem';
import { useRuleAndProvider } from 'src/components/rules/rules.hooks';
import { RulesPageFab } from 'src/components/rules/RulesPageFab';
import { TextFilter } from 'src/components/rules/TextFilter';
import { State } from 'src/store/types';
import { ClashAPIConfig } from 'src/types';

import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import { getClashAPIConfig } from '../store/app';
import ContentHeader from './ContentHeader';
import Rule from './Rule';
import s from './Rules.module.css';
import { connect } from './StateProvider';

const { memo } = React;

const paddingBottom = 30;

function itemKey(index: number, { rules, provider }) {
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
      return 90;
    }
    // rule
    return 80;
  };
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'index' does not exist on type '{ childre... Remove this comment to see the full error message
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

const mapState = (s: State) => ({
  apiConfig: getClashAPIConfig(s),
});

export default connect(mapState)(Rules);

type RulesProps = {
  apiConfig: ClashAPIConfig;
};

function Rules({ apiConfig }: RulesProps) {
  const [refRulesContainer, containerHeight] = useRemainingViewPortHeight();
  const { rules, provider } = useRuleAndProvider(apiConfig);
  const getItemSize = getItemSizeFactory({ provider });

  const { t } = useTranslation();

  return (
    <div>
      <div className={s.header}>
        <ContentHeader title={t('Rules')} />
        <TextFilter />
      </div>
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type 'number | MutableRefObject<any>' is not assig... Remove this comment to see the full error message */}
      <div ref={refRulesContainer} style={{ paddingBottom }}>
        <VariableSizeList
          // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
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
