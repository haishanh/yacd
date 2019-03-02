import React from 'react';
import PropTypes from 'prop-types';

export default function SvgCommand({ isActive }) {
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
          d="M17 7a3 3 0 0 0-3 3v12a3 3 0 1 0 3-3H5a3 3 0 1 0 3 3V10a3 3 0 1 0-3 3h12a3 3 0 0 0 0-6z"
          fill="#75B24B"
          stroke="#75B24B"
          style={{
            transition: 'all 1s',
            opacity: isActive ? '1' : '0'
          }}
        />
        <path
          d="M20 5a3 3 0 0 0-3 3v12a3 3 0 1 0 3-3H8a3 3 0 1 0 3 3V8a3 3 0 1 0-3 3h12a3 3 0 0 0 0-6z"
          stroke={stroke}
          style={{ transition: 'all 1s' }}
        />
      </g>
    </svg>
  );
}

SvgCommand.propTypes = {
  isActive: PropTypes.bool
};
