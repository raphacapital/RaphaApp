# Rapha App - API Documentation

This document provides detailed information about all API services, methods, and data structures in the Rapha app.

## 🔐 Authentication Service

**Location**: `src/services/authService.ts`  
**Purpose**: Handles all authentication-related operations including Apple Sign In

### Core Methods

#### `signInWithApple(onboardingData: Partial<UserProfile>)`
**Purpose**: Authenticates user with Apple Sign In

**Parameters**:
```typescript
onboardingData: Partial<UserProfile> - User onboarding information
```

**Returns**:
```typescript
Promise<{ user: AuthUser | null; error: string | null }>
```

**Flow**:
1. Checks Apple Sign In availability
2. Requests user consent for name and email
3. Extracts user information from Apple credential
4. Attempts to sign in existing user
5. Creates new user if none exists
6. Creates/updates user profile

**Example**:
```typescript
const result = await AuthService.signInWithApple({
  devotional_experience: 'beginner',
  preferred_themes: ['comfort', 'hope']
});

if (result.error) {
  console.error('Sign in failed:', result.error);
} else {
  console.log('User signed in:', result.user);
}
```

#### `signOut()`
**Purpose**: Signs out the current user

**Returns**:
```typescript
Promise<{ success: boolean; error: string | null }>
```

**Example**:
```typescript
const result = await AuthService.signOut();
if (result.success) {
  // User signed out successfully
}
```

#### `getCurrentUser()`
**Purpose**: Retrieves the currently authenticated user

**Returns**:
```typescript
Promise<AuthUser | null>
```

**Example**:
```typescript
const user = await AuthService.getCurrentUser();
if (user) {
  console.log('Current user:', user.email);
}
```

#### `getUserProfile(userId: string)`
**Purpose**: Retrieves user profile information

**Parameters**:
```typescript
userId: string - User's unique identifier
```

**Returns**:
```typescript
Promise<{ profile: UserProfile | null; error: string | null }>
```

**Example**:
```typescript
const result = await AuthService.getUserProfile(userId);
if (result.profile) {
  console.log('User profile:', result.profile.full_name);
}
```

#### `createUserProfile(userId: string, profileData: Partial<UserProfile>)`
**Purpose**: Creates or updates user profile

**Parameters**:
```typescript
userId: string - User's unique identifier
profileData: Partial<UserProfile> - Profile information to save
```

**Returns**:
```typescript
Promise<{ profile: UserProfile | null; error: string | null }>
```

**Example**:
```typescript
const result = await AuthService.createUserProfile(userId, {
  full_name: 'John Doe',
  devotional_experience: 'intermediate',
  preferred_themes: ['peace', 'wisdom']
});
```

#### `updateUserProfile(userId: string, profileData: Partial<UserProfile>)`
**Purpose**: Updates existing user profile

**Parameters**:
```typescript
userId: string - User's unique identifier
profileData: Partial<UserProfile> - Profile updates
```

**Returns**:
```typescript
Promise<{ profile: UserProfile | null; error: string | null }>
```

**Example**:
```typescript
const result = await AuthService.updateUserProfile(userId, {
  current_emotional_state: 'peaceful',
  additional_notes: 'Feeling grateful today'
});
```

#### `ensureUserProfilesTable()`
**Purpose**: Ensures the user_profiles table exists with proper structure

**Returns**:
```typescript
Promise<{ success: boolean; error: string | null }>
```

**Example**:
```typescript
const result = await AuthService.ensureUserProfilesTable();
if (!result.success) {
  console.error('Table setup failed:', result.error);
}
```

### Private Methods

#### `createNewAppleUser(credential, onboardingData, email, fullName)`
**Purpose**: Creates new user account with Apple authentication

**Parameters**:
```typescript
credential: AppleAuthentication.AppleAuthenticationCredential
onboardingData: Partial<UserProfile>
email: string
fullName: string
```

**Returns**:
```typescript
Promise<{ user: AuthUser | null; error: string | null }>
```

**Features**:
- Generates secure random password
- Creates Supabase auth user
- Stores Apple ID for future reference
- Creates user profile with onboarding data

## 🗄️ Supabase Service

**Location**: `src/services/supabase.ts`  
**Purpose**: Configures and exports Supabase client instance

