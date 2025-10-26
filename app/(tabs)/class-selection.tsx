import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Globe, LogOut } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { CLASSES, SECTIONS } from '@/constants/mockData';

export default function ClassSelectionScreen() {
  const router = useRouter();
  const { t, isRTL, language, setLanguageTo } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { signOut } = useAuth();
  
  console.log('ClassSelectionScreen rendered');
  
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');

  const classOptions = CLASSES.map((cls) => ({
    label: cls,
    value: cls,
  }));

  const sectionOptions = SECTIONS.map((sec) => ({
    label: sec,
    value: sec,
  }));

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Use a small delay to ensure state updates are complete
              setTimeout(() => {
                router.push('/sign-in' as any);
              }, 50);
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDone = () => {
    if (selectedClass && selectedSection) {
      console.log('Class and Section selected:', { selectedClass, selectedSection });
      router.push({
        pathname: '/attendance' as any,
        params: {
          class: selectedClass,
          section: selectedSection,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.gradient}
      >
        <BackgroundPattern />
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
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
              
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <LogOut size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.logoContainer}>
              <Logo size={60} showText={false} />
            </View>
            <Text style={[styles.title, isRTL && styles.rtlText]}>Attendance</Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              Select Class and Section
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Dropdown
              label={t.class}
              placeholder={t.class}
              options={classOptions}
              value={selectedClass}
              onSelect={(value) => setSelectedClass(String(value))}
              isRTL={isRTL}
            />

            <Dropdown
              label={t.section}
              placeholder={t.section}
              options={sectionOptions}
              value={selectedSection}
              onSelect={(value) => setSelectedSection(String(value))}
              isRTL={isRTL}
            />

            <Button
              title={t.done}
              onPress={handleDone}
              disabled={!selectedClass || !selectedSection}
              style={styles.doneButton}
            />
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  languageMenu: {
    position: 'absolute' as const,
    top: 36,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 20,
  },
  languageOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
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
  logoutButton: {
    padding: 8,
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gold,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
  },
  formContainer: {
    flex: 1,
  },
  doneButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});
