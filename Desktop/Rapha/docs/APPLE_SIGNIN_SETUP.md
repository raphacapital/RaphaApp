# Apple Sign In Setup Guide for Rapha App

## Overview
This guide explains how to properly configure Apple Sign In for the Rapha app using Expo and Supabase.

## What Was Fixed

### 1. App Configuration (`app.json`)
- ✅ Added Apple Authentication plugin configuration
- ✅ Added proper bundle identifiers for iOS and Android
- ✅ Configured services for sign-in functionality

### 2. Authentication Service (`src/services/authService.ts`)
- ✅ Rebuilt Apple Sign In flow using proper Supabase authentication
- ✅ Added proper error handling and user creation
- ✅ Implemented both new user creation and existing user authentication
- ✅ Added availability checking before attempting sign-in

### 3. Supabase Configuration (`src/services/supabase.ts`)
- ✅ Added PKCE flow type for better security
- ✅ Updated user profile interface to include full_name
- ✅ Configured proper authentication flow

### 4. Authentication Context (`src/contexts/AuthContext.tsx`)
- ✅ Created centralized authentication state management
- ✅ Added proper loading states and error handling
- ✅ Integrated with existing components

## Required Configuration

### 1. Supabase Project Setup
Make sure your Supabase project has:
- Apple OAuth provider enabled
- Proper authentication policies
- `user_profiles` table with the correct schema

### 2. Apple Developer Account
You need:
- Apple Developer Program membership
- App ID with Sign In with Apple capability
- Service ID for web authentication
- Private key for server-side verification

### 3. Environment Variables
Ensure these are properly configured:
- Supabase URL
- Supabase Anon Key
- Apple Service ID (if using web authentication)

## Testing the Implementation

### 1. Use the Test Component
Import and use `AppleSignInTest` component to verify:
- Apple Sign In availability
- Authentication flow
- Error handling

### 2. Test on Physical Device
Apple Sign In only works on physical iOS devices, not in simulators.

### 3. Check Console Logs
Monitor console output for:
- Authentication errors
- User creation/update status
- Profile data handling

## Common Issues and Solutions

### Issue: "Authentication failed: JSON object requested, multiple (or no) rows returned"
**Solution**: This error occurs when the `user_profiles` table doesn't exist or has duplicate entries. 
1. Run the SQL migration script in `supabase_migrations.sql` in your Supabase SQL Editor
2. Ensure the table has proper Row Level Security (RLS) policies
3. Check for duplicate user profiles and clean them up if necessary

### Issue: "Apple Sign In is not available"
**Solution**: Ensure you're testing on a physical iOS device with iOS 13+ and an Apple ID signed in.

### Issue: "Authentication failed"
**Solution**: Check Supabase configuration and ensure Apple OAuth is properly set up.

### Issue: "User not found" errors
**Solution**: Verify the user creation flow and database schema.

### Issue: Profile creation failures
**Solution**: Check the `user_profiles` table structure and permissions.

## Next Steps

1. **Test on Physical Device**: Verify the implementation works on a real iOS device
2. **Configure Supabase**: Ensure Apple OAuth is properly configured in your Supabase dashboard
3. **Add Error Boundaries**: Implement error boundaries for better error handling
4. **Add Loading States**: Enhance UI with better loading indicators
5. **Test Edge Cases**: Test various scenarios like network failures, user cancellation, etc.

## Security Considerations

- ✅ Identity tokens are properly validated
- ✅ Secure random passwords are generated for new users
- ✅ User data is properly sanitized
- ✅ Authentication state is managed securely

## Performance Optimizations

- ✅ Authentication state is cached locally
- ✅ Loading states prevent multiple simultaneous requests
- ✅ Error handling prevents infinite loading states
- ✅ Proper cleanup of authentication listeners

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all configuration steps are completed
3. Test on a physical iOS device
4. Ensure your Apple Developer account is properly configured
