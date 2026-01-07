'use client';

import React from 'react';

interface TreeLogoProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  className?: string;
}

/**
 * KitaWorksHub Logo - Bold "K" Monogram
 * Clean, geometric, memorable
 * No flourishes, no clipart - pure form
 */
export const TreeLogo: React.FC<TreeLogoProps> = ({
  size = 48,
  className = "",
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Bold geometric K - the vertical */}
      <rect x="10" y="6" width="8" height="36" rx="2" fill="currentColor" />

      {/* K upper diagonal - clean angle */}
      <polygon
        points="18,24 38,6 38,16 24,28"
        fill="currentColor"
      />

      {/* K lower diagonal - clean angle */}
      <polygon
        points="18,24 24,20 38,42 28,42"
        fill="currentColor"
      />
    </svg>
  );
};

export default TreeLogo;
