import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Globe } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import { SuccessPopup } from '@/components/SuccessPopup';
import colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { SURAHS } from '@/constants/surahs';
import { CLASSES, SECTIONS } from '@/constants/mockData';
import { autoDetectingApiService } from '@/services/autoDetectingApi';

export default function ActivityScreen() {
  const router = useRouter();
  const { t, isRTL, language, setLanguageTo } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [selectedActivityType, setSelectedActivityType] = useState<'lesson' | 'revision' | 'newLesson' | 'manzil'>('lesson');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [students, setStudents] = useState<Array<{ id: string; name: string; class?: string; section?: string }>>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState<string>('');
  const [startVerse, setStartVerse] = useState('');
  const [endVerse, setEndVerse] = useState('');
  const [recitation, setRecitation] = useState('');
  const [memorization, setMemorization] = useState('');
  const [mistake, setMistake] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const classOptions = CLASSES.map((cls) => ({ label: cls, value: cls }));
  const sectionOptions = SECTIONS.map((sec) => ({ label: sec, value: sec }));

  // Load students for selected class/section
  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!selectedClass || !selectedSection) {
        setStudents([]);
        return;
      }
      setStudentsLoading(true);
      try {
        const sRes = await autoDetectingApiService.getStudentsByClassSection(selectedClass, selectedSection);
        if (!cancelled && sRes.success && (sRes.data as any)?.students) {
          const list = (sRes.data as any).students.map((s: any) => ({
            id: s.studentId,
            name: s.name || s.urduName,
            class: selectedClass,
            section: selectedSection,
          }));
          setStudents(list);
        } else if (!cancelled) {
          setStudents([]);
        }
      } catch (e) {
        console.log('Failed to fetch students for Activity:', selectedClass, selectedSection, e);
        if (!cancelled) setStudents([]);
      } finally {
        if (!cancelled) setStudentsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedClass, selectedSection]);

  const studentOptions = (studentsLoading ? [] : students.map((s) => ({
    label: s.class && s.section ? `${s.name} (${s.class} - ${s.section})` : s.name,
    value: s.id,
  })));

  const effectiveStudentOptions = studentOptions.length > 0
    ? studentOptions
    : (!studentsLoading && selectedClass && selectedSection ? [{ label: 'No students found', value: '__none__' }] : []);

  const surahOptions = SURAHS.map((surah) => ({
    label: language === 'ur' ? surah.urduName : surah.name,
    value: surah.number.toString(),
  }));

  const handleSubmit = async () => {
    console.log('Activity submitted:', {
      selectedActivityType,
      selectedStudent,
      selectedSurah,
      startVerse,
      endVerse,
      recitation,
      memorization,
      mistake,
    });
    try {
      if (selectedActivityType === 'newLesson') {
        const surahNum = Number(selectedSurah || 0);
        const surahMeta = SURAHS.find(s => s.number === surahNum);
        if (!selectedStudent || !surahMeta || !startVerse || !endVerse) {
          setShowSuccessPopup(true);
          return;
        }
        const due = new Date();
        due.setDate(due.getDate() + 1);
        await autoDetectingApiService.assignLesson({
          studentId: selectedStudent,
          startSurah: { number: surahMeta.number, name: surahMeta.name, urduName: surahMeta.urduName },
          startVerse: Number(startVerse),
          endSurah: { number: surahMeta.number, name: surahMeta.name, urduName: surahMeta.urduName },
          endVerse: Number(endVerse),
          dueDate: due.toISOString(),
        });
      }
      setShowSuccessPopup(true);
    } catch (e) {
      console.log('Failed to submit activity:', e);
      setShowSuccessPopup(true);
    }
  };

  const getSuccessMessage = () => {
    switch (selectedActivityType) {
      case 'lesson':
        return t.lessonUpdated;
      case 'revision':
        return t.revisionUpdated;
      case 'manzil':
        return t.manzilUpdated;
      case 'newLesson':
        return t.newLessonAssigned;
      default:
        return t.lessonUpdated;
    }
  };

  // Reset all form fields
  const resetForm = () => {
    setSelectedActivityType('lesson');
    setSelectedStudent('');
    setSelectedClass('');
    setSelectedSection('');
    setStudents([]);
    setSelectedSurah('');
    setStartVerse('');
    setEndVerse('');
    setRecitation('');
    setMemorization('');
    setMistake('');
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    resetForm();
    router.back();
  };

  // Clear form when this screen loses focus (tabs keep components mounted)
  useFocusEffect(React.useCallback(() => {
    return () => {
      resetForm();
      setShowLangMenu(false);
    };
  }, []));

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
            <Text style={[styles.title, isRTL && styles.rtlText]}>{t.activity}</Text>
          </View>

          {/* Activity Type Selector */}
          <View style={styles.activityTypeContainer}>
            <TouchableOpacity
              style={[
                styles.activityTypeButton,
                selectedActivityType === 'lesson' && styles.activityTypeButtonActive,
              ]}
              onPress={() => setSelectedActivityType('lesson')}
            >
              <Text
                style={[
                  styles.activityTypeText,
                  selectedActivityType === 'lesson' && styles.activityTypeTextActive,
                ]}
              >
                {t.lesson}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.activityTypeButton,
                selectedActivityType === 'revision' && styles.activityTypeButtonActive,
              ]}
              onPress={() => setSelectedActivityType('revision')}
            >
              <Text
                style={[
                  styles.activityTypeText,
                  selectedActivityType === 'revision' && styles.activityTypeTextActive,
                ]}
              >
                {t.revision}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.activityTypeButton,
                selectedActivityType === 'manzil' && styles.activityTypeButtonActive,
              ]}
              onPress={() => setSelectedActivityType('manzil')}
            >
              <Text
                style={[
                  styles.activityTypeText,
                  selectedActivityType === 'manzil' && styles.activityTypeTextActive,
                ]}
              >
                {t.manzil}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.activityTypeButton,
                selectedActivityType === 'newLesson' && styles.activityTypeButtonActive,
              ]}
              onPress={() => setSelectedActivityType('newLesson')}
            >
              <Text
                style={[
                  styles.activityTypeText,
                  selectedActivityType === 'newLesson' && styles.activityTypeTextActive,
                ]}
              >
                {t.newLesson}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Dropdown
              label={t.class}
              placeholder={t.class}
              options={classOptions}
              value={selectedClass}
              onSelect={(value) => { setSelectedClass(String(value)); setSelectedStudent(''); }}
              isRTL={isRTL}
            />

            <Dropdown
              label={t.section}
              placeholder={t.section}
              options={sectionOptions}
              value={selectedSection}
              onSelect={(value) => { setSelectedSection(String(value)); setSelectedStudent(''); }}
              isRTL={isRTL}
            />

            <Dropdown
              label={t.studentName}
              placeholder={t.studentName}
              options={effectiveStudentOptions}
              value={selectedStudent}
              onSelect={(value) => {
                if (value === '__none__') return;
                setSelectedStudent(String(value));
              }}
              isRTL={isRTL}
            />
            <Dropdown
              label={t.surah}
              placeholder={t.surah}
              options={surahOptions}
              value={selectedSurah}
              onSelect={(value) => setSelectedSurah(String(value))}
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

            <Input
              label={t.endVerse}
              placeholder={t.endVerse}
              value={endVerse}
              onChangeText={setEndVerse}
              keyboardType="number-pad"
              isRTL={isRTL}
            />

            {/* Qualities Section - Hidden for New Lesson */}
            {selectedActivityType !== 'newLesson' && (
              <View style={styles.qualitiesContainer}>
                <Text style={[styles.qualitiesLabel, isRTL && styles.rtlText]}>
                  {t.qualities}
                </Text>
                 <View style={styles.qualitiesInputsContainer}>
                   <Input
                     placeholder={t.recitation}
                     value={recitation}
                     onChangeText={setRecitation}
                     isRTL={isRTL}
                     style={styles.qualityInput}
                   />

                   <Input
                     placeholder={t.memorization}
                     value={memorization}
                     onChangeText={setMemorization}
                     isRTL={isRTL}
                     style={styles.qualityInput}
                   />

                   <Input
                     placeholder={t.mistakes}
                     value={mistake}
                     onChangeText={setMistake}
                     isRTL={isRTL}
                     style={styles.qualityInput}
                   />
                 </View>
              </View>
            )}
          </View>

          <Button
            title={t.submit}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </ScrollView>
      </LinearGradient>

      <SuccessPopup
        visible={showSuccessPopup}
        message={getSuccessMessage()}
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
    paddingBottom: 100,
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
  activityTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 6,
    paddingHorizontal: 2,
  },
  activityTypeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 32,
  },
  activityTypeButtonActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  activityTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 14,
  },
  activityTypeTextActive: {
    color: colors.primary,
  },
  formContainer: {
    flex: 1,
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 20,
  },
  qualitiesContainer: {
    marginBottom: 20,
  },
  qualitiesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 12,
  },
  qualitiesInputsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  qualityInput: {
    flex: 1,
  },
});