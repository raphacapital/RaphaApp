import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../services/supabase';
import CTAButton from './CTAButton';
import { useTheme } from '../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../constants/theme';

/**
 * Props for the SignInScreen component
 */
interface SignInScreenProps {
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

/**
 * SignInScreen component for Apple Sign In
 * Saves onboarding data to the database upon successful authentication
 */
const SignInScreen: React.FC<SignInScreenProps> = ({ 
  onboardingData, 
  onAuthSuccess, 
  onAuthError 
}) => {
  const { signInWithApple, isLoading: authLoading, markOnboardingComplete } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState<boolean | null>(null);

  /**
   * Check if Apple Sign In is available on this device
   */
  useEffect(() => {
    const checkAppleAvailability = async () => {
      try {
        const available = await AppleAuthentication.isAvailableAsync();
        setIsAppleAvailable(available);
      } catch (error) {
        console.error('Error checking Apple Sign In availability:', error);
        setIsAppleAvailable(false);
      }
    };

    checkAppleAvailability();
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

    setIsLoading(true);

    try {
      // Attempt Apple Sign In with onboarding data
      const result = await signInWithApple(onboardingData);

      if (result.error) {
        onAuthError(result.error);
      } else if (result.success) {
        // Mark onboarding as complete after successful authentication
        markOnboardingComplete();
        
        // Get the user from the auth context
        onAuthSuccess({ success: true });
        
        // After successful sign in, navigate to root to trigger FlowRouter
        // The FlowRouter will determine the next step based on completion status
        router.replace('/');
      }
    } catch (error: any) {
      console.error('Apple Sign In error:', error);
      onAuthError('An unexpected error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking Apple availability
  if (isAppleAvailable === null) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Checking availability...</Text>
        </View>
      </View>
    );
  }

  const showLoading = isLoading || authLoading;

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
        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>Welcome Back</Text>
            <Text style={[styles.descriptionText, { color: theme === 'dark' ? 'white' : 'black' }]}>Sign in to continue your spiritual journey</Text>
          </View>

          {/* Loading State */}
          {showLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.darkGrey }]}>Signing you in...</Text>
            </View>
          )}
        </View>

        {/* Apple Sign In Button */}
        <View style={styles.buttonContainer}>
          {isAppleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={theme === 'dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={8}
              style={styles.appleButton}
              onPress={handleAppleSignIn}
            />
          )}
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyContainer}>
          <Text style={[styles.privacyText, { color: theme === 'dark' ? 'white' : 'black' }]}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
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
  mainContentContainer: {
    flex: 1,
  },
  questionContainer: {
    marginTop: SPACING.xxl, // 48px below top content since no top bar
    alignItems: 'center',
  },
  questionText: {
    ...getTypography('h1', 'medium'),
    textAlign: 'center',
  },
  descriptionText: {
    ...getTypography('text', 'regular'),
    textAlign: 'center',
    marginTop: SPACING.sm,
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
    height: 54,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.sm,
    ...getTypography('text', 'regular'),
  },
  privacyContainer: {
    alignItems: 'center',
    marginTop: 12, // 12px below the button
    width: '100%',
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 15.6,
    letterSpacing: 0,
    fontFamily: 'NeueHaasDisplayRoman',
    textAlign: 'center',
    maxWidth: 400,
  },
});

export default SignInScreen;
