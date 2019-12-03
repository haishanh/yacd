import React from 'react';
import prettyBytes from 'm/pretty-bytes';

import { useStoreState } from 'm/store';
import { getClashAPIConfig } from 'd/app';
import { fetchData } from '../api/traffic';
import * as connAPI from '../api/connections';

import s0 from 'c/TrafficNow.module.css';

const { useState, useEffect, useCallback } = React;

export default function TrafficNow() {
  const { upStr, downStr } = useSpeed();
  const { upTotal, dlTotal, connNumber } = useConnection();
  return (
    <div className={s0.TrafficNow}>
      <div className="sec">
        <div>Upload</div>
        <div>{upStr}</div>
      </div>
      <div className="sec">
        <div>Download</div>
        <div>{downStr}</div>
      </div>
      <div className="sec">
        <div>Upload Total</div>
        <div>{upTotal}</div>
      </div>
      <div className="sec">
        <div>Download Total</div>
        <div>{dlTotal}</div>
      </div>
      <div className="sec">
        <div>Active Connections</div>
        <div>{connNumber}</div>
      </div>
    </div>
  );
}

function useSpeed() {
  const [speed, setSpeed] = useState({ upStr: '0 B/s', downStr: '0 B/s' });
  const { hostname, port, secret } = useStoreState(getClashAPIConfig);
  useEffect(() => {
    return fetchData({
      hostname,
      port,
      secret
    }).subscribe(o =>
      setSpeed({
        upStr: prettyBytes(o.up) + '/s',
        downStr: prettyBytes(o.down) + '/s'
      })
    );
  }, [hostname, port, secret]);
  return speed;
}

function useConnection() {
  const [state, setState] = useState({
    upTotal: '0 B',
    dlTotal: '0 B',
    connNumber: 0
  });
  const config = useStoreState(getClashAPIConfig);
  const read = useCallback(
    ({ downloadTotal, uploadTotal, connections }) => {
      setState({
        upTotal: prettyBytes(uploadTotal),
        dlTotal: prettyBytes(downloadTotal),
        connNumber: connections.length
      });
    },
    [setState]
  );
  useEffect(() => {
    return connAPI.fetchData(config, read);
  }, [config, read]);
  return state;
}
