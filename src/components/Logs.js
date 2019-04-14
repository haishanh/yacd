import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useStoreState, useActions } from 'm/store';
import { getClashAPIConfig } from 'd/app';

import SvgYacd from './SvgYacd';
import { FixedSizeList as List, areEqual } from 'react-window';
import ContentHeader from 'c/ContentHeader';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
// TODO move this into a redux action
import { fetchLogs } from '../api/logs';
import LogSearch from './LogSearch';
import { getLogsForDisplay, appendLog } from 'd/logs';

import s0 from 'c/Logs.module.css';
const paddingBottom = 30;
const colors = {
  debug: 'none',
  // debug: '#8a8a8a',
  info: '#454545',
  // info: '#147d14',
  warning: '#b99105',
  error: '#c11c1c'
};

function LogLine({ time, even, payload, type }) {
  const className = cx({ even }, s0.log);
  return (
    <div className={className}>
      <div className={s0.logMeta}>
        <div className={s0.logTime}>{time}</div>
        <div className={s0.logType} style={{ backgroundColor: colors[type] }}>
          {type}
        </div>
        <div className={s0.logText}>{payload}</div>
      </div>
    </div>
  );
}

LogLine.propTypes = {
  time: PropTypes.string,
  even: PropTypes.bool,
  payload: PropTypes.string,
  type: PropTypes.string
};

function itemKey(index, data) {
  const item = data[index];
  return item.id;
}

const Row = memo(({ index, style, data }) => {
  const r = data[index];
  return (
    <div style={style}>
      <LogLine {...r} />
    </div>
  );
}, areEqual);

const actions = { appendLog };

export default function Logs() {
  const { hostname, port, secret } = useStoreState(getClashAPIConfig);
  const { appendLog } = useActions(actions);
  const logs = useStoreState(getLogsForDisplay);

  useEffect(() => {
    fetchLogs({ hostname, port, secret }, appendLog);
  }, [hostname, port, secret]);
  const [refLogsContainer, containerHeight] = useRemainingViewPortHeight();

  return (
    <div>
      <ContentHeader title="Logs" />
      <LogSearch />
      <div ref={refLogsContainer} style={{ paddingBottom }}>
        {logs.length === 0 ? (
          <div
            className={s0.logPlaceholder}
            style={{ height: containerHeight - paddingBottom }}
          >
            <div className={s0.logPlaceholderIcon}>
              <SvgYacd width={200} height={200} />
            </div>
            <div>No logs yet, hang tight...</div>
          </div>
        ) : (
          <div className={s0.logsWrapper}>
            <List
              height={containerHeight - paddingBottom}
              width="100%"
              itemCount={logs.length}
              itemSize={80}
              itemData={logs}
              itemKey={itemKey}
            >
              {Row}
            </List>
          </div>
        )}
      </div>
    </div>
  );
}
