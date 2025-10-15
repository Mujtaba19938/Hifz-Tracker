import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '@/constants/colors';

interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: 'normal' | 'large';
}

export default function Logo({ size = 120, showText = true, textSize = 'normal' }: LogoProps) {
  const isLarge = textSize === 'large';
  
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/hkt72rlh1214cr3di7tl1' }}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.arabicText, isLarge && styles.arabicTextLarge]}>حفظ</Text>
          <Text style={[styles.englishText, isLarge && styles.englishTextLarge]}>TRACKER</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 2,
  },
  arabicTextLarge: {
    fontSize: 42,
  },
  englishText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 4,
    marginTop: 4,
  },
  englishTextLarge: {
    fontSize: 32,
  },
});
