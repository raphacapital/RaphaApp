import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../../constants/theme';
import ContinueButton from '../../components/ContinueButton';
import LightRays from '../../components/LightRays';

/**
 * Onboarding Screen 13 - Final onboarding screen with Rapha introduction
 */
export default function OnboardingScreen13() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const colors = getColors(theme);
  
  // State for text animation
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [lightRaysColor, setLightRaysColor] = useState('#FF0000'); // Start with red
  

  
  const handleContinue = () => {
    if (currentTextIndex === 0) {
      // First press: animate to second text
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Change text and fade in
        setCurrentTextIndex(1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentTextIndex === 1) {
      // Second press: animate to third text
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Change text and fade in
        setCurrentTextIndex(2);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentTextIndex === 2) {
      // Third press: animate to fourth text
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Change text and fade in
        setCurrentTextIndex(3);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentTextIndex === 3) {
      // Fourth press: animate to final text
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Change text and fade in
        setCurrentTextIndex(4);
        setLightRaysColor(colors.primary); // Transition to primary color
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Fifth press: navigate to auth screen with all onboarding data
      router.push({
        pathname: '/auth',
        params: {
          gender: params.gender,
          birthday: params.birthday,
          devotional_experience: params.devotional_experience,
          spiritual_journey: params.spiritual_journey,
          life_challenges: params.life_challenges,
          emotional_state: params.emotional_state,
          preferred_themes: params.preferred_themes,
          devotional_goals: params.devotional_goals,
          style_reverent_conversational: params.style_reverent_conversational,
          style_comforting_challenging: params.style_comforting_challenging,
          style_poetic_practical: params.style_poetic_practical,
          style_traditional_modern: params.style_traditional_modern,
          preferred_time: params.preferred_time,
          devotional_times: params.devotional_times,
          additional_notes: params.additional_notes,
        }
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Red Light Rays Background - Behind all content */}
      <LightRays
        key={lightRaysColor} // Force re-render when color changes
        raysOrigin="top-center"
        raysColor={lightRaysColor}
        raysSpeed={1}
        lightSpread={0.05}
        rayLength={10}
        pulsating={true}
        noiseAmount={0.0}
        distortion={0.0}
        saturation={2.0}
        style={styles.lightRays}
      />

      {/* Content container with 36px vertical and 18px horizontal safe area margins */}
      <View style={[
        styles.contentContainer,
        {
          marginTop: insets.top + SPACING.xl,
          marginBottom: insets.bottom + SPACING.xl,
          marginHorizontal: SPACING.lg,
        }
      ]}>
        {/* Main Content Area */}
        <View style={styles.mainContentContainer}>
          {/* Header Text */}
          <View style={styles.headerContainer}>
            <Animated.View style={{ opacity: fadeAnim }}>
              {currentTextIndex === 0 ? (
                <Text style={[styles.headerText, { color: colors.textPrimary }]}>
                  Social media and endless{'\n'}
                  entertainment have created a{'\n'}
                  <Text style={{ color: 'white', fontStyle: 'italic' }}>disconnect.</Text>
                </Text>
              ) : currentTextIndex === 1 ? (
                <Text style={[styles.headerText, { color: colors.textPrimary }]}>
                  It has never been easier{'\n'}
                  to stray from God and{'\n'}
                  neglect your faith.
                </Text>
              ) : currentTextIndex === 2 ? (
                <Text style={[styles.headerText, { color: colors.textPrimary }]}>
                  Generic devotional apps{'\n'}
                  aren't enough anymore.
                </Text>
              ) : currentTextIndex === 3 ? (
                <Text style={[styles.headerText, { color: colors.textPrimary }]}>
                  We're searching for something{'\n'}
                  deeper, that actually speaks{'\n'}
                  to our own journey and{'\n'}
                  struggles.
                </Text>
              ) : (
                <Text style={[styles.headerText, { color: colors.textPrimary }]}>
                  That's why we created{'\n'}
                  <Text style={{ color: 'white' }}>Rapha.</Text>
                </Text>
              )}
            </Animated.View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <ContinueButton
            title={currentTextIndex === 0 ? "Next" : currentTextIndex === 1 ? "Next" : currentTextIndex === 2 ? "Next" : currentTextIndex === 3 ? "Next" : "Continue"}
            onPress={handleContinue}
            variant={currentTextIndex === 4 ? "filled" : "outline"}
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
  lightRays: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    zIndex: 10,
  },
  mainContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg - 15,
  },
  headerText: {
    fontSize: 24,
    lineHeight: 26,
    letterSpacing: 0,
    fontFamily: 'NeueHaasDisplay-Medium',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    width: '100%',
  },
});
