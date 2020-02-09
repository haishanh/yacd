import React from 'react';

import Button from './Button';
import { ChevronsDown } from 'react-feather';

import cx from 'classnames';
import { connect } from './StateProvider';
import { getDelay, getRtFilterSwitch } from '../store/proxies';

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
    show: false
  });

  const updateShow = useCallback(
    type => {
      setIsShow({
        show: !isShow.show
      });
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

  const button = useMemo(
    () => (
      <Button
        className="btn"
        start={<ChevronsDown width={16} />}
        onClick={() => updateShow()}
        // text={isShow.show ? 'hide' : 'show'}
      />
    ),
    [updateShow]
  );

  return (
    <div className={s0.group}>
      <div className={s0.header}>
        <SectionNameType name={name} type={group.type} dropDown={button} />
      </div>
      <ProxyList
        all={isShow.show ? all : []}
        now={now}
        isSelectable={isSelectable}
        itemOnTapCallback={itemOnTapCallback}
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

const mapState = (s, { all }) => {
  const delay = getDelay(s);
  const filterByRt = getRtFilterSwitch(s);

  const groupList = [];
  const proxyList = [];

  let clonelist = [...all];

  if (filterByRt) {
    const filterList = clonelist.filter(name => {
      const d = delay[name];
      if (d === undefined) {
        groupList.push(name);
        return true;
      }
      if (d.error || d.number === 0) {
        return false;
      } else {
        proxyList.push(name);
        return true;
      }
    });

    //
    if (proxyList.length > 0) {
      //not test connection yet ,,show all
      clonelist = filterList;
    }
  }

  return {
    all: clonelist.sort((first, second) => {
      const d1 = getSortDelay(delay[first], 999999);
      const d2 = getSortDelay(delay[second], 999999);
      return d1 - d2;
    })
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
