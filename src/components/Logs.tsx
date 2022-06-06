import cx from 'clsx';
import * as React from 'react';
import { Pause, Play } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { areEqual, FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { fetchLogs, reconnect as reconnectLogs, stop as stopLogs } from 'src/api/logs';
import ContentHeader from 'src/components/ContentHeader';
import LogSearch from 'src/components/LogSearch';
import { connect, useStoreActions } from 'src/components/StateProvider';
import SvgYacd from 'src/components/SvgYacd';
import useRemainingViewPortHeight from 'src/hooks/useRemainingViewPortHeight';
import { getClashAPIConfig, getLogStreamingPaused } from 'src/store/app';
import { getLogLevel } from 'src/store/configs';
import { appendLog, getLogsForDisplay } from 'src/store/logs';
import { Log, State } from 'src/store/types';

import s from './Logs.module.scss';
import { Fab, position as fabPosition } from './shared/Fab';

const { useCallback, memo, useEffect } = React;

const paddingBottom = 30;
const colors = {
  debug: '#28792c',
  info: 'var(--bg-log-info-tag)',
  warning: '#b99105',
  error: '#c11c1c',
};

type LogLineProps = Partial<Log>;

function LogLine({ time, even, payload, type }: LogLineProps) {
  const className = cx({ even }, 'log');
  return (
    <div className={className}>
      <div className={s.logMeta}>
        <div className={s.logTime}>{time}</div>
        <div className={s.logType} style={{ backgroundColor: colors[type] }}>
          {type}
        </div>
        <div className={s.logText}>{payload}</div>
      </div>
    </div>
  );
}

function itemKey(index: number, data: LogLineProps[]) {
  const item = data[index];
  return item.id;
}

const Row = memo(({ index, style, data }: ListChildComponentProps<LogLineProps>) => {
  const r = data[index];
  return (
    <div style={style}>
      <LogLine {...r} />
    </div>
  );
}, areEqual);

function Logs({ dispatch, logLevel, apiConfig, logs, logStreamingPaused }) {
  const actions = useStoreActions();
  const toggleIsRefreshPaused = useCallback(() => {
    logStreamingPaused ? reconnectLogs({ ...apiConfig, logLevel }) : stopLogs();
    // being lazy here
    // ideally we should check the result of previous operation before updating this
    actions.app.updateAppConfig('logStreamingPaused', !logStreamingPaused);
  }, [apiConfig, logLevel, logStreamingPaused, actions.app]);
  const appendLogInternal = useCallback((log) => dispatch(appendLog(log)), [dispatch]);
  useEffect(() => {
    fetchLogs({ ...apiConfig, logLevel }, appendLogInternal);
  }, [apiConfig, logLevel, appendLogInternal]);
  const [refLogsContainer, containerHeight] = useRemainingViewPortHeight();
  const { t } = useTranslation();

  return (
    <div>
      <ContentHeader title={t('Logs')} />
      <LogSearch />
      <div ref={refLogsContainer} style={{ paddingBottom }}>
        {logs.length === 0 ? (
          <div className={s.logPlaceholder} style={{ height: containerHeight - paddingBottom }}>
            <div className={s.logPlaceholderIcon}>
              <SvgYacd width={200} height={200} />
            </div>
            <div>{t('no_logs')}</div>
          </div>
        ) : (
          <div className={s.logsWrapper}>
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

            <Fab
              icon={logStreamingPaused ? <Play size={16} /> : <Pause size={16} />}
              mainButtonStyles={logStreamingPaused ? { background: '#e74c3c' } : {}}
              style={fabPosition}
              text={logStreamingPaused ? t('Resume Refresh') : t('Pause Refresh')}
              onClick={toggleIsRefreshPaused}
            ></Fab>
          </div>
        )}
      </div>
    </div>
  );
}

const mapState = (s: State) => ({
  logs: getLogsForDisplay(s),
  logLevel: getLogLevel(s),
  apiConfig: getClashAPIConfig(s),
  logStreamingPaused: getLogStreamingPaused(s),
});

export default connect(mapState)(Logs);
