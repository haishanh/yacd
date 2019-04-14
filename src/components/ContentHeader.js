import React from 'react';
import PropTypes from 'prop-types';

import s0 from './ContentHeader.module.css';

function ContentHeader({ title }) {
  return (
    <div className={s0.root}>
      <h1 className={s0.h1}>{title}</h1>
    </div>
  );
}

ContentHeader.propTypes = {
  title: PropTypes.string.isRequired
};

export default React.memo(ContentHeader);
