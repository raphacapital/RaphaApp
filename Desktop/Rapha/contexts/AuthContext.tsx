import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

/**
 * Authentication provider component
 * Manages authentication state and provides authentication methods
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

  // Listen to Supabase auth state changes
  useEffect(() => {
    console.log('🔍 AuthContext: Setting up Supabase auth listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: Supabase auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ AuthContext: User signed in via Supabase, updating local state');
          const authUser: UserProfile = {
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at!,
            hasCompletedOnboarding: false, // Default to false, will be updated from database
            hasPaidThroughSuperwall: false,
          };
          setUser(authUser);
          setUserFlowState({
            hasCompletedOnboarding: false,
            hasPaidThroughSuperwall: false,
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ AuthContext: User signed out via Supabase, clearing local state');
          setUser(null);
        }
      }
    );

    // Check initial auth state
    const checkInitialAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('🔍 AuthContext: Found existing session on startup');
          const authUser: UserProfile = {
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at!,
            hasCompletedOnboarding: false, // Default to false, will be updated from database
            hasPaidThroughSuperwall: false,
          };
          setUser(authUser);
          setUserFlowState({
            hasCompletedOnboarding: false,
            hasPaidThroughSuperwall: false,
          });
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
    console.log('🔄 AuthContext: Updating user flow state:', updates);
    setUserFlowState(prev => {
      const newState = { ...prev, ...updates };
      console.log('🔄 AuthContext: New flow state:', newState);
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
