/**
 * Design System Constants for Rapha App
 * Typography and spacing guidelines
 */

export const TYPOGRAPHY = {
  // Font sizes with line heights
  h1: {
    fontSize: 32,
    lineHeight: 35.2, // 110% of 32
    letterSpacing: -0.64, // -2% of 32
  },
  h2: {
    fontSize: 24,
    lineHeight: 28.8, // 120% of 24
    letterSpacing: -0.48, // -2% of 24
  },
  h3: {
    fontSize: 20,
    lineHeight: 24, // 120% of 20
    letterSpacing: -0.4, // -2% of 20
  },
  largeText: {
    fontSize: 18,
    lineHeight: 23.4, // 130% of 18
    letterSpacing: -0.36, // -2% of 18
  },
  text: {
    fontSize: 16,
    lineHeight: 20.8, // 130% of 16
    letterSpacing: -0.32, // -2% of 16
  },
  smallText: {
    fontSize: 12,
    lineHeight: 15.6, // 130% of 12
    letterSpacing: -0.24, // -2% of 12
  },
  tinyText: {
    fontSize: 8,
    lineHeight: 10.4, // 130% of 8
    letterSpacing: -0.16, // -2% of 8
  },

  // Font weights
  regular: {
    fontWeight: '400' as const,
  },
  semibold: {
    fontWeight: '600' as const,
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

export const COLORS = {
  // Primary colors
  primary: '#0000ff', // Color from splash screen
  secondary: '#000000', // Black
  background: '#ffffff', // White background
  
  // UI colors
  lightGray: '#F5F5F5',
  darkGray: '#666666',
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textLight: '#ffffff',
  
  // Status colors
  success: '#00ff77',
  error: '#ff0000',
  warning: '#ffaa00',
};

/**
 * Helper function to combine typography styles
 * @param size - Typography size (e.g., 'h1', 'text')
 * @param weight - Font weight ('regular' or 'semibold')
 * @returns Combined typography styles
 */
export const getTypography = (size: keyof typeof TYPOGRAPHY, weight: 'regular' | 'semibold' = 'regular') => {
  return {
    ...TYPOGRAPHY[size],
    ...TYPOGRAPHY[weight],
  };
}; 