import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Globe } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Dropdown from '@/components/Dropdown';
import Input from '@/components/Input';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import { SuccessPopup } from '@/components/SuccessPopup';
import colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { SURAHS } from '@/constants/surahs';
import { MOCK_STUDENTS } from '@/constants/mockData';

export default function HomeworkScreen() {
  const router = useRouter();
  const { t, isRTL, language, setLanguageTo } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [startSurah, setStartSurah] = useState<number>(0);
  const [startVerse, setStartVerse] = useState('');
  const [endSurah, setEndSurah] = useState<number>(0);
  const [endVerse, setEndVerse] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const studentOptions = MOCK_STUDENTS.map((student) => ({
    label: language === 'ur' ? student.urduName : student.name,
    value: student.id,
  }));

  const surahOptions = SURAHS.map((s) => ({
    label: language === 'ur' ? `${s.number}. ${s.urduName}` : `${s.number}. ${s.name}`,
    value: s.number,
  }));

  const handleSubmit = () => {
    console.log('Homework assigned:', {
      selectedStudent,
      startSurah,
      startVerse,
      endSurah,
      endVerse,
    });
    
    // Show success popup
    setShowSuccessPopup(true);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    router.back();
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

          <View style={styles.header}>
            <View style={styles.logoSmall}>
              <Logo size={60} showText={false} />
            </View>
            <Text style={[styles.title, isRTL && styles.rtlText]}>{t.homework}</Text>
          </View>

          <View style={styles.formContainer}>
            <Dropdown
              label={t.studentName}
              placeholder={t.studentName}
              options={studentOptions}
              value={selectedStudent}
              onSelect={(value) => setSelectedStudent(String(value))}
              isRTL={isRTL}
            />

            <Dropdown
              label={t.startSurah}
              placeholder={t.startSurah}
              options={surahOptions}
              value={startSurah}
              onSelect={(value) => setStartSurah(Number(value))}
              isRTL={isRTL}
            />

            <Input
              label={t.startVerse}
              placeholder={t.startVerse}
              value={startVerse}
              onChangeText={setStartVerse}
              keyboardType="number-pad"
              isRTL={isRTL}
            />

            <Dropdown
              label={t.endSurah}
              placeholder={t.endSurah}
              options={surahOptions}
              value={endSurah}
              onSelect={(value) => setEndSurah(Number(value))}
              isRTL={isRTL}
            />

            <Input
              label={t.endVerse}
              placeholder={t.endVerse}
              value={endVerse}
              onChangeText={setEndVerse}
              keyboardType="number-pad"
              isRTL={isRTL}
            />

            <Button
              title={t.submit}
              onPress={handleSubmit}
              disabled={!selectedStudent || !startSurah || !startVerse || !endSurah || !endVerse}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </LinearGradient>

      <SuccessPopup
        visible={showSuccessPopup}
        message={t.homeworkAssigned}
        onClose={handleSuccessPopupClose}
        isRTL={isRTL}
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
    top: 92,
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
    textAlign: 'right' as const,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoSmall: {
    marginBottom: 12,
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
  submitButton: {
    marginTop: 16,
  },
});
