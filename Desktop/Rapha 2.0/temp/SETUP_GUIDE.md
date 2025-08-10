# Rapha App Setup Guide

## ✅ Completed Foundation

The following foundation has been established:

### Project Structure
- ✅ React Native + Expo project with TypeScript
- ✅ Organized folder structure (`src/` with components, screens, services, etc.)
- ✅ Essential dependencies installed (Supabase, React Navigation, etc.)

### Type Definitions
- ✅ Complete TypeScript types for user profiles, onboarding, and devotional content
- ✅ Constants for all onboarding options
- ✅ Navigation and API response types

### Backend Integration
- ✅ Supabase service layer with authentication, user profiles, and devotional services
- ✅ Complete database schema with tables, indexes, and RLS policies
- ✅ Environment configuration setup

### Utilities & Configuration
- ✅ Helper functions for validation, date handling, and error management
- ✅ App configuration and settings
- ✅ Updated app.json with proper bundle identifiers
- ✅ Comprehensive .gitignore and README

## 🚀 Next Steps

### 1. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the database schema in your Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of supabase/schema.sql
   ```

### 2. Authentication Configuration

#### Apple Sign-In Setup
1. **Apple Developer Console Setup**:
   - Go to [Apple Developer Console](https://developer.apple.com/account/)
   - Navigate to Certificates, Identifiers & Profiles
   - Create a new App ID or use existing one
   - Enable "Sign In with Apple" capability
   - Note your Bundle ID (e.g., `com.rapha.bible.app`)

2. **Create Apple Service ID**:
   - In Apple Developer Console, go to Identifiers
   - Create a new Service ID (e.g., `com.rapha.bible.app.service`)
   - Enable "Sign In with Apple"
   - Add your domain and redirect URL: `https://your-supabase-project.supabase.co/auth/v1/callback`

3. **Supabase Apple Provider Configuration**:
   - In Supabase Dashboard, go to Authentication > Providers
   - Enable Apple provider
   - **Client ID**: Enter your Apple Service ID (e.g., `com.rapha.bible.app.service`)
   - **Secret Key**: Upload your Apple private key file (downloaded from Apple Developer Console)



### 3. Development Environment
1. Install Expo Go on your device
2. Run the development server:
   ```bash
   npm start
   ```
3. Scan the QR code with Expo Go

### 4. Next Development Phase
Once the foundation is tested, we can proceed with:

1. **Daily Devotional Feature** (Priority #1)
   - Create the main devotional screen
   - Implement AI integration for content generation
   - Add devotional content display and interaction

2. **Onboarding Flow** (Priority #2)
   - Build the 11-screen onboarding process
   - Implement user profile creation
   - Add navigation between onboarding screens

3. **Authentication Screens**
   - Sign in with Apple/Google
   - Handle authentication state
   - Redirect logic based on user state

## 🔧 Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Type checking
npm run type-check

# Build for production
npm run build:ios
npm run build:android
```

## 📱 Testing

- Use Expo Go for rapid development and testing
- Test on both iOS and Android devices
- Use EAS Build for production-like testing

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env` files to version control
2. **Supabase Keys**: Keep your service role key secure (only use anon key in client)
3. **Testing**: Test authentication flow thoroughly before proceeding
4. **Performance**: Monitor bundle size and performance as features are added

## 📞 Support

If you encounter any issues during setup:
1. Check the Supabase documentation
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the Expo documentation for troubleshooting

---

**Ready to proceed with the daily devotional feature once Supabase is configured!** 