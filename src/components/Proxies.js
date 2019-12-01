import React from 'react';
import { useActions, useStoreState } from 'm/store';

import ContentHeader from 'c/ContentHeader';
import ProxyGroup from 'c/ProxyGroup';
import { ButtonWithIcon } from 'c/Button';
import { Zap } from 'react-feather';

import s0 from 'c/Proxies.module.css';

import {
  getProxies,
  getProxyGroupNames,
  fetchProxies,
  requestDelayAll
} from 'd/proxies';

const { useEffect, useMemo } = React;

const mapStateToProps = s => ({
  proxies: getProxies(s),
  groupNames: getProxyGroupNames(s)
});

const actions = {
  fetchProxies,
  requestDelayAll
};

export default function Proxies() {
  const { fetchProxies, requestDelayAll } = useActions(actions);
  useEffect(() => {
    (async () => {
      await fetchProxies();
      // await requestDelayAll();
    })();
  }, [fetchProxies, requestDelayAll]);
  const { groupNames } = useStoreState(mapStateToProps);
  const icon = useMemo(() => <Zap width={16} />, []);

  return (
    <>
      <ContentHeader title="Proxies" />
      <div className={s0.body}>
        <div className="fabgrp">
          <ButtonWithIcon
            text="Test Latency"
            icon={icon}
            onClick={requestDelayAll}
          />
          {/* <Button onClick={requestDelayAll}>Test Latency</Button> */}
        </div>
        {groupNames.map(groupName => {
          return (
            <div className={s0.group} key={groupName}>
              <ProxyGroup name={groupName} />
            </div>
          );
        })}
      </div>
    </>
  );
}
