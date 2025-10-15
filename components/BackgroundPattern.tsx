import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';

export default function BackgroundPattern() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.pattern}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Decorative circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
      <View style={[styles.circle, styles.circle4]} />
      
      {/* Decorative lines */}
      <View style={[styles.line, styles.line1]} />
      <View style={[styles.line, styles.line2]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 100,
    height: 100,
    top: '10%',
    right: '10%',
  },
  circle2: {
    width: 60,
    height: 60,
    top: '30%',
    left: '15%',
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: '20%',
    right: '20%',
  },
  circle4: {
    width: 40,
    height: 40,
    bottom: '40%',
    left: '10%',
  },
  line: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  line1: {
    width: 2,
    height: 200,
    top: '20%',
    left: '30%',
    transform: [{ rotate: '45deg' }],
  },
  line2: {
    width: 2,
    height: 150,
    bottom: '30%',
    right: '25%',
    transform: [{ rotate: '-30deg' }],
  },
});