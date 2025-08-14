import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import { SymbolView } from 'expo-symbols';

/**
 * Onboarding Screen 12 - Thank you screen
 */
export default function OnboardingScreen12() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const colors = getColors(theme);

  // Progress calculation - this is the final screen
  const currentScreen = 12;
  const totalScreens = 12;
  const progressPercentage = (currentScreen / totalScreens) * 100;

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleContinue = () => {
    // Navigate to auth screen with all onboarding data
    router.push({
      pathname: '/auth',
      params: {
        gender: params.gender,
        birthday: params.birthday,
        devotional_experience: params.devotional_experience,
        spiritual_journey: params.spiritual_journey,
        life_challenges: params.life_challenges,
        emotional_state: params.emotional_state,
        preferred_themes: params.preferred_themes,
        devotional_goals: params.devotional_goals,
        style_reverent_conversational: params.style_reverent_conversational,
        style_comforting_challenging: params.style_comforting_challenging,
        style_poetic_practical: params.style_poetic_practical,
        style_traditional_modern: params.style_traditional_modern,
        preferred_time: params.preferred_time,
        devotional_times: params.devotional_times,
        additional_notes: params.additional_notes,
      }
    });
  };

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
            onPress={() => router.back()}
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

          {/* Skip Button - Hidden by default */}
          <TouchableOpacity
            style={[styles.skipButton, { backgroundColor: colors.grey, opacity: 0 }]}
            activeOpacity={0.8}
            onPress={() => router.push('/dashboard')}
          >
            <Text style={[styles.skipButtonText, { color: colors.textPrimary }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, { color: colors.textPrimary }]}>
              Thank you for{'\n'}choosing Rapha.
            </Text>
          </View>
        </View>

        {/* SF Symbol and Box Container - positioned above continue button */}
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
              <Text style={[styles.privacyText, { color: colors.textPrimary }]}>
                Your privacy and security matter to us.{'\n'}
                We promise to keep your information private and secure.
              </Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <ContinueButton
            title="Continue"
            onPress={handleContinue}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
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
  headerContainer: {
    marginTop: SPACING.xl, // 36px below top content
    alignItems: 'center',
  },
  symbolAndBoxContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg, // 24px above continue button
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
  box: {
    height: 126,
    width: '100%',
    borderRadius: 10,
    position: 'relative',
  },
  privacyTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  privacyText: {
    fontSize: 18,
    lineHeight: 18, // 100% line height
    fontFamily: 'NeueHaasDisplayMediu', // Medium weight
    textAlign: 'center',
  },
  headerText: {
    ...getTypography('h1', 'medium'),
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 'auto', // Push button to bottom of content container
    alignItems: 'center',
    width: '100%',
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
