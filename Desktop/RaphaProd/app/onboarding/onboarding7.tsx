import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import { UserProfile } from '../../services/supabase';

/**
 * Onboarding Screen 7 - Theme selection multi-select screen with 2-column layout
 */
export default function OnboardingScreen7() {
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

  // State to track onboarding data
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({
    gender,
    birthday,
    devotional_experience: devotionalExperience,
    spiritual_journey: spiritualJourney,
    life_challenges: lifeChallenges ? JSON.parse(lifeChallenges) : [],
    current_emotional_state: emotionalState ? JSON.parse(emotionalState) : [],
  });

  // Theme state - multi-select
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  // Progress calculation - start from where onboarding6 finished (54.55%)
  const currentScreen = 7;
  const totalScreens = 11;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 54.55; // onboarding6 finished at 54.55% (6/11)

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));
  const [trustAnimation] = useState(new Animated.Value(0));
  const [healingAnimation] = useState(new Animated.Value(0));
  const [identityAnimation] = useState(new Animated.Value(0));
  const [wisdomAnimation] = useState(new Animated.Value(0));
  const [hopeAnimation] = useState(new Animated.Value(0));
  const [purposeAnimation] = useState(new Animated.Value(0));
  const [gratitudeAnimation] = useState(new Animated.Value(0));
  const [forgivenessAnimation] = useState(new Animated.Value(0));
  const [surrenderAnimation] = useState(new Animated.Value(0));
  const [courageAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount - start from 54.55% and animate to 63.64%
  useEffect(() => {
    // Set initial value to 54.55%
    progressAnimation.setValue(startingProgress);
    
    // Animate to 63.64%
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleThemeSelect = (theme: string) => {
    let newThemes: string[];
    if (selectedThemes.includes(theme)) {
      // Deselect if already selected
      newThemes = selectedThemes.filter(t => t !== theme);
    } else {
      // Select new theme
      newThemes = [...selectedThemes, theme];
    }
    
    setSelectedThemes(newThemes);
    setOnboardingData(prev => ({
      ...prev,
      preferred_themes: newThemes
    }));

    // Update animations
    const animations = [
      trustAnimation,
      healingAnimation,
      identityAnimation,
      wisdomAnimation,
      hopeAnimation,
      purposeAnimation,
      gratitudeAnimation,
      forgivenessAnimation,
      surrenderAnimation,
      courageAnimation
    ];
    
    const themeIndex = ['trust', 'healing', 'identity', 'wisdom', 'hope', 'purpose', 'gratitude', 'forgiveness', 'surrender', 'courage'].indexOf(theme);
    
    if (themeIndex !== -1) {
      // Toggle animation for the selected theme
      const isSelected = newThemes.includes(theme);
      Animated.timing(animations[themeIndex], {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleContinue = () => {
    console.log('Continue button pressed');
    console.log('onboardingData:', onboardingData);
    console.log('onboardingData.preferred_themes:', onboardingData.preferred_themes);

    if (onboardingData.preferred_themes && onboardingData.preferred_themes.length > 0) {
      console.log('Navigating to onboarding8');
      // Navigate to onboarding8 with all onboarding data as route params
      router.push({
        pathname: '/onboarding/onboarding8',
        params: {
          gender: onboardingData.gender,
          birthday: onboardingData.birthday,
          devotional_experience: onboardingData.devotional_experience,
          spiritual_journey: onboardingData.spiritual_journey,
          life_challenges: JSON.stringify(onboardingData.life_challenges),
          emotional_state: JSON.stringify(onboardingData.current_emotional_state),
          preferred_themes: JSON.stringify(onboardingData.preferred_themes),
        }
      });
    } else {
      console.log('No themes selected, cannot continue');
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
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>What kind of themes resonate with you?</Text>
          </View>

          {/* Answer Choices - 2 columns */}
          <View style={styles.answersContainer}>
            {/* Row 1 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: trustAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('trust')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: trustAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Trust
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: healingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('healing')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: healingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Healing
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Row 2 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: identityAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('identity')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: identityAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Identity
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: wisdomAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('wisdom')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: wisdomAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Wisdom
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Row 3 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: hopeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('hope')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: hopeAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Hope
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: purposeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('purpose')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: purposeAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Purpose
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Row 4 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: gratitudeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('gratitude')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: gratitudeAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Gratitude
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: forgivenessAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('forgiveness')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: forgivenessAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Forgiveness
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Row 5 */}
            <View style={styles.answerRow}>
              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: surrenderAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('surrender')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: surrenderAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Surrender
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[
                styles.answerButton,
                {
                  backgroundColor: courageAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [colors.grey, colors.buttonBackground],
                  }),
                }
              ]}>
                <TouchableOpacity
                  style={styles.answerTouchable}
                  activeOpacity={0.8}
                  onPress={() => handleThemeSelect('courage')}
                >
                  <Animated.Text style={[
                    styles.answerText,
                    {
                      color: courageAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.textPrimary, colors.buttonText],
                      }),
                    }
                  ]}>
                    Courage
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
            disabled={!onboardingData.preferred_themes || onboardingData.preferred_themes.length === 0}
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
