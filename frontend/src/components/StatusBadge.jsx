import React from 'react';

/**
 * Returns the CSS class name for a status badge based on the status string.
 */
export function getStatusClass(status = '') {
  switch (status.toLowerCase()) {
    case 'pending': return 'badge badge-pending';
    case 'in progress': return 'badge badge-in-progress';
    case 'resolved':
    case 'accepted': return 'badge badge-resolved';
    case 'rejected': return 'badge badge-rejected';
    default: return 'badge';
  }
}

/**
 * StatusBadge — displays a coloured pill for any status value.
 * @param {string} status
 */
const StatusBadge = ({ status = '' }) => (
  <span className={getStatusClass(status)}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default StatusBadge;
