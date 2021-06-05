import React from 'react';

import s from './Loading.module.css';

type Props = {
  height?: string;
};

const Loading = ({ height }: Props) => {
  const style = height ? { height } : {};
  return (
    <div className={s.loading} style={style}>
      <div className={s.spinner} />
    </div>
  );
};

export default Loading;
