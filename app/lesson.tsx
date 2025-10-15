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

export default function LessonScreen() {
  const router = useRouter();
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  
  const [startSurah, setStartSurah] = useState<string>('');
  const [startVerses, setStartVerses] = useState('');
  const [endSurah, setEndSurah] = useState<string>('');
  const [endVerses, setEndVerses] = useState('');
  const [recitation, setRecitation] = useState('');
  const [memorization, setMemorization] = useState('');
  const [mistake, setMistake] = useState('');

  const surahOptions = SURAHS.map((surah) => ({
    label: language === 'ur' ? surah.urduName : surah.name,
    value: surah.number.toString(),
  }));

  const handleSubmit = () => {
    console.log('Lesson submitted:', {
      startSurah,
      startVerses,
      endSurah,
      endVerses,
      recitation,
      memorization,
      mistake,
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
            <Text style={[styles.title, isRTL && styles.rtlText]}>{t.lesson}</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Dropdown
              label={t.startSurah}
              placeholder={t.startSurah}
              options={surahOptions}
              value={startSurah}
              onSelect={(value) => setStartSurah(String(value))}
              isRTL={isRTL}
            />

            <Input
              label={t.startVerses}
              placeholder={t.startVerses}
              value={startVerses}
              onChangeText={setStartVerses}
              keyboardType="number-pad"
              isRTL={isRTL}
            />

            <Dropdown
              label={t.endSurah}
              placeholder={t.endSurah}
              options={surahOptions}
              value={endSurah}
              onSelect={(value) => setEndSurah(String(value))}
              isRTL={isRTL}
            />

            <Input
              label={t.endVerses}
              placeholder={t.endVerses}
              value={endVerses}
              onChangeText={setEndVerses}
              keyboardType="number-pad"
              isRTL={isRTL}
            />

            {/* Qualities Section */}
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
          </View>

          <Button
            title={t.done}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
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
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
  },
  formContainer: {
    flex: 1,
    marginBottom: 24,
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
  submitButton: {
    marginTop: 16,
  },
});
