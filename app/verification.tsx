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

export default function VerificationScreen() {
  const router = useRouter();
  const { verifyCode, isLoading, verificationId, verificationFlow } = useAuth();
  const { t, isRTL } = useLanguage();
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setError('');
    
    if (!code) {
      setError('Please enter verification code');
      return;
    }

    if (!verificationId) {
      setError('No verification session found. Please request a new code.');
      return;
    }

    const result = await verifyCode(code);
    
    if (result.success) {
      // Route based on the verification flow
      if (result.flow === 'forgot-password') {
        router.replace('/new-password' as any);
      } else {
        // Regular sign-in flow
        router.replace('/(tabs)/class-selection' as any);
      }
    } else {
      setError(result.error || 'Invalid code');
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
              <Text style={[styles.title, isRTL && styles.rtlText]}>VERIFICATION CODE</Text>

              <Input
                placeholder={t.enterVerificationCode}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
                isRTL={isRTL}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                title={t.verify}
                onPress={handleVerify}
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
