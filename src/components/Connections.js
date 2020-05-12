import React from 'react';
import ContentHeader from './ContentHeader';
import ConnectionTable from './ConnectionTable';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import { getClashAPIConfig } from '../store/app';
import { X as IconClose, Pause, Play } from 'react-feather';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SvgYacd from './SvgYacd';
import ModalCloseAllConnections from './ModalCloseAllConnections';
import { connect } from './StateProvider';
import * as connAPI from '../api/connections';
import { Fab, Action, position as fabPosition } from './shared/Fab';

import './Connections.css';
import s from './Connections.module.css';

const { useEffect, useState, useRef, useCallback } = React;

const paddingBottom = 30;

function arrayToIdKv(items) {
  const o = {};
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    o[item.id] = item;
  }
  return o;
}

function formatConnectionDataItem(i, prevKv) {
  const { id, metadata, upload, download, start, chains, rule } = i;
  // eslint-disable-next-line prefer-const
  let { host, destinationPort, destinationIP } = metadata;
  // host could be an empty string if it's direct IP connection
  if (host === '') host = destinationIP;
  const metadataNext = {
    ...metadata,
    // merge host and destinationPort into one column
    host: host + ':' + destinationPort,
  };
  // const started = formatDistance(new Date(start), now);
  const ret = {
    id,
    upload,
    download,
    start: 0 - new Date(start),
    chains: chains.reverse().join(' / '),
    rule,
    ...metadataNext,
  };
  const prev = prevKv[id];
  ret.downloadSpeedCurr = download - (prev ? prev.download : 0);
  ret.uploadSpeedCurr = upload - (prev ? prev.upload : 0);
  return ret;
}

function renderTableOrPlaceholder(conns) {
  return conns.length > 0 ? (
    <ConnectionTable data={conns} />
  ) : (
    <div className={s.placeHolder}>
      <SvgYacd width={200} height={200} c1="var(--color-text)" />
    </div>
  );
}

function ConnQty({ qty }) {
  return qty < 100 ? '' + qty : '99+';
}

function Conn({ apiConfig }) {
  const [refContainer, containerHeight] = useRemainingViewPortHeight();
  const [conns, setConns] = useState([]);
  const [closedConns, setClosedConns] = useState([]);
  const [isCloseAllModalOpen, setIsCloseAllModalOpen] = useState(false);
  const openCloseAllModal = useCallback(() => setIsCloseAllModalOpen(true), []);
  const closeCloseAllModal = useCallback(
    () => setIsCloseAllModalOpen(false),
    []
  );
  const [isRefreshPaused, setIsRefreshPaused] = useState(false);
  const toggleIsRefreshPaused = useCallback(() => {
    setIsRefreshPaused((x) => !x);
  }, []);
  const closeAllConnections = useCallback(() => {
    connAPI.closeAllConnections(apiConfig);
    closeCloseAllModal();
  }, [apiConfig, closeCloseAllModal]);
  const prevConnsRef = useRef(conns);
  const read = useCallback(
    ({ connections }) => {
      const prevConnsKv = arrayToIdKv(prevConnsRef.current);
      const x = connections.map((c) =>
        formatConnectionDataItem(c, prevConnsKv)
      );
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
      // arrays, we wont update state to avaoid rerender
      if (
        x &&
        (x.length !== 0 || prevConnsRef.current.length !== 0) &&
        !isRefreshPaused
      ) {
        prevConnsRef.current = x;
        setConns(x);
      } else {
        prevConnsRef.current = x;
      }
    },
    [setConns, isRefreshPaused]
  );
  useEffect(() => {
    return connAPI.fetchData(apiConfig, read);
  }, [apiConfig, read]);
  return (
    <div>
      <ContentHeader title="Connections" />
      <Tabs>
        <TabList>
          <Tab>
            <span>Active</span>
            <span className={s.connQty}>
              <ConnQty qty={conns.length} />
            </span>
          </Tab>
          <Tab>
            <span>Closed</span>
            <span className={s.connQty}>
              <ConnQty qty={closedConns.length} />
            </span>
          </Tab>
        </TabList>
        <div
          ref={refContainer}
          style={{ padding: 30, paddingBottom, paddingTop: 0 }}
        >
          <div
            style={{
              height: containerHeight - paddingBottom,
              overflow: 'auto',
            }}
          >
            <TabPanel>
              <>{renderTableOrPlaceholder(conns)}</>
              <Fab
                icon={
                  isRefreshPaused ? <Play size={16} /> : <Pause size={16} />
                }
                mainButtonStyles={
                  isRefreshPaused
                    ? {
                        background: '#e74c3c',
                      }
                    : {}
                }
                position={fabPosition}
                text={isRefreshPaused ? 'Resume Refresh' : 'Pause Refresh'}
                onClick={toggleIsRefreshPaused}
              >
                <Action
                  text="Close All Connections"
                  onClick={openCloseAllModal}
                >
                  <IconClose size={10} />
                </Action>
              </Fab>
            </TabPanel>
            <TabPanel>{renderTableOrPlaceholder(closedConns)}</TabPanel>
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

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
});

export default connect(mapState)(Conn);
