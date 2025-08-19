import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import { UserProfile } from '../../services/supabase';

/**
 * Onboarding Screen 5 - Life challenges multi-select screen
 */
export default function OnboardingScreen5() {
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

  // State to track onboarding data
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({
    gender,
    birthday,
    devotional_experience: devotionalExperience,
    spiritual_journey: spiritualJourney,
  });

  // Life challenges state - multi-select
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);

  // Progress calculation - start from where onboarding4 finished (36.36%)
  const currentScreen = 5;
  const totalScreens = 11;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 36.36; // onboarding4 finished at 36.36% (4/11)

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));
  const [careerAnimation] = useState(new Animated.Value(0));
  const [relationshipsAnimation] = useState(new Animated.Value(0));
  const [healthAnimation] = useState(new Animated.Value(0));
  const [financesAnimation] = useState(new Animated.Value(0));
  const [anxietyAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount - start from 36.36% and animate to 45.45%
  useEffect(() => {
    // Set initial value to 36.36%
    progressAnimation.setValue(startingProgress);
    
    // Animate to 45.45%
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleChallengeSelect = (challenge: string) => {
    let newChallenges: string[];
    if (selectedChallenges.includes(challenge)) {
      // Deselect if already selected
      newChallenges = selectedChallenges.filter(c => c !== challenge);
    } else {
      // Select new challenge
      newChallenges = [...selectedChallenges, challenge];
    }
    
    setSelectedChallenges(newChallenges);
    setOnboardingData(prev => ({
      ...prev,
      life_challenges: newChallenges
    }));

    // Update animations
    const animations = [
      careerAnimation,
      relationshipsAnimation,
      healthAnimation,
      financesAnimation,
      anxietyAnimation
    ];
    
    const challengeIndex = ['career', 'relationships', 'health', 'finances', 'anxiety'].indexOf(challenge);
    
    if (challengeIndex !== -1) {
      // Toggle animation for the selected challenge
      const isSelected = newChallenges.includes(challenge);
      Animated.timing(animations[challengeIndex], {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleContinue = () => {
    console.log('Continue button pressed');
    console.log('onboardingData:', onboardingData);
    console.log('onboardingData.life_challenges:', onboardingData.life_challenges);

    if (onboardingData.life_challenges && onboardingData.life_challenges.length > 0) {
      console.log('Navigating to onboarding6');
      // Navigate to onboarding6 with all onboarding data as route params
      router.push({
        pathname: '/onboarding/onboarding6',
        params: {
          gender: onboardingData.gender,
          birthday: onboardingData.birthday,
          devotional_experience: onboardingData.devotional_experience,
          spiritual_journey: onboardingData.spiritual_journey,
          life_challenges: JSON.stringify(onboardingData.life_challenges),
        }
      });
    } else {
      console.log('No challenges selected, cannot continue');
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

          {/* Skip Button */}
          <TouchableOpacity
            style={[styles.skipButton, { backgroundColor: colors.grey }]}
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/onboarding6')}
          >
            <Text style={[styles.skipButtonText, { color: colors.textPrimary }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>Which areas of life are challenging right now?</Text>
          </View>

          {/* Answer Choices */}
          <View style={styles.answersContainer}>
            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: careerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleChallengeSelect('career')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: careerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Career stress
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: relationshipsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleChallengeSelect('relationships')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: relationshipsAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Relationships & family
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: healthAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleChallengeSelect('health')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: healthAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Health & wellness
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: financesAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleChallengeSelect('finances')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: financesAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Finances & provisions
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: anxietyAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleChallengeSelect('anxiety')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: anxietyAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Anxiety & emotional struggles
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
            disabled={!onboardingData.life_challenges || onboardingData.life_challenges.length === 0}
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
