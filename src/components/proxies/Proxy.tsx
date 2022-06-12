import { TooltipPopup, useTooltip } from '@reach/tooltip';
import cx from 'clsx';
import * as React from 'react';

import { State } from '$src/store/types';

import { getDelay, getProxies, NonProxyTypes } from '../../store/proxies';
import { connect } from '../StateProvider';
import s0 from './Proxy.module.scss';
import { ProxyLatency } from './ProxyLatency';

const { useMemo } = React;

const colorMap = {
  // green
  good: '#67c23a',
  // yellow
  normal: '#d4b75c',
  // orange
  bad: '#e67f3c',
  // bad: '#F56C6C',
  na: '#909399',
};

function getLabelColor({ number }: { number?: number } = {}) {
  if (number === 0) {
    return colorMap.na;
  } else if (number < 200) {
    return colorMap.good;
  } else if (number < 400) {
    return colorMap.normal;
  } else if (typeof number === 'number') {
    return colorMap.bad;
  }
  return colorMap.na;
}

function getProxyDotStyle(latency: { number?: number }, proxyType: string) {
  if (NonProxyTypes.indexOf(proxyType) > -1) {
    return { border: '1px dotted #777' };
  }
  const bg = getLabelColor(latency);
  return { background: bg };
}

type ProxyProps = {
  name: string;
  now?: boolean;
  proxy: any;
  latency?: { number?: number };
  isSelectable?: boolean;
  onClick?: (proxyName: string) => unknown;
};

function ProxySmallImpl({ now, name, proxy, latency, isSelectable, onClick }: ProxyProps) {
  const style = useMemo(() => getProxyDotStyle(latency, proxy.type), [latency, proxy]);
  const title = useMemo(() => {
    let ret = name;
    if (latency && typeof latency.number === 'number') {
      ret += ' ' + latency.number + ' ms';
    }
    return ret;
  }, [name, latency]);

  const doSelect = React.useCallback(() => {
    isSelectable && onClick && onClick(name);
  }, [name, onClick, isSelectable]);

  const className = useMemo(() => {
    return cx(s0.proxySmall, { [s0.now]: now, [s0.selectable]: isSelectable });
  }, [isSelectable, now]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') doSelect();
    },
    [doSelect]
  );

  return (
    <div
      title={title}
      className={className}
      style={style}
      onClick={doSelect}
      onKeyDown={handleKeyDown}
      role={isSelectable ? 'menuitem' : ''}
    />
  );
}

function formatProxyType(t: string) {
  if (t === 'Shadowsocks') return 'SS';
  return t;
}

const positionProxyNameTooltip = (triggerRect: { left: number; top: number }) => {
  return {
    left: triggerRect.left + window.scrollX - 5,
    top: triggerRect.top + window.scrollY - 38,
  };
};

function ProxyNameTooltip({ children, label, 'aria-label': ariaLabel }) {
  const [trigger, tooltip] = useTooltip();
  return (
    <>
      {React.cloneElement(children, trigger)}
      <TooltipPopup
        {...tooltip}
        label={label}
        aria-label={ariaLabel}
        position={positionProxyNameTooltip}
      />
    </>
  );
}

function ProxyImpl({ now, name, proxy, latency, isSelectable, onClick }: ProxyProps) {
  const color = useMemo(() => getLabelColor(latency), [latency]);
  const doSelect = React.useCallback(() => {
    isSelectable && onClick && onClick(name);
  }, [name, onClick, isSelectable]);
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') doSelect();
    },
    [doSelect]
  );
  const className = useMemo(() => {
    return cx(s0.proxy, {
      [s0.now]: now,
      // [s0.error]: latency && latency.error,
      [s0.selectable]: isSelectable,
    });
  }, [isSelectable, now]);

  return (
    <div
      tabIndex={0}
      className={className}
      onClick={doSelect}
      onKeyDown={handleKeyDown}
      role={isSelectable ? 'menuitem' : ''}
    >
      <div className={s0.proxyName}>
        <ProxyNameTooltip label={name} aria-label={'proxy name: ' + name}>
          <span>{name}</span>
        </ProxyNameTooltip>
      </div>
      <div className={s0.row}>
        <span className={s0.proxyType} style={{ opacity: now ? 0.6 : 0.2 }}>
          {formatProxyType(proxy.type)}
        </span>
        <ProxyLatency number={latency?.number} color={color} />
      </div>
    </div>
  );
}

const mapState = (s: State, { name }) => {
  const proxies = getProxies(s);
  const delay = getDelay(s);
  const proxy = proxies[name] || { name, type: 'Unknown', history: [] };
  return { proxy, latency: delay[name] };
};

export const Proxy = connect(mapState)(ProxyImpl);
export const ProxySmall = connect(mapState)(ProxySmallImpl);
