/**
 * User flow completion states for routing logic
 */
export interface UserFlowState {
  hasCompletedOnboarding: boolean;
  hasPaidThroughSuperwall: boolean;
}

/**
 * User profile data that includes flow completion status
 */
export interface UserProfile extends UserFlowState {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/**
 * Onboarding data structure
 */
export interface OnboardingData {
  // Add specific onboarding fields as needed
  [key: string]: any;
}


