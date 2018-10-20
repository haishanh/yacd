import React from 'react';

import style from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={style.loading}>
      <div className={style.left + ' ' + style.circle} />
      <div className={style.right + ' ' + style.circle} />
    </div>
  );
};

export default Loading;
