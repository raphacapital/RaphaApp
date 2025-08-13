import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../constants/theme';

interface ContinueButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

/**
 * Continue Button component - reusable button for onboarding screens
 */
const ContinueButton: React.FC<ContinueButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false,
  style 
}) => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.buttonBackground,
        },
        disabled && styles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.buttonText,
        {
          color: colors.buttonText,
        },
        disabled && styles.buttonTextDisabled
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md, // 18px padding each side
    paddingHorizontal: SPACING.md, // 18px padding each side
    borderRadius: 999, // Fully rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54, // Text height + 18px padding each side
    width: '100%', // Fill container width
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...getTypography('largeText', 'medium'), // 18px font size with medium weight
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
});

export default ContinueButton;
