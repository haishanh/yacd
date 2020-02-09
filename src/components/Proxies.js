import React from 'react';
// import { useStoreState } from '../misc/store';

import { connect } from './StateProvider';

import ContentHeader from './ContentHeader';
import ProxyGroup from './ProxyGroup';
import Button from './Button';
import { Zap, Filter } from 'react-feather';

import ProxyProviderList from './ProxyProviderList';

import s0 from './Proxies.module.css';

import {
  getProxies,
  getDelay,
  getRtFilterSwitch,
  getProxyGroupNames,
  getProxyProviders,
  fetchProxies,
  requestDelayAll
} from '../store/proxies';
import { getClashAPIConfig } from '../store/app';

const { useEffect, useMemo, useCallback, useRef } = React;

function Proxies({
  dispatch,
  groupNames,
  proxies,
  delay,
  proxyProviders,
  apiConfig,
  filterZeroRT
}) {
  const refFetchedTimestamp = useRef({});

  const switchRequetState = (dispath, getState) => {
    const preState = getRtFilterSwitch(getState());

    dispatch('store/proxies#filterZeroRTProxies', s => {
      s.filterZeroRT = !preState;
    });
  };
  const filterZeroRTFn = useCallback(() => dispatch(switchRequetState), [
    dispatch
  ]);
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
  const icon = useMemo(() => <Zap width={16} />, []);
  const filterIcon = useMemo(() => <Filter width={16} />, []);

  return (
    <>
      <ContentHeader title="Proxies" />
      <div>
        <div className="fabgrp">
          <Button
            text="Test Latency"
            start={icon}
            onClick={requestDelayAllFn}
          />
          <Button start={filterIcon} onClick={filterZeroRTFn}>
            <span>{filterZeroRT ? 'show' : 'hide'} 0ms proxies</span>
          </Button>
        </div>
        {groupNames.map(groupName => {
          return (
            <div className={s0.group} key={groupName}>
              <ProxyGroup
                name={groupName}
                proxies={proxies}
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
    </>
  );
}

const mapState = s => ({
  apiConfig: getClashAPIConfig(s),
  groupNames: getProxyGroupNames(s),
  proxies: getProxies(s),
  proxyProviders: getProxyProviders(s),
  delay: getDelay(s),
  filterZeroRT: getRtFilterSwitch(s)
});

export default connect(mapState)(Proxies);
