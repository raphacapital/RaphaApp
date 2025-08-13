# Rapha App - Project Structure Guide

This document provides a comprehensive overview of the Rapha app's project structure, organization principles, and file naming conventions.

## 🏗️ Overall Architecture

The Rapha app follows a **feature-based architecture** with clear separation of concerns, organized around business domains rather than technical layers.

```
Rapha App/
├── src/                    # Main source code
├── components/             # Legacy components (to be removed)
├── rapha-backup/          # Backup and reference materials
├── .cursor/               # Cursor IDE configuration
└── .DS_Store              # macOS system file
```

## 📁 Source Code Structure (`src/`)

### Core Application (`app/`)
```
app/
├── _layout.tsx            # Root layout with providers
├── index.tsx              # Main app entry point
├── splashscreen.tsx       # App launch screen
└── onboarding/            # Onboarding flow screens
    └── onboarding1.tsx    # First onboarding step
```

**Purpose**: Contains all screen components using Expo Router's file-based routing system.

**Key Features**:
- **File-based Routing**: Each `.tsx` file becomes a route
- **Layout Nesting**: `_layout.tsx` wraps child routes
- **Provider Integration**: Context providers at root level

### Reusable Components (`components/`)
```
components/
├── ui/                    # Base UI components (planned)
├── forms/                 # Form-specific components (planned)
├── onboarding/            # Onboarding-specific components
├── AuthScreen.tsx         # Main authentication interface
├── CTAButton.tsx          # Call-to-action button
├── ContinueButton.tsx     # Onboarding navigation button
├── LightRays.tsx          # Animated background component
├── Particles.tsx          # Interactive particle system
└── fonts/                 # Custom font files
    ├── NeueHaasDisplayBlack.ttf
    ├── NeueHaasDisplayBold.ttf
    ├── NeueHaasDisplayLight.ttf
    ├── NeueHaasDisplayMedium.ttf
    ├── NeueHaasDisplayRoman.ttf
    ├── NeueHaasDisplayThin.ttf
    └── [Additional weights and styles...]
```

**Purpose**: Houses all reusable UI components organized by functionality.

**Organization Principles**:
- **Base Components**: Generic, reusable UI elements
- **Feature Components**: Specific to particular app features
- **Visual Components**: Backgrounds, animations, and effects

### State Management (`contexts/`)
```
contexts/
├── AuthContext.tsx        # Authentication state and methods
└── ThemeContext.tsx       # Theme and color scheme management
```

**Purpose**: Provides global state management using React Context API.

**Key Benefits**:
- **Centralized State**: Single source of truth for app data
- **Performance**: Avoids prop drilling
- **Maintainability**: Clear separation of concerns

### Business Logic (`services/`)
```
services/
├── authService.ts         # Authentication business logic
└── supabase.ts            # Supabase client configuration
```

**Purpose**: Contains all external service integrations and business logic.

**Responsibilities**:
- **API Calls**: External service communication
- **Data Transformation**: Business logic and data processing
- **Error Handling**: Centralized error management

### Configuration (`constants/`)
```
constants/
├── designSystem.ts        # Design tokens and spacing
├── index.ts              # Re-exported constants
└── theme.ts              # Theme configuration
```

**Purpose**: Centralizes all configuration values and design tokens.

**Benefits**:
- **Consistency**: Uniform values across the app
- **Maintainability**: Single place to update values
- **Reusability**: Shared constants across components

### Utilities (`utils/`)
```
utils/
└── fontLoader.ts          # Font loading and management
```

**Purpose**: Contains helper functions and utilities.

**Scope**:
- **Data Processing**: Formatting, validation, transformation
- **Device Utilities**: Platform-specific helpers
- **Common Functions**: Shared utility functions

### Static Assets (`assets/`)
```
assets/
├── adaptive-icon.png      # App icon for different platforms
├── favicon.png            # Web favicon
├── icon.png               # Main app icon
├── splash-icon.png        # Splash screen icon
└── wordmark.svg           # App wordmark
```

**Purpose**: Stores all static assets used throughout the app.

### Documentation (`docs/`)
```
docs/
├── APPLE_SIGNIN_SETUP.md  # Apple Sign In configuration guide
├── COMPONENTS.md          # Component documentation
├── API.md                 # API and service documentation
├── PROJECT_STRUCTURE.md   # This file
└── supabase_migrations.sql # Database migration scripts
```

**Purpose**: Comprehensive documentation for developers and maintainers.

## 🔧 Configuration Files

