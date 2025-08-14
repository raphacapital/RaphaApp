import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../constants/theme';

/**
 * Post-authentication route that handles routing for authenticated users
 * This route is only accessible after successful authentication
 */
export default function PostAuthRoute() {
  const router = useRouter();
  const { user, isAuthenticated, userFlowState } = useAuth();
  const { theme } = useTheme();
  const colors = getColors(theme);

  useEffect(() => {
    console.log('🔀 PostAuth: Evaluating routing logic...', {
      isAuthenticated,
      hasUser: !!user,
      flowState: userFlowState,
      hasCompletedOnboarding: userFlowState.hasCompletedOnboarding,
    });

    // If not authenticated, go to splash screen
    if (!isAuthenticated || !user) {
      console.log('❌ PostAuth: User not authenticated, going to splash screen');
      router.replace('/splashscreen');
      return;
    }

    // User is authenticated, check if they need to complete onboarding
    if (!userFlowState.hasCompletedOnboarding) {
      console.log('🆕 PostAuth: User needs to complete onboarding, going to onboarding');
      router.replace('/onboarding/onboarding1');
      return;
    }

    // User is authenticated and has completed onboarding, take them to dashboard
    console.log('✅ PostAuth: User authenticated and onboarding complete, going to dashboard');
    router.replace('/dashboard');
  }, [isAuthenticated, user, userFlowState, router]);

  // Show loading while routing
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
