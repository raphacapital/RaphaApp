# Apple Sign-In Setup Guide

## Overview

This guide provides detailed instructions for setting up Apple Sign-In for the Rapha app using Supabase authentication.

## Prerequisites

- Apple Developer Account ($99/year)
- Supabase project created
- Expo development environment set up

## Apple Sign-In Setup

### 1. Apple Developer Console Configuration

#### Step 1: Create App ID
1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** to create new identifier
4. Select **App IDs** → **App**
5. Fill in the details:
   - **Description**: Rapha App
   - **Bundle ID**: `com.rapha.bible.app`
   - **Capabilities**: Check **Sign In with Apple**
6. Click **Continue** → **Register**

#### Step 2: Create Service ID
1. In Apple Developer Console, go to **Identifiers**
2. Click **+** → **Services IDs** → **Services**
3. Fill in the details:
   - **Description**: Rapha App Service
   - **Identifier**: `com.rapha.bible.app.service`
4. Click **Continue** → **Register**
5. Click on the created Service ID
6. Check **Sign In with Apple**
7. Click **Configure** next to Sign In with Apple
8. Add your domain: `your-supabase-project.supabase.co`
9. Add redirect URL: `https://your-supabase-project.supabase.co/auth/v1/callback`
10. Click **Save** → **Continue** → **Register**

#### Step 3: Create Private Key
1. In Apple Developer Console, go to **Keys**
2. Click **+** to create new key
3. Fill in the details:
   - **Key Name**: Rapha App Key
   - **Key ID**: Note this down (you'll need it)
4. Check **Sign In with Apple**
5. Click **Configure** → **Primary App ID** → Select your app ID
6. Click **Save** → **Continue** → **Register**
7. **Download the key file** (you can only download it once!)
8. Note the **Key ID** and **Team ID**

### 2. Supabase Apple Provider Configuration

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Apple** and click **Enable**
3. Fill in the configuration:
   - **Client ID**: `com.rapha.bible.app.service` (your Service ID)
   - **Secret Key**: Upload the private key file you downloaded
4. Click **Save**



## App Configuration

### 1. Update app.json
The app.json has been configured with:
```json
{
  "expo": {
    "ios": {
      "usesAppleSignIn": true,
      "bundleIdentifier": "com.rapha.bible.app"
    },
    "android": {
      "package": "com.rapha.bible.app"
    }
  }
}
```

### 2. Environment Variables
Make sure your `.env` file includes:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing Authentication

### Development Testing
1. Run the app: `npm start`
2. Test on physical device (Apple Sign-In doesn't work well in simulator)
3. Test Apple sign-in flow

### Production Testing
1. Build with EAS: `npm run build:ios`
2. Test on TestFlight
3. Verify Apple authentication flow works correctly

## Troubleshooting

### Common Apple Sign-In Issues
- **"Invalid client"**: Check that Service ID matches exactly
- **"Invalid redirect URI"**: Verify redirect URL in Apple Developer Console
- **"Invalid key"**: Ensure private key file is uploaded correctly



### General Issues
- **CORS errors**: Ensure domain is added to Apple Service ID
- **Authentication failures**: Check Supabase logs for detailed error messages
- **App Store rejection**: Ensure Apple Sign-In is implemented if you offer other social logins

## Security Best Practices

1. **Never commit private keys** to version control
2. **Use environment variables** for sensitive data
3. **Enable Row Level Security** in Supabase
4. **Validate tokens** on the server side
5. **Handle authentication errors** gracefully
6. **Implement proper logout** functionality

## Next Steps

Once authentication is configured:
1. Test Apple sign-in flow thoroughly
2. Implement authentication state management
3. Add user profile creation after sign-in
4. Build the onboarding flow
5. Implement the daily devotional feature

---

**Need help?** Check the [Expo Apple Authentication docs](https://docs.expo.dev/versions/latest/sdk/apple-authentication/) for more details. 