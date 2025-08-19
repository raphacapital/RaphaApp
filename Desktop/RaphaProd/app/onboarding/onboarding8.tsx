import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import { UserProfile } from '../../services/supabase';

/**
 * Onboarding Screen 8 - Devotional goals multi-select screen
 */
export default function OnboardingScreen8() {
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

  // State to track onboarding data
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({
    gender,
    birthday,
    devotional_experience: devotionalExperience,
    spiritual_journey: spiritualJourney,
    life_challenges: lifeChallenges ? JSON.parse(lifeChallenges) : [],
    current_emotional_state: emotionalState ? JSON.parse(emotionalState) : [],
    preferred_themes: preferredThemes ? JSON.parse(preferredThemes) : [],
  });

  // Devotional goals state - multi-select
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Progress calculation - start from where onboarding7 finished (58.33% of 12 screens)
  const currentScreen = 8;
  const totalScreens = 12;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 58.33; // onboarding7 finished at 58.33% (7/12)

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));
  const [encouragementAnimation] = useState(new Animated.Value(0));
  const [accountabilityAnimation] = useState(new Animated.Value(0));
  const [peaceAnimation] = useState(new Animated.Value(0));
  const [scriptureAnimation] = useState(new Animated.Value(0));
  const [habitAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount - start from 77.78% and animate to 88.89%
  useEffect(() => {
    // Set initial value to 77.78%
    progressAnimation.setValue(startingProgress);
    
    // Animate to 88.89%
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleGoalSelect = (goal: string) => {
    let newGoals: string[];
    if (selectedGoals.includes(goal)) {
      // Deselect if already selected
      newGoals = selectedGoals.filter(g => g !== goal);
    } else {
      // Select new goal
      newGoals = [...selectedGoals, goal];
    }
    
    setSelectedGoals(newGoals);
    setOnboardingData(prev => ({
      ...prev,
      devotional_goals: newGoals
    }));

    // Update animations
    const animations = [
      encouragementAnimation,
      accountabilityAnimation,
      peaceAnimation,
      scriptureAnimation,
      habitAnimation
    ];
    
    const goalIndex = ['encouragement', 'accountability', 'peace', 'scripture', 'habit'].indexOf(goal);
    
    if (goalIndex !== -1) {
      // Toggle animation for the selected goal
      const isSelected = newGoals.includes(goal);
      Animated.timing(animations[goalIndex], {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleContinue = () => {
    console.log('Continue button pressed');
    console.log('onboardingData:', onboardingData);
    console.log('onboardingData.devotional_goals:', onboardingData.devotional_goals);

    if (onboardingData.devotional_goals && onboardingData.devotional_goals.length > 0) {
      console.log('Navigating to onboarding9');
      // Navigate to onboarding9 with all onboarding data as route params
      router.push({
        pathname: '/onboarding/onboarding9',
        params: {
          gender: onboardingData.gender,
          birthday: onboardingData.birthday,
          devotional_experience: onboardingData.devotional_experience,
          spiritual_journey: onboardingData.spiritual_journey,
          life_challenges: JSON.stringify(onboardingData.life_challenges),
          emotional_state: JSON.stringify(onboardingData.current_emotional_state),
          preferred_themes: JSON.stringify(onboardingData.preferred_themes),
          devotional_goals: JSON.stringify(onboardingData.devotional_goals),
        }
      });
    } else {
      console.log('No goals selected, cannot continue');
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
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>What are you hoping to get out of a devotional?</Text>
          </View>

          {/* Answer Choices */}
          <View style={styles.answersContainer}>
            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: encouragementAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleGoalSelect('encouragement')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: encouragementAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Encouragement
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: accountabilityAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleGoalSelect('accountability')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: accountabilityAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Accountability
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: peaceAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleGoalSelect('peace')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: peaceAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Peace & emotional support
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: scriptureAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleGoalSelect('scripture')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: scriptureAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  A deeper understanding of scripture
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: habitAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleGoalSelect('habit')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: habitAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Building a daily habit
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <ContinueButton
            title="Continue"
            onPress={handleContinue}
            disabled={!onboardingData.devotional_goals || onboardingData.devotional_goals.length === 0}
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
