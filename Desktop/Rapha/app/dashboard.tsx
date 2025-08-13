import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getColors, SPACING, getTypography } from '../constants/theme';
import { supabase } from '../services/supabase';

// Constants for data labels to improve maintainability
const ONBOARDING_LABELS = {
  FULL_NAME: 'Full Name',
  GENDER: 'Gender',
  BIRTHDAY: 'Birthday',
  DEVOTIONAL_EXPERIENCE: 'Devotional Experience',
  SPIRITUAL_JOURNEY: 'Spiritual Journey',
  LIFE_CHALLENGES: 'Life Challenges',
  CURRENT_EMOTIONAL_STATE: 'Current Emotional State',
  PREFERRED_THEMES: 'Preferred Themes',
  DEVOTIONAL_GOALS: 'Devotional Goals',
  STYLE_REVERENT_CONVERSATIONAL: 'Style: Reverent vs Conversational',
  STYLE_COMFORTING_CHALLENGING: 'Style: Comforting vs Challenging',
  STYLE_POETIC_PRACTICAL: 'Style: Poetic vs Practical',
  STYLE_TRADITIONAL_MODERN: 'Style: Traditional vs Modern',
  PREFERRED_TIME: 'Preferred Time',
  ADDITIONAL_NOTES: 'Additional Notes',
} as const;

/**
 * Dashboard Screen - Main app screen after authentication
 */
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  const { user, signOut, userFlowState } = useAuth();
  const colors = getColors(theme);
  
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from Supabase on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        if (!user?.id) {
          console.log('⏳ Dashboard: Waiting for user ID...');
          return;
        }

        console.log('🔍 Dashboard: Fetching profile for user:', user.id);

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setUserName('there');
        } else if (profile?.full_name) {
          const firstName = profile.full_name.split(' ')[0];
          setUserName(firstName);
        } else {
          setUserName('there');
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setUserName('there');
      } finally {
        setIsLoading(false);
      }
    };

    // Add timeout to prevent hanging
    const timeoutId = setTimeout(fetchUserData, 100);
    return () => clearTimeout(timeoutId);
  }, [user?.id]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.replace('/splashscreen');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut, router]);

  // Memoized onboarding data to prevent unnecessary recalculations
  const onboardingData = useMemo(() => {
    if (!user) return null;

    return [
      { label: ONBOARDING_LABELS.FULL_NAME, value: user.full_name || 'Not provided' },
      { label: ONBOARDING_LABELS.GENDER, value: user.gender || 'Not provided' },
      { label: ONBOARDING_LABELS.BIRTHDAY, value: user.birthday || 'Not provided' },
      { label: ONBOARDING_LABELS.DEVOTIONAL_EXPERIENCE, value: user.devotional_experience || 'Not provided' },
      { label: ONBOARDING_LABELS.SPIRITUAL_JOURNEY, value: user.spiritual_journey || 'Not provided' },
      { label: ONBOARDING_LABELS.LIFE_CHALLENGES, value: user.life_challenges?.join(', ') || 'Not provided' },
      { label: ONBOARDING_LABELS.CURRENT_EMOTIONAL_STATE, value: user.current_emotional_state || 'Not provided' },
      { label: ONBOARDING_LABELS.PREFERRED_THEMES, value: user.preferred_themes?.join(', ') || 'Not provided' },
      { label: ONBOARDING_LABELS.DEVOTIONAL_GOALS, value: user.devotional_goals?.join(', ') || 'Not provided' },
      { label: ONBOARDING_LABELS.STYLE_REVERENT_CONVERSATIONAL, value: user.style_reverent_conversational ? `${user.style_reverent_conversational}/10` : 'Not provided' },
      { label: ONBOARDING_LABELS.STYLE_COMFORTING_CHALLENGING, value: user.style_comforting_challenging ? `${user.style_comforting_challenging}/10` : 'Not provided' },
      { label: ONBOARDING_LABELS.STYLE_POETIC_PRACTICAL, value: user.style_poetic_practical ? `${user.style_poetic_practical}/10` : 'Not provided' },
      { label: ONBOARDING_LABELS.STYLE_TRADITIONAL_MODERN, value: user.style_traditional_modern ? `${user.style_traditional_modern}/10` : 'Not provided' },
      { label: ONBOARDING_LABELS.PREFERRED_TIME, value: user.preferred_time || 'Not provided' },
      { label: ONBOARDING_LABELS.ADDITIONAL_NOTES, value: user.additional_notes || 'Not provided' },
    ];
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.headerSection, { marginTop: insets.top + SPACING.xl }]}>
        {isLoading ? (
          <View style={styles.loadingHeader}>
            <ActivityIndicator size="small" color={colors.buttonBackground} />
            <Text style={[styles.welcomeText, { color: colors.textPrimary }]}>
              Welcome to Rapha
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.welcomeText, { color: colors.textPrimary }]}>
              Hello {userName}!
            </Text>
            <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
              Your personalized spiritual journey begins here
            </Text>
          </>
        )}
      </View>

      {/* Status Cards Section */}
      <View style={styles.statusSection}>




        {/* Onboarding Data Section */}
        {onboardingData && (
          <View style={[styles.statusCard, { backgroundColor: colors.grey }]}>
            <Text style={[styles.statusCardTitle, { color: colors.textPrimary }]}>
              Onboarding Data (From Database)
            </Text>
            <FlatList
              data={onboardingData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.dataRow}>
                  <Text style={[styles.dataLabel, { color: colors.textPrimary }]}>
                    {item.label}:
                  </Text>
                  <Text style={[styles.dataValue, { color: colors.textSecondary }]}>
                    {item.value}
                  </Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              style={styles.onboardingDataScroll}
            />
          </View>
        )}
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutSection}>
        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: colors.textSecondary }]}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text style={[styles.signOutButtonText, { color: colors.textSecondary }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  loadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  welcomeText: {
    ...getTypography('h1', 'medium'),
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitleText: {
    ...getTypography('largeText', 'regular'),
    textAlign: 'center',
  },
  
  // Status Section
  statusSection: {
    flex: 1,
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statusCard: {
    padding: SPACING.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusCardTitle: {
    ...getTypography('h3', 'medium'),
    marginBottom: SPACING.md,
  },
  statusContent: {
    gap: SPACING.sm,
  },
  statusText: {
    ...getTypography('text', 'regular'),
  },
  onboardingDataScroll: {
    maxHeight: 300,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: SPACING.sm,
  },
  dataValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  
  // Sign Out Section
  signOutSection: {
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  signOutButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButtonText: {
    ...getTypography('text', 'medium'),
  },
});
