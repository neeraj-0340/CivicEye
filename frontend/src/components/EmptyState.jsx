import React from 'react';
import { FiInbox } from 'react-icons/fi';

/**
 * EmptyState — shown when a list or section has no data.
 * @param {string} [title]
 * @param {string} [description]
 * @param {ReactNode} [icon]
 * @param {ReactNode} [action] - optional button/link
 */
const EmptyState = ({
  title = 'No data found',
  description = '',
  icon: Icon = FiInbox,
  action,
}) => (
  <div className="empty-state">
    <Icon size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 4 }}>{title}</p>
    {description && (
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4 }}>{description}</p>
    )}
    {action && <div style={{ marginTop: '1.25rem' }}>{action}</div>}
  </div>
);

export default EmptyState;
