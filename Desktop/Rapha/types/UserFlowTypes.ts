/**
 * User flow completion states for routing logic
 */
export interface UserFlowState {
  hasCompletedOnboarding: boolean;
}

/**
 * User profile data that includes flow completion status and onboarding data
 */
export interface UserProfile extends UserFlowState {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  // Onboarding data fields
  full_name?: string;
  gender?: string;
  birthday?: string;
  devotional_experience?: string;
  spiritual_journey?: string;
  life_challenges?: string[];
  current_emotional_state?: string;
  preferred_themes?: string[];
  devotional_goals?: string[];
  style_reverent_conversational?: number;
  style_comforting_challenging?: number;
  style_poetic_practical?: number;
  style_traditional_modern?: number;
  preferred_time?: string;
  additional_notes?: string;
}

/**
 * Onboarding data structure
 */
export interface OnboardingData {
  // Add specific onboarding fields as needed
  [key: string]: any;
}


