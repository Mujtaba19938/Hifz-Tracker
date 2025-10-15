import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
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

export default function PhoneAuthScreen() {
  const router = useRouter();
  const { sendVerificationCode, isLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'phone' | 'verification'>('phone');

  const handleSendCode = async () => {
    setError('');
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number');
      return;
    }

    const result = await sendVerificationCode(phoneNumber, 'signin');
    
    if (result.success) {
      setStep('verification');
      Alert.alert(
        'Code Sent',
        `A verification code has been sent to ${phoneNumber}. Please check your messages.`,
        [{ text: 'OK' }]
      );
    } else {
      setError(result.error || 'Failed to send verification code');
    }
  };

  const handleResendCode = async () => {
    setError('');
    const result = await sendVerificationCode(phoneNumber, 'signin');
    
    if (result.success) {
      Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
    } else {
      setError(result.error || 'Failed to resend code');
    }
  };

  const renderPhoneStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.title, isRTL && styles.rtlText]}>Phone Verification</Text>
      <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
        Enter your phone number to receive a verification code
      </Text>

      <Input
        placeholder="Phone Number (e.g., +1234567890)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCapitalize="none"
        isRTL={isRTL}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title="Send Verification Code"
        onPress={handleSendCode}
        loading={isLoading}
        style={styles.button}
      />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.backLink, isRTL && styles.rtlText]}>
          Back to Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderVerificationStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.title, isRTL && styles.rtlText]}>Enter Verification Code</Text>
      <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
        We sent a 6-digit code to {phoneNumber}
      </Text>

      <TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setStep('phone')}>
        <Text style={[styles.backLink, isRTL && styles.rtlText]}>
          Change Phone Number
        </Text>
      </TouchableOpacity>
    </View>
  );

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
              {step === 'phone' && renderPhoneStep()}
              {step === 'verification' && renderVerificationStep()}
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
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  rtlText: {
    textAlign: 'right',
  },
  button: {
    marginBottom: 24,
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  resendText: {
    color: colors.white,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  backLink: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    opacity: 0.8,
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
