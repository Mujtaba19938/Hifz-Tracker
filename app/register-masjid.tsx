import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Globe, ChevronLeft } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface MasjidData {
  masjidName: string;
  masjidAddress: string;
  city: string;
  country: string;
}

interface AdminData {
  adminName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterMasjidScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const { t, isRTL, language, setLanguageTo } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  
  const [masjidData, setMasjidData] = useState<MasjidData>({
    masjidName: '',
    masjidAddress: '',
    city: '',
    country: '',
  });
  
  const [adminData, setAdminData] = useState<AdminData>({
    adminName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const totalSteps = 2;

  const validateStep1 = () => {
    if (!masjidData.masjidName.trim()) {
      setError('Please enter masjid name');
      return false;
    }
    if (!masjidData.masjidAddress.trim()) {
      setError('Please enter masjid address');
      return false;
    }
    if (!masjidData.city.trim()) {
      setError('Please enter city');
      return false;
    }
    if (!masjidData.country.trim()) {
      setError('Please enter country');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!adminData.adminName.trim()) {
      setError('Please enter admin name');
      return false;
    }
    if (!adminData.phoneNumber.trim()) {
      setError('Please enter phone number');
      return false;
    }
    if (!adminData.email.trim()) {
      setError('Please enter email address');
      return false;
    }
    if (!adminData.password) {
      setError('Please enter password');
      return false;
    }
    if (adminData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (adminData.password !== adminData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  const handlePrevious = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async () => {
    setError('');
    
    if (!validateStep2()) {
      return;
    }

    const result = await register({
      ...masjidData,
      ...adminData,
    });
    
    if (result.success) {
      router.replace('/sign-in' as any);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <Text style={[styles.stepText, isRTL && styles.rtlText]}>
        {t.step} {currentStep} {t.of} {totalSteps}
      </Text>
      <View style={styles.stepDots}>
        {[1, 2].map((step) => (
          <View
            key={step}
            style={[
              styles.stepDot,
              currentStep >= step && styles.stepDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, isRTL && styles.rtlText]}>
        {t.masjidInformation}
      </Text>

      <Input
        placeholder={t.masjidName}
        value={masjidData.masjidName}
        onChangeText={(text) => setMasjidData({ ...masjidData, masjidName: text })}
        isRTL={isRTL}
      />

      <Input
        placeholder={t.masjidAddress}
        value={masjidData.masjidAddress}
        onChangeText={(text) => setMasjidData({ ...masjidData, masjidAddress: text })}
        isRTL={isRTL}
        multiline
      />

      <Input
        placeholder={t.city}
        value={masjidData.city}
        onChangeText={(text) => setMasjidData({ ...masjidData, city: text })}
        isRTL={isRTL}
      />

      <Input
        placeholder={t.country}
        value={masjidData.country}
        onChangeText={(text) => setMasjidData({ ...masjidData, country: text })}
        isRTL={isRTL}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title={t.next}
        onPress={handleNext}
        style={styles.actionButton}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, isRTL && styles.rtlText]}>
        {t.adminInformation}
      </Text>

      <Input
        placeholder={t.adminName}
        value={adminData.adminName}
        onChangeText={(text) => setAdminData({ ...adminData, adminName: text })}
        isRTL={isRTL}
      />

      <Input
        placeholder={t.phoneNumber}
        value={adminData.phoneNumber}
        onChangeText={(text) => setAdminData({ ...adminData, phoneNumber: text })}
        keyboardType="phone-pad"
        isRTL={isRTL}
      />

      <Input
        placeholder={t.email}
        value={adminData.email}
        onChangeText={(text) => setAdminData({ ...adminData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        isRTL={isRTL}
      />

      <Input
        placeholder={t.password}
        value={adminData.password}
        onChangeText={(text) => setAdminData({ ...adminData, password: text })}
        secureTextEntry
        isRTL={isRTL}
      />

      <Input
        placeholder={t.confirmPassword}
        value={adminData.confirmPassword}
        onChangeText={(text) => setAdminData({ ...adminData, confirmPassword: text })}
        secureTextEntry
        isRTL={isRTL}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.buttonRow}>
        <Button
          title={t.previous}
          onPress={handlePrevious}
          style={styles.halfButton}
          variant="secondary"
        />
        <Button
          title={t.register}
          onPress={handleRegister}
          loading={isLoading}
          style={styles.halfButton}
        />
      </View>

      <Text style={[styles.disclaimer, isRTL && styles.rtlText]}>
        {t.byRegistering}
      </Text>
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
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ChevronLeft size={24} color={colors.white} />
              </TouchableOpacity>

              <View>
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
            </View>

            <View style={styles.logoContainer}>
              <Logo size={80} showText />
            </View>

            <View style={styles.formContainer}>
              <Text style={[styles.title, isRTL && styles.rtlText]}>{t.registerMasjid}</Text>

              {renderStepIndicator()}

              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  languageMenu: {
    position: 'absolute' as const,
    top: 36,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 20,
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
    textAlign: 'right' as const,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  rtlText: {
    textAlign: 'right',
  },
  stepIndicator: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  stepDots: {
    flexDirection: 'row',
    gap: 12,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepDotActive: {
    backgroundColor: colors.white,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 24,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  halfButton: {
    flex: 1,
  },
  disclaimer: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
    marginTop: 16,
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
