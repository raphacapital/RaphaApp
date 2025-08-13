# Rapha App - Configuration Backup

This folder contains all the important configuration files and credentials for your Rapha app. Use these files to set up your new project.

## 📁 Files Included

- `app.json` - Expo app configuration
- `eas.json` - EAS build configuration  
- `SupabaseConfig.ts` - Supabase client setup
- `scripts/` - Apple JWT generation script
- `AuthKey_BWB62YHB4Y.p8` - Apple private key (if found)

## 🍎 Apple Developer Information

### Bundle Identifier
```
com.raphalabs.rapha
```

### Apple Sign-In Configuration
- **Team ID:** `DB3G4HPMX7`
- **Service ID:** `com.raphalabs.rapha.signin`
- **Key ID:** `BWB62YHB4Y`
- **Private Key:** `AuthKey_BWB62YHB4Y.p8`

### Apple JWT Script
The `scripts/generate-apple-jwt.js` file contains your Apple configuration for generating JWT tokens for Supabase authentication.

## 🔗 Supabase Configuration

### Required Environment Variables
Add these to your `.env` file in the new project:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_CLAUDE_API_KEY=your_claude_api_key
EXPO_PUBLIC_APP_NAME=Rapha
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Supabase Client Setup
Use the `SupabaseConfig.ts` file as a reference for setting up your Supabase client in the new project.

## 🚀 EAS Build Configuration

### Project ID
```
2e3b843a-7b3f-42b0-aa3a-0549a7862bb8
```

### Build Profiles
- **Development:** Internal distribution with development client
- **Preview:** Internal distribution
- **Production:** Auto-incrementing builds

## 📱 App Configuration

### Key Settings
- **Name:** rapha-app
- **Slug:** rapha-app
- **Version:** 1.0.0
- **Orientation:** Portrait
- **Bundle ID:** com.raphalabs.rapha
- **Scheme:** rapha

## 🔧 Setup Instructions for New Project

1. **Create new Expo project:**
   ```bash
   npx create-expo-app@latest your-new-project --template
   ```

2. **Copy configuration files:**
   - Copy `app.json` to your new project
   - Copy `eas.json` to your new project
   - Copy `scripts/` folder to your new project
   - Copy `AuthKey_BWB62YHB4Y.p8` to your new project

3. **Set up environment variables:**
   - Create `.env` file with your Supabase credentials
   - Add all required environment variables

4. **Configure EAS:**
   ```bash
   eas build:configure
   ```

5. **Set up Supabase:**
   - Copy `SupabaseConfig.ts` to your new project
   - Install required dependencies

6. **Configure Apple Sign-In:**
   - Update the JWT generation script with your new project paths
   - Generate JWT token for Supabase

## 📦 Required Dependencies

For the new project, you'll need:
```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage jsonwebtoken
```

## ⚠️ Important Notes

- Keep your Apple private key secure
- Regenerate JWT tokens every 6 months
- Update bundle identifiers if needed
- Test authentication flow in new project

## 🗑️ Safe to Delete

After copying these files to your new project, you can safely delete the original `rapha-app` folder. 