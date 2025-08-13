import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getColors, SPACING, getTypography } from '../constants/theme';
import { UserProfile } from '../services/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';

/**
 * AuthScreen Component
 * Handles Apple Sign In and routes to dashboard
 */
interface AuthScreenProps {
  /**
   * Onboarding data collected from the user
   */
  onboardingData: Partial<UserProfile>;
  
  /**
   * Callback when authentication is successful
   */
  onAuthSuccess: (user: any) => void;
  
  /**
   * Callback when authentication fails
   */
  onAuthError: (error: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ 
  onboardingData, 
  onAuthSuccess, 
  onAuthError 
}) => {
  const { theme } = useTheme();
  const { signInWithApple } = useAuth();
  const router = useRouter();
  const colors = getColors(theme);
  const insets = useSafeAreaInsets();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState<boolean | null>(null);

  // Check Apple Sign In availability on component mount
  useEffect(() => {
    const checkAppleAvailability = async () => {
      try {
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        setIsAppleAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking Apple Sign In availability:', error);
        setIsAppleAvailable(false);
      }
    };

    checkAppleAvailability();
  }, []);

  // Progress bar animation
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressPercentage = 100; // Auth is the final step

  useEffect(() => {
    // Animate to 100%
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  /**
   * Handle Apple Sign In button press
   */
  const handleAppleSignIn = async () => {
    if (!isAppleAvailable) {
      Alert.alert(
        'Apple Sign In Not Available',
        'Apple Sign In is not available on this device. Please use a different sign-in method.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsLoading(true);
      console.log('🍎 Starting Apple Sign In...');
      
      // Attempt Apple Sign In with onboarding data
      const result = await signInWithApple(onboardingData);

      if (result.error) {
        console.error('❌ Apple Sign In failed:', result.error);
        onAuthError(result.error);
        return;
      }

      if (result.success) {
        console.log('✅ Apple Sign In successful, marking onboarding complete and navigating...');
        
        // Mark onboarding as complete after successful authentication
        markOnboardingComplete();
        
        // After successful sign in, user should go to paywall
        // The FlowRouter will handle the actual routing based on completion status
        router.replace('/');
      } else {
        console.error('❌ Apple Sign In returned no success');
        onAuthError('Authentication failed');
      }
    } catch (error: any) {
      console.error('🍎 Apple Sign In error:', error);
      onAuthError('An unexpected error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking Apple availability
  if (isAppleAvailable === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.buttonBackground} />
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Checking availability...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Content container with 36px vertical and 18px horizontal safe area margins */}
      <View style={[
        styles.contentContainer,
        {
          marginTop: insets.top + SPACING.xl,
          marginBottom: insets.bottom + SPACING.xl,
          marginHorizontal: SPACING.lg,
        }
      ]}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.grey }]}
            activeOpacity={0.8}
            onPress={() => {/* No back button on auth screen */}}
          >
            <Text style={[styles.backButtonText, { color: colors.textPrimary }]}>←</Text>
          </TouchableOpacity>

          {/* Progress Bar Container */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.grey }]}>
              <Animated.View style={[styles.progressFill, {
                backgroundColor: colors.buttonBackground,
                width: progressAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                })
              }]} />
            </View>
          </View>

          {/* Empty space for balance (no skip button) */}
          <View style={styles.placeholderButton} />
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>Sign Up To Create Your Profile</Text>
          </View>

          {/* Answers Container - empty for spacing */}
          <View style={styles.answersContainer}>
            {/* This container is just for spacing, no content */}
          </View>

          {/* Button Container - positioned at bottom like other onboarding screens */}
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.buttonBackground} />
            ) : (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={999}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  mainContentContainer: {
    flex: 1,
  },
  questionContainer: {
    marginTop: SPACING.xl, // 36px below top content
    alignItems: 'center',
  },
  questionText: {
    ...getTypography('h1', 'medium'),
    textAlign: 'center',
  },
  answersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    width: '100%',
  },
  appleButton: {
    width: '100%',
    height: 54, // Match ContinueButton height
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.sm,
    ...getTypography('largeText', 'regular'),
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderButton: {
    width: 64,
    height: 32,
  },
  backButtonText: {
    fontSize: 16,
    lineHeight: 20.8,
    letterSpacing: 0,
    fontFamily: 'System',
    fontWeight: '600',
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: SPACING.sm, // 12px on each side
    alignItems: 'center',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    width: '100%', // Use full width of container
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthScreen;
