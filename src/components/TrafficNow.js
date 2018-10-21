import React, { Component } from 'react';
import prettyBytes from 'm/pretty-bytes';

import { fetchData } from '../api/traffic';

import s0 from 'c/TrafficNow.module.scss';

class TrafficNow extends Component {
  state = {
    upStr: '0 B/s',
    downStr: '0 B/s'
  };

  componentDidMount() {
    this.traffic = fetchData();
    this.unsubscribe = this.traffic.subscribe(o => {
      this.setState({
        upStr: prettyBytes(o.up) + '/s',
        downStr: prettyBytes(o.down) + '/s'
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { upStr, downStr } = this.state;
    return (
      <div className={s0.TrafficNow}>
        <div className={s0.up}>
          <div>Upload</div>
          <div>{upStr}</div>
        </div>
        <div className={s0.down}>
          <div>Download</div>
          <div>{downStr}</div>
        </div>
      </div>
    );
  }
}

export default TrafficNow;