### Build Configuration
```
├── app.json               # Expo app configuration
├── babel.config.js        # Babel transpilation settings
├── tsconfig.json          # TypeScript compiler options
├── eslint.config.js       # ESLint configuration
├── .eslintrc.js           # Legacy ESLint config
├── .prettierrc            # Prettier formatting rules
└── .gitignore             # Git ignore patterns
```

### Dependencies
```
├── package.json           # Node.js dependencies and scripts
└── package-lock.json      # Locked dependency versions
```

## 📱 Screen Organization

### Authentication Flow
1. **Splash Screen** (`splashscreen.tsx`) - App launch and font loading
2. **Authentication** (`AuthScreen.tsx`) - Apple Sign In interface
3. **Onboarding** (`onboarding/onboarding1.tsx`) - User setup flow

### Navigation Structure
```
Splash Screen → Authentication → Onboarding → Main App
```

## 🎨 Design System Organization

### Typography
- **Font Family**: Neue Haas Display
- **Weights**: Thin, Light, Roman, Medium, Bold, Black
- **Location**: `src/components/fonts/`

### Spacing Scale
- **Base Unit**: 4px
- **Scale**: 4, 8, 16, 24, 32px multiples
- **Location**: `src/constants/designSystem.ts`

### Color System
- **Theme Support**: Light and dark modes
- **Dynamic Colors**: Context-based color switching
- **Location**: `src/constants/theme.ts`

## 🔐 Authentication Architecture

### Flow Components
1. **AuthContext** - Global authentication state
2. **AuthScreen** - User interface for sign-in
3. **authService** - Business logic for authentication
4. **supabase** - Backend authentication service

### Data Flow
```
User Action → AuthScreen → AuthContext → authService → Supabase → Response
```

## 🗄️ Database Integration

### Supabase Configuration
- **Client**: `src/services/supabase.ts`
- **Migrations**: `src/docs/supabase_migrations.sql`
- **Tables**: user_profiles, daily_checkins, devotionals, theme_progression

### Data Flow
```
App → authService → Supabase Client → Database → Response → App State
```

## 📱 Platform Considerations

### iOS-Specific
- **Apple Sign In**: Primary authentication method
- **Fonts**: Custom Neue Haas Display fonts
- **Animations**: React Native Reanimated optimizations

### Cross-Platform
- **React Native**: Core framework
- **Expo**: Development and build tools
- **TypeScript**: Language and type safety

## 🚀 Development Workflow

### File Creation
1. **Components**: Create in appropriate subdirectory
2. **Services**: Add to services directory
3. **Contexts**: Create new context file
4. **Constants**: Add to appropriate constants file

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Directories**: lowercase with hyphens for multi-word
- **Constants**: SCREAMING_SNAKE_CASE

### Import Organization
```typescript
// 1. React and React Native imports
import React from 'react';
import { View, Text } from 'react-native';

// 2. Third-party libraries
import { useAuth } from '../contexts/AuthContext';

// 3. Local components and utilities
import { CTAButton } from '../components/CTAButton';
import { COLORS } from '../constants/designSystem';

// 4. Types and interfaces
import { UserProfile } from '../types/UserProfile';
```

## 🔍 Code Organization Principles

### Single Responsibility
- Each file has one clear purpose
- Components handle UI, services handle logic
- Contexts manage state, utilities provide helpers

### Separation of Concerns
- **UI Layer**: Components and screens
- **Business Layer**: Services and utilities
- **Data Layer**: Contexts and external services
- **Configuration**: Constants and environment

### Reusability
- Generic components in `ui/` directory
- Feature-specific components in feature directories
- Shared utilities in `utils/` directory

### Maintainability
- Clear file organization
- Consistent naming conventions
- Comprehensive documentation
- Type safety with TypeScript

## 📚 Documentation Structure

### Setup Guides
- **Apple Sign In**: Complete authentication setup
- **Database**: Migration and schema setup
- **Development**: Local development environment

### API Reference
- **Components**: Props, usage, and examples
- **Services**: Methods, parameters, and return values
- **Contexts**: State management and hooks

### Architecture
- **Project Structure**: File organization and purpose
- **Data Flow**: How data moves through the app
- **Security**: Authentication and data protection

## 🎯 Best Practices

### File Organization
- Keep related files close together
- Use descriptive directory names
- Group by feature, not by type
- Maintain consistent structure

### Component Structure
- One component per file
- Clear prop interfaces
- Proper TypeScript types
- Comprehensive error handling

### State Management
- Use contexts for global state
- Keep local state in components
- Avoid prop drilling
- Clear data flow patterns

### Performance
- Lazy load when appropriate
- Optimize re-renders
- Use proper dependency arrays
- Monitor bundle size

---

**Last Updated**: December 2024  
**Version**: 1.0.0
