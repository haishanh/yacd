import './Connections.css';

import React from 'react';
import { Pause, Play, X as IconClose } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ConnectionItem } from 'src/api/connections';

import { useApiConfig } from '$src/store/app';

import * as connAPI from '../api/connections';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import s from './Connections.module.scss';
import ConnectionTable from './ConnectionTable';
import { MutableConnRefCtx } from './conns/ConnCtx';
import { ContentHeader } from './ContentHeader';
import ModalCloseAllConnections from './ModalCloseAllConnections';
import { Action, Fab, position as fabPosition } from './shared/Fab';
import SvgYacd from './SvgYacd';

const { useEffect, useState, useRef, useCallback } = React;

const paddingBottom = 30;

function arrayToIdKv<T extends { id: string }>(items: T[]) {
  const o = {};
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    o[item.id] = item;
  }
  return o;
}

function basePath(path: string) {
  return path?.replace(/.*[/\\]/, '');
}

type FormattedConn = {
  id: string;
  upload: number;
  download: number;
  start: number;
  chains: string;
  rule: string;
  destinationPort: string;
  destinationIP: string;
  sourceIP: string;
  sourcePort: string;
  source: string;
  host: string;
  type: string;
  network: string;
  processPath?: string;
  downloadSpeedCurr?: number;
  uploadSpeedCurr?: number;
};

function hasSubstring(s: string, pat: string) {
  return (s ?? '').toLowerCase().includes(pat.toLowerCase());
}

function filterConns(conns: FormattedConn[], keyword: string) {
  return !keyword
    ? conns
    : conns.filter((conn) =>
        [
          conn.host,
          conn.sourceIP,
          conn.sourcePort,
          conn.destinationIP,
          conn.chains,
          conn.rule,
          conn.type,
          conn.network,
          conn.processPath,
        ].some((field) => hasSubstring(field, keyword)),
      );
}

function fmtConnItem(
  i: ConnectionItem,
  prevKv: Record<string, { upload: number; download: number }>,
  now: number,
  mutConnCtxRef: { hasProcessPath: boolean },
): FormattedConn {
  const { id, metadata, upload, download, start, chains, rule, rulePayload } = i;
  const { host, destinationPort, destinationIP, network, type, sourceIP, sourcePort } = metadata;
  const processPath = metadata.processPath;
  if (mutConnCtxRef.hasProcessPath === false && typeof processPath !== 'undefined') {
    mutConnCtxRef.hasProcessPath = true;
  }
  // host could be an empty string if it's direct IP connection
  const host2 = host || destinationIP || '';
  const prev = prevKv[id];
  const ret = {
    id,
    upload,
    download,
    start: now - new Date(start).valueOf(),
    chains: chains.reverse().join(' / '),
    rule: !rulePayload ? rule : `${rule}(${rulePayload})`,
    ...metadata,
    host: `${host2}:${destinationPort}`,
    type: `${type}(${network})`,
    source: `${sourceIP}:${sourcePort}`,
    downloadSpeedCurr: download - (prev ? prev.download : 0),
    uploadSpeedCurr: upload - (prev ? prev.upload : 0),
    process: basePath(processPath),
  };
  return ret;
}

function renderTableOrPlaceholder(conns: FormattedConn[]) {
  return conns.length > 0 ? (
    <ConnectionTable data={conns} />
  ) : (
    <div className={s.placeHolder}>
      <SvgYacd width={200} height={200} c1="var(--color-text)" />
    </div>
  );
}

function connQty({ qty }) {
  return qty < 100 ? '' + qty : '99+';
}

export default function Conn() {
  const apiConfig = useApiConfig();
  const [refContainer, containerHeight] = useRemainingViewPortHeight();
  const [conns, setConns] = useState([]);
  const [closedConns, setClosedConns] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const filteredConns = filterConns(conns, filterKeyword);
  const filteredClosedConns = filterConns(closedConns, filterKeyword);
  const [isCloseAllModalOpen, setIsCloseAllModalOpen] = useState(false);
  const openCloseAllModal = useCallback(() => setIsCloseAllModalOpen(true), []);
  const closeCloseAllModal = useCallback(() => setIsCloseAllModalOpen(false), []);
  const [isRefreshPaused, setIsRefreshPaused] = useState(false);
  const toggleIsRefreshPaused = useCallback(() => setIsRefreshPaused((x) => !x), []);
  const closeAllConnections = useCallback(() => {
    connAPI.closeAllConnections(apiConfig);
    closeCloseAllModal();
  }, [apiConfig, closeCloseAllModal]);
  const prevConnsRef = useRef(conns);
  const connCtx = React.useContext(MutableConnRefCtx);
  const read = useCallback(
    ({ connections }: { connections: ConnectionItem[] }) => {
      const prevConnsKv = arrayToIdKv(prevConnsRef.current);
      const now = Date.now();
      const x = connections.map((c) => fmtConnItem(c, prevConnsKv, now, connCtx));
      const closed = [];
      for (const c of prevConnsRef.current) {
        const idx = x.findIndex((conn) => conn.id === c.id);
        if (idx < 0) closed.push(c);
      }
      setClosedConns((prev) => {
        // keep max 100 entries
        return [...closed, ...prev].slice(0, 101);
      });
      // if previous connections and current connections are both empty
      // arrays, we wont update state to avoid rerender
      if (x && (x.length !== 0 || prevConnsRef.current.length !== 0) && !isRefreshPaused) {
        prevConnsRef.current = x;
        setConns(x);
      } else {
        prevConnsRef.current = x;
      }
    },
    [setConns, isRefreshPaused, connCtx],
  );
  useEffect(() => {
    return connAPI.fetchData(apiConfig, read);
  }, [apiConfig, read]);

  const { t } = useTranslation();

  return (
    <div>
      <ContentHeader title={t('Connections')} />
      <Tabs>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <TabList>
            <Tab>
              <span>{t('Active')}</span>
              <span className={s.connQty}>{connQty({ qty: filteredConns.length })}</span>
            </Tab>
            <Tab>
              <span>{t('Closed')}</span>
              <span className={s.connQty}>{connQty({ qty: filteredClosedConns.length })}</span>
            </Tab>
          </TabList>
          <div className={s.inputWrapper}>
            <input
              type="text"
              name="filter"
              autoComplete="off"
              className={s.input}
              placeholder="Filter"
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
          </div>
        </div>
        <div ref={refContainer} style={{ padding: 30, paddingBottom, paddingTop: 0 }}>
          <div
            style={{
              height: containerHeight - paddingBottom,
              overflow: 'auto',
            }}
          >
            <TabPanel>
              <>{renderTableOrPlaceholder(filteredConns)}</>
              <Fab
                icon={isRefreshPaused ? <Play size={16} /> : <Pause size={16} />}
                mainButtonStyles={isRefreshPaused ? { background: '#e74c3c' } : {}}
                style={fabPosition}
                text={isRefreshPaused ? t('Resume Refresh') : t('Pause Refresh')}
                onClick={toggleIsRefreshPaused}
              >
                <Action text="Close All Connections" onClick={openCloseAllModal}>
                  <IconClose size={10} />
                </Action>
              </Fab>
            </TabPanel>
            <TabPanel>{renderTableOrPlaceholder(filteredClosedConns)}</TabPanel>
          </div>
        </div>
        <ModalCloseAllConnections
          isOpen={isCloseAllModalOpen}
          primaryButtonOnTap={closeAllConnections}
          onRequestClose={closeCloseAllModal}
        />
      </Tabs>
    </div>
  );
}
