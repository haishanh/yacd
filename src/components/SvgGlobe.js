import React from 'react';
import PropTypes from 'prop-types';

export default function SvgGlobe({ isActive }) {
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
        <circle
          cx="10"
          cy="10"
          r="10"
          transform="translate(2 6)"
          fill="#FFCB33"
          stroke="#FFCB33"
          style={{
            transition: 'all 1s',
            opacity: isActive ? '1' : '0'
          }}
        />
        <g
          transform="translate(4 4)"
          stroke={stroke}
          style={{ transition: 'all 1s' }}
        >
          <circle cx="10" cy="10" r="10" />
          <path d="M0 10h20M10 0a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </g>
      </g>
    </svg>
  );
}

SvgGlobe.propTypes = {
  isActive: PropTypes.bool
};
