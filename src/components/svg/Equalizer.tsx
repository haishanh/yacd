import * as React from 'react';

type Props = {
  size?: number;
  color?: string;
};

export default function Equalizer({ color = 'currentColor', size = 24 }: Props) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6h9M18.5 6H22" />
      <circle cx="16" cy="6" r="2" />
      <path d="M22 18h-9M6 18H2" />
      <circle r="2" transform="matrix(-1 0 0 1 8 18)" />
    </svg>
  );
}
