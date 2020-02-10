import React from 'react';

import { connect, useStoreActions } from './StateProvider';

import ContentHeader from './ContentHeader';
import ProxyGroup from './ProxyGroup';
import { Zap, Filter, Circle } from 'react-feather';

import ProxyProviderList from './ProxyProviderList';
import { Fab, Action } from 'react-tiny-fab';

import './rtf.css';
import s0 from './Proxies.module.css';

import {
  getDelay,
  getRtFilterSwitch,
  getProxyGroupNames,
  getProxyProviders,
  fetchProxies,
  requestDelayAll
} from '../store/proxies';
import { getClashAPIConfig } from '../store/app';

const { useEffect, useCallback, useRef } = React;

function Proxies({
  dispatch,
  groupNames,
  delay,
  proxyProviders,
  apiConfig,
  filterZeroRT
}) {
  const refFetchedTimestamp = useRef({});
  const { toggleUnavailableProxiesFilter } = useStoreActions();
  const requestDelayAllFn = useCallback(
    () => dispatch(requestDelayAll(apiConfig)),
    [apiConfig, dispatch]
  );

  const fetchProxiesHooked = useCallback(() => {
    refFetchedTimestamp.current.startAt = new Date();
    dispatch(fetchProxies(apiConfig)).then(() => {
      refFetchedTimestamp.current.completeAt = new Date();
    });
  }, [apiConfig, dispatch]);
  useEffect(() => {
    // fetch it now
    fetchProxiesHooked();

    // arm a window on focus listener to refresh it
    const fn = () => {
      if (
        refFetchedTimestamp.current.startAt &&
        new Date() - refFetchedTimestamp.current.startAt > 3e4 // 30s
      ) {
        fetchProxiesHooked();
      }
    };
    window.addEventListener('focus', fn, false);
    return () => window.removeEventListener('focus', fn, false);
  }, [fetchProxiesHooked]);

  return (
    <>
      <ContentHeader title="Proxies" />
      <div>
        {groupNames.map(groupName => {
          return (
            <div className={s0.group} key={groupName}>
              <ProxyGroup
                name={groupName}
                delay={delay}
                apiConfig={apiConfig}
                dispatch={dispatch}
              />
            </div>
          );
        })}
      </div>
      <ProxyProviderList items={proxyProviders} />
      <div style={{ height: 60 }} />
      <Fab icon={<Circle />}>
        <Action text="Test Latency" onClick={requestDelayAllFn}>
          <Zap width={16} />
        </Action>
        <Action
          text={(filterZeroRT ? 'Show' : 'Hide') + ' Unavailable Proxies'}
          onClick={toggleUnavailableProxiesFilter}
        >
          <Filter width={16} />
        </Action>
      </Fab>
    </>
  );
}

const mapState = s => ({
  apiConfig: getClashAPIConfig(s),
  groupNames: getProxyGroupNames(s),
  proxyProviders: getProxyProviders(s),
  delay: getDelay(s),
  filterZeroRT: getRtFilterSwitch(s)
});

export default connect(mapState)(Proxies);
