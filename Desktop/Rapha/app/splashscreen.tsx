import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import LightRays from '../components/LightRays';
import Particles from '../components/Particles';
// import RaphaLogo from '../components/RaphaLogo'; // Temporarily removed due to missing dependency
import CTAButton from '../components/CTAButton';
import { useTheme } from '../contexts/ThemeContext';
import { getColors, SPACING, getTypography } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

/**
 * Main splash screen component
 * Displays a blank screen with light rays and particles effects
 */
export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  const { userFlowState } = useAuth();
  const colors = getColors(theme);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LightRays
        raysOrigin="top-center"
        raysColor={colors.primary}
        raysSpeed={1}
        lightSpread={0.05}
        rayLength={10}
        pulsating={true}
        noiseAmount={0.0}
        distortion={0.0}
        style={styles.lightRays}
      />

      <Particles
        particleColors={[colors.textLight, colors.textLight]}
        particleCount={500}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
        style={styles.particles}
      />

      {/* Content container with 36px vertical and 18px horizontal safe area margins */}
      <View style={[
        styles.contentContainer,
        {
          marginTop: insets.top + SPACING.xl,
          marginBottom: insets.bottom + SPACING.xl,
          marginHorizontal: SPACING.lg,
        }
      ]}>
        {/* Logo - Temporarily removed due to missing dependency */}
        {/* <View style={styles.logoContainer}>

        </View> */}

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          {/* Header Text */}
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, { color: colors.textPrimary }]}>
              Discover Faith Made{'\n'}Just For You.
            </Text>
          </View>

          <CTAButton
            title="Get Started"
            onPress={() => {
              // Always start with onboarding for new users
              router.push('/onboarding/onboarding1');
            }}
          />
          
          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, { borderColor: colors.textSecondary }]}
            onPress={() => {
              // Go to auth screen for sign in
              router.push('/auth');
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.signInButtonText, { color: colors.textSecondary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightRays: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: SPACING.lg, // 24px above CTA button
    alignItems: 'center',
  },
  headerText: {
    ...getTypography('h1', 'medium'), // 32px font size with medium weight
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 'auto', // Push button to bottom of content container
    width: '100%',
  },
  signInButton: {
    marginTop: SPACING.md, // 16px below CTA button
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    ...getTypography('text', 'medium'), // 16px font size with medium weight
  },

}); 