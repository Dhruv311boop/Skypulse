import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme) {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyThemeToDOM(resolved) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
}

function getNextTheme(current) {
  if (current === 'light') return 'dark';
  if (current === 'dark') return 'system';
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('weather-theme') || 'system';
    } catch (err) {
      console.warn('Failed to read theme from localStorage:', err);
      return 'system';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(theme));

  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
    try {
      localStorage.setItem('weather-theme', theme);
    } catch (err) {
      console.warn('Failed to persist theme:', err);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const resolved = mq.matches ? 'dark' : 'light';
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(current => getNextTheme(current));
  }, []);

  const value = useMemo(() => ({
    theme, resolvedTheme, setTheme, toggleTheme,
  }), [theme, resolvedTheme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
