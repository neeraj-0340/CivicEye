import React from 'react';

/**
 * StatCard — displays a single statistic with an icon.
 * @param {string} label
 * @param {number|string} value
 * @param {ReactNode} icon - react-icons component
 * @param {string} iconBg - background colour for icon container
 * @param {string} iconColor - icon colour
 * @param {string} [trend] - optional trend note
 */
const StatCard = React.memo(({ label, value, icon: Icon, iconBg, iconColor, trend }) => (
  <div className="stat-card">
    <div
      className="stat-card-icon"
      style={{ backgroundColor: iconBg || '#eff6ff' }}
    >
      {Icon && <Icon size={22} color={iconColor || '#2563eb'} />}
    </div>
    <div className="stat-card-content">
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">
        {value !== undefined && value !== null ? value : '—'}
      </p>
      {trend && (
        <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 2 }}>{trend}</p>
      )}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

export default StatCard;
