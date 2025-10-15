import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, Globe } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Dropdown from '@/components/Dropdown';
import Input from '@/components/Input';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { SURAHS } from '@/constants/surahs';
import { MOCK_STUDENTS } from '@/constants/mockData';

export default function HomeworkScreen() {
  const router = useRouter();
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [startSurah, setStartSurah] = useState<number>(0);
  const [startVerse, setStartVerse] = useState('');
  const [endSurah, setEndSurah] = useState<number>(0);
  const [endVerse, setEndVerse] = useState('');

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={28} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.languageButton}
            onPress={toggleLanguage}
          >
            <Globe size={24} color={colors.white} />
            <Text style={styles.languageText}>{language === 'en' ? 'اردو' : 'English'}</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoSmall}>
              <Logo size={60} showText={false} />
            </View>
            <Text style={[styles.title, isRTL && styles.rtlText]}>{t.homework}</Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {t.homework}
            </Text>
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
              title={t.done}
              onPress={handleSubmit}
              disabled={!selectedStudent || !startSurah || !startVerse || !endSurah || !endVerse}
              style={styles.submitButton}
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
  backButton: {
    position: 'absolute' as const,
    top: 60,
    left: 24,
    zIndex: 10,
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
