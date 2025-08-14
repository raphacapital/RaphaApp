import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../constants/theme';

/**
 * Root index component that redirects to splash screen
 * The splash screen handles the initial user choice (Get Started vs Sign In)
 */
export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);

  useEffect(() => {
    // Always start at splash screen when app opens
    router.replace('/splashscreen');
  }, [router]);

  // Show loading while redirecting
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.background, 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <ActivityIndicator size="large" color={colors.buttonBackground} />
    </View>
  );
} 