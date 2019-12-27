import React from 'react';
import { useStoreState } from '../misc/store';

import { connect } from './StateProvider';

import ContentHeader from './ContentHeader';
import ProxyGroup from './ProxyGroup';
import Button from './Button';
import { Zap } from 'react-feather';

import ProxyProviderList from './ProxyProviderList';

import s0 from './Proxies.module.css';

import {
  getProxies,
  getDelay,
  getProxyGroupNames,
  getProxyProviders,
  fetchProxies,
  requestDelayAll
} from '../store/proxies';

import { getClashAPIConfig } from '../ducks/app';

const { useEffect, useMemo, useCallback } = React;

const mapStateToProps = s => ({
  apiConfig: getClashAPIConfig(s)
});

function Proxies({ dispatch, groupNames, proxies, delay, proxyProviders }) {
  const { apiConfig } = useStoreState(mapStateToProps);
  useEffect(() => {
    dispatch(fetchProxies(apiConfig));
  }, [dispatch, apiConfig]);
  const requestDelayAllFn = useCallback(
    () => dispatch(requestDelayAll(apiConfig)),
    [apiConfig, dispatch]
  );
  const icon = useMemo(() => <Zap width={16} />, []);

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
  groupNames: getProxyGroupNames(s),
  proxies: getProxies(s),
  proxyProviders: getProxyProviders(s),
  delay: getDelay(s)
});

export default connect(mapState)(Proxies);