### Configuration

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce', // Enhanced security
  },
});
```

**Features**:
- PKCE (Proof Key for Code Exchange) flow
- AsyncStorage for session persistence
- Automatic token refresh
- Secure authentication flow

### Data Types

#### `UserProfile` Interface
```typescript
interface UserProfile {
  id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
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
```

#### `AuthUser` Interface
```typescript
interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}
```

## 🔄 Context APIs

### AuthContext

**Location**: `src/contexts/AuthContext.tsx`  
**Purpose**: Provides authentication state and methods throughout the app

#### Hook Usage
```typescript
const { user, isLoading, isAuthenticated, signInWithApple, signOut } = useAuth();
```

#### Context Value
```typescript
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithApple: (onboardingData: Partial<UserProfile>) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  refreshUser: () => Promise<void>;
}
```

#### Methods

##### `signInWithApple(onboardingData)`
**Purpose**: Initiates Apple Sign In flow

**Parameters**:
```typescript
onboardingData: Partial<UserProfile> - User onboarding information
```

**Returns**:
```typescript
Promise<AuthResult>
```

**Example**:
```typescript
const { signInWithApple } = useAuth();

const handleSignIn = async () => {
  const result = await signInWithApple({
    devotional_experience: 'beginner'
  });
  
  if (result.success) {
    // Navigate to main app
  }
};
```

##### `signOut()`
**Purpose**: Signs out current user

**Returns**:
```typescript
Promise<AuthResult>
```

**Example**:
```typescript
const { signOut } = useAuth();

const handleSignOut = async () => {
  const result = await signOut();
  if (result.success) {
    // Navigate to auth screen
  }
};
```

##### `refreshUser()`
**Purpose**: Refreshes current user data

**Returns**:
```typescript
Promise<void>
```

**Example**:
```typescript
const { refreshUser } = useAuth();

const handleRefresh = async () => {
  await refreshUser();
  // User data updated
};
```

### ThemeContext

**Location**: `src/contexts/ThemeContext.tsx`  
**Purpose**: Manages app theme and color schemes

#### Hook Usage
```typescript
const { theme, colors, toggleTheme } = useTheme();
```

#### Context Value
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ColorScheme;
  toggleTheme: () => void;
}
```

## 📊 Database Schema

### Core Tables

#### `user_profiles`
**Purpose**: Stores user preferences and onboarding data

**Key Fields**:
- `id`: UUID primary key
- `user_id`: Foreign key to auth.users
- `full_name`: User's full name from Apple Sign In
- `devotional_experience`: User's spiritual experience level
- `preferred_themes`: Array of preferred devotional themes

#### `daily_checkins`
**Purpose**: Tracks daily emotional state and spiritual check-ins

**Key Fields**:
- `id`: UUID primary key
- `user_id`: Foreign key to user_profiles
- `date`: Check-in date
- `emotional_state`: Current emotional state
- `emotional_notes`: Additional emotional context

#### `devotionals`
**Purpose**: Stores AI-generated devotional content

**Key Fields**:
- `id`: UUID primary key
- `user_id`: Foreign key to user_profiles
- `bible_verse`: Scripture reference
- `devotional_content`: AI-generated devotional text
- `primary_theme`: Main theme of the devotional

#### `theme_progression`
**Purpose**: Tracks theme usage and progression

**Key Fields**:
- `id`: UUID primary key
- `user_id`: Foreign key to user_profiles
- `theme`: Theme identifier
- `usage_count`: Number of times theme used
- `week_start`: Week start date for tracking

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Automatic data isolation between users
- Secure profile access policies

### Authentication Flow
- PKCE flow for enhanced security
- Secure token storage in AsyncStorage
- Automatic session refresh
- Apple ID verification

### Data Validation
- TypeScript interfaces for all data
- Input validation and sanitization
- Error handling for malformed data

## 🚀 Performance Optimizations

### Database Queries
- Proper indexing on frequently queried fields
- Efficient foreign key relationships
- Optimized SELECT queries

### Client-Side
- React Context for state management
- Memoized components where appropriate
- Efficient re-render patterns

### Caching
- Session persistence in AsyncStorage
- User profile caching
- Theme preference caching

## 📝 Error Handling

### Error Types
```typescript
interface AuthResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}
```

### Common Error Scenarios
1. **Apple Sign In Unavailable**: Device doesn't support Apple Sign In
2. **Authentication Failed**: Invalid credentials or network issues
3. **Profile Creation Failed**: Database or validation errors
4. **Network Errors**: Connection or timeout issues

### Error Recovery
- Automatic retry for transient errors
- User-friendly error messages
- Fallback authentication flows
- Graceful degradation

## 🔧 Development Tools

### Debug Mode
Enable detailed logging:
```typescript
// In development
console.log('Auth flow:', { step, data });

// In production
if (__DEV__) {
  console.log('Debug info:', debugData);
}
```

### Testing
- Test on physical iOS devices
- Verify authentication flows
- Check error handling
- Validate data persistence

---

**Last Updated**: December 2024  
**Version**: 1.0.0
