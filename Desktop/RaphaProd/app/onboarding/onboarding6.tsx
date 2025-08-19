import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import { UserProfile } from '../../services/supabase';

/**
 * Onboarding Screen 6 - Emotional state multi-select screen with 2-column layout
 */
export default function OnboardingScreen6() {
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

  // State to track onboarding data
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({
    gender,
    birthday,
    devotional_experience: devotionalExperience,
    spiritual_journey: spiritualJourney,
    life_challenges: lifeChallenges ? JSON.parse(lifeChallenges) : [],
  });

  // Emotional state state - multi-select
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

  // Progress calculation - start from where onboarding5 finished (45.45%)
  const currentScreen = 6;
  const totalScreens = 11;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 45.45; // onboarding5 finished at 45.45% (5/11)

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));
  const [peacefulAnimation] = useState(new Animated.Value(0));
  const [stressedAnimation] = useState(new Animated.Value(0));
  const [grievingAnimation] = useState(new Animated.Value(0));
  const [anxiousAnimation] = useState(new Animated.Value(0));
  const [gratefulAnimation] = useState(new Animated.Value(0));
  const [confusedAnimation] = useState(new Animated.Value(0));
  const [hopefulAnimation] = useState(new Animated.Value(0));
  const [overwhelmedAnimation] = useState(new Animated.Value(0));
  const [contentAnimation] = useState(new Animated.Value(0));
  const [uncertainAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount - start from 45.45% and animate to 54.55%
  useEffect(() => {
    // Set initial value to 45.45%
    progressAnimation.setValue(startingProgress);
    
    // Animate to 54.55%
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleEmotionSelect = (emotion: string) => {
    let newEmotions: string[];
    if (selectedEmotions.includes(emotion)) {
      // Deselect if already selected
      newEmotions = selectedEmotions.filter(e => e !== emotion);
    } else {
      // Select new emotion
      newEmotions = [...selectedEmotions, emotion];
    }
    
    setSelectedEmotions(newEmotions);
    setOnboardingData(prev => ({
      ...prev,
      current_emotional_state: newEmotions
    }));

    // Update animations
    const animations = [
      peacefulAnimation,
      stressedAnimation,
      grievingAnimation,
      anxiousAnimation,
      gratefulAnimation,
      confusedAnimation,
      hopefulAnimation,
      overwhelmedAnimation,
      contentAnimation,
      uncertainAnimation
    ];
    
    const emotionIndex = ['peaceful', 'stressed', 'grieving', 'anxious', 'grateful', 'confused', 'hopeful', 'overwhelmed', 'content', 'uncertain'].indexOf(emotion);
    
    if (emotionIndex !== -1) {
      // Toggle animation for the selected emotion
      const isSelected = newEmotions.includes(emotion);
      Animated.timing(animations[emotionIndex], {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleContinue = () => {
    console.log('Continue button pressed');
    console.log('onboardingData:', onboardingData);
    console.log('onboardingData.current_emotional_state:', onboardingData.current_emotional_state);

    if (onboardingData.current_emotional_state && onboardingData.current_emotional_state.length > 0) {
      console.log('Navigating to onboarding7');
      // Navigate to onboarding7 with all onboarding data as route params
      router.push({
        pathname: '/onboarding/onboarding7',
        params: {
          gender: onboardingData.gender,
          birthday: onboardingData.birthday,
          devotional_experience: onboardingData.devotional_experience,
          spiritual_journey: onboardingData.spiritual_journey,
          life_challenges: JSON.stringify(onboardingData.life_challenges),
          emotional_state: JSON.stringify(onboardingData.current_emotional_state),
        }
      });
    } else {
      console.log('No emotions selected, cannot continue');
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
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>How would you describe your current emotional state?</Text>
          </View>

          {/* Answer Choices - 2 columns */}
          <View style={styles.answersContainer}>
            {/* Row 1 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: peacefulAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('peaceful')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: peacefulAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Peaceful
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: stressedAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('stressed')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: stressedAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Stressed
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Row 2 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: grievingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('grieving')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: grievingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Grieving
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: anxiousAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('anxious')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: anxiousAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Anxious
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Row 3 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: gratefulAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('grateful')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: gratefulAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Grateful
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: confusedAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('confused')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: confusedAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Confused
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Row 4 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: hopefulAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('hopeful')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: hopefulAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Hopeful
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: overwhelmedAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('overwhelmed')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: overwhelmedAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Overwhelmed
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Row 5 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: contentAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('content')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: contentAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Content
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: uncertainAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleEmotionSelect('uncertain')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: uncertainAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Uncertain
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <ContinueButton
            title="Continue"
            onPress={handleContinue}
            disabled={!onboardingData.current_emotional_state || onboardingData.current_emotional_state.length === 0}
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
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.sm, // 12px gap between rows
  },
  answerButton: {
    height: 66, // Fixed height of 66px
    width: '48.5%', // Slightly less than 50% to account for gap
    paddingHorizontal: SPACING.lg, // 18px padding
    borderRadius: 10, // 10px corner radius
    alignItems: 'center',
    justifyContent: 'center',
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
