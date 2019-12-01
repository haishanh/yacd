import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import s from './SvgYacd.module.css';

function SvgYacd({
  width = 320,
  height = 320,
  animate = false,
  c0 = 'currentColor',
  c1 = '#eee'
}) {
  const faceClasName = cx({ [s.path]: animate });
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fillRule="evenodd">
        {/* face */}
        <path
          d="M71.689 53.055c9.23-1.487 25.684 27.263 41.411 56.663 18.572-8.017 71.708-7.717 93.775 0 4.714-15.612 31.96-57.405 41.626-56.663 3.992.088 13.07 31.705 23.309 94.96 2.743 16.949 7.537 47.492 14.38 91.63-42.339 17.834-84.37 26.751-126.095 26.751-41.724 0-83.756-8.917-126.095-26.751C52.973 116.244 65.536 54.047 71.689 53.055z"
          stroke={c1}
          strokeWidth="4"
          strokeLinecap="round"
          fill={c0}
          className={faceClasName}
        />
        <circle fill={c1} cx="216.5" cy="181.5" r="14.5" />
        <circle fill={c1} cx="104.5" cy="181.5" r="14.5" />
        {/* mouth */}
        <g stroke={c1} strokeLinecap="round" strokeWidth="4">
          <path d="M175.568 218.694c-2.494 1.582-5.534 2.207-8.563 1.508-3.029-.7-5.487-2.594-7.035-5.11M143.981 218.694c2.494 1.582 5.534 2.207 8.563 1.508 3.03-.7 5.488-2.594 7.036-5.11" />
        </g>
      </g>
    </svg>
  );
}

SvgYacd.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

export default SvgYacd;
