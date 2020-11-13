import cx from 'clsx';
import React from 'react';
import { areEqual, FixedSizeList as List } from 'react-window';

import { fetchLogs } from '../api/logs';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import { getClashAPIConfig } from '../store/app';
import { getLogLevel } from '../store/configs';
import { appendLog, getLogsForDisplay } from '../store/logs';
import ContentHeader from './ContentHeader';
import s0 from './Logs.module.css';
import LogSearch from './LogSearch';
import { connect } from './StateProvider';
import SvgYacd from './SvgYacd';

const { useCallback, memo, useEffect } = React;

const paddingBottom = 30;
const colors = {
  debug: 'none',
  // debug: '#8a8a8a',
  info: '#454545',
  // info: '#147d14',
  warning: '#b99105',
  error: '#c11c1c',
};

type LogLineProps = {
  time?: string;
  even?: boolean;
  payload?: string;
  type?: string;
};

function LogLine({ time, even, payload, type }: LogLineProps) {
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

function itemKey(index, data) {
  const item = data[index];
  return item.id;
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'index' does not exist on type '{ childre... Remove this comment to see the full error message
const Row = memo(({ index, style, data }) => {
  const r = data[index];
  return (
    <div style={style}>
      <LogLine {...r} />
    </div>
  );
}, areEqual);

function Logs({ dispatch, logLevel, apiConfig, logs }) {
  const appendLogInternal = useCallback(
    (log) => {
      dispatch(appendLog(log));
    },
    [dispatch]
  );
  useEffect(() => {
    fetchLogs({ ...apiConfig, logLevel }, appendLogInternal);
  }, [apiConfig, logLevel, appendLogInternal]);
  const [refLogsContainer, containerHeight] = useRemainingViewPortHeight();

  return (
    <div>
      <ContentHeader title="Logs" />
      <LogSearch />
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type 'number | MutableRefObject<any>' is not assig... Remove this comment to see the full error message */}
      <div ref={refLogsContainer} style={{ paddingBottom }}>
        {logs.length === 0 ? (
          <div
            className={s0.logPlaceholder}
            // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
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
              // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
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

const mapState = (s) => ({
  logs: getLogsForDisplay(s),
  logLevel: getLogLevel(s),
  apiConfig: getClashAPIConfig(s),
});

export default connect(mapState)(Logs);
