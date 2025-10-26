import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Logo from '@/components/Logo';
import BackgroundPattern from '@/components/BackgroundPattern';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      console.log('SplashScreen: isAuthenticated =', isAuthenticated);
      console.log('SplashScreen: user =', user);
      console.log('SplashScreen: user?.role =', user?.role);
      if (isAuthenticated) {
        if (user?.role === 'admin') {
          console.log('Navigating to admin-dashboard');
          router.replace('/admin-dashboard' as any);
        } else {
          console.log('Navigating to class-selection');
          router.replace('/(tabs)/class-selection' as any);
        }
      } else {
        console.log('Navigating to sign-in');
        router.replace('/sign-in' as any);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.gradient}
      >
        <BackgroundPattern />
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Logo size={150} showText textSize="large" />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
