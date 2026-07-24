import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiBarChart2, FiAlertCircle, FiUsers, FiMessageSquare, FiLogOut } from 'react-icons/fi';
import logo from '../assets/celogofull.png';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/overview', label: 'Overview', Icon: FiBarChart2 },
  { to: '/complaintmanagement', label: 'Complaints', Icon: FiAlertCircle },
  { to: '/usermanagement', label: 'Users', Icon: FiUsers },
  { to: '/feedbackmanagement', label: 'Feedback', Icon: FiMessageSquare },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const adminName = localStorage.getItem('name') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      {/* Logo & Theme Toggle */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <img src={logo} alt="CivicEye" style={{ height: 36 }} />
        <ThemeToggle />
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {NAV_ITEMS.map(({ to, label, Icon }) => {
          const active = pathname === to || pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: active ? 'var(--color-primary-subtle)' : 'transparent',
                  borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: active ? 'var(--color-primary)' : 'var(--color-gray-600)',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.backgroundColor = 'var(--color-gray-100)';
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={18} />
                <span className="sidebar-label">{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer: user info + logout */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', overflow: 'hidden' }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.9rem',
            flexShrink: 0,
          }}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          <span className="sidebar-label" style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {adminName}
          </span>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '0.375rem',
            borderRadius: '0.375rem',
            transition: 'color 0.15s ease',
            display: 'flex',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
