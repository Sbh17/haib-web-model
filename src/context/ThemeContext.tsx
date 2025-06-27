
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if theme is stored in localStorage first
    const savedTheme = localStorage.getItem('beauty-theme') as Theme | null;
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Use system preference as fallback
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setThemeState(systemTheme);
      applyTheme(systemTheme);
      localStorage.setItem('beauty-theme', systemTheme);
    }
    
    setIsInitialized(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(newTheme);
    
    // Set data attribute for additional styling if needed
    root.setAttribute('data-theme', newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('beauty-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Don't render children until theme is initialized to prevent flash
  if (!isInitialized) {
    return <div className="loading-theme">Loading...</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
