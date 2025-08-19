# Rapha App - Project Overhaul

## Overview
This project has been completely overhauled to implement a new font system and light/dark mode theme support.

## Changes Made

### 1. Font System Overhaul
- **Replaced SF Pro** with **Neue Haas Display** font family
- **Font mapping**:
  - `semibold` → `medium` (NeueHaasDisplayMediu)
  - `regular` → `roman` (NeueHaasDisplayRoman)
  - Added support for `bold`, `light`, and `thin` weights

### 2. Theme System Implementation
- **Light Mode**:
  - Background: `#ffffff`
  - Grey: `#f6f6f6`
  - Text: Black
  - Buttons: Black background with white text

- **Dark Mode**:
  - Background: `#181818`
  - Grey: `#303030`
  - Text: White
  - Buttons: White background with black text

### 3. New File Structure
```
src/
├── constants/
│   ├── theme.ts          # New theme system
│   └── index.ts          # Export file
├── contexts/
│   └── ThemeContext.tsx  # Theme context provider
├── utils/
│   └── fontLoader.ts     # Font loading utility
└── assets/fonts/         # Custom font files
```

### 4. Updated Components
- **Splash Screen**: Now theme-aware with dynamic colors
- **CTA Button**: Updated to use theme colors and new typography
- **Continue Button**: Updated to use theme colors and new typography
- **Sign In Link**: Updated to use theme colors and new typography
- **Onboarding Screen**: Updated to use theme colors and new typography

### 5. Theme Context Features
- **Automatic detection** of device appearance (light/dark)
- **Manual toggle** capability for testing
- **Consistent theming** across all components
- **Dynamic color switching** without app restart

### 6. Font Loading
- **Expo Font integration** for custom font loading
- **Loading screen** while fonts are being loaded
- **Error handling** for font loading failures

## Usage

### Using the Theme
```typescript
import { useTheme } from '../contexts/ThemeContext';
import { getColors, getTypography } from '../constants/theme';

const MyComponent = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const colors = getColors(theme);
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={[getTypography('h1', 'medium'), { color: colors.textPrimary }]}>
        Hello World
      </Text>
    </View>
  );
};
```

### Using Typography
```typescript
import { getTypography } from '../constants/theme';

// Available sizes: h1, h2, h3, largeText, text, smallText, tinyText
// Available weights: regular, medium, bold, light, thin
const textStyle = getTypography('h1', 'medium');
```

### Using Colors
```typescript
import { getColors } from '../constants/theme';

const colors = getColors(theme);
// Available colors: background, grey, textPrimary, buttonBackground, buttonText, etc.
```

## Technical Details

### Font Files
- `NeueHaasDisplayRoman.ttf` - Regular weight
- `NeueHaasDisplayMediu.ttf` - Medium weight (replaces semibold)
- `NeueHaasDisplayBold.ttf` - Bold weight
- `NeueHaasDisplayLight.ttf` - Light weight
- `NeueHaasDisplayThin.ttf` - Thin weight

### Dependencies Added
- `expo-font` - For custom font loading

### Configuration Updates
- `app.json` - Added font declarations and automatic dark mode
- `_layout.tsx` - Added theme provider and font loading

## Testing

### Theme Toggle
A theme toggle button has been added to the splash screen for testing purposes. You can:
1. Tap the toggle button to switch between light and dark modes
2. Change your device appearance settings to see automatic switching
3. Test all components in both themes

### Font Verification
To verify fonts are working:
1. Check that text renders with Neue Haas Display instead of SF Pro
2. Verify medium weight (formerly semibold) renders correctly
3. Ensure all typography combinations work as expected

## Notes
- The RaphaLogo component has been temporarily removed due to missing dependencies
- All hardcoded colors have been replaced with theme-aware colors
- The old `designSystem.ts` file has been replaced with the new `theme.ts` system
- All components now use the new typography and color system
