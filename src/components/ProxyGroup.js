import React from 'react';

import Button from './Button';

import cx from 'classnames';
import { connect } from './StateProvider';
import { getDelay } from '../store/proxies';

import Proxy, { ProxySmall } from './Proxy';
import { SectionNameType } from './shared/Basic';

import s0 from './ProxyGroup.module.css';

import { switchProxy } from '../store/proxies';

const { memo, useCallback, useMemo, useState } = React;

function ProxyGroup({ name, proxies, apiConfig, dispatch }) {
  const group = proxies[name];
  const { all, type, now } = group;

  const isSelectable = useMemo(() => type === 'Selector', [type]);

  const [isShow, setIsShow] = useState({
    show: false,
    showAll: false
  });

  const updateShow = useCallback(
    type => {
      if (type === 'all') {
        setIsShow({
          ...isShow,
          showAll: !isShow.showAll
        });
      } else {
        setIsShow({
          ...isShow,
          show: !isShow.show
        });
      }
    },
    [isShow]
  );

  const itemOnTapCallback = useCallback(
    proxyName => {
      if (!isSelectable) return;

      dispatch(switchProxy(apiConfig, name, proxyName));
      // switchProxyFn(name, proxyName);
    },
    [apiConfig, dispatch, name, isSelectable]
  );

  return (
    <div className={s0.group}>
      <div className={s0.header}>
        <SectionNameType name={name} type={group.type} />
        <Button
          className="btn"
          onClick={() => updateShow()}
          text={isShow.show ? 'hide' : 'show'}
        ></Button>
        <Button
          className="btn"
          onClick={() => updateShow('all')}
          text={isShow.showAll ? 'hide error' : 'all proxies'}
        ></Button>
      </div>
      <ProxyList
        all={isShow.show ? all : []}
        now={now}
        isSelectable={isSelectable}
        itemOnTapCallback={itemOnTapCallback}
        filterError={!isShow.showAll}
      />
    </div>
  );
}

type ProxyListProps = {
  all: string[],
  now?: string,
  isSelectable?: boolean,
  itemOnTapCallback?: string => void,
  show?: boolean
};
function ProxyListImpl({
  all,
  now,
  isSelectable,
  itemOnTapCallback,
  filterError,
  sortedAll
}: ProxyListProps) {
  const proxies = sortedAll || all;

  return (
    <div className={s0.list}>
      {proxies.map(proxyName => {
        const proxyClassName = cx(s0.proxy, {
          [s0.proxySelectable]: isSelectable
        });
        return (
          <div
            className={proxyClassName}
            key={proxyName}
            onClick={() => {
              if (!isSelectable || !itemOnTapCallback) return;
              itemOnTapCallback(proxyName);
            }}
          >
            <Proxy name={proxyName} now={proxyName === now} />
          </div>
        );
      })}
    </div>
  );
}

const getSortDelay = (d, w) => {
  if (d === undefined) {
    return 0;
  }
  if (!d.error && d.number > 0) {
    return d.number;
  }

  return w;
};

const mapState = (s, { all, filterError }) => {
  const delay = getDelay(s);

  let clonelist = [...all];

  if (filterError) {
    clonelist = clonelist.filter(e => {
      const d = delay[e];
      if (d === undefined) return true;
      if (d.error || d.number === 0 || d.number > 1000) {
        return false;
      } else {
        return true;
      }
    });
  }

  clonelist = clonelist.sort((first, second) => {
    const d1 = getSortDelay(delay[first], 999999);
    const d2 = getSortDelay(delay[second], 999999);

    return d1 - d2;
  });

  return {
    sortedAll: clonelist
  };
};

export const ProxyList = connect(mapState)(ProxyListImpl);

export function ProxyListSummaryView({
  all,
  now,
  isSelectable,
  itemOnTapCallback
}: ProxyListProps) {
  return (
    <div className={s0.list}>
      {all.map(proxyName => {
        const proxyClassName = cx(s0.proxy, {
          [s0.proxySelectable]: isSelectable
        });
        return (
          <div
            className={proxyClassName}
            key={proxyName}
            onClick={() => {
              if (!isSelectable || !itemOnTapCallback) return;
              itemOnTapCallback(proxyName);
            }}
          >
            <ProxySmall name={proxyName} now={proxyName === now} />
          </div>
        );
      })}
    </div>
  );
}

export default memo(ProxyGroup);
