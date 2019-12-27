import React from 'react';
import ContentHeader from './ContentHeader';
import ConnectionTable from './ConnectionTable';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import { useStoreState } from '../misc/store';
import { getClashAPIConfig } from '../ducks/app';
import { X as IconClose } from 'react-feather';
import SvgYacd from './SvgYacd';
import Button from './Button';
import ModalCloseAllConnections from './ModalCloseAllConnections';
import * as connAPI from '../api/connections';

import s from './Connections.module.css';

const { useEffect, useState, useRef, useCallback, useMemo } = React;

const paddingBottom = 30;

function formatConnectionDataItem(i) {
  const { id, metadata, upload, download, start, chains, rule } = i;
  const { host, destinationPort } = metadata;
  const metadataNext = {
    ...metadata,
    // merge host and destinationPort into one column
    host: host + ':' + destinationPort
  };
  // const started = formatDistance(new Date(start), now);
  return {
    id,
    upload,
    download,
    start: 0 - new Date(start),
    chains: chains.reverse().join(' / '),
    rule,
    ...metadataNext
  };
}

function Conn() {
  const [refContainer, containerHeight] = useRemainingViewPortHeight();
  const config = useStoreState(getClashAPIConfig);
  const [conns, setConns] = useState([]);
  const [isCloseAllModalOpen, setIsCloseAllModalOpen] = useState(false);
  const openCloseAllModal = useCallback(() => setIsCloseAllModalOpen(true), []);
  const closeCloseAllModal = useCallback(
    () => setIsCloseAllModalOpen(false),
    []
  );
  const closeAllConnections = useCallback(() => {
    connAPI.closeAllConnections(config);
    closeCloseAllModal();
  }, [config, closeCloseAllModal]);
  const iconClose = useMemo(() => <IconClose width={16} />, []);
  const prevConnsRef = useRef(conns);
  const read = useCallback(
    ({ connections }) => {
      const x = connections.map(c => formatConnectionDataItem(c));
      // if previous connections and current connections are both empty
      // arrays, we wont update state to avaoid rerender
      if (x && (x.length !== 0 || prevConnsRef.current.length !== 0)) {
        prevConnsRef.current = x;
        setConns(x);
      } else {
        prevConnsRef.current = x;
      }
    },
    [setConns]
  );
  useEffect(() => {
    return connAPI.fetchData(config, read);
  }, [config, read]);
  return (
    <div>
      <ContentHeader title="Connections" />
      <div
        ref={refContainer}
        style={{ padding: 30, paddingBottom, paddingTop: 0 }}
      >
        <div
          style={{ height: containerHeight - paddingBottom, overflow: 'auto' }}
        >
          {conns.length > 0 ? (
            <ConnectionTable data={conns} />
          ) : (
            <div className={s.placeHolder}>
              <SvgYacd width={200} height={200} c1="var(--color-text)" />
            </div>
          )}
        </div>
      </div>
      <div className="fabgrp">
        <Button text="Close" start={iconClose} onClick={openCloseAllModal} />
      </div>
      <ModalCloseAllConnections
        isOpen={isCloseAllModalOpen}
        primaryButtonOnTap={closeAllConnections}
        onRequestClose={closeCloseAllModal}
      />
    </div>
  );
}

export default Conn;
