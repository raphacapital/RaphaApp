import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import AuthScreen from '../components/AuthScreen';
import { UserProfile } from '../services/supabase';

/**
 * Auth Screen Route - Displays authentication options
 * Receives onboarding data as route parameters
 */
export default function AuthRoute() {
  const params = useLocalSearchParams();
  
  // Extract onboarding data from route params
  const onboardingData = {
    gender: params.gender as string,
    birthday: params.birthday as string,
    devotional_experience: params.devotional_experience as string,
    spiritual_journey: params.spiritual_journey as string,
    life_challenges: params.life_challenges ? JSON.parse(params.life_challenges as string) : undefined,
    current_emotional_state: params.emotional_state ? JSON.parse(params.emotional_state as string) : undefined,
    preferred_themes: params.preferred_themes ? JSON.parse(params.preferred_themes as string) : undefined,
    devotional_goals: params.devotional_goals ? JSON.parse(params.devotional_goals as string) : undefined,
    style_reverent_conversational: params.style_reverent_conversational ? parseInt(params.style_reverent_conversational as string) : undefined,
    style_comforting_challenging: params.style_comforting_challenging ? parseInt(params.style_comforting_challenging as string) : undefined,
    style_poetic_practical: params.style_poetic_practical ? parseInt(params.style_poetic_practical as string) : undefined,
    style_traditional_modern: params.style_traditional_modern ? parseInt(params.style_traditional_modern as string) : undefined,
    preferred_time: params.preferred_time ? JSON.parse(params.preferred_time as string) : undefined,
    additional_notes: params.additional_notes as string,
  };

  const handleAuthSuccess = (user: any) => {
    console.log('🎉 User authenticated successfully:', user);
    // AuthScreen now handles navigation directly, so this callback is just for logging
  };

  const handleAuthError = (error: string) => {
    console.error('❌ Authentication failed:', error);
    // Could show error message or retry
  };

  return (
    <AuthScreen
      onboardingData={onboardingData}
      onAuthSuccess={handleAuthSuccess}
      onAuthError={handleAuthError}
    />
  );
}
