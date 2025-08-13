import { supabase, UserProfile, AuthUser, handleSupabaseError } from './supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

/**
 * Authentication service for handling Apple Sign In and user management
 */
export class AuthService {
  /**
   * Sign in with Apple and create/update user profile
   * @param onboardingData - Data collected during onboarding
   * @returns Promise with user data or error
   */
  static async signInWithApple(
    onboardingData?: Partial<UserProfile>
  ): Promise<{ user: AuthUser | null; error: string | null; isNewUser?: boolean }> {
    try {
      // Check if Apple Sign In is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        return { user: null, error: 'Apple Sign In is not available on this device' };
      }

      // Request Apple authentication
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        return { user: null, error: 'Apple Sign In failed - no identity token received' };
      }

      // Extract user info from Apple credential with better fallback logic
      const email = credential.email || '';
      let fullName = '';
      
      if (credential.fullName) {
        const { givenName, familyName, nickname } = credential.fullName;
        if (givenName && familyName) {
          fullName = `${givenName} ${familyName}`;
        } else if (givenName) {
          fullName = givenName;
        } else if (familyName) {
          fullName = familyName;
        } else if (nickname) {
          fullName = nickname;
        }
      }

      // Log the extracted information for debugging
      console.log('Apple Sign In - Extracted info:', {
        email: email ? '***' + email.substring(email.indexOf('@')) : 'No email',
        fullName: fullName || 'No name provided',
        hasIdentityToken: !!credential.identityToken,
        userId: credential.user || 'No user ID'
      });

      // Check if user already exists
      const { data: existingUser, error: userCheckError } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (userCheckError) {
        // If user doesn't exist, create a new one
        if (userCheckError.message.includes('User not found') || userCheckError.message.includes('Invalid login credentials')) {
          return await this.createNewAppleUser(credential, onboardingData, email, fullName);
        }
        return { user: null, error: handleSupabaseError(userCheckError) };
      }

      if (existingUser.user) {
        // User exists, update profile if we have new information
        const updateData: Partial<UserProfile> = { ...onboardingData };
        
        // Only update name if we have a new one and the existing one is empty
        if (fullName) {
          const existingProfile = await this.getUserProfile(existingUser.user.id);
          if (!existingProfile.profile?.full_name) {
            updateData.full_name = fullName;
          }
        }

        const profileResult = await this.updateUserProfile(existingUser.user.id, updateData);
        if (profileResult.error) {
          return { user: null, error: profileResult.error };
        }

        const user: AuthUser = {
          id: existingUser.user.id,
          email: existingUser.user.email!,
          created_at: existingUser.user.created_at,
          updated_at: existingUser.user.updated_at!,
        };

        return { user, error: null, isNewUser: false };
      }

