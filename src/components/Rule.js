import React from 'react';
import PropTypes from 'prop-types';

import s0 from './Rule.module.css';

const colorMap = {
  _default: '#59caf9',
  DIRECT: '#f5bc41',
  REJECT: '#cb3166'
};

function getStyleFor({ proxy }) {
  let color = colorMap._default;
  if (colorMap[proxy]) {
    color = colorMap[proxy];
  }
  return { color };
}

function Rule({ type, payload, proxy, id }) {
  const styleProxy = getStyleFor({ proxy });
  return (
    <div className={s0.rule}>
      <div className={s0.left}>{id}</div>
      <div>
        <div className={s0.b}>{payload}</div>
        <div className={s0.a}>
          <div className={s0.type}>{type}</div>
          <div style={styleProxy}>{proxy}</div>
        </div>
      </div>
    </div>
  );
}

Rule.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  payload: PropTypes.string,
  proxy: PropTypes.string
};

export default Rule;
