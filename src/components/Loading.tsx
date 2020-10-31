
import React from 'react';

import s0 from './Loading.module.css';

type Props = {
    height?: string;
};

const Loading = ({ height }: Props) => {
  const style = height ? { height } : {};
  return (
    <div className={s0.loading} style={style}>
      <div className={s0.pulse} />
    </div>
  );
};

export default Loading;
