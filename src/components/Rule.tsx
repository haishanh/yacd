import React from 'react';

import s0 from './Rule.module.scss';

const colorMap = {
  _default: '#59caf9',
  DIRECT: '#f5bc41',
  REJECT: '#cb3166',
};

function getStyleFor({ proxy }) {
  let color = colorMap._default;
  if (colorMap[proxy]) {
    color = colorMap[proxy];
  }
  return { color };
}

type Props = {
  id?: number;
  type?: string;
  payload?: string;
  proxy?: string;
};

function Rule({ type, payload, proxy, id }: Props) {
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

export default Rule;
