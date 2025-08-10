# Rapha App - AI-Powered Devotional Companion

A React Native mobile application built with Expo that provides personalized daily devotionals using AI, with Apple Sign In authentication and Supabase backend integration.

## 🚀 Features

- **Apple Sign In Authentication** - Secure, one-tap authentication
- **AI-Powered Devotionals** - Personalized daily spiritual content
- **Emotional Tracking** - Daily check-ins and mood monitoring
- **Theme Progression** - Adaptive content based on user preferences
- **Cross-Platform** - Built with React Native and Expo
- **Real-time Sync** - Supabase backend with offline support

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native with Expo
- **Authentication**: Apple Sign In + Supabase Auth
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Language**: TypeScript
- **State Management**: React Context + Hooks
- **Navigation**: Expo Router (file-based routing)

### Project Structure
```
src/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Main app entry point
│   ├── splashscreen.tsx   # App splash screen
│   └── onboarding/        # Onboarding flow
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form-specific components
│   └── onboarding/        # Onboarding components
├── contexts/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Theme management
├── services/               # API and external services
│   ├── authService.ts     # Authentication logic
│   └── supabase.ts        # Supabase client
├── constants/              # App constants and configuration
│   ├── designSystem.ts    # Design tokens
│   └── theme.ts           # Theme configuration
├── utils/                  # Helper functions
│   └── fontLoader.ts      # Font loading utilities
├── assets/                 # Images, fonts, and static files
└── docs/                   # Documentation and migrations
    ├── APPLE_SIGNIN_SETUP.md
    └── supabase_migrations.sql
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator or physical iOS device
- Supabase account
- Apple Developer account

### 1. Clone and Install
```bash
git clone https://github.com/raphacapital/RaphaApp.git
cd RaphaApp/src
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `src/` directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Setup
1. Run the migration script in `docs/supabase_migrations.sql`
2. Configure Apple OAuth in Supabase Auth settings
3. Set up Row Level Security (RLS) policies

### 4. Apple Developer Setup
1. Configure Apple Sign In capability
2. Add your app's bundle identifier
3. Generate and configure OAuth credentials

### 5. Start Development
```bash
npm start
# or
expo start
```

## 🔐 Authentication

### Apple Sign In Flow
1. **Availability Check** - Verifies Apple Sign In is available
2. **User Consent** - Requests name and email permissions
3. **Token Exchange** - Securely exchanges Apple tokens for Supabase session
4. **Profile Creation** - Creates or updates user profile
5. **Session Management** - Maintains authenticated state

### Security Features
- PKCE (Proof Key for Code Exchange) flow
- Row Level Security (RLS) policies
- Secure token storage
- Automatic session refresh

## 📱 Components

### Core Components
- **AuthScreen** - Main authentication interface
- **CTAButton** - Call-to-action button component
- **ContinueButton** - Onboarding navigation button
- **LightRays** - Animated background component
- **Particles** - Interactive particle system

### Component Guidelines
- All components use TypeScript interfaces
- Follow React Native best practices
- Implement proper accessibility
- Use consistent animation timing (0.2s)

## 🎨 Design System

### Animation Standards
- **Universal Duration**: 0.2s for all micro-interactions
- **Easing**: `Easing.out(Easing.cubic)` for natural feel
- **Performance**: 60fps with `useNativeDriver: true`

### Spacing Scale
- Base unit: 4px
- Scale: 4, 8, 16, 24, 32px multiples

### Typography
- Font family: Neue Haas Display
- Weights: Thin, Light, Roman, Medium, Bold, Black
- Responsive sizing based on screen dimensions

## 🗄️ Database Schema

### Core Tables
- **user_profiles** - User preferences and onboarding data
- **daily_checkins** - Emotional state tracking
- **devotionals** - AI-generated content
- **theme_progression** - Content theme usage analytics

### Key Relationships
- One-to-one: `auth.users` ↔ `user_profiles`
- One-to-many: `user_profiles` → `daily_checkins`
- One-to-many: `user_profiles` → `devotionals`

## 🚀 Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler
```

### Code Quality
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Pre-commit hooks** - Automated quality checks

### Testing
- Test on physical iOS devices for Apple Sign In
- Verify authentication flows
- Check offline/online behavior
- Validate error handling

## 📚 Documentation

### Setup Guides
- [Apple Sign In Setup](docs/APPLE_SIGNIN_SETUP.md) - Complete authentication setup
- [Database Migrations](docs/supabase_migrations.sql) - Database schema setup

### API Reference
- [Authentication Service](src/services/authService.ts) - Auth methods and flows
- [Supabase Client](src/services/supabase.ts) - Database client configuration

## 🐛 Troubleshooting

### Common Issues
1. **Apple Sign In Not Available** - Ensure testing on physical iOS device
2. **Authentication Failures** - Check Supabase configuration and Apple Developer setup
3. **Database Errors** - Verify migration scripts have been run
4. **Build Failures** - Clear Expo cache and reinstall dependencies

### Debug Mode
Enable detailed logging by setting environment variables:
```env
EXPO_DEBUG=true
SUPABASE_DEBUG=true
```

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with proper TypeScript types
3. Add comprehensive error handling
4. Update documentation
5. Submit pull request with detailed description

### Code Standards
- Follow existing TypeScript patterns
- Implement proper error boundaries
- Add JSDoc comments for public APIs
- Maintain consistent animation timing
- Test on multiple device types

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Check the [documentation](docs/)
- Review [troubleshooting guide](#troubleshooting)
- Contact the development team

---

**Built with ❤️ for spiritual growth and community**
