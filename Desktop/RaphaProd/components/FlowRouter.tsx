import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../constants/theme';

/**
 * FlowRouter - Handles all routing logic based on user flow completion status
 * Implements the exact routing flow from the flowchart
 */
export default function FlowRouter() {
  const router = useRouter();
  const { user, isAuthenticated, userFlowState } = useAuth();
  const { theme } = useTheme();
  const colors = getColors(theme);

  useEffect(() => {
    console.log('🔀 FlowRouter: Evaluating routing logic...', {
      isAuthenticated,
      hasUser: !!user,
      flowState: userFlowState,
      hasCompletedOnboarding: userFlowState.hasCompletedOnboarding,
      hasPaidThroughSuperwall: userFlowState.hasPaidThroughSuperwall
    });

    // If not authenticated, go to splash screen
    if (!isAuthenticated || !user) {
      console.log('❌ FlowRouter: User not authenticated, going to splash screen');
      router.replace('/splashscreen');
      return;
    }

    // User is authenticated, take them to dashboard
    console.log('✅ FlowRouter: User authenticated, going to dashboard');
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
