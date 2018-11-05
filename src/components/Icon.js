import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Icon = ({ id, width = 20, height = 20, className, ...props }) => {
  const c = cx('icon', id, className);
  const href = '#' + id;
  return (
    <svg className={c} width={width} height={height} {...props}>
      <use xlinkHref={href} />
    </svg>
  );
};

Icon.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};

export default React.memo(Icon);
