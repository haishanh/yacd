import React from 'react';
import ContentHeader from 'c/ContentHeader';
import ConnectionTable from 'c/ConnectionTable';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import { useStoreState } from 'm/store';
import { getClashAPIConfig } from 'd/app';
import * as connAPI from '../api/connections';

const { useEffect, useState } = React;

const paddingBottom = 30;

function formatConnectionDataItem(i) {
  const { id, metadata, upload, download, start, chains, rule } = i;
  // const started = formatDistance(new Date(start), now);
  return {
    id,
    upload,
    download,
    start: 0 - new Date(start),
    chains: chains.reverse().join(' / '),
    rule,
    ...metadata
  };
}

function Conn() {
  const [refContainer, containerHeight] = useRemainingViewPortHeight();
  const config = useStoreState(getClashAPIConfig);
  const [conns, setConns] = useState([]);
  useEffect(() => {
    function read({ connections }) {
      const x = connections.map(c => formatConnectionDataItem(c));
      setConns(x);
    }
    return connAPI.fetchData(config, read);
  }, [config]);
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
          <ConnectionTable data={conns} />
        </div>
      </div>
    </div>
  );
}

export default Conn;
