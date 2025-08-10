# Rapha AI Bible Devotion App - Development Guide

## 📋 Project Overview

**Rapha** is a personalized daily devotional app that uses AI to create meaningful spiritual content based on user profiles and life circumstances.

### Core Features
- **Personalized Daily Devotionals**: AI-generated content tailored to user's faith journey, life stage, and current challenges
- **Comprehensive Onboarding**: 11-screen profiling to understand user's spiritual needs
- **Prayer & Journaling Tools**: Track prayers, journal reflections, and spiritual milestones
- **Community Features**: Safe environment for prayer sharing and spiritual discussions
- **Scripture Access**: Easy Bible reading with multiple translations
- **Subscription Management**: Trial-to-paid conversion with Superwall integration

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (Database, Authentication, Real-time)
- **AI Services**: Claude/ChatGPT for personalized content generation
- **Payments**: Superwall (planned)
- **Deployment**: EAS Build for iOS/Android

### Project Structure
```
RaphaApp/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens and navigation
│   ├── services/       # API and external service integrations
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions and utilities
│   ├── hooks/          # Custom React hooks
│   ├── constants/      # App constants and configuration
│   └── assets/         # Images, fonts, and static assets
├── supabase/           # Database schema and migrations
└── temp/               # Documentation and setup files
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### 1. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file in the `RaphaApp` directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
   ```
4. Run the database schema in your Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of temp/schema.sql
   ```

### 2. Authentication Configuration
1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google OAuth:
   - Add your Google OAuth credentials
   - Set redirect URL: `com.rapha.app://auth/callback`
3. Enable Apple OAuth:
   - Add your Apple OAuth credentials
   - Set redirect URL: `com.rapha.app://auth/callback`

### 3. Development Environment
1. Navigate to the RaphaApp directory:
   ```bash
   cd RaphaApp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Expo Go on your device
4. Run the development server:
   ```bash
   npm start
   ```
5. Scan the QR code with Expo Go

## 📊 Database Schema

### Tables Overview
- `user_profiles`: User onboarding responses and preferences
- `devotional_content`: Generated daily devotionals
- `prayer_requests`: User prayer requests and tracking
- `journal_entries`: User reflection and journal entries
- `community_posts`: Community prayer sharing and discussions
- `community_comments`: Comments on community posts
- `user_engagement`: User activity tracking

### Key Features
- **Row Level Security (RLS)**: All tables have proper security policies
- **Automatic timestamps**: Updated_at columns are automatically maintained
- **User profile creation**: Automatically created on user signup
- **Indexes**: Optimized for common queries

## 🎯 Development Priorities

### Phase 1: Core Features (Current)
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

### Phase 2: Enhanced Features
1. **Prayer & Journaling Tools**
2. **Community Features**
3. **Scripture Access**
4. **Subscription Management**

## 🔧 Development Commands

```bash
# Navigate to project
cd RaphaApp

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

## 📱 Testing Strategy

### Development Testing
- Use Expo Go for rapid iteration
- Test on both iOS and Android devices
- Test authentication flow thoroughly

### Production Testing
- Use EAS Build for staging builds
- Use TestFlight for iOS beta testing
- Monitor performance and user feedback

## 🚨 Important Notes

### Security
- Never commit `.env` files to version control
- Keep service role keys secure (only use anon key in client)
- All database operations use Row Level Security

### Performance
- Monitor bundle size as features are added
- Optimize rendering and state management
- Use proper loading states

### Code Quality
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, documented code

## 📚 Reference Files

- `References/raphamvp.txt`: Original MVP requirements and guidelines
- `References/rules.txt`: Coding guidelines and best practices
- `temp/schema.sql`: Complete database schema
- `temp/SETUP_GUIDE.md`: Quick setup instructions

## 📞 Support

If you encounter any issues:
1. Check the Supabase documentation
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the Expo documentation for troubleshooting

---

**Ready to proceed with development! The foundation is solid and scalable.** 