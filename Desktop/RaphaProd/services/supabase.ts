import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = 'https://wltikekljokjmoxzgfjq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsdGlrZWtsam9ram1veHpnZmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTg5MTUsImV4cCI6MjA2OTgzNDkxNX0.X-8L0knwFP9F_F_raSO6vf7hWByUMTjVCYoUArvX0Ok';

// Create Supabase client with Apple authentication support
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});

// Database types for user profiles
export interface UserProfile {
  id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  full_name?: string; // User's full name from Apple Sign In
  gender?: string;
  birthday?: string;
  devotional_experience?: string;
  spiritual_journey?: string;
  life_challenges?: string[];
  current_emotional_state?: string[];
  preferred_themes?: string[];
  devotional_goals?: string[];
  style_reverent_conversational?: number;
  style_comforting_challenging?: number;
  style_poetic_practical?: number;
  style_traditional_modern?: number;
  preferred_time?: string[]; // Array of selected time slots (e.g., ["morning", "afternoon"])
  devotional_times?: {[key: string]: string}; // Specific times in 24-hour format (e.g., {"morning": "09:00"})
  additional_notes?: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Error types
export interface SupabaseError {
  message: string;
  status?: number;
  details?: string;
}

/**
 * Handle Supabase errors and return user-friendly messages
 * @param error - The error object from Supabase
 * @returns Formatted error message
 */
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return 'An unexpected error occurred. Please try again.';
};
