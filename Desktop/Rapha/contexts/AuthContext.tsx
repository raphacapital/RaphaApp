import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/authService';
import { AuthUser, UserProfile as DatabaseUserProfile } from '../services/supabase';
import { supabase } from '../services/supabase';
import { UserProfile, UserFlowState } from '../types/UserFlowTypes';

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userFlowState: UserFlowState;
  signInWithApple: (onboardingData: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  updateUserFlowState: (updates: Partial<UserFlowState>) => void;
  markOnboardingComplete: () => void;
  markPaymentComplete: () => void;
  resetFlowStates: () => void;
  forceClearAuth: () => Promise<void>;
}

/**
 * Authentication context provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Create authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys for persisting user data locally
const USER_PROFILE_KEY = '@rapha_user_profile';
const FLOW_STATE_KEY = '@rapha_flow_state';

/**
 * Convert database profile to app profile
 */
const convertDatabaseProfileToAppProfile = (
  dbProfile: DatabaseUserProfile, 
  flowState: UserFlowState
): UserProfile => {
  return {
    id: dbProfile.user_id || dbProfile.id,
    email: '', // Will be filled from auth user
    created_at: dbProfile.created_at || new Date().toISOString(),
    updated_at: dbProfile.updated_at || new Date().toISOString(),
    hasCompletedOnboarding: flowState.hasCompletedOnboarding,
    hasPaidThroughSuperwall: flowState.hasPaidThroughSuperwall,
  };
};

/**
 * Convert auth user to app profile
 */
const createAppProfileFromAuthUser = (
  authUser: AuthUser, 
  flowState: UserFlowState
): UserProfile => {
  return {
    id: authUser.id,
    email: authUser.email,
    created_at: authUser.created_at,
    updated_at: authUser.updated_at,
    hasCompletedOnboarding: flowState.hasCompletedOnboarding,
    hasPaidThroughSuperwall: flowState.hasPaidThroughSuperwall,
  };
};

