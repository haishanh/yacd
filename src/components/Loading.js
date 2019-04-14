import React from 'react';
import PropTypes from 'prop-types';

import s0 from './Loading.module.css';

const Loading = ({ height }) => {
  const style = height ? { height } : {};
  return (
    <div className={s0.loading} style={style}>
      <div className={s0.pulse} />
    </div>
  );
};

Loading.propTypes = {
  height: PropTypes.string
};

export default Loading;
