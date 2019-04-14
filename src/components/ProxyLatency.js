import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import s0 from './ProxyLatency.module.css';

const colorMap = {
  good: '#67C23A',
  normal: '#E6A23C',
  bad: '#F56C6C',
  na: '#909399'
};

function getLabelColor(number, error) {
  if (error !== '') {
    return colorMap.na;
  } else if (number < 200) {
    return colorMap.good;
  } else if (number < 400) {
    return colorMap.normal;
  }
  return colorMap.bad;
}

export default function ProxyLatency({ latency }) {
  const { number, error } = latency;
  const color = useMemo(() => getLabelColor(number, error), [number, error]);
  return (
    <span className={s0.proxyLatency} style={{ color }}>
      {error !== '' ? <span>{error}</span> : <span>{number} ms</span>}
    </span>
  );
}

ProxyLatency.propTypes = {
  latency: PropTypes.shape({
    number: PropTypes.number,
    error: PropTypes.string
  })
};