/**
 * Authentication provider component
 * Manages authentication state with local-first approach
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userFlowState, setUserFlowState] = useState<UserFlowState>({
    hasCompletedOnboarding: false,
    hasPaidThroughSuperwall: false,
  });

  // Debug: Monitor user state changes
  useEffect(() => {
    console.log('👤 AuthContext: User state changed:', { 
      user: user ? { id: user.id, email: user.email } : null,
      isAuthenticated: !!user 
    });
  }, [user]);

  // Load persisted user data from local storage on startup
  useEffect(() => {
    const loadPersistedUserData = async () => {
      try {
        console.log('📱 AuthContext: Loading persisted user data from local storage...');
        
        // Load user profile
        const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
        const storedFlowState = await AsyncStorage.getItem(FLOW_STATE_KEY);
        
        if (storedProfile) {
          const userProfile = JSON.parse(storedProfile);
          console.log('📱 AuthContext: Loaded user profile from local storage:', userProfile);
          setUser(userProfile);
        }
        
        if (storedFlowState) {
          const flowState = JSON.parse(storedFlowState);
          console.log('📱 AuthContext: Loaded flow state from local storage:', flowState);
          setUserFlowState(flowState);
        }
        
        if (!storedProfile && !storedFlowState) {
          console.log('📱 AuthContext: No persisted user data found');
        }
      } catch (error) {
        console.error('📱 AuthContext: Error loading persisted user data:', error);
      }
    };

    loadPersistedUserData();
  }, []);

  // Function to persist user data locally
  const persistUserData = async (userProfile: UserProfile, flowState: UserFlowState) => {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
      await AsyncStorage.setItem(FLOW_STATE_KEY, JSON.stringify(flowState));
      console.log('📱 AuthContext: User data persisted locally');
    } catch (error) {
      console.error('📱 AuthContext: Error persisting user data:', error);
    }
  };

  // Function to clear all local data
  const clearLocalData = async () => {
    try {
      await AsyncStorage.multiRemove([USER_PROFILE_KEY, FLOW_STATE_KEY]);
      console.log('📱 AuthContext: Local user data cleared');
    } catch (error) {
      console.error('📱 AuthContext: Error clearing local data:', error);
    }
  };

  // Listen to Supabase auth state changes
  useEffect(() => {
    console.log('🔍 AuthContext: Setting up Supabase auth listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: Supabase auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ AuthContext: User signed in via Supabase, checking for existing profile...');
          
          // Check if we have a local profile for this user
          const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
          if (storedProfile) {
            const localProfile = JSON.parse(storedProfile);
            if (localProfile.id === session.user.id) {
              console.log('✅ AuthContext: Found matching local profile, using it');
              setUser(localProfile);
              // Flow state is already loaded from local storage
              return;
            }
          }
          
          // No local profile found, try to fetch from Supabase
          console.log('🔍 AuthContext: No local profile found, fetching from Supabase...');
          try {
            const { profile, error } = await AuthService.getUserProfile(session.user.id);
            
            if (profile && !error) {
              console.log('✅ AuthContext: Profile fetched from Supabase, storing locally');
              const appProfile = convertDatabaseProfileToAppProfile(profile, {
                hasCompletedOnboarding: false, // Default, will be updated from local storage
                hasPaidThroughSuperwall: false,
              });
              // Update email from auth user
              appProfile.email = session.user.email!;
              
              setUser(appProfile);
              // Persist to local storage with current flow state
              await persistUserData(appProfile, {
                hasCompletedOnboarding: false,
                hasPaidThroughSuperwall: false,
              });
            } else {
              console.log('⚠️ AuthContext: No profile found in Supabase, creating default user');
              const defaultUser = createAppProfileFromAuthUser({
                id: session.user.id,
                email: session.user.email!,
                created_at: session.user.created_at,
                updated_at: session.user.updated_at!,
              }, {
                hasCompletedOnboarding: false,
                hasPaidThroughSuperwall: false,
              });
              setUser(defaultUser);
              // Don't persist default user yet - wait for onboarding completion
            }
          } catch (fetchError) {
            console.error('❌ AuthContext: Error fetching profile from Supabase:', fetchError);
            console.log('⚠️ AuthContext: Creating default user due to fetch error');
            const defaultUser = createAppProfileFromAuthUser({
              id: session.user.id,
              email: session.user.email!,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at!,
            }, {
              hasCompletedOnboarding: false,
              hasPaidThroughSuperwall: false,
            });
            setUser(defaultUser);
            // Don't persist default user yet - wait for onboarding completion
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ AuthContext: User signed out via Supabase, clearing local state');
          setUser(null);
          setUserFlowState({
            hasCompletedOnboarding: false,
            hasPaidThroughSuperwall: false,
          });
          // Clear all local data
          await clearLocalData();
        }
      }
    );

    // Check initial auth state
    const checkInitialAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('🔍 AuthContext: Found existing session on startup');
          
          // Check if we have local data for this user
          const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
          if (storedProfile) {
            const localProfile = JSON.parse(storedProfile);
            if (localProfile.id === session.user.id) {
              console.log('✅ AuthContext: Using existing local profile data');
              setUser(localProfile);
              // Flow state is already loaded from local storage
              return;
            }
          }
          
          // No local data, fetch from Supabase
          console.log('🔍 AuthContext: Fetching profile from Supabase on startup...');
          try {
            const { profile, error } = await AuthService.getUserProfile(session.user.id);
            
            if (profile && !error) {
              console.log('✅ AuthContext: Profile loaded from Supabase on startup');
              const appProfile = convertDatabaseProfileToAppProfile(profile, {
                hasCompletedOnboarding: false,
                hasPaidThroughSuperwall: false,
              });
              // Update email from auth user
              appProfile.email = session.user.email!;
              
              setUser(appProfile);
              // Persist to local storage with current flow state
              await persistUserData(appProfile, {
                hasCompletedOnboarding: false,
                hasPaidThroughSuperwall: false,
              });
            } else {
              console.log('⚠️ AuthContext: No profile found, creating default user');
              const defaultUser = createAppProfileFromAuthUser({
                id: session.user.id,
                email: session.user.email!,
                created_at: session.user.created_at,
                updated_at: session.user.updated_at!,
              }, {
                hasCompletedOnboarding: false,
                hasPaidThroughSuperwall: false,
              });
              setUser(defaultUser);
            }
          } catch (fetchError) {
            console.error('❌ AuthContext: Error fetching profile from Supabase on startup:', fetchError);
            console.log('⚠️ AuthContext: Creating default user due to fetch error');
            const defaultUser = createAppProfileFromAuthUser({
              id: session.user.id,
              email: session.user.email!,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at!,
            }, {
              hasCompletedOnboarding: false,
              hasPaidThroughSuperwall: false,
            });
            setUser(defaultUser);
          }
        } else {
          console.log('🔍 AuthContext: No existing session found on startup');
        }
      } catch (error) {
        console.error('🔍 AuthContext: Error checking initial auth state:', error);
      }
    };

    checkInitialAuth();

    return () => {
      console.log('🔍 AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in with Apple
   */
  const signInWithApple = async (onboardingData: any) => {
    try {
      console.log('🔐 AuthContext: Starting Apple Sign In...');
      setIsLoading(true);
      const result = await AuthService.signInWithApple(onboardingData);

      console.log('🔐 AuthContext: Apple Sign In result:', result);

      if (result.error) {
        console.log('❌ AuthContext: Sign in failed with error:', result.error);
        return { success: false, error: result.error };
      }

      if (result.user) {
        console.log('✅ AuthContext: Sign in successful, user returned:', result.user);
        // Note: We don't need to call setUser here because the Supabase auth listener
        // will automatically update the state when the auth state changes
        return { success: true };
      }

      console.log('❌ AuthContext: No user returned from sign in');
      return { success: false, error: 'Authentication failed' };
    } catch (error: any) {
      console.error('🔐 AuthContext: Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      console.log('🔐 AuthContext: Setting loading to false');
      setIsLoading(false);
    }
  };

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      setIsLoading(true);
      const result = await AuthService.signOut();
      
      if (result.success) {
        setUser(null);
        setUserFlowState({
          hasCompletedOnboarding: false,
          hasPaidThroughSuperwall: false,
        });
        // Clear all local data
        await clearLocalData();
      } else {
        console.error('Sign out error:', result.error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user flow state locally and sync to Supabase
   */
  const updateUserFlowState = async (updates: Partial<UserFlowState>) => {
    console.log('🔄 AuthContext: Updating user flow state:', updates);
    
    // Update local state immediately
    setUserFlowState(prev => {
      const newState = { ...prev, ...updates };
      console.log('🔄 AuthContext: New flow state:', newState);
      
      // Persist to local storage
      if (user) {
        const updatedUser = { ...user, ...newState };
        persistUserData(updatedUser, newState);
        
        // Sync to Supabase in background
        if (user.id) {
          AuthService.updateUserProfile(user.id, updatedUser).catch(error => {
            console.error('❌ AuthContext: Failed to sync to Supabase:', error);
          });
        }
      }
      
      return newState;
    });
  };

  /**
   * Mark onboarding as complete
   */
  const markOnboardingComplete = () => {
    console.log('🎯 AuthContext: Marking onboarding as complete');
    updateUserFlowState({ hasCompletedOnboarding: true });
  };

  /**
   * Mark payment as complete
   */
  const markPaymentComplete = () => {
    updateUserFlowState({ hasPaidThroughSuperwall: true });
  };

  /**
   * Reset all flow states (for testing purposes)
   */
  const resetFlowStates = () => {
    setUserFlowState({
      hasCompletedOnboarding: false,
      hasPaidThroughSuperwall: false,
    });
    // Clear local data
    clearLocalData();
    console.log('📱 AuthContext: Flow states reset and local data cleared');
  };

  /**
   * Force clear all authentication state and go back to splash screen
   * This is useful for development/testing or when you want to start fresh
   */
  const forceClearAuth = async () => {
    try {
      console.log('🧹 AuthContext: Force clearing all authentication state...');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      setUserFlowState({
        hasCompletedOnboarding: false,
        hasPaidThroughSuperwall: false,
      });
      
      // Clear all local data
      await clearLocalData();
      
      console.log('🧹 AuthContext: Authentication state cleared successfully');
    } catch (error) {
      console.error('🧹 AuthContext: Error clearing auth state:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    userFlowState,
    signInWithApple,
    signOut,
    setUser,
    updateUserFlowState,
    markOnboardingComplete,
    markPaymentComplete,
    resetFlowStates,
    forceClearAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
