import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiBarChart2, FiAlertCircle, FiUsers, FiMessageSquare, FiLogOut, FiMenu } from 'react-icons/fi';
import logo from '../assets/celogofull.png';

const NAV_ITEMS = [
  { to: '/overview', label: 'Overview', Icon: FiBarChart2 },
  { to: '/complaintmanagement', label: 'Complaints', Icon: FiAlertCircle },
  { to: '/usermanagement', label: 'Users', Icon: FiUsers },
  { to: '/feedbackmanagement', label: 'Feedback', Icon: FiMessageSquare },
];

export const AdminMobileHeader = ({ onToggleSidebar, title = 'Admin Panel' }) => {
  return (
    <div className="admin-mobile-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            minHeight: '44px',
            minWidth: '44px',
          }}
        >
          <FiMenu />
        </button>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          {title}
        </span>
      </div>
    </div>
  );
};

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const adminName = localStorage.getItem('name') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`admin-sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <div className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
        }}>
          <img src={logo} alt="CivicEye" style={{ height: 36 }} />
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {NAV_ITEMS.map(({ to, label, Icon }) => {
            const active = pathname === to || pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1.5rem',
                    minHeight: '48px',
                    backgroundColor: active ? 'var(--color-primary-subtle)' : 'transparent',
                    borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                    color: active ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.95rem',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={20} />
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
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
