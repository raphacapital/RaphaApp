# Rapha App - Component Documentation

This document provides detailed information about all components in the Rapha app, their usage, props, and implementation details.

## 📱 Core Components

### AuthScreen
**Location**: `src/components/AuthScreen.tsx`  
**Purpose**: Main authentication interface for Apple Sign In

**Props**:
```typescript
interface AuthScreenProps {
  onAuthSuccess: (result: { success: boolean }) => void;
  onAuthError: (error: string) => void;
}
```

**Features**:
- Apple Sign In availability checking
- Loading states and error handling
- Integration with AuthContext
- Responsive design for different screen sizes

**Usage**:
```tsx
<AuthScreen 
  onAuthSuccess={handleAuthSuccess}
  onAuthError={handleAuthError}
/>
```

### CTAButton
**Location**: `src/components/CTAButton.tsx`  
**Purpose**: Reusable call-to-action button component

**Props**:
```typescript
interface CTAButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}
```

**Features**:
- Consistent button styling
- Disabled state handling
- Customizable styles
- Touch feedback animations

**Usage**:
```tsx
<CTAButton 
  title="Sign In with Apple"
  onPress={handleSignIn}
  style={{ width: '100%' }}
/>
```

### ContinueButton
**Location**: `src/components/ContinueButton.tsx`  
**Purpose**: Navigation button for onboarding flow

**Props**:
```typescript
interface ContinueButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

**Features**:
- Loading state indicator
- Disabled state handling
- Consistent onboarding styling
- Smooth animations

**Usage**:
```tsx
<ContinueButton 
  onPress={handleContinue}
  disabled={!isFormValid}
  loading={isSubmitting}
/>
```

## 🎨 Visual Components

### LightRays
**Location**: `src/components/LightRays.tsx`  
**Purpose**: Animated background component with light ray effects

**Props**: None (self-contained component)

**Features**:
- Animated light ray patterns
- Responsive to screen dimensions
- Optimized performance with React Native Reanimated
- Consistent 0.2s animation timing

**Usage**:
```tsx
<LightRays />
```

### Particles
**Location**: `src/components/Particles.tsx`  
**Purpose**: Interactive particle system background

**Props**: None (self-contained component)

**Features**:
- Interactive particle animations
- Touch-responsive behavior
- Smooth 60fps animations
- Configurable particle density

**Usage**:
```tsx
<Particles />
```

## 🔐 Authentication Components

### AuthContext
**Location**: `src/contexts/AuthContext.tsx`  
**Purpose**: Centralized authentication state management

**Context Value**:
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

**Features**:
- Global authentication state
- Apple Sign In integration
- Automatic session management
- Loading state handling

**Usage**:
```tsx
const { user, signInWithApple, isLoading } = useAuth();
```

### ThemeContext
**Location**: `src/contexts/ThemeContext.tsx`  
**Purpose**: Theme management and color scheme handling

**Context Value**:
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ColorScheme;
  toggleTheme: () => void;
}
```

**Features**:
- Light/dark theme switching
- Dynamic color schemes
- Consistent design tokens
- Responsive theme changes

**Usage**:
```tsx
const { theme, colors, toggleTheme } = useTheme();
```

## 🏗️ Layout Components

### RootLayout
**Location**: `src/app/_layout.tsx`  
**Purpose**: Root application layout with providers

**Features**:
- Theme provider wrapper
- Authentication provider wrapper
- Font loading initialization
- Status bar configuration

**Structure**:
```tsx
<ThemeProvider>
  <AuthProvider>
    <RootLayoutContent />
  </AuthProvider>
</ThemeProvider>
```

### SplashScreen
**Location**: `src/app/splashscreen.tsx`  
**Purpose**: App launch screen with branding

**Features**:
- Animated logo display
- Font loading progress
- Smooth transitions
- Brand consistency

## 📝 Form Components

### Onboarding Components
**Location**: `src/app/onboarding/`  
**Purpose**: User onboarding flow components

**Features**:
- Multi-step form progression
- Data validation
- Progress indicators
- Smooth navigation

## 🎯 Component Guidelines

### Animation Standards
- **Duration**: All micro-interactions use 0.2s timing
- **Easing**: `Easing.out(Easing.cubic)` for natural feel
- **Performance**: Use `useNativeDriver: true` when possible
- **Consistency**: Maintain uniform animation behavior

### Styling Standards
- **Spacing**: Use 4px base unit (4, 8, 16, 24, 32px)
- **Typography**: Neue Haas Display font family
- **Colors**: Use theme context for dynamic colors
- **Responsiveness**: Support multiple screen sizes

### Accessibility
- **Touch Targets**: Minimum 44x44px touch areas
- **Labels**: Proper accessibility labels for screen readers
- **Contrast**: Maintain sufficient color contrast ratios
- **Focus**: Clear focus indicators for navigation

### Performance
- **Re-renders**: Minimize unnecessary component re-renders
- **Memory**: Proper cleanup in useEffect hooks
- **Images**: Optimize image sizes and formats
- **Animations**: Maintain 60fps performance

## 🔧 Component Development

### Creating New Components
1. **File Naming**: Use PascalCase (e.g., `NewComponent.tsx`)
2. **TypeScript**: Define proper interfaces for all props
3. **Documentation**: Add JSDoc comments for public APIs
4. **Testing**: Test on multiple device types and orientations

### Component Structure
```tsx
interface ComponentProps {
  // Define all props here
}

const ComponentName: React.FC<ComponentProps> = ({ ...props }) => {
  // Hooks at top
  // State management
  // Effect hooks
  // Event handlers
  // Render logic
  
  return (
    // JSX with proper accessibility
  );
};

export default ComponentName;
```

### Error Handling
- **Boundaries**: Implement error boundaries for critical components
- **Fallbacks**: Provide fallback UI for error states
- **Logging**: Use consistent error logging patterns
- **User Experience**: Never expose technical errors to users

## 📚 Related Documentation

- [Main README](../README.md) - Project overview and setup
- [Apple Sign In Setup](APPLE_SIGNIN_SETUP.md) - Authentication setup
- [Database Schema](supabase_migrations.sql) - Database structure

---

**Last Updated**: December 2024  
**Version**: 1.0.0
