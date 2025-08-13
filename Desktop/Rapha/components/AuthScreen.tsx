import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../services/supabase';
import CTAButton from './CTAButton';

/**
 * Props for the AuthScreen component
 */
interface AuthScreenProps {
  /**
   * Onboarding data collected from the user (optional for sign in flow)
   */
  onboardingData?: Partial<UserProfile>;
  
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
        if (result.isNewUser) {
          // New user - redirect to onboarding
          console.log('🆕 AuthScreen: New user detected, redirecting to onboarding');
          router.replace('/onboarding/onboarding1');
        } else {
          // Existing user - mark onboarding complete and go to dashboard
          console.log('👤 AuthScreen: Existing user, marking onboarding complete');
          markOnboardingComplete();
          onAuthSuccess({ success: true });
          router.replace('/');
        }
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
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Sign in to save your preferences and start your spiritual journey
        </Text>

        {/* Apple Sign In Button */}
        {isAppleAvailable && (
          <View style={styles.buttonContainer}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={8}
              style={styles.appleButton}
              onPress={handleAppleSignIn}
            />
          </View>
        )}

        {/* Loading State */}
        {showLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Signing you in...</Text>
          </View>
        )}

        {/* Fallback Options */}
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>Or</Text>
          <CTAButton
            title="Sign In with Email"
            onPress={handleManualSignIn}
            style={styles.fallbackButton}
          />
        </View>

        {/* Privacy Notice */}
        <Text style={styles.privacyText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 32,
  },
  appleButton: {
    width: '100%',
    height: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  fallbackContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  fallbackText: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 16,
  },
  fallbackButton: {
    width: '100%',
  },
  privacyText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
});

export default AuthScreen;
