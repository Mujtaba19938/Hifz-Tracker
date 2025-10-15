import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Globe } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const { t, isRTL, toggleLanguage, language } = useLanguage();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');
    
    if (!phoneNumber || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await signIn(phoneNumber, password);
    
    if (result.success) {
      router.replace('/student-selection' as any);
    } else {
      setError(result.error || 'Sign in failed');
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
              style={styles.languageButton}
              onPress={toggleLanguage}
            >
              <Globe size={24} color={colors.white} />
              <Text style={styles.languageText}>{language === 'en' ? 'اردو' : 'English'}</Text>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Logo size={100} showText />
            </View>

            <View style={styles.formContainer}>
              <Text style={[styles.title, isRTL && styles.rtlText]}>{t.signIn}</Text>

              <Input
                placeholder={t.phoneNumber}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoCapitalize="none"
                isRTL={isRTL}
              />

              <Input
                placeholder={t.password}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                isRTL={isRTL}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => router.push('/forgot-password' as any)}>
                  <Text style={[styles.linkText, isRTL && styles.rtlText]}>{t.forgotPassword}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/register-masjid' as any)}>
                  <Text style={[styles.linkText, isRTL && styles.rtlText]}>{t.registerMasjidNow}</Text>
                </TouchableOpacity>
              </View>

              <Button
                title={t.signInNow}
                onPress={handleSignIn}
                loading={isLoading}
                style={styles.signInButton}
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
  languageButton: {
    position: 'absolute' as const,
    top: 60,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  languageText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
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
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  linkText: {
    color: colors.white,
    fontSize: 14,
  },
  signInButton: {
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
