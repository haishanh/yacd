import React, { useEffect } from 'react';
import { useActions, useStoreState } from 'm/store';

import ContentHeader from 'c/ContentHeader';
import ProxyGroup from 'c/ProxyGroup';
import Button from 'c/Button';

import s0 from 'c/Proxies.module.css';

import {
  getProxies,
  getProxyGroupNames,
  fetchProxies,
  requestDelayAll
} from 'd/proxies';

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

  return (
    <>
      <ContentHeader title="Proxies" />
      <div className={s0.body}>
        <div className={s0.fabgrp}>
          <Button label="Test Latency" onClick={requestDelayAll} />
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
