import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import { UserProfile } from '../../services/supabase';

/**
 * Onboarding Screen 3 - Devotional experience selection screen
 */
export default function OnboardingScreen3() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const colors = getColors(theme);

  // Get onboarding data from previous screens
  const gender = params.gender as string;
  const birthday = params.birthday as string;

  // State to track onboarding data
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({
    gender,
    birthday,
  });

  // Devotional experience state
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);

  // Progress calculation - start from where onboarding2 finished (18.18%)
  const currentScreen = 3;
  const totalScreens = 11;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 18.18; // onboarding2 finished at 18.18% (2/11)

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));
  const [neverAnimation] = useState(new Animated.Value(0));
  const [rarelyAnimation] = useState(new Animated.Value(0));
  const [onOffAnimation] = useState(new Animated.Value(0));
  const [dailyAnimation] = useState(new Animated.Value(0));
  const [multipleAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount - start from 18.18% and animate to 27.27%
  useEffect(() => {
    // Set initial value to 18.18%
    progressAnimation.setValue(startingProgress);
    
    // Animate to 27.27%
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleExperienceSelect = (experience: string) => {
    setSelectedExperience(experience);
    
    // Update onboarding data
    setOnboardingData(prev => {
      const newData = { ...prev, devotional_experience: experience };
      console.log('Updated onboardingData:', newData);
      return newData;
    });

    // Animate the selected button
    const animations = [
      neverAnimation,
      rarelyAnimation,
      onOffAnimation,
      dailyAnimation,
      multipleAnimation
    ];
    
    const experienceIndex = ['never', 'rarely', 'on_off', 'daily', 'multiple'].indexOf(experience);
    
    // Reset all animations to 0
    animations.forEach(anim => anim.setValue(0));
    
    // Animate selected button to 1
    Animated.timing(animations[experienceIndex], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleContinue = () => {
    console.log('Continue button pressed');
    console.log('onboardingData:', onboardingData);
    console.log('onboardingData.devotional_experience:', onboardingData.devotional_experience);

    if (onboardingData.devotional_experience) {
      console.log('Navigating to onboarding4 screen');
      // Navigate to onboarding4 screen with onboarding data as route params
      router.push({
        pathname: '/onboarding/onboarding4',
        params: {
          gender: onboardingData.gender,
          birthday: onboardingData.birthday,
          devotional_experience: onboardingData.devotional_experience,
        }
      });
    } else {
      console.log('No experience selected, cannot continue');
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

          {/* Skip Button - Hidden by default */}
          <TouchableOpacity
            style={[styles.skipButton, { backgroundColor: colors.grey, opacity: 0 }]}
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/onboarding4')}
          >
            <Text style={[styles.skipButtonText, { color: colors.textPrimary }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>Have you done devotionals before?</Text>
          </View>

          {/* Answer Choices */}
          <View style={styles.answersContainer}>
            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: neverAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleExperienceSelect('never')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: neverAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Never done them
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: rarelyAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleExperienceSelect('rarely')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: rarelyAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Rarely
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: onOffAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleExperienceSelect('on_off')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: onOffAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Inconsistently
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: dailyAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleExperienceSelect('daily')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: dailyAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Once a day
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: multipleAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleExperienceSelect('multiple')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: multipleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  More than once a day
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
            disabled={!onboardingData.devotional_experience}
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
  descriptionText: {
    fontSize: 16,
    lineHeight: 20.8,
    letterSpacing: 0,
    fontFamily: 'NeueHaasDisplayRoman',
    textAlign: 'center',
    marginTop: SPACING.sm, // 12px below the question
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
