'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Update resolved theme when theme changes or system preference changes
  useEffect(() => {
    const updateResolvedTheme = () => {
      let newResolvedTheme: 'light' | 'dark';

      if (theme === 'system') {
        newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
      } else {
        newResolvedTheme = theme;
      }

      setResolvedTheme(newResolvedTheme);

      // Update document class
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);

      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          newResolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
        );
      }
    };

    updateResolvedTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleSetTheme, resolvedTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme initialization script to prevent flash of unstyled content
export const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var resolvedTheme = theme === 'system' || !theme ? systemTheme : theme;
      
      document.documentElement.classList.add(resolvedTheme);
      document.documentElement.style.colorScheme = resolvedTheme;
      
      // Set initial meta theme-color
      var metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#1f2937' : '#ffffff');
      }
    } catch (e) {
      console.error('Theme initialization error:', e);
    }
  })();
`;
