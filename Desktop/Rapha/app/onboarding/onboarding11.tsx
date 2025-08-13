import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';

/**
 * Onboarding Screen 11 - Additional notes text input screen
 */
export default function OnboardingScreen11() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const { markOnboardingComplete } = useAuth();
  const colors = getColors(theme);

  // Get onboarding data from previous screens
  const gender = params.gender as string;
  const birthday = params.birthday as string;
  const devotionalExperience = params.devotional_experience as string;
  const spiritualJourney = params.spiritual_journey as string;
  const lifeChallenges = params.life_challenges as string;
  const emotionalState = params.emotional_state as string;
  const preferredThemes = params.preferred_themes as string;
  const devotionalGoals = params.devotional_goals as string;
  const styleReverentConversational = params.style_reverent_conversational as string;
  const styleComfortingChallenging = params.style_comforting_challenging as string;
  const stylePoeticPractical = params.style_poetic_practical as string;
  const styleTraditionalModern = params.style_traditional_modern as string;
  const preferredTime = params.preferred_time as string;

  // State to track onboarding data
  const [onboardingData, setOnboardingData] = useState({
    gender,
    birthday,
    devotional_experience: devotionalExperience,
    spiritual_journey: spiritualJourney,
    life_challenges: lifeChallenges ? JSON.parse(lifeChallenges) : [],
    current_emotional_state: emotionalState ? JSON.parse(emotionalState) : [],
    preferred_themes: preferredThemes ? JSON.parse(preferredThemes) : [],
    devotional_goals: devotionalGoals ? JSON.parse(devotionalGoals) : [],
    style_reverent_conversational: styleReverentConversational ? parseInt(styleReverentConversational) : 50,
    style_comforting_challenging: styleComfortingChallenging ? parseInt(styleComfortingChallenging) : 50,
    style_poetic_practical: stylePoeticPractical ? parseInt(stylePoeticPractical) : 50,
    style_traditional_modern: styleTraditionalModern ? parseInt(styleTraditionalModern) : 50,
    preferred_time: preferredTime ? JSON.parse(preferredTime) : [],
    additional_notes: '',
  });

  // Additional notes state
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Progress calculation - start from where onboarding10 finished (100% of 11 screens)
  const currentScreen = 11;
  const totalScreens = 11;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 90.91; // onboarding10 finished at 90.91% of total 11 screens

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount - start from 90.91% and animate to 100%
  useEffect(() => {
    // Set initial value to 90.91%
    progressAnimation.setValue(startingProgress);
    
    // Animate to 100%
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleContinue = () => {
    console.log('Continue button pressed');
    console.log('onboardingData:', onboardingData);
    console.log('additionalNotes:', additionalNotes);

    // Navigate to auth screen with all onboarding data
    const finalOnboardingData = {
      ...onboardingData,
      additional_notes: additionalNotes,
    };

    router.push({
      pathname: '/auth',
      params: {
        gender: finalOnboardingData.gender,
        birthday: finalOnboardingData.birthday,
        devotional_experience: finalOnboardingData.devotional_experience,
        spiritual_journey: finalOnboardingData.spiritual_journey,
        life_challenges: JSON.stringify(finalOnboardingData.life_challenges),
        emotional_state: JSON.stringify(finalOnboardingData.current_emotional_state),
        preferred_themes: JSON.stringify(finalOnboardingData.preferred_themes),
        devotional_goals: JSON.stringify(finalOnboardingData.devotional_goals),
        style_reverent_conversational: finalOnboardingData.style_reverent_conversational,
        style_comforting_challenging: finalOnboardingData.style_comforting_challenging,
        style_poetic_practical: finalOnboardingData.style_poetic_practical,
        style_traditional_modern: finalOnboardingData.style_traditional_modern,
        preferred_time: JSON.stringify(finalOnboardingData.preferred_time),
        additional_notes: finalOnboardingData.additional_notes,
      }
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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

            {/* Empty space for balance (no skip button) */}
            <View style={styles.placeholderButton} />
          </View>

          {/* Main Content Area */}
          <View style={styles.mainContentContainer}>
            {/* Question */}
            <View style={styles.questionContainer}>
              <Text style={[styles.questionText, { color: colors.textPrimary }]}>Anything else you'd like us to keep in mind?</Text>
            </View>

            {/* Text Input Area */}
            <View style={styles.answersContainer}>
              <View style={[styles.textInputContainer, { backgroundColor: colors.grey }]}>
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="Share any aa additional thoughts, preferences, or concerns..."
                  placeholderTextColor={colors.darkGrey}
                  value={additionalNotes}
                  onChangeText={setAdditionalNotes}
                  multiline
                  textAlignVertical="top"
                  numberOfLines={8}
                />
              </View>
            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <ContinueButton
                title="Continue"
                onPress={handleContinue}
                disabled={false} // Always enabled since notes are optional
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

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
  textInputContainer: {
    height: 222, // Fixed height of 222px as requested
    width: '100%', // Fill container width
    paddingHorizontal: SPACING.lg, // 18px padding
    paddingVertical: SPACING.md, // 18px vertical padding
    borderRadius: 10, // 10px corner radius (same as answer buttons)
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  textInput: {
    flex: 1,
    width: '100%',
    paddingTop: 6, // 6px from top
    paddingLeft: 6, // 6px from left
    ...getTypography('largeText', 'regular'),
    textAlignVertical: 'top',
    lineHeight: 21.6, // 120% of 18px font size (18 * 1.2 = 21.6)
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    width: '100%',
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
});
