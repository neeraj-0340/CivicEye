import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ThemeToggle Component
 * Renders a moon icon in Light Mode and a sun icon in Dark Mode.
 * Smooth transition animation and full accessibility.
 */
const ThemeToggle = ({ className = '', style = {} }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`theme-toggle-btn ${className}`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        color: isDark ? '#f59e0b' : '#4b5563',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: 'var(--shadow-sm)',
        outline: 'none',
        flexShrink: 0,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.backgroundColor = 'var(--card-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = 'var(--card)';
      }}
    >
      {isDark ? (
        <FiSun size={18} style={{ transition: 'transform 0.3s ease' }} />
      ) : (
        <FiMoon size={18} style={{ transition: 'transform 0.3s ease' }} />
      )}
    </button>
  );
};

export default ThemeToggle;
