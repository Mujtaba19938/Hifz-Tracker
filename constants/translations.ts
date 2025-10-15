export type Language = 'en' | 'ur';

export interface Translations {
  appName: string;
  signIn: string;
  phoneNumber: string;
  password: string;
  forgotPassword: string;
  registerMasjidNow: string;
  signInNow: string;
  enterYourMobileNumber: string;
  sendVerificationCode: string;
  enterVerificationCode: string;
  verify: string;
  newPassword: string;
  enterYourPassword: string;
  confirmYourPassword: string;
  studentSelection: string;
  studentName: string;
  class: string;
  section: string;
  done: string;
  activity: string;
  homework: string;
  surah: string;
  startSurah: string;
  startVerse: string;
  endVerse: string;
  endSurah: string;
  lesson: string;
  revision: string;
  newLesson: string;
  manzil: string;
  mistakes: string;
  qualities: string;
  back: string;
  privacyPolicy: string;
  termsOfService: string;
  byRegistering: string;
  registerMasjid: string;
  masjidInformation: string;
  masjidName: string;
  masjidAddress: string;
  city: string;
  country: string;
  adminInformation: string;
  adminName: string;
  email: string;
  confirmPassword: string;
  next: string;
  previous: string;
  register: string;
  step: string;
  of: string;
  verses: string;
  completed: string;
  inProgress: string;
  pending: string;
  startActivity: string;
  recitation: string;
  memorization: string;
  review: string;
  startVerses: string;
  endVerses: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'HIFZ TRACKER',
    signIn: 'SIGN IN',
    phoneNumber: 'Phone Number',
    password: 'Password',
    forgotPassword: 'Forgot Password',
    registerMasjidNow: 'Register Masjid Now',
    signInNow: 'SIGN IN NOW',
    enterYourMobileNumber: 'Enter Your Mobile Number',
    sendVerificationCode: 'SEND VERIFICATION CODE',
    enterVerificationCode: 'Enter Verification Code',
    verify: 'VERIFY',
    newPassword: 'NEW PASSWORD',
    enterYourPassword: 'Enter Your Password',
    confirmYourPassword: 'Confirm Your Password',
    studentSelection: 'Student Selection',
    studentName: 'Student Name',
    class: 'Class',
    section: 'Section',
    done: 'DONE',
    activity: 'Activity',
    homework: 'HOME WORK',
    surah: 'Surah',
    startSurah: 'Start Surah',
    startVerse: 'Start Verse No.',
    endVerse: 'End Verse No.',
    endSurah: 'End Surah',
    lesson: 'Lesson',
    revision: 'Revision',
    newLesson: 'New Lesson',
    manzil: 'Manzil',
    mistakes: 'Mistakes',
    qualities: 'Qualities',
    back: 'Back',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    byRegistering: 'By continuing, you agree to our Privacy Policy & Terms of Service',
    registerMasjid: 'Register Masjid',
    masjidInformation: 'Masjid Information',
    masjidName: 'Masjid Name',
    masjidAddress: 'Masjid Address',
    city: 'City',
    country: 'Country',
    adminInformation: 'Admin Information',
    adminName: 'Admin Name',
    email: 'Email Address',
    confirmPassword: 'Confirm Password',
    next: 'NEXT',
    previous: 'PREVIOUS',
    register: 'REGISTER',
    step: 'Step',
    of: 'of',
    verses: 'Verses',
    completed: 'Completed',
    inProgress: 'In Progress',
    pending: 'Pending',
    startActivity: 'Start Activity',
    recitation: 'Recitation',
    memorization: 'Memorization',
    review: 'Review',
    startVerses: 'Start Verses',
    endVerses: 'End Verses',
  },
  ur: {
    appName: 'حفظ TRACKER',
    signIn: 'سائن ان',
    phoneNumber: 'فون نمبر',
    password: 'پاس ورڈ',
    forgotPassword: 'پاس ورڈ بھول گئے',
    registerMasjidNow: 'مسجد رجسٹر کریں',
    signInNow: 'سائن ان کریں',
    enterYourMobileNumber: 'اپنا موبائل نمبر درج کریں',
    sendVerificationCode: 'تصدیقی کوڈ بھیجیں',
    enterVerificationCode: 'تصدیقی کوڈ درج کریں',
    verify: 'تصدیق کریں',
    newPassword: 'نیا پاس ورڈ',
    enterYourPassword: 'اپنا پاس ورڈ درج کریں',
    confirmYourPassword: 'اپنے پاس ورڈ کی تصدیق کریں',
    studentSelection: 'طالب علم کا انتخاب',
    studentName: 'طالب علم کا نام',
    class: 'جماعت',
    section: 'سیکشن',
    done: 'مکمل',
    activity: 'سرگرمی',
    homework: 'گھر کا کام',
    surah: 'سورۃ',
    startSurah: 'شروع سورۃ',
    startVerse: 'شروع آیت نمبر',
    endVerse: 'آخر آیت نمبر',
    endSurah: 'ختم سورۃ',
    lesson: 'سبق',
    revision: 'مرور',
    newLesson: 'نیا سبق',
    manzil: 'منزل',
    mistakes: 'غلطیاں',
    qualities: 'کمیات',
    back: 'واپس',
    privacyPolicy: 'رازداری کی پالیسی',
    termsOfService: 'سروس کی شرائط',
    byRegistering: 'جاری رکھ کر، آپ ہماری رازداری کی پالیسی اور سروس کی شرائط سے اتفاق کرتے ہیں',
    registerMasjid: 'مسجد رجسٹر کریں',
    masjidInformation: 'مسجد کی معلومات',
    masjidName: 'مسجد کا نام',
    masjidAddress: 'مسجد کا پتہ',
    city: 'شہر',
    country: 'ملک',
    adminInformation: 'ایڈمن کی معلومات',
    adminName: 'ایڈمن کا نام',
    email: 'ای میل ایڈریس',
    confirmPassword: 'پاس ورڈ کی تصدیق کریں',
    next: 'اگلا',
    previous: 'پچھلا',
    register: 'رجسٹر کریں',
    step: 'مرحلہ',
    of: 'میں سے',
    verses: 'آیات',
    completed: 'مکمل',
    inProgress: 'جاری',
    pending: 'انتظار',
    startActivity: 'شروع کریں',
    recitation: 'تلاوت',
    memorization: 'حفظ',
    review: 'مرور',
    startVerses: 'شروع آیات',
    endVerses: 'ختم آیات',
  },
};
