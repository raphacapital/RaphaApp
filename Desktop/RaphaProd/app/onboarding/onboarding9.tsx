import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import CustomStyleSlider from '../../components/CustomStyleSlider';

/**
 * Onboarding Screen 9 - Devotional style preferences with sliders
 */
export default function OnboardingScreen9() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
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
  });

  // Tone preferences state - using correct database column names
  const [tonePreferences, setTonePreferences] = useState({
    style_reverent_conversational: 0.5, // 50% = 0.5
    style_comforting_challenging: 0.5,  // 50% = 0.5
    style_poetic_practical: 0.5,        // 50% = 0.5
    style_traditional_modern: 0.5,       // 50% = 0.5
  });

  // Progress calculation - start from where onboarding8 finished (66.67% of 12 screens)
  const currentScreen = 9;
  const totalScreens = 12;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 66.67; // onboarding8 finished at 66.67% (8/12)

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount - start from 88.89% and animate to 100%
  useEffect(() => {
    // Set initial value to 88.89%
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
    console.log('tonePreferences:', tonePreferences);

    // Flatten tone preferences to match database schema
    const flattenedTonePreferences = {
      style_reverent_conversational: Math.round(tonePreferences.style_reverent_conversational * 100),
      style_comforting_challenging: Math.round(tonePreferences.style_comforting_challenging * 100),
      style_poetic_practical: Math.round(tonePreferences.style_poetic_practical * 100),
      style_traditional_modern: Math.round(tonePreferences.style_traditional_modern * 100),
    };

    // Navigate to onboarding10 with all onboarding data
    const finalOnboardingData = {
      ...onboardingData,
      ...flattenedTonePreferences,
    };

    router.push({
      pathname: '/onboarding/onboarding10',
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
      },
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

          {/* Empty space for balance (no skip button) */}
          <View style={styles.placeholderButton} />
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>
              How would you like your devotionals?
            </Text>
          </View>

          {/* Sliders */}
          <View style={styles.slidersContainer}>
            {/* Slider 1: Reverent — Conversational */}
            <CustomStyleSlider
              leftStyle="Reverent"
              rightStyle="Conversational"
              value={tonePreferences.style_reverent_conversational}
              onValueChange={(value) => setTonePreferences(prev => ({
                ...prev,
                style_reverent_conversational: value
              }))}
              colors={colors}
            />
            
            {/* Slider 2: Comforting — Challenging */}
            <CustomStyleSlider
              leftStyle="Comforting"
              rightStyle="Challenging"
              value={tonePreferences.style_comforting_challenging}
              onValueChange={(value) => setTonePreferences(prev => ({
                ...prev,
                style_comforting_challenging: value
              }))}
              colors={colors}
            />
            
            {/* Slider 3: Poetic — Practical */}
            <CustomStyleSlider
              leftStyle="Poetic"
              rightStyle="Practical"
              value={tonePreferences.style_poetic_practical}
              onValueChange={(value) => setTonePreferences(prev => ({
                ...prev,
                style_poetic_practical: value
              }))}
              colors={colors}
            />
            
            {/* Slider 4: Traditional — Modern */}
            <CustomStyleSlider
              leftStyle="Traditional"
              rightStyle="Modern"
              value={tonePreferences.style_traditional_modern}
              onValueChange={(value) => setTonePreferences(prev => ({
                ...prev,
                style_traditional_modern: value
              }))}
              colors={colors}
            />
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <ContinueButton
            title="Continue"
            onPress={handleContinue}
            disabled={false}
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
  slidersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm, // 12px spacing between sliders
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
