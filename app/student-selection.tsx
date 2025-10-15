import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BookOpen, Home, Globe } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_STUDENTS, CLASSES, SECTIONS } from '@/constants/mockData';

export default function StudentSelectionScreen() {
  const router = useRouter();
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');

  const studentOptions = MOCK_STUDENTS.map((student) => ({
    label: language === 'ur' ? student.urduName : student.name,
    value: student.id,
  }));

  const classOptions = CLASSES.map((cls) => ({
    label: cls,
    value: cls,
  }));

  const sectionOptions = SECTIONS.map((sec) => ({
    label: sec,
    value: sec,
  }));

  const handleDone = () => {
    if (selectedStudent) {
      router.push('/lesson' as any);
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
            <Text style={[styles.title, isRTL && styles.rtlText]}>{t.studentSelection}</Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {t.studentSelection}
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
              disabled={!selectedStudent}
              style={styles.doneButton}
            />

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/activity' as any)}
              >
                <BookOpen size={32} color={colors.white} />
                <Text style={styles.actionText}>{t.activity}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/homework' as any)}
              >
                <Home size={32} color={colors.white} />
                <Text style={styles.actionText}>{t.homework}</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 32,
  },
  logoSmall: {
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  actionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
});
