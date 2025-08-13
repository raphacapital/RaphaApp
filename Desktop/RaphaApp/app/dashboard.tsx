import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getColors, SPACING, getTypography } from '../constants/theme';
import { supabase } from '../services/supabase';

/**
 * Dashboard Screen - Main app screen after authentication
 */
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  const { user, signOut, userFlowState, resetFlowStates, refreshUserProfile } = useAuth();
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
          return; // Don't fetch yet, wait for user to be available
        }

        console.log('🔍 Dashboard: Fetching profile for user:', user.id);

        // Refresh user profile data to get latest flow completion status
        await refreshUserProfile();

        // Get user profile data from user_profiles table
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setUserName('there');
        } else if (profile?.full_name) {
          // Extract first name from full name (take everything before first space)
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

    fetchUserData();
  }, [user?.id, refreshUserProfile]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/splashscreen');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Content container with safe area margins */}
      <View style={[
        styles.contentContainer,
        {
          marginTop: insets.top + SPACING.xl,
          marginBottom: insets.bottom + SPACING.xl,
          marginHorizontal: SPACING.lg,
        }
      ]}>
        {/* Header */}
        <View style={styles.headerContainer}>
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

        {/* Authentication Status */}
        <View style={[styles.authStatusCard, { backgroundColor: colors.grey }]}>
          <Text style={[styles.authStatusTitle, { color: colors.textPrimary }]}>
            Authentication Status
          </Text>
          <Text style={[styles.authStatusText, { color: colors.textSecondary }]}>
            User ID: {user?.id || 'Not available'}
          </Text>
          <Text style={[styles.authStatusText, { color: colors.textSecondary }]}>
            Email: {user?.email || 'Not available'}
          </Text>
          <Text style={[styles.authStatusText, { color: colors.textSecondary }]}>
            Signed in: {user ? 'Yes' : 'No'}
          </Text>
        </View>

        {/* Flow Completion Status */}
        <View style={[styles.authStatusCard, { backgroundColor: colors.grey }]}>
          <View style={styles.flowStatusHeader}>
            <Text style={[styles.authStatusTitle, { color: colors.textPrimary }]}>
              Flow Completion Status
            </Text>
            <TouchableOpacity
              style={[styles.refreshButton, { backgroundColor: colors.buttonBackground }]}
              onPress={refreshUserProfile}
              activeOpacity={0.8}
            >
              <Text style={[styles.refreshButtonText, { color: colors.buttonText }]}>
                🔄 Refresh
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.authStatusText, { color: colors.textSecondary }]}>
            Onboarding: {userFlowState.hasCompletedOnboarding ? '✅ Complete' : '❌ Incomplete'}
          </Text>
          <Text style={[styles.authStatusText, { color: colors.textSecondary }]}>
            EA Flow: {userFlowState.hasCompletedEAFlow ? '✅ Complete' : '❌ Incomplete'}
          </Text>
          <Text style={[styles.authStatusText, { color: colors.textSecondary }]}>
            Payment: {userFlowState.hasPaidThroughSuperwall ? '✅ Complete' : '❌ Incomplete'}
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={[styles.card, { backgroundColor: colors.grey }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Your First Devotional
            </Text>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Based on your preferences, we're preparing a personalized devotional experience just for you.
            </Text>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.buttonBackground }]}
              onPress={() => console.log('Start devotional')}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                Start Your Devotional
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: colors.grey }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Profile Settings
            </Text>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Update your preferences, devotional times, and spiritual goals.
            </Text>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.buttonBackground }]}
              onPress={() => console.log('Profile settings')}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.buttonBackground }]}>
                Manage Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity
            style={[styles.signOutButton, { borderColor: colors.textSecondary }]}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Text style={[styles.signOutText, { color: colors.textSecondary }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Test Reset Buttons */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity
            style={[styles.signOutButton, { borderColor: colors.buttonBackground, marginBottom: SPACING.sm }]}
            onPress={() => {
              // Reset all flow states for testing
              console.log('🧪 Dashboard: Resetting all flow states for testing');
              resetFlowStates();
              router.replace('/');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.signOutText, { color: colors.buttonBackground }]}>
              Reset Flow States (Test)
            </Text>
          </TouchableOpacity>
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
  },
  headerContainer: {
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
  mainContent: {
    flex: 1,
    gap: SPACING.lg,
  },
  card: {
    padding: SPACING.lg,
    borderRadius: 12,
    gap: SPACING.md,
  },
  cardTitle: {
    ...getTypography('h2', 'medium'),
  },
  cardText: {
    ...getTypography('text', 'regular'),
    lineHeight: 22,
  },
  primaryButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  buttonText: {
    ...getTypography('largeText', 'medium'),
  },
  secondaryButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    borderWidth: 2,
  },
  secondaryButtonText: {
    ...getTypography('largeText', 'medium'),
  },
  signOutContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  signOutButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 999,
    borderWidth: 1,
  },
  signOutText: {
    ...getTypography('text', 'medium'),
  },
  authStatusCard: {
    padding: SPACING.lg,
    borderRadius: 12,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  authStatusTitle: {
    ...getTypography('h3', 'medium'),
    marginBottom: SPACING.sm,
  },
  authStatusText: {
    ...getTypography('text', 'regular'),
    marginBottom: SPACING.xs,
  },
  flowStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  refreshButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    ...getTypography('smallText', 'medium'),
  },
});
