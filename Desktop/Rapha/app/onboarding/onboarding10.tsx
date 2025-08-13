import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';

/**
 * Onboarding Screen 10 - Devotional time preferences multi-select screen
 */
export default function OnboardingScreen10() {
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
  const styleReverentConversational = params.style_reverent_conversational as string;
  const styleComfortingChallenging = params.style_comforting_challenging as string;
  const stylePoeticPractical = params.style_poetic_practical as string;
  const styleTraditionalModern = params.style_traditional_modern as string;

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
    preferred_time: [] as string[],
  });

  // Devotional times state - multi-select
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // Progress calculation - start from where onboarding9 finished (100% of 10 screens)
  const currentScreen = 10;
  const totalScreens = 10;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 90; // onboarding9 finished at 90% of total 10 screens

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));
  const [morningAnimation] = useState(new Animated.Value(0));
  const [middayAnimation] = useState(new Animated.Value(0));
  const [afternoonAnimation] = useState(new Animated.Value(0));
  const [nightAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount - start from 90% and animate to 100%
  useEffect(() => {
    // Set initial value to 90%
    progressAnimation.setValue(startingProgress);
    
    // Animate to 100%
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleTimeSelect = (time: string) => {
    let newTimes: string[];
    if (selectedTimes.includes(time)) {
      // Deselect if already selected
      newTimes = selectedTimes.filter(t => t !== time);
    } else {
      // Select new time
      newTimes = [...selectedTimes, time];
    }
    
    setSelectedTimes(newTimes);
    setOnboardingData(prev => ({
      ...prev,
      preferred_time: newTimes
    }));

    // Update animations
    const animations = [
      morningAnimation,
      middayAnimation,
      afternoonAnimation,
      nightAnimation
    ];
    
    const timeIndex = ['morning', 'midday', 'afternoon', 'night'].indexOf(time);
    
    if (timeIndex !== -1) {
      // Toggle animation for the selected time
      const isSelected = newTimes.includes(time);
      Animated.timing(animations[timeIndex], {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleContinue = () => {
    if (selectedTimes.length > 0) {
      console.log('Continue button pressed');
      console.log('onboardingData:', onboardingData);
      console.log('selectedTimes:', selectedTimes);

      // Navigate to onboarding11 with all onboarding data
      const finalOnboardingData = {
        ...onboardingData,
        preferred_time: selectedTimes,
      };

      router.push({
        pathname: '/onboarding/onboarding11',
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
        }
      });
    } else {
      console.log('No times selected, cannot continue');
    }
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
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>When would you like to do your devotionals?</Text>
          </View>

          {/* Answer Choices */}
          <View style={styles.answersContainer}>
            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: morningAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleTimeSelect('morning')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: morningAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Morning
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: middayAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleTimeSelect('midday')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: middayAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Midday
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: afternoonAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleTimeSelect('afternoon')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: afternoonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Afternoon
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: nightAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleTimeSelect('night')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: nightAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Night
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <ContinueButton
              title="Continue"
              onPress={handleContinue}
              disabled={!onboardingData.preferred_time || onboardingData.preferred_time.length === 0}
            />
          </View>
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
  answersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerButton: {
    height: 66, // Fixed height of 66px
    width: '100%', // Fill container width
    paddingHorizontal: SPACING.lg, // 18px padding
    borderRadius: 10, // 10px corner radius
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm, // 12px gap
  },
  answerText: {
    ...getTypography('largeText', 'medium'),
  },
  answerTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
