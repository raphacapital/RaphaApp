import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  PanResponder
} from 'react-native';
import { Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getColors, SPACING, getTypography } from '../constants/theme';

const { height: screenHeight } = Dimensions.get('window');

interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
  onSignInSuccess: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ 
  visible, 
  onClose, 
  onSignInSuccess 
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { signInWithApple, isLoading: authLoading } = useAuth();
  const colors = getColors(theme);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [isAppleAvailable, setIsAppleAvailable] = useState<boolean | null>(null);
  
  // Drag handling with PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        slideAnim.setOffset(slideAnim._value);
        slideAnim.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) { // Only allow dragging down
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        slideAnim.flattenOffset();
        
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // Close modal if dragged down far enough or with enough velocity
          handleClose();
        } else {
          // Snap back to open position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;
  


  // Check Apple Sign In availability
  useEffect(() => {
    const checkAppleAvailability = async () => {
      try {
        const available = await AppleAuthentication.isAvailableAsync();
        setIsAppleAvailable(available);
      } catch (error) {
        console.error('Error checking Apple Sign In availability:', error);
        setIsAppleAvailable(false);
      }
    };

    if (visible) {
      checkAppleAvailability();
    }
  }, [visible]);

  // Handle modal open/close animations
  useEffect(() => {
    if (visible) {
      // Reset animation values and slide up
      slideAnim.setValue(screenHeight);
      backdropOpacity.setValue(0);
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    // Animate closing before calling onClose
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(() => {
      onClose();
    });
  };



  const handleAppleSignIn = async () => {
    if (!isAppleAvailable) {
      return;
    }

    try {
      // Call the actual Apple Sign In function from AuthContext
      // Pass empty onboarding data since this is just sign in
      const result = await signInWithApple({});

      if (result.error) {
        console.error('Apple Sign In error:', result.error);
        // You could show an alert here if you want
      } else if (result.success) {
        // Close modal and notify parent of successful sign in
        onSignInSuccess();
      }
    } catch (error) {
      console.error('Apple Sign In error:', error);
    }
  };

  const handleBackdropPress = () => {
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <Animated.View 
          style={[
            styles.backdropOverlay,
            { opacity: backdropOpacity }
          ]} 
        />
      </TouchableOpacity>

              {/* Bottom Sheet */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
              paddingBottom: insets.bottom + SPACING.lg,
            }
          ]}
        >
        {/* Swipe Indicator */}
        <View style={styles.swipeIndicator}>
          <View style={[styles.swipeLine, { backgroundColor: colors.grey }]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Empty space for balance */}
          </View>
          
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Sign In
          </Text>
          
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.grey }]}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeButtonText, { color: colors.textPrimary }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Apple Sign In Button */}
          {isAppleAvailable && (
            <View style={styles.buttonContainer}>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                buttonStyle={theme === 'dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={8}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
                disabled={authLoading}
              />
            </View>
          )}

          {/* Privacy Notice */}
          <View style={styles.privacyContainer}>
            <Text style={[styles.privacyText, { color: theme === 'dark' ? 'white' : 'black' }]}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
                    </View>
          </Animated.View>
        </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdropOverlay: {
    flex: 1,
    backgroundColor: 'black',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  swipeIndicator: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  swipeLine: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    ...getTypography('h1', 'medium'),
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  content: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  appleButton: {
    width: '100%',
    height: 54,
  },
  privacyContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 15.6,
    letterSpacing: 0,
    fontFamily: 'NeueHaasDisplayRoman',
    textAlign: 'center',
    maxWidth: 400,
  },
});

export default SignInModal;
