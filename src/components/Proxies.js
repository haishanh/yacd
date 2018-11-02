import React, { useEffect } from 'react';
import { useActions, useComponentState } from 'm/store';

import ContentHeader from 'c/ContentHeader';
import ProxyGroup from 'c/ProxyGroup';
import Button from 'c/Button';

import s0 from 'c/Proxies.module.scss';

import {
  getUserProxies,
  getProxyGroupNames,
  fetchProxies,
  requestDelayAll
} from 'd/proxies';

const mapStateToProps = s => ({
  proxies: getUserProxies(s),
  groupNames: getProxyGroupNames(s)
});

const actions = {
  fetchProxies,
  requestDelayAll
};

export default function Proxies() {
  const { fetchProxies, requestDelayAll } = useActions(actions);
  useEffect(() => {
    fetchProxies();
  }, []);
  const { groupNames } = useComponentState(mapStateToProps);

  return (
    <div>
      <ContentHeader title="Proxies" />
      <div>
        <div className={s0.btnGroup}>
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
    </div>
  );
}
