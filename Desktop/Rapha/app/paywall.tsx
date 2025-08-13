import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getColors } from '../constants/theme';

/**
 * Paywall screen - displayed after onboarding completion
 * Users must subscribe to access the dashboard
 */
export default function Paywall() {
  const router = useRouter();
  const { theme } = useTheme();
  const { markPaymentComplete } = useAuth();
  const colors = getColors(theme);

  const handleSubscribe = async () => {
    // TODO: Implement actual subscription logic with Superwall
    console.log('💰 Paywall: User subscribed');
    
    // Mark payment as complete
    markPaymentComplete();
    
    // Navigate to dashboard
    router.replace('/dashboard');
  };

  const handleBackToOnboarding = () => {
    // Go back to onboarding
    router.replace('/onboarding/onboarding1');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Unlock Your Full Experience
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          You've completed onboarding! Subscribe to access all features.
        </Text>

        <View style={styles.featuresContainer}>
          <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
            What you'll get:
          </Text>
          <Text style={[styles.feature, { color: colors.textSecondary }]}>
            • Full dashboard access
          </Text>
          <Text style={[styles.feature, { color: colors.textSecondary }]}>
            • Premium content
          </Text>
          <Text style={[styles.feature, { color: colors.textSecondary }]}>
            • Advanced features
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: colors.buttonBackground }]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
        >
          <Text style={[styles.subscribeButtonText, { color: colors.buttonText }]}>
            Subscribe Now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToOnboarding}
          activeOpacity={0.6}
        >
          <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>
            Back to Onboarding
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
  },
  subscribeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
