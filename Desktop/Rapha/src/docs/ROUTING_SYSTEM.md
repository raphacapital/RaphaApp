# Rapha App Routing System

## Overview

The Rapha app implements a comprehensive routing system that guides users through a specific flow before they can access the main dashboard. This system ensures users complete onboarding, early access (EA) flow, and payment verification in the correct order.

## User Flow Architecture

```
SPLASH SCREEN
    ↓
    ├── Get Started Button → ONBOARDING FLOW → AUTH SCREEN → PAYWALL
└── Sign In Button → AUTH SCREEN → PAYWALL
                ↓
            PAYWALL
                ↓
            PAYWALL
                ↓
            DASHBOARD
```

## Key Components

### 1. FlowRouter (`src/components/FlowRouter.tsx`)
- **Purpose**: Central routing logic that evaluates user state and directs them to the appropriate screen
- **Logic**: 
  - If not authenticated → Splash Screen
  - If authenticated but onboarding incomplete → Onboarding
- If onboarding complete but payment incomplete → Paywall
  - If all conditions met → Dashboard

### 2. AuthContext (`src/contexts/AuthContext.tsx`)
- **Purpose**: Manages user authentication state and flow completion flags
- **Key State**:
  - `hasCompletedOnboarding`: Boolean flag for onboarding completion
  - `hasPaidThroughSuperwall`: Boolean flag for payment completion

### 3. Screen Flow

#### Splash Screen (`src/app/splashscreen.tsx`)
- **Get Started Button**: Routes to onboarding based on completion status
- **Sign In Button**: Routes to auth or paywall based on completion status

#### Onboarding Flow (`src/app/onboarding/onboarding1.tsx` → `onboarding11.tsx`)
- **11 screens** that collect user preferences and spiritual journey information
- **Final screen** marks onboarding as complete and navigates to auth

#### Auth Screen (`src/app/auth.tsx`)
- **Apple Sign In** integration
- **On success**: Routes back to root (FlowRouter handles next destination)



#### Paywall (`src/app/paywall.tsx`)
- **Subscription options** for accessing the full app
- **On subscribe**: Marks payment as complete and navigates to dashboard

#### Dashboard (`src/app/dashboard.tsx`)
- **Main app interface** accessible only after completing all flows
- **Flow status display** shows completion status for debugging
- **Test reset button** for development purposes

## Testing the Routing System

### 1. Fresh User Journey
1. Start app → Splash Screen
2. Tap "Get Started" → Onboarding Flow (11 screens)
3. Complete onboarding → Auth Screen
4. Sign in with Apple → Paywall
5. Subscribe → Dashboard

### 2. Returning User Journey
1. Start app → Splash Screen
2. Tap "Sign In" → Auth Screen (if onboarding incomplete) or Paywall (if onboarding complete)
3. Complete remaining flows → Dashboard

### 3. Development Testing
- **Dashboard Reset Button**: Resets all flow states and returns to root
- **Console Logs**: Extensive logging shows routing decisions
- **Flow Status Display**: Dashboard shows current completion status

## State Management

### Flow State Persistence
- **Current**: In-memory only (resets on app restart)
- **Future**: Will integrate with Supabase for persistence

### State Transitions
```typescript
// Mark onboarding complete
markOnboardingComplete();



// Mark payment complete
markPaymentComplete();

// Reset all states (testing)
resetFlowStates();
```

## Security Features

### Flow Protection
- **Sequential Progression**: Users cannot skip required steps
- **State Validation**: Each screen checks completion status
- **Navigation Guards**: FlowRouter prevents unauthorized access

### Authentication Integration
- **Apple Sign In**: Secure authentication method
- **Session Management**: Supabase handles auth state
- **User Isolation**: Each user has independent flow state

## Future Enhancements

### Planned Features
1. **Persistent State**: Save flow completion to Supabase
2. **Analytics**: Track user progression through flows
3. **A/B Testing**: Different flow variations for optimization
4. **Offline Support**: Handle network interruptions gracefully

### Technical Improvements
1. **Type Safety**: Stricter TypeScript interfaces
2. **Error Boundaries**: Better error handling and recovery
3. **Performance**: Optimize navigation and state updates
4. **Testing**: Unit and integration tests for routing logic

## Troubleshooting

### Common Issues
1. **Infinite Loops**: Check FlowRouter logic and state updates
2. **Navigation Errors**: Verify route paths and parameters
3. **State Mismatches**: Ensure AuthContext state is properly updated

### Debug Tools
1. **Console Logs**: Extensive logging throughout the flow
2. **Flow Status Display**: Dashboard shows current state
3. **Reset Button**: Test button to reset all states
4. **React DevTools**: Inspect component state and props

## File Structure

```
src/
├── app/
│   ├── index.tsx              # Root route (delegates to FlowRouter)
│   ├── splashscreen.tsx       # Entry point with routing logic
│   ├── auth.tsx               # Authentication screen
│   ├── paywall.tsx            # Subscription screen
│   ├── dashboard.tsx          # Main app interface
│   ├── onboarding/            # 11 onboarding screens

├── components/
│   └── FlowRouter.tsx         # Central routing logic
├── contexts/
│   └── AuthContext.tsx        # Authentication and flow state
└── types/
    └── UserFlowTypes.ts       # TypeScript interfaces
```

This routing system ensures a smooth, guided user experience while maintaining security and preventing unauthorized access to the main app features.
