import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, Globe } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { SURAHS } from '@/constants/surahs';


export default function ActivityScreen() {
  const router = useRouter();
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  
  const [selectedActivityType, setSelectedActivityType] = useState<'lesson' | 'revision' | 'newLesson' | 'manzil'>('lesson');
  const [selectedSurah, setSelectedSurah] = useState<string>('');
  const [startVerse, setStartVerse] = useState('');
  const [endVerse, setEndVerse] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [qualities, setQualities] = useState('');

  const surahOptions = SURAHS.map((surah) => ({
    label: language === 'ur' ? surah.urduName : surah.name,
    value: surah.number.toString(),
  }));

  const handleSubmit = () => {
    console.log('Activity submitted:', {
      selectedActivityType,
      selectedSurah,
      startVerse,
      endVerse,
      mistakes,
      qualities,
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
            <Text style={[styles.title, isRTL && styles.rtlText]}>{t.activity}</Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {t.activity}
            </Text>
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

            <Input
              label={t.mistakes}
              placeholder={t.mistakes}
              value={mistakes}
              onChangeText={setMistakes}
              isRTL={isRTL}
            />

            <Input
              label={t.qualities}
              placeholder={t.qualities}
              value={qualities}
              onChangeText={setQualities}
              isRTL={isRTL}
            />
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
    gap: 8,
  },
  activityTypeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityTypeButtonActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  activityTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  activityTypeTextActive: {
    color: colors.primary,
  },
  formContainer: {
    flex: 1,
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 16,
  },
});