import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, translations } from '@/constants/translations';

const LANGUAGE_KEY = '@hifz_tracker_language';

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (stored === 'en' || stored === 'ur') {
        setLanguage(stored);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = useCallback(async () => {
    const newLanguage: Language = language === 'en' ? 'ur' : 'en';
    setLanguage(newLanguage);
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  }, [language]);

  const t = translations[language];
  const isRTL = language === 'ur';

  return useMemo(
    () => ({
      language,
      toggleLanguage,
      t,
      isRTL,
      isLoading,
    }),
    [language, toggleLanguage, t, isRTL, isLoading]
  );
});
