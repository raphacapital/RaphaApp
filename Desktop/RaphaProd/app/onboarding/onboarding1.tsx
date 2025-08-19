import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import { UserProfile } from '../../services/supabase';

/**
 * Onboarding Screen 1 - First onboarding screen
 */
export default function OnboardingScreen1() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);
  
  // State to track onboarding data
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({});
  
  // Progress calculation
  const currentScreen = 1;
  const totalScreens = 11;
  const progressPercentage = (currentScreen / totalScreens) * 100;

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));

  // Answer choice animations
  const [maleAnimation] = useState(new Animated.Value(0));
  const [femaleAnimation] = useState(new Animated.Value(0));
  const [preferNotToSayAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleGenderSelect = (gender: string) => {
    
    // Update onboarding data
    setOnboardingData(prev => {
      const newData = { ...prev, gender };
      return newData;
    });
    
    // Animate all buttons
    const animations = [
      { value: maleAnimation, isSelected: gender === 'male' },
      { value: femaleAnimation, isSelected: gender === 'female' },
      { value: preferNotToSayAnimation, isSelected: gender === 'prefer not to say' }
    ];
    
    animations.forEach(({ value, isSelected }) => {
      Animated.timing(value, {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  const handleContinue = () => {
    
    if (onboardingData.gender) {
      // Navigate to onboarding2 with onboarding data as route params
      router.push({
        pathname: '/onboarding/onboarding2',
        params: {
          gender: onboardingData.gender,
        }
      });
    } else {
      console.log('No gender selected, cannot continue');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* White Particles Background - Behind all content */}
      

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
            onPress={() => router.push('/onboarding/onboarding2')}
          >
            <Text style={[styles.skipButtonText, { color: colors.textPrimary }]}>Skip</Text>
          </TouchableOpacity>

        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>What's your gender?</Text>
            <Text style={[styles.descriptionText, { color: theme === 'dark' ? 'white' : 'black' }]}>This helps us personalize your experience.</Text>
          </View>

          {/* Answer Choices */}
          <View style={styles.answersContainer}>
            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: maleAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleGenderSelect('male')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: maleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Male
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: femaleAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleGenderSelect('female')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: femaleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Female
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.answerButton,
              {
                backgroundColor: preferNotToSayAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.grey, colors.buttonBackground],
                }),
              }
            ]}>
              <TouchableOpacity
                style={styles.answerTouchable}
                activeOpacity={0.8}
                onPress={() => handleGenderSelect('prefer not to say')}
              >
                <Animated.Text style={[
                  styles.answerText,
                  {
                    color: preferNotToSayAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.textPrimary, colors.buttonText],
                    }),
                  }
                ]}>
                  Prefer not to say
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
            disabled={!onboardingData.gender}
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
    zIndex: 10, // Higher than particles
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
  answerButtonSelected: {
    backgroundColor: '#000000',
  },
  answerText: {
    ...getTypography('largeText', 'medium'),
  },
  answerTextSelected: {
    color: '#FFFFFF', // White when selected
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
