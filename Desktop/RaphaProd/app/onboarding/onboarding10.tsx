import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

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
    devotional_times: {} as {[key: string]: string}, // New state for devotional times
  });

  // Devotional times state - multi-select
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  
  // State to track which options are expanded
  const [expandedOptions, setExpandedOptions] = useState<Set<string>>(new Set());
  
  // State for time picker modal
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [selectedTimesData, setSelectedTimesData] = useState<{[key: string]: string}>({}); // Start empty
  
  // Display times in AM/PM format
  const [displayTimesData, setDisplayTimesData] = useState<{[key: string]: string}>({}); // Start empty
  
  // Individual date states for each time option
  const [timeDates, setTimeDates] = useState<{[key: string]: Date}>({
    morning: new Date(2024, 0, 1, 9, 0, 0), // 9:00 AM
    midday: new Date(2024, 0, 1, 12, 0, 0), // 12:00 PM
    afternoon: new Date(2024, 0, 1, 15, 0, 0), // 3:00 PM
    night: new Date(2024, 0, 1, 21, 0, 0), // 9:00 PM
  });

  // Progress calculation - start from where onboarding9 finished (75% of 12 screens)
  const currentScreen = 10;
  const totalScreens = 12;
  const progressPercentage = (currentScreen / totalScreens) * 100;
  const startingProgress = 75; // onboarding9 finished at 75% (9/12)

  // Animation setup using React Native Animated
  const [progressAnimation] = useState(new Animated.Value(0));
  const [morningAnimation] = useState(new Animated.Value(0));
  const [middayAnimation] = useState(new Animated.Value(0));
  const [afternoonAnimation] = useState(new Animated.Value(0));
  const [nightAnimation] = useState(new Animated.Value(0));
  
  // Expansion animations for each option
  const [morningExpansion] = useState(new Animated.Value(0));
  const [middayExpansion] = useState(new Animated.Value(0));
  const [afternoonExpansion] = useState(new Animated.Value(0));
  const [nightExpansion] = useState(new Animated.Value(0));

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

    // Configure notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  const handleTimeSelect = (time: string) => {
    let newTimes: string[];
    if (selectedTimes.includes(time)) {
      // Deselect if already selected
      newTimes = selectedTimes.filter(t => t !== time);
      
      // Remove from devotional_times when deselected
      setOnboardingData(prev => {
        const newDevotionalTimes = { ...prev.devotional_times };
        delete newDevotionalTimes[time];
        return {
          ...prev,
          devotional_times: newDevotionalTimes
        };
      });
      
      // Remove from selectedTimesData and displayTimesData when deselected
      setSelectedTimesData(prev => {
        const newData = { ...prev };
        delete newData[time];
        return newData;
      });
      
      setDisplayTimesData(prev => {
        const newData = { ...prev };
        delete newData[time];
        return newData;
      });
    } else {
      // Select new time
      newTimes = [...selectedTimes, time];
      
      // Initialize with default time when selected
      const defaultTimes = {
        morning: '09:00',
        midday: '12:00',
        afternoon: '15:00',
        night: '21:00'
      };
      
      const defaultDisplayTimes = {
        morning: '9:00 AM',
        midday: '12:00 PM',
        afternoon: '3:00 PM',
        night: '9:00 PM'
      };
      
      setOnboardingData(prev => ({
        ...prev,
        devotional_times: {
          ...prev.devotional_times,
          [time]: defaultTimes[time as keyof typeof defaultTimes]
        }
      }));
      
      // Only add to selectedTimesData and displayTimesData when actually selected
      setSelectedTimesData(prev => ({
        ...prev,
        [time]: defaultTimes[time as keyof typeof defaultTimes]
      }));
      
      setDisplayTimesData(prev => ({
        ...prev,
        [time]: defaultDisplayTimes[time as keyof typeof defaultDisplayTimes]
      }));
    }
    
    setSelectedTimes(newTimes);
    setOnboardingData(prev => ({
      ...prev,
      preferred_time: newTimes
    }));

    // Update selection animations
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

  const handleOptionExpand = (time: string) => {
    const newExpandedOptions = new Set(expandedOptions);
    const isCurrentlyExpanded = newExpandedOptions.has(time);
    
    if (isCurrentlyExpanded) {
      // Collapse
      newExpandedOptions.delete(time);
    } else {
      // Expand
      newExpandedOptions.add(time);
    }
    
    setExpandedOptions(newExpandedOptions);
    
    // Animate expansion
    const expansionAnimations = {
      morning: morningExpansion,
      midday: middayExpansion,
      afternoon: afternoonExpansion,
      night: nightExpansion
    };
    
    const targetValue = isCurrentlyExpanded ? 0 : 1;
    const duration = 300;
    
    Animated.timing(expansionAnimations[time as keyof typeof expansionAnimations], {
      toValue: targetValue,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const handleTimePickerOpen = (time: string) => {
    setEditingTime(time);
    setShowTimePicker(true);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate && editingTime) {
      // Update the specific time option's date
      setTimeDates(prev => ({
        ...prev,
        [editingTime]: selectedDate
      }));
      
      // Format the time as HH:MM AM/PM for display
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      const formattedTime = `${displayHours}:${displayMinutes} ${ampm}`;
      
      // Also store the 24-hour format for the database
      const hours24 = selectedDate.getHours().toString().padStart(2, '0');
      const minutes24 = selectedDate.getMinutes().toString().padStart(2, '0');
      const time24Hour = `${hours24}:${minutes24}`;
      
      // Update selectedTimesData with 24-hour format for database
      setSelectedTimesData(prev => ({
        ...prev,
        [editingTime]: time24Hour // Store 24-hour format instead of AM/PM
      }));
      
      // Update displayTimesData with AM/PM format for UI
      setDisplayTimesData(prev => ({
        ...prev,
        [editingTime]: formattedTime // Store AM/PM format for display
      }));
      
      // Store 24-hour format separately for database
      setOnboardingData(prev => ({
        ...prev,
        devotional_times: {
          ...prev.devotional_times,
          [editingTime]: time24Hour
        }
      }));
    }
  };

  const handleContinue = async () => {
    if (selectedTimes.length > 0) {
      console.log('Continue button pressed');
      console.log('onboardingData:', onboardingData);
      console.log('selectedTimes:', selectedTimes);

      try {
        // Request notification permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log('Existing notification status:', existingStatus);
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          console.log('Requesting notification permissions...');
          // Request permission
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
          console.log('New notification status:', finalStatus);
        }
        
        if (finalStatus !== 'granted') {
          console.log('Permission denied, showing alert...');
          // User denied permission, show alert but still continue
          Alert.alert(
            'Notifications Disabled',
            'You can enable notifications later in Settings to receive daily devotional reminders.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  console.log('User clicked continue from alert, navigating...');
                  navigateToNextScreen();
                }
              }
            ]
          );
          return;
        }
        
        console.log('Permission granted, navigating to next screen...');
        // Permission granted, navigate to next screen
        navigateToNextScreen();
        
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
        // If there's an error, still navigate to next screen
        navigateToNextScreen();
      }
    } else {
      console.log('No times selected, cannot continue');
    }
  };

  const navigateToNextScreen = () => {
    // Navigate to onboarding11 with all onboarding data
    const finalOnboardingData = {
      ...onboardingData,
      preferred_time: selectedTimes,
      devotional_times: selectedTimesData, // Use selectedTimesData instead of onboardingData.devotional_times
    };

    console.log('Final onboarding data being passed:', finalOnboardingData);
    console.log('Devotional times:', finalOnboardingData.devotional_times);
    console.log('Selected times:', finalOnboardingData.preferred_time);
    console.log('selectedTimesData:', selectedTimesData); // Debug log

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
        devotional_times: JSON.stringify(finalOnboardingData.devotional_times), // Add this to params
      }
    });
  };

  const renderTimeOption = (time: string, label: string, selectionAnim: Animated.Value, expansionAnim: Animated.Value) => {
    const isSelected = selectedTimes.includes(time);
    const isExpanded = expandedOptions.has(time);
    
    return (
      <View key={time} style={styles.answerOptionContainer}>
        <Animated.View style={[
          styles.answerButton,
          {
            backgroundColor: selectionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.grey, colors.buttonBackground],
            }),
            borderBottomLeftRadius: expandedOptions.has(time) ? 0 : 10,
            borderBottomRightRadius: expandedOptions.has(time) ? 0 : 10,
          }
        ]}>
          <TouchableOpacity
            style={styles.answerTouchable}
            activeOpacity={0.8}
            onPress={() => {
              handleTimeSelect(time);
              handleOptionExpand(time);
            }}
          >
            <Animated.Text style={[
              styles.answerText,
              {
                color: selectionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.textPrimary, colors.buttonText],
                }),
              }
            ]}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Expandable content - attached directly to the box */}
        <Animated.View style={[
          styles.expandableContent,
          {
            maxHeight: expansionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 66], // Match the answer button height exactly
            }),
            opacity: expansionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }
        ]}>
          <View style={[
            styles.expandableInner, 
            { 
              backgroundColor: colors.buttonBackground,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }
          ]}>
            <View style={styles.expandableContentRow}>
              <TouchableOpacity
                style={styles.timeTextTouchable}
                activeOpacity={0.8}
                onPress={() => handleTimePickerOpen(time)}
              >
                <Text style={[styles.expandableText, { color: colors.buttonText }]}>
                  {displayTimesData[time]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.caretTouchable}
                activeOpacity={0.8}
                onPress={() => handleTimePickerOpen(time)}
              >
                <Text style={[styles.caret, { color: colors.buttonText }]}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    );
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
            onPress={() => router.push('/onboarding/onboarding11')}
          >
            <Text style={[styles.skipButtonText, { color: colors.textPrimary }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>When would you like to do your devotionals?</Text>
          </View>

          {/* Answer Choices */}
          <View style={styles.answersContainer}>
            {renderTimeOption('morning', 'Morning', morningAnimation, morningExpansion)}
            {renderTimeOption('midday', 'Midday', middayAnimation, middayExpansion)}
            {renderTimeOption('afternoon', 'Afternoon', afternoonAnimation, afternoonExpansion)}
            {renderTimeOption('night', 'Night', nightAnimation, nightExpansion)}
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
      
      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowTimePicker(false)}
        >
          <TouchableOpacity 
            style={styles.timePickerContainer} 
            activeOpacity={1}
            onPress={() => {}} // Prevent event bubbling
          >
            {/* Native DateTimePicker */}
            <View style={styles.dateTimePickerContainer}>
              <DateTimePicker
                value={timeDates[editingTime || ''] || new Date()}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                textColor={colors.textPrimary}
                style={styles.dateTimePicker}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  answerOptionContainer: {
    width: '100%',
    marginBottom: SPACING.sm, // 12px gap between options
  },
  answerButton: {
    height: 66, // Fixed height of 66px
    width: '100%', // Fill container width
    paddingHorizontal: SPACING.lg, // 18px padding
    borderRadius: 10, // 10px corner radius
    alignItems: 'center',
    justifyContent: 'center', // Center the text
  },
  answerText: {
    ...getTypography('largeText', 'medium'),
    textAlign: 'center',
  },
  answerTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  expandableContent: {
    overflow: 'hidden',
    marginTop: 0, // No gap between button and expanded content
  },
  expandableInner: {
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg, // Match the answer button's horizontal padding
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: '100%', // Ensure full width
    alignItems: 'center', // Center items vertically
    justifyContent: 'flex-start', // Start from the left instead of centering
  },
  expandableText: {
    ...getTypography('largeText', 'medium'),
    textAlign: 'center',
  },
  caret: {
    fontSize: 24,
    marginLeft: 12,
    lineHeight: 24,
    textAlignVertical: 'center',
  },
  expandableContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the entire group
    width: '100%',
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
  timeTextTouchable: {
    // No flex - only take up needed space
  },
  caretTouchable: {
    // No padding - caret margin handles the spacing
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContainer: {
    width: '80%',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
  },
  dateTimePickerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  dateTimePicker: {
    width: '100%',
    height: 150, // Adjust height as needed
  },
});
