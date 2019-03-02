import React from 'react';
import PropTypes from 'prop-types';

export default function SvgFile({ isActive }) {
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
          d="M13 6H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V12l-6-6z"
          fill="#F29632"
          stroke="#F29632"
          style={{
            transition: 'all 1s',
            opacity: isActive ? '1' : '0'
          }}
        />
        <g stroke={stroke} style={{ transition: 'all 1s' }}>
          <path d="M16 4H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10l-6-6z" />
          <path d="M16 4v6h6M18 15h-8M18 19h-8M12 11h-2" />
        </g>
      </g>
    </svg>
  );
}

SvgFile.propTypes = {
  isActive: PropTypes.bool
};
