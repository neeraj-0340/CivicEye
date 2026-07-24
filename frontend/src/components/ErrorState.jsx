import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * ErrorState — shown when an API call fails.
 * @param {string} [message]
 * @param {function} [onRetry] - optional retry callback
 */
const ErrorState = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => (
  <div className="empty-state">
    <FiAlertTriangle size={48} color="#dc2626" style={{ marginBottom: '1rem', opacity: 0.7 }} />
    <p style={{ fontWeight: 600, fontSize: '1rem', color: '#b91c1c', marginBottom: 4 }}>Error Loading Data</p>
    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 4 }}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn btn-primary btn-sm"
        style={{ marginTop: '1.25rem' }}
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