      return { user: null, error: 'Failed to authenticate with Apple' };

    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        return { user: null, error: 'Sign in was cancelled' };
      }
      
      console.error('Apple Sign In error:', error);
      return { user: null, error: 'An unexpected error occurred during Apple Sign In' };
    }
  }

  /**
   * Create a new user with Apple authentication
   */
  private static async createNewAppleUser(
    credential: AppleAuthentication.AppleAuthenticationCredential,
    onboardingData: Partial<UserProfile>,
    email: string,
    fullName: string
  ): Promise<{ user: AuthUser | null; error: string | null; isNewUser?: boolean }> {
    try {
      console.log('Creating new Apple user with:', {
        email: email ? '***' + email.substring(email.indexOf('@')) : 'No email',
        fullName: fullName || 'No name provided',
        hasOnboardingData: !!onboardingData
      });

      // Generate a secure random password for Supabase
      const randomPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        credential.identityToken + Date.now().toString() + Math.random().toString(),
        { encoding: Crypto.CryptoEncoding.HEX }
      );

      // Create new user with email and password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: randomPassword,
        options: {
          data: {
            full_name: fullName,
            provider: 'apple',
            apple_id: credential.user,
          }
        }
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        return { user: null, error: handleSupabaseError(signUpError) };
      }

      if (!signUpData.user) {
        console.error('No user data returned from signup');
        return { user: null, error: 'Failed to create user account' };
      }

      console.log('User created successfully, creating profile...');

      // Create user profile with onboarding data and full name
      const profileData: Partial<UserProfile> = {
        ...onboardingData,
        full_name: fullName, // Always include the full name from Apple
      };

      const profileResult = await this.createUserProfile(signUpData.user.id, profileData);

      if (profileResult.error) {
        console.error('Profile creation error:', profileResult.error);
        // Don't fail the entire signup if profile creation fails
        // The user can still use the app and complete onboarding later
        console.warn('Profile creation failed, but user account was created');
      } else {
        console.log('User profile created successfully');
      }

      const user: AuthUser = {
        id: signUpData.user.id,
        email: signUpData.user.email!,
        created_at: signUpData.user.created_at,
        updated_at: signUpData.user.updated_at!,
      };

      return { user, error: null, isNewUser: true };

    } catch (error) {
      console.error('Unexpected error in createNewAppleUser:', error);
      return { user: null, error: 'Failed to create new user account' };
    }
  }

  /**
   * Create user profile with onboarding data
   * @param userId - User's unique ID
   * @param profileData - Partial<UserProfile>
   * @returns Promise with profile data or error
   */
  static async createUserProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<{ profile: UserProfile | null; error: string | null }> {
    try {
      // First check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId);

      if (checkError) {
        console.error('Error checking existing profile:', checkError);
        return { profile: null, error: handleSupabaseError(checkError) };
      }

      let profile: UserProfile | null = null;

      if (existingProfile && existingProfile.length > 0) {
        // Profile exists, update it
        const { data: updatedProfile, error: updateError } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', userId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating profile:', updateError);
          return { profile: null, error: handleSupabaseError(updateError) };
        }

        profile = updatedProfile as UserProfile;
      } else {
        // Profile doesn't exist, create it
        const profileToInsert: Partial<UserProfile> = {
          user_id: userId,
          ...profileData,
        };

        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert(profileToInsert)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return { profile: null, error: handleSupabaseError(insertError) };
        }

        profile = newProfile as UserProfile;
      }

      return { profile, error: null };
    } catch (error) {
      console.error('Unexpected error in createUserProfile:', error);
      return { profile: null, error: 'Failed to create/update user profile' };
    }
  }

  /**
   * Update existing user profile with new onboarding data
   * @param userId - User's unique ID
   * @param profileData - New onboarding data to update
   * @returns Promise with profile data or error
   */
  static async updateUserProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<{ profile: UserProfile | null; error: string | null }> {
    try {
      // Use upsert to handle both insert and update cases
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting profile:', error);
        return { profile: null, error: handleSupabaseError(error) };
      }

      return { profile: data as UserProfile, error: null };
    } catch (error) {
      console.error('Unexpected error in updateUserProfile:', error);
      return { profile: null, error: 'Failed to update user profile' };
    }
  }

  /**
   * Sign out the current user
   * @returns Promise with success status or error
   */
  static async signOut(): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: handleSupabaseError(error) };
      }

      return { success: true, error: null };
    } catch {
      return { success: false, error: 'An unexpected error occurred during sign out' };
    }
  }

  /**
   * Get the current authenticated user
   * @returns Promise with current user or null
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        return {
          id: user.id,
          email: user.email!,
          created_at: user.created_at,
          updated_at: user.updated_at!,
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Ensure user_profiles table exists with proper structure
   * This method should be called during app initialization
   */
  static async ensureUserProfilesTable(): Promise<{ success: boolean; error: string | null }> {
    try {
      // Try to create the table if it doesn't exist
      const { error } = await supabase.rpc('create_user_profiles_table_if_not_exists');
      
      if (error) {
        // If RPC doesn't exist, try to create table directly
        console.log('RPC method not available, attempting direct table creation...');
        
        // This is a fallback - in production, you should use migrations
        const { error: createError } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1);
        
        if (createError && createError.message.includes('relation "user_profiles" does not exist')) {
          console.error('user_profiles table does not exist. Please create it using Supabase migrations.');
          return { success: false, error: 'user_profiles table does not exist. Please create it using Supabase migrations.' };
        }
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error ensuring user_profiles table:', error);
      return { success: false, error: 'Failed to ensure user_profiles table exists' };
    }
  }

  /**
   * Get user profile by user ID
   * @param userId - User's unique ID
   * @returns Promise with profile data or error
   */
  static async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: string | null }> {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<{ profile: UserProfile | null; error: string | null }>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000); // 5 second timeout
      });

      const fetchPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId);

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error fetching user profile:', error);
        return { profile: null, error: handleSupabaseError(error) };
      }

      // Return the first profile if multiple exist, or null if none exist
      const profile = data && data.length > 0 ? data[0] as UserProfile : null;
      return { profile, error: null };
    } catch (error) {
      console.error('Unexpected error in getUserProfile:', error);
      return { profile: null, error: 'Failed to fetch user profile' };
    }
  }
}
