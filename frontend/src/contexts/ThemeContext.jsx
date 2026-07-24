import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'civiceye_theme';

export const ThemeProvider = ({ children }) => {
  // 1. Get initial theme (localStorage -> system preference -> light)
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn('ThemeContext: Could not access localStorage', e);
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // 2. Apply theme to <html> document attribute whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('ThemeContext: Could not write to localStorage', e);
    }
  }, [theme]);

  // 3. Listen to system preference changes if user hasn't set an explicit preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // 4. Toggle theme function
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
