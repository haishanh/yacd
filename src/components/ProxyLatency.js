import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s0 from './ProxyLatency.module.scss';

const colorMap = {
  good: '#67C23A',
  normal: '#E6A23C',
  bad: '#F56C6C',
  na: '#909399'
};

class C extends Component {
  static propTypes = {
    latency: PropTypes.shape({
      number: PropTypes.number,
      error: PropTypes.string
    })
  };

  render() {
    const { latency } = this.props;
    const { number, error } = latency;
    let bg;

    if (error !== '') {
      bg = colorMap.na;
    } else if (number < 200) {
      bg = colorMap.good;
    } else if (number < 400) {
      bg = colorMap.normal;
    } else {
      bg = colorMap.bad;
    }

    return (
      <span className={s0.proxyLatency} style={{ color: bg }}>
        {error !== '' ? <span>{error}</span> : <span>{number} ms</span>}
      </span>
    );
  }
}

export default C;
