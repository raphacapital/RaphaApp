import { Theme } from '../contexts/ThemeContext';

export const FONTS = {
  // Neue Haas Display font family
  regular: 'NeueHaasDisplayRoman',
  medium: 'NeueHaasDisplayMediu', // This replaces semibold
  bold: 'NeueHaasDisplayBold',
  light: 'NeueHaasDisplayLight',
  thin: 'NeueHaasDisplayThin',
};

export const TYPOGRAPHY = {
  // Font sizes with line heights
  h1: {
    fontSize: 32,
    lineHeight: 35.2, // 110% of 32
    letterSpacing: 0,
  },
  h2: {
    fontSize: 24,
    lineHeight: 28.8, // 120% of 24
    letterSpacing: 0,
  },
  h3: {
    fontSize: 20,
    lineHeight: 24, // 120% of 20
    letterSpacing: 0,
  },
  largeText: {
    fontSize: 18,
    lineHeight: 23.4, // 130% of 18
    letterSpacing: 0,
  },
  text: {
    fontSize: 16,
    lineHeight: 20.8, // 130% of 16
    letterSpacing: 0,
  },
  smallText: {
    fontSize: 12,
    lineHeight: 15.6, // 130% of 12
    letterSpacing: 0,
  },
  tinyText: {
    fontSize: 8,
    lineHeight: 10.4, // 130% of 8
    letterSpacing: 0,
  },

  // Font weights using Neue Haas Display
  regular: {
    fontFamily: FONTS.regular,
  },
  medium: {
    fontFamily: FONTS.medium, // Replaces semibold
  },
  bold: {
    fontFamily: FONTS.bold,
  },
  light: {
    fontFamily: FONTS.light,
  },
  thin: {
    fontFamily: FONTS.thin,
  },
};

export const SPACING = {
  xs: 6,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 36,
  xxl: 48,
  xxxl: 60,
  xxxxl: 72,
};

export const LIGHT_COLORS = {
  // Primary colors
  primary: '#0000ff',
  secondary: '#000000',
  background: '#ffffff',
  
  // UI colors
  grey: '#f6f6f6',
  lightGrey: '#f5f5f5',
  darkGrey: '#666666',
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textLight: '#ffffff',
  
  // Button colors
  buttonBackground: '#000000',
  buttonText: '#ffffff',
  
  // Status colors
  success: '#00ff77',
  error: '#ff0000',
  warning: '#ffaa00',
};

export const DARK_COLORS = {
  // Primary colors
  primary: '#0000ff',
  secondary: '#ffffff',
  background: '#181818',
  
  // UI colors
  grey: '#303030',
  lightGrey: '#404040',
  darkGrey: '#666666',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#cccccc',
  textLight: '#ffffff',
  
  // Button colors
  buttonBackground: '#ffffff',
  buttonText: '#000000',
  
  // Status colors
  success: '#00ff77',
  error: '#ff0000',
  warning: '#ffaa00',
};

export const getColors = (theme: Theme) => {
  return theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
};

export const getTypography = (size: keyof typeof TYPOGRAPHY, weight: 'regular' | 'medium' | 'bold' | 'light' | 'thin' = 'regular') => {
  return {
    ...TYPOGRAPHY[size],
    ...TYPOGRAPHY[weight],
  };
};
