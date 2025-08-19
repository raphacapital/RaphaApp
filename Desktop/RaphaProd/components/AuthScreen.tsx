import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { SymbolView } from 'expo-symbols';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../services/supabase';
import CTAButton from './CTAButton';
import { useTheme } from '../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../constants/theme';

/**
 * Props for the AuthScreen component
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

/**
 * AuthScreen component for Apple Sign In
 * Saves onboarding data to the database upon successful authentication
 */
const AuthScreen: React.FC<AuthScreenProps> = ({ 
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

  /**
   * Handle manual sign in (fallback)
   */
  const handleManualSignIn = () => {
    // For now, just show a message about Apple Sign In being required
    Alert.alert(
      'Apple Sign In Required',
      'Please use Apple Sign In to continue. This ensures a secure and seamless experience.',
      [{ text: 'OK' }]
    );
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
        {/* Top Navigation Bar - Visible with back button and progress bar */}
        <View style={styles.topBar}>
          {/* Back Button - Visible */}
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.grey }]}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.textPrimary }]}>←</Text>
          </TouchableOpacity>

          {/* Progress Bar Container - Visible */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.grey }]}>
              <View style={[styles.progressFill, { 
                backgroundColor: colors.buttonBackground,
                width: '100%'
              }]} />
            </View>
          </View>

          {/* Skip Button - Hidden */}
          <TouchableOpacity
            style={[styles.skipButton, { backgroundColor: colors.grey, opacity: 0 }]}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Text style={[styles.skipButtonText, { color: colors.textPrimary }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>Sign up to complete{'\n'}your profile.</Text>
          </View>

        </View>

        {/* SF Symbol and Box Container - positioned above Apple Sign In button */}
        <View style={styles.symbolAndBoxContainer}>
          {/* Box */}
          <View style={[styles.box, { backgroundColor: colors.grey }]}>
            {/* SF Symbol - positioned at top of box */}
            <View style={styles.symbolOverlay}>
              <SymbolView 
                name="shield.pattern.checkered" 
                style={styles.symbol} 
                size={36}
                tintColor={colors.textPrimary}
              />
            </View>
            
            {/* Privacy Text */}
            <View style={styles.privacyTextContainer}>
              <Text style={[styles.boxPrivacyText, { color: colors.textPrimary }]}>
                Your privacy and security matter to us.{'\n'}
                We promise to keep your information private and secure.
              </Text>
            </View>
          </View>
        </View>

        {/* Apple Sign In Button */}
        <View style={styles.buttonContainer}>
          {isAppleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
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
    marginTop: SPACING.xl, // 36px below top content (same as onboarding screens)
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
    marginTop: 'auto', // Push button to bottom of content container (same as onboarding12)
    width: '100%',
  },
  appleButton: {
    width: '100%',
    height: 54,
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

  symbolAndBoxContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg, // 24px above Apple Sign In button (same as onboarding12)
    width: '100%',
  },
  box: {
    height: 126,
    width: '100%',
    borderRadius: 10,
    position: 'relative',
  },
  symbolOverlay: {
    position: 'absolute',
    top: -18, // Position symbol so it's flush with top edge of box (36/2 = 18)
    left: '50%',
    marginLeft: -18, // Half of symbol width (36/2)
    zIndex: 10,
  },
  symbol: {
    height: 36,
    width: 36,
  },
  privacyTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  boxPrivacyText: {
    fontSize: 18,
    lineHeight: 18, // 100% line height
    fontFamily: 'NeueHaasDisplayMediu', // Medium weight
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: '#007AFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    width: 64,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    lineHeight: 20.8,
    letterSpacing: 0,
    fontFamily: 'NeueHaasDisplay-Medium',
    fontWeight: '600',
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
});

export default AuthScreen;
