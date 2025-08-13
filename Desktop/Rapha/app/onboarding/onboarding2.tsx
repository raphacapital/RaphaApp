import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import { UserProfile } from '../../services/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * Onboarding Screen 2 - Birthday selection screen
 */
export default function OnboardingScreen2() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const colors = getColors(theme);
  
  // Get gender from previous screen
  const gender = params.gender as string;
  
  // State to track onboarding data
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({
    gender,
  });
  
  // Birthday state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Progress calculation - start from where onboarding1 finished (20%)
  const currentScreen = 2;
  const totalScreens = 7;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 14.29; // onboarding1 finished at 14.29%

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));

  // Animate progress on mount - start from 50% and animate to 100%
  useEffect(() => {
    // Set initial value to 50%
    progressAnimation.setValue(startingProgress);
    
    // Animate to 100%
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);



  const handleDateSelect = (event: any, date?: Date) => {
    if (date) {
      console.log('Date selected:', date);
      setSelectedDate(date);
      
      // Update onboarding data
      setOnboardingData(prev => {
        const newData = { ...prev, birthday: date.toISOString().split('T')[0] };
        console.log('Updated onboardingData:', newData);
        return newData;
      });
    }
  };

    const handleContinue = () => {
    console.log('Continue button pressed');
    console.log('onboardingData:', onboardingData);
    console.log('onboardingData.birthday:', onboardingData.birthday);

    if (onboardingData.birthday) {
      console.log('Navigating to onboarding3 screen');
      // Navigate to onboarding3 screen with onboarding data as route params
      router.push({
        pathname: '/onboarding/onboarding3',
        params: {
          gender: onboardingData.gender,
          birthday: onboardingData.birthday,
        }
      });
    } else {
      console.log('No date selected, cannot continue');
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
            onPress={() => router.push('/onboarding/onboarding3')}
          >
            <Text style={[styles.skipButtonText, { color: colors.textPrimary }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>When's your birthday?</Text>
            <Text style={[styles.descriptionText, { color: colors.darkGrey }]}>This helps us personalize your experience.</Text>
          </View>

                             {/* Date Selection Area */}
                   <View style={styles.dateContainer}>
                     {/* Date Picker */}
                     <DateTimePicker
                       value={selectedDate || new Date()}
                       mode="date"
                       display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                       onChange={handleDateSelect}
                       maximumDate={new Date()}
                       minimumDate={new Date(1900, 0, 1)}
                       style={styles.datePicker}
                     />
                   </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <ContinueButton
            title="Continue"
            onPress={handleContinue}
            disabled={!onboardingData.birthday}
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
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
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



  datePicker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 50,
    marginBottom: SPACING.lg,
  },

});
