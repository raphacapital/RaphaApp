import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../constants/theme';

interface CTAButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

/**
 * Reusable CTA Button component with consistent styling
 */
const CTAButton: React.FC<CTAButtonProps> = ({
  title,
  onPress,
  style,
  disabled = false,
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
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.buttonText,
        {
          color: colors.buttonText,
        },
        disabled && styles.disabledText,
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
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    ...getTypography('largeText', 'medium'), // 18px font size with medium weight
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default CTAButton; 