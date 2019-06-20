import React from 'react';

export default function SvgGlobe() {
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
        <g transform="translate(4 4)" stroke="currentColor">
          <circle cx="10" cy="10" r="10" />
          <path d="M0 10h20M10 0a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </g>
      </g>
    </svg>
  );
}
