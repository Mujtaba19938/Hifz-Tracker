import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Globe, Lock, GraduationCap } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import AdminCredentialsPopup from '@/components/AdminCredentialsPopup';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const { t, isRTL, language, setLanguageTo } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isStudentMode, setIsStudentMode] = useState(false);
  const [showCredentialsPopup, setShowCredentialsPopup] = useState(false);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleSignIn = async () => {
    setError('');
    
    if (isAdminMode) {
      if (!username || !password) {
        setError('Please fill in all fields');
        return;
      }
      
      // TODO: Implement admin login API call
      const result = await signIn(username, password, 'admin');
      
      if (result.success) {
        router.replace('/admin-dashboard' as any);
      } else {
        setError(result.error || 'Admin login failed');
      }
    } else if (isStudentMode) {
      if (!studentId) {
        setError('Please enter your Student ID');
        return;
      }

      const result = await signIn(studentId, password, 'student');
      
      if (result.success) {
        router.replace('/student-dashboard' as any);
      } else {
        setError(result.error || 'Student login failed');
      }
    } else {
      if (!phoneNumber || !password) {
        setError('Please fill in all fields');
        return;
      }

      const result = await signIn(phoneNumber, password);
      
      console.log('Sign-in result:', result);
      
      if (result.success) {
        console.log('Sign-in successful, navigating to class-selection');
        router.replace('/(tabs)/class-selection' as any);
      } else {
        setError(result.error || 'Sign in failed');
      }
    }
  };

  const handleAdminToggle = () => {
    if (!isAdminMode) {
      setShowCredentialsPopup(true);
    } else {
      setIsAdminMode(false);
      setUsername('');
      setPassword('');
      setError('');
    }
  };

  const handleCredentialsPopupClose = () => {
    setShowCredentialsPopup(false);
    setIsAdminMode(true);
  };

  const handleStudentLogin = () => {
    setShowStudentLogin(true);
    setIsStudentMode(true);
    setError('');
  };

  const handleBackToNormal = () => {
    setIsStudentMode(false);
    setShowStudentLogin(false);
    setStudentId('');
    setPassword('');
    setError('');
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
            <View style={styles.languageWrapper}>
              {showLangMenu && (
                <TouchableWithoutFeedback onPress={() => setShowLangMenu(false)}>
                  <View style={styles.languageOverlay} />
                </TouchableWithoutFeedback>
              )}
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => setShowLangMenu(v => !v)}
              >
                <Globe size={24} color={colors.white} />
              </TouchableOpacity>
              {showLangMenu && (
                <View style={styles.languageMenu}>
                  <TouchableOpacity style={styles.languageMenuItem} onPress={() => { setLanguageTo('en' as any); setShowLangMenu(false); }}>
                    <Text style={styles.languageMenuText}>English</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.languageMenuItem} onPress={() => { setLanguageTo('ur' as any); setShowLangMenu(false); }}>
                    <Text style={styles.languageMenuText}>اردو</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.logoContainer}>
              <Logo size={100} showText />
            </View>

            <View style={styles.formContainer}>
              <Text style={[styles.title, isRTL && styles.rtlText]}>
                {isAdminMode ? t.adminLogin : isStudentMode ? t.studentLogin : t.signIn}
              </Text>

              {!isAdminMode && !isStudentMode && (
                <View style={styles.loginOptionsContainer}>
                  <TouchableOpacity
                    style={styles.adminToggleButton}
                    onPress={handleAdminToggle}
                  >
                    <Lock size={20} color={colors.white} />
                    <Text style={styles.adminToggleText}>{t.loginAsAdmin}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.studentToggleButton}
                    onPress={handleStudentLogin}
                  >
                    <GraduationCap size={20} color={colors.white} />
                    <Text style={styles.studentToggleText}>{t.loginAsStudent}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isAdminMode && (
                <TouchableOpacity
                  style={styles.backToNormalButton}
                  onPress={handleAdminToggle}
                >
                  <Text style={styles.backToNormalText}>← Back to Teacher Login</Text>
                </TouchableOpacity>
              )}

              {isStudentMode && (
                <TouchableOpacity
                  style={styles.backToNormalButton}
                  onPress={handleBackToNormal}
                >
                  <Text style={styles.backToNormalText}>← Back to Teacher Login</Text>
                </TouchableOpacity>
              )}

              {isAdminMode ? (
                <Input
                  placeholder={t.username}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  isRTL={isRTL}
                />
              ) : isStudentMode ? (
                <Input
                  placeholder={t.studentIdPlaceholder}
                  value={studentId}
                  onChangeText={setStudentId}
                  autoCapitalize="none"
                  isRTL={isRTL}
                />
              ) : (
                <Input
                  placeholder={t.phoneNumber}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  isRTL={isRTL}
                />
              )}

              <Input
                placeholder={t.password}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                isRTL={isRTL}
              />

              {isStudentMode && (
                <Text style={[styles.studentMessage, isRTL && styles.rtlText]}>
                  {t.studentLoginMessage}
                </Text>
              )}

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
                title={isAdminMode ? t.adminLogin : isStudentMode ? t.signInNow : t.signInNow}
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
      
      <AdminCredentialsPopup
        visible={showCredentialsPopup}
        onClose={handleCredentialsPopupClose}
      />
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
  languageWrapper: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 12,
  },
  languageButton: {
    position: 'absolute' as const,
    top: 60,
    right: 24,
    padding: 8,
    zIndex: 13,
  },
  languageMenu: {
    position: 'absolute' as const,
    top: 100,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 14,
  },
  languageOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
  },
  languageMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 120,
  },
  languageMenuText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center' as const,
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
  adminToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  adminToggleText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  backToNormalButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backToNormalText: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.8,
  },
  loginOptionsContainer: {
    marginBottom: 20,
  },
  studentToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  studentToggleText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  studentMessage: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
});
