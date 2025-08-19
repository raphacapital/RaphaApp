import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

interface CustomStyleSliderProps {
  leftStyle: string;
  rightStyle: string;
  value: number;
  onValueChange: (value: number) => void;
  colors: any;
}

export default function CustomStyleSlider({ leftStyle, rightStyle, value, onValueChange, colors }: CustomStyleSliderProps) {
  const [thumbPosition] = useState(new Animated.Value(0));
  
  // Slider width: screen width minus content container margins (24px * 2)
  const sliderWidth = width - 48;
  
  useEffect(() => {
    // Set initial thumb position immediately without animation
    const initialPosition = value * sliderWidth;
    thumbPosition.setValue(initialPosition);
  }, [value, sliderWidth]);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const leftMargin = 24;
      const relativeX = gestureState.moveX - leftMargin;
      const clampedX = Math.max(0, Math.min(sliderWidth, relativeX));
      
      // Update thumb position immediately during drag (no animation)
      thumbPosition.setValue(clampedX);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const leftMargin = 24;
      const relativeX = gestureState.moveX - leftMargin;
      const clampedX = Math.max(0, Math.min(sliderWidth, relativeX));
      
      // Calculate value and snap to nearest position
      const rawValue = clampedX / sliderWidth;
      const positions = [0, 0.25, 0.5, 0.75, 1];
      
      // Make snapping less aggressive - only snap if within 15% of a position
      const snapTolerance = 0.15;
      let shouldSnap = false;
      let closest = rawValue;
      
      for (let i = 0; i < positions.length; i++) {
        const distance = Math.abs(positions[i] - rawValue);
        if (distance < snapTolerance) {
          shouldSnap = true;
          closest = positions[i];
          break;
        }
      }
      
      // If not close enough to snap, keep the current position
      if (!shouldSnap) {
        closest = rawValue;
      }
      
      // Animate to final position
      const finalPosition = closest * sliderWidth;
      Animated.timing(thumbPosition, {
        toValue: finalPosition,
        duration: 400,
        useNativeDriver: false,
      }).start();
      
      onValueChange(closest);
    },
  });

  return (
    <View style={styles.container}>
      {/* Labels */}
      <View style={styles.labelsContainer}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>{leftStyle}</Text>
        <Text style={[styles.label, { color: colors.textPrimary }]}>{rightStyle}</Text>
      </View>
      
      {/* Slider Track */}
      <View style={styles.sliderContainer}>
        <View style={[styles.sliderTrack, { backgroundColor: colors.grey }]}>
          {/* Dots */}
          {[0, 0.25, 0.5, 0.75, 1].map((dot, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                { 
                  left: `${dot * 100}%`,
                  marginLeft: -4,
                  backgroundColor: colors.grey
                }
              ]}
            />
          ))}
          
          {/* Thumb with larger touch area */}
          <View style={styles.thumbContainer} {...panResponder.panHandlers}>
            <Animated.View
              style={[
                styles.thumb,
                {
                  left: thumbPosition.interpolate({
                    inputRange: [0, sliderWidth],
                    outputRange: [-12, sliderWidth - 12], // Center 24px thumb on position
                  }),
                  backgroundColor: colors.buttonBackground
                }
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  sliderContainer: {
    marginTop: 8,
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  sliderTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 12, // Increased from 10px to 12px
    height: 12, // Increased from 10px to 12px
    borderRadius: 6, // Half of width/height
    top: -3, // Adjusted to center on track (12/2 - 6/2 = 3)
  },
  thumbContainer: {
    position: 'absolute',
    width: 60, // Large touch area around the thumb
    height: 60, // Large touch area around the thumb
    borderRadius: 30, // Half of width/height
    top: -27, // Center vertically on track (60/2 - 6/2 = 27)
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 2,
    // Add shadow for better visual feedback
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});


