import { Tooltip } from '@reach/tooltip';
import * as React from 'react';

import Button from '$src/components/Button';
import CollapsibleSectionHeader from '$src/components/CollapsibleSectionHeader';
import { ZapAnimated } from '$src/components/shared/ZapAnimated';
import { connect, useStoreActions } from '$src/components/StateProvider';
import { useState2 } from '$src/hooks/basic';
import { getCollapsibleIsOpen, getHideUnavailableProxies, getProxySortBy } from '$src/store/app';
import { getProxies, switchProxy } from '$src/store/proxies';
import { DelayMapping, DispatchFn, ProxiesMapping, State } from '$src/store/types';
import { ClashAPIConfig } from '$src/types';

import { useFilteredAndSorted } from './hooks';
import s0 from './ProxyGroup.module.scss';
import { ProxyList, ProxyListSummaryView } from './ProxyList';

const { createElement, useCallback, useMemo } = React;

type ProxyGroupImplProps = {
  name: string;
  all: string[];
  delay: DelayMapping;
  hideUnavailableProxies: boolean;
  proxySortBy: string;
  proxies: ProxiesMapping;
  type: string;
  now: string;
  isOpen: boolean;
  apiConfig: ClashAPIConfig;
  dispatch: DispatchFn;
};

function ProxyGroupImpl({
  name,
  all: allItems,
  delay,
  hideUnavailableProxies,
  proxySortBy,
  proxies,
  type,
  now,
  isOpen,
  apiConfig,
  dispatch,
}: ProxyGroupImplProps) {
  const all = useFilteredAndSorted(allItems, delay, hideUnavailableProxies, proxySortBy, proxies);

  const isSelectable = useMemo(() => type === 'Selector', [type]);

  const {
    app: { updateCollapsibleIsOpen },
    proxies: { requestDelayForProxies },
  } = useStoreActions();

  const toggle = useCallback(() => {
    updateCollapsibleIsOpen('proxyGroup', name, !isOpen);
  }, [isOpen, updateCollapsibleIsOpen, name]);

  const itemOnTapCallback = useCallback(
    (proxyName: string) => {
      if (!isSelectable) return;
      dispatch(switchProxy(apiConfig, name, proxyName));
    },
    [apiConfig, dispatch, name, isSelectable],
  );

  const testingLatency = useState2(false);
  const testLatency = useCallback(async () => {
    if (testingLatency.value) return;
    testingLatency.set(true);
    try {
      await requestDelayForProxies(apiConfig, all);
    } catch (err) {}
    testingLatency.set(false);
  }, [all, apiConfig, requestDelayForProxies, testingLatency]);

  return (
    <div className={s0.group}>
      <div className={s0.groupHead}>
        <CollapsibleSectionHeader
          name={name}
          type={type}
          toggle={toggle}
          qty={all.length}
          isOpen={isOpen}
        />
        <div className={s0.action}>
          <Tooltip label={'Test latency'}>
            <Button kind="circular" onClick={testLatency}>
              <ZapAnimated animate={testingLatency.value} size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>
      {createElement(isOpen ? ProxyList : ProxyListSummaryView, {
        all,
        now,
        isSelectable,
        itemOnTapCallback,
      })}
    </div>
  );
}

export const ProxyGroup = connect((s: State, { name, delay }) => {
  const proxies = getProxies(s);
  const collapsibleIsOpen = getCollapsibleIsOpen(s);
  const proxySortBy = getProxySortBy(s);
  const hideUnavailableProxies = getHideUnavailableProxies(s);

  const group = proxies[name];
  const { all, type, now } = group;
  return {
    all,
    delay,
    hideUnavailableProxies,
    proxySortBy,
    proxies,
    type,
    now,
    isOpen: collapsibleIsOpen[`proxyGroup:${name}`],
  };
})(ProxyGroupImpl);
