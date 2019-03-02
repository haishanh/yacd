import React from 'react';
import PropTypes from 'prop-types';

function SvgActivity({ isActive }) {
  const stroke = isActive ? '#000' : 'currentColor';
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path
          d="M22 17h-4l-3 9L9 8l-3 9H2"
          stroke="#E1293E"
          style={{
            transition: 'all 1s',
            opacity: isActive ? '1' : '0'
          }}
        />
        <path
          d="M24 14h-4l-3 9-6-18-3 9H4"
          stroke={stroke}
          style={{ transition: 'all 1s' }}
        />
      </g>
    </svg>
  );
}

SvgActivity.propTypes = {
  isActive: PropTypes.bool
};

export default SvgActivity;
