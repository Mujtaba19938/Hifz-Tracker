import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await resetPassword(password);
    
    if (result.success) {
      router.replace('/sign-in' as any);
    } else {
      setError(result.error || 'Failed to reset password');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.gradient}
      >
        <BackgroundPattern />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={28} color={colors.white} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Logo size={100} showText />
            </View>

            <View style={styles.formContainer}>
              <Text style={[styles.title, isRTL && styles.rtlText]}>{t.newPassword}</Text>

              <Input
                placeholder={t.enterYourPassword}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                isRTL={isRTL}
              />

              <Input
                placeholder={t.confirmYourPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                isRTL={isRTL}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                title={t.signInNow}
                onPress={handleResetPassword}
                loading={isLoading}
                style={styles.button}
              />

              <Text style={[styles.disclaimer, isRTL && styles.rtlText]}>
                {t.byRegistering}
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute' as const,
    top: 60,
    left: 24,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 1,
  },
  rtlText: {
    textAlign: 'right',
  },
  button: {
    marginBottom: 24,
  },
  disclaimer: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
  },
});
