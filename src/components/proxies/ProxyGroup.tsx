import { Tooltip } from '@reach/tooltip';
import { useAtom } from 'jotai';
import * as React from 'react';

import Button from '$src/components/Button';
import CollapsibleSectionHeader from '$src/components/CollapsibleSectionHeader';
import { ZapAnimated } from '$src/components/shared/ZapAnimated';
import { connect, useStoreActions } from '$src/components/StateProvider';
import { useState2 } from '$src/hooks/basic';
import {
  autoCloseOldConnsAtom,
  collapsibleIsOpenAtom,
  hideUnavailableProxiesAtom,
  proxySortByAtom,
} from '$src/store/app';
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
  proxies: ProxiesMapping;
  type: string;
  now: string;
  apiConfig: ClashAPIConfig;
  dispatch: DispatchFn;
};

function ProxyGroupImpl({
  name,
  all: allItems,
  delay,
  proxies,
  type,
  now,
  apiConfig,
  dispatch,
}: ProxyGroupImplProps) {
  const [collapsibleIsOpen, setCollapsibleIsOpen] = useAtom(collapsibleIsOpenAtom);
  const isOpen = collapsibleIsOpen[`proxyGroup:${name}`];
  const [proxySortBy] = useAtom(proxySortByAtom);
  const [hideUnavailableProxies] = useAtom(hideUnavailableProxiesAtom);
  const all = useFilteredAndSorted(allItems, delay, hideUnavailableProxies, proxySortBy, proxies);
  const isSelectable = useMemo(() => type === 'Selector', [type]);
  const {
    proxies: { requestDelayForProxies },
  } = useStoreActions();
  const updateCollapsibleIsOpen = useCallback(
    (prefix: string, name: string, v: boolean) => {
      setCollapsibleIsOpen((s) => ({ ...s, [`${prefix}:${name}`]: v }));
    },
    [setCollapsibleIsOpen],
  );
  const toggle = useCallback(() => {
    updateCollapsibleIsOpen('proxyGroup', name, !isOpen);
  }, [isOpen, updateCollapsibleIsOpen, name]);
  const [autoCloseOldConns] = useAtom(autoCloseOldConnsAtom);
  const itemOnTapCallback = useCallback(
    (proxyName: string) => {
      if (!isSelectable) return;
      dispatch(switchProxy(apiConfig, name, proxyName, autoCloseOldConns));
    },
    [apiConfig, dispatch, name, isSelectable, autoCloseOldConns],
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
  const group = proxies[name];
  const { all, type, now } = group;
  return {
    all,
    delay,
    proxies,
    type,
    now,
  };
})(ProxyGroupImpl);
