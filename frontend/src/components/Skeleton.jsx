import React from 'react';

/**
 * Skeleton — an animated placeholder for loading states.
 * @param {string} [width] - CSS width (default: '100%')
 * @param {string} [height] - CSS height (default: '1rem')
 * @param {string} [borderRadius] - CSS border-radius
 * @param {string} [className] - extra class names
 */
const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius,
  className = '',
  style = {},
}) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius, ...style }}
    aria-hidden="true"
  />
);

/** Pre-built skeleton for a table row with n columns */
export const SkeletonTableRow = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding: '0.75rem 1rem' }}>
        <Skeleton height="0.875rem" width={i === 0 ? '60%' : '80%'} />
      </td>
    ))}
  </tr>
);

/** Pre-built skeleton for a stat card */
export const SkeletonStatCard = () => (
  <div className="stat-card">
    <Skeleton width="52px" height="52px" borderRadius="0.75rem" />
    <div style={{ flex: 1 }}>
      <Skeleton height="0.75rem" width="60%" style={{ marginBottom: '0.5rem' }} />
      <Skeleton height="1.5rem" width="40%" />
    </div>
  </div>
);

export default Skeleton;
