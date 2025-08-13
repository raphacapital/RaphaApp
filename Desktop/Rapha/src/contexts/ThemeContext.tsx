import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme || 'light');

  useEffect(() => {
    setTheme(colorScheme || 'light');
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
