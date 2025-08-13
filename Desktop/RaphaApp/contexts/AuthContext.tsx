import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthService } from '../services/authService';
import { AuthUser } from '../services/supabase';
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
  markEAFlowComplete: () => void;
  markPaymentComplete: () => void;
  resetFlowStates: () => void;
  refreshUserProfile: () => Promise<void>;
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

/**
 * Authentication provider component
 * Manages authentication state and provides authentication methods
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userFlowState, setUserFlowState] = useState<UserFlowState>({
    hasCompletedOnboarding: false,
    hasCompletedEAFlow: false,
    hasPaidThroughSuperwall: false,
  });

  // Debug: Monitor user state changes
  useEffect(() => {
    console.log('👤 AuthContext: User state changed:', { 
      user: user ? { id: user.id, email: user.email } : null,
      isAuthenticated: !!user 
    });
  }, [user]);

  /**
   * Fetch user profile data from Supabase and update local state
   */
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log('🔍 AuthContext: Fetching user profile for:', userId);
      
      // Fetch user profile from user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('❌ AuthContext: Error fetching user profile:', profileError);
        // If profile doesn't exist, create a basic one
        return {
          hasCompletedOnboarding: false,
          hasCompletedEAFlow: false,
          hasPaidThroughSuperwall: false,
        };
      }

      if (profileData) {
        console.log('✅ AuthContext: User profile fetched successfully:', {
          hasOnboardingData: !!profileData.gender,
          hasEAFlowData: !!profileData.devotional_goals,
          hasPaymentData: false // This would come from a different table/service
        });

        // Determine completion status based on profile data
        const hasCompletedOnboarding = !!(
          profileData.gender &&
          profileData.birthday &&
          profileData.devotional_experience &&
          profileData.spiritual_journey &&
          profileData.current_emotional_state &&
          profileData.preferred_themes &&
          profileData.devotional_goals &&
          profileData.style_reverent_conversational !== undefined &&
          profileData.style_comforting_challenging !== undefined &&
          profileData.style_poetic_practical !== undefined &&
          profileData.style_traditional_modern !== undefined &&
          profileData.preferred_time
        );

        const hasCompletedEAFlow = !!(
          profileData.devotional_goals &&
          profileData.preferred_themes
        );

        // For now, assume payment is not completed (this would need to be updated based on your payment system)
        const hasPaidThroughSuperwall = false;

        return {
          hasCompletedOnboarding,
          hasCompletedEAFlow,
          hasPaidThroughSuperwall,
        };
      }

      return {
        hasCompletedOnboarding: false,
        hasCompletedEAFlow: false,
        hasPaidThroughSuperwall: false,
      };
    } catch (error) {
      console.error('❌ AuthContext: Unexpected error fetching user profile:', error);
      return {
        hasCompletedOnboarding: false,
        hasCompletedEAFlow: false,
        hasPaidThroughSuperwall: false,
      };
    }
  }, []);

  // Listen to Supabase auth state changes
  useEffect(() => {
    console.log('🔍 AuthContext: Setting up Supabase auth listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: Supabase auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ AuthContext: User signed in via Supabase, updating local state');
          
          // Fetch the user's actual profile data from Supabase
          const flowState = await fetchUserProfile(session.user.id);
          
          const authUser: UserProfile = {
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at!,
            ...flowState, // Include the actual flow completion status
          };
          
          setUser(authUser);
          setUserFlowState(flowState);
          
          console.log('✅ AuthContext: User state updated with profile data:', flowState);
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ AuthContext: User signed out via Supabase, clearing local state');
          setUser(null);
          setUserFlowState({
            hasCompletedOnboarding: false,
            hasCompletedEAFlow: false,
            hasPaidThroughSuperwall: false,
          });
        }
      }
    );

    // Check initial auth state
    const checkInitialAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('🔍 AuthContext: Found existing session on startup');
          
          // Fetch the user's actual profile data from Supabase
          const flowState = await fetchUserProfile(session.user.id);
          
          const authUser: UserProfile = {
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at!,
            ...flowState, // Include the actual flow completion status
          };
          
          setUser(authUser);
          setUserFlowState(flowState);
          
          console.log('✅ AuthContext: Initial auth state updated with profile data:', flowState);
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
          hasCompletedEAFlow: false,
          hasPaidThroughSuperwall: false,
        });
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
   * Update user flow state
   */
  const updateUserFlowState = (updates: Partial<UserFlowState>) => {
    setUserFlowState(prev => ({ ...prev, ...updates }));
  };

  /**
   * Mark onboarding as complete
   */
  const markOnboardingComplete = () => {
    updateUserFlowState({ hasCompletedOnboarding: true });
  };

  /**
   * Mark EA flow as complete
   */
  const markEAFlowComplete = () => {
    updateUserFlowState({ hasCompletedEAFlow: true });
  };

  /**
   * Mark payment as complete
   */
  const markPaymentComplete = () => {
    updateUserFlowState({ hasPaidThroughSuperwall: true });
  };

  /**
   * Refresh user profile data from Supabase
   */
  const refreshUserProfile = useCallback(async () => {
    if (user?.id) {
      console.log('🔄 AuthContext: Refreshing user profile data...');
      const flowState = await fetchUserProfile(user.id);
      setUserFlowState(flowState);
      
      // Update the user object with new flow state
      setUser(prev => prev ? { ...prev, ...flowState } : null);
      
      console.log('✅ AuthContext: User profile refreshed:', flowState);
    }
  }, [user?.id, fetchUserProfile]);

  /**
   * Reset all flow states (for testing purposes)
   */
  const resetFlowStates = () => {
    setUserFlowState({
      hasCompletedOnboarding: false,
      hasCompletedEAFlow: false,
      hasPaidThroughSuperwall: false,
    });
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
    markEAFlowComplete,
    markPaymentComplete,
    resetFlowStates,
    refreshUserProfile,
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
