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
  present: string;
  absent: string;
  leave: string;
  saveAttendance: string;
  homeworkAssigned: string;
  attendanceMarked: string;
  lessonUpdated: string;
  revisionUpdated: string;
  manzilUpdated: string;
  newLessonAssigned: string;
  submit: string;
  loginAsAdmin: string;
  adminLogin: string;
  adminDashboard: string;
  welcomeAdmin: string;
  defaultAdminCredentials: string;
  username: string;
  changeCredentials: string;
  updateCredentials: string;
  oldUsername: string;
  oldPassword: string;
  newUsername: string;
  newPassword: string;
  credentialsUpdated: string;
  totalTeachers: string;
  totalStudents: string;
  totalClasses: string;
  logout: string;
  summaryStatistics: string;
  manageUsers: string;
  addNewTeacher: string;
  addNewStudent: string;
  viewAllUsers: string;
  deleteUser: string;
  addTeacher: string;
  addStudent: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhone: string;
  studentName: string;
  studentClass: string;
  studentSection: string;
  cancel: string;
  save: string;
  userDeleted: string;
  userAdded: string;
  selectUser: string;
  confirmDelete: string;
  deleteUserMessage: string;
  generateUserId: string;
  studentAccountCreated: string;
  teacherAccountCreated: string;
  loginAsStudent: string;
  studentLogin: string;
  studentId: string;
  studentIdPlaceholder: string;
  studentLoginMessage: string;
  studentDashboard: string;
  welcomeStudent: string;
  yourHifzProgress: string;
  todaysLesson: string;
  revision: string;
  newLesson: string;
  surahName: string;
  startAyah: string;
  endAyah: string;
  status: string;
  markAsCompleted: string;
  noLessonAssigned: string;
  noLessonAssignedToday: string;
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
    present: 'Present',
    absent: 'Absent',
    leave: 'Leave',
    saveAttendance: 'Save Attendance',
    homeworkAssigned: 'Homework Assigned',
    attendanceMarked: 'Attendance Marked',
    lessonUpdated: 'Lesson Updated',
    revisionUpdated: 'Revision Updated',
    manzilUpdated: 'Manzil Updated',
    newLessonAssigned: 'New Lesson Assigned',
    submit: 'Submit',
    loginAsAdmin: 'Login as Admin',
    adminLogin: 'Admin Login',
    adminDashboard: 'Admin Dashboard',
    welcomeAdmin: 'Welcome, Admin',
    defaultAdminCredentials: 'Default Admin User Credentials Are:\nUsername: admin@hifztracker.com\nPassword: admin123\n⚠️ Please change them once you log in.',
    username: 'Username',
    changeCredentials: 'Change Credentials',
    updateCredentials: 'Update Credentials',
    oldUsername: 'Old Username',
    oldPassword: 'Old Password',
    newUsername: 'New Username',
    newPassword: 'New Password',
    credentialsUpdated: 'Admin user credentials have been updated successfully.',
    totalTeachers: 'Total Teachers',
    totalStudents: 'Total Students',
    totalClasses: 'Total Classes',
    logout: 'Logout',
    summaryStatistics: 'Summary Statistics',
    manageUsers: 'Manage Users',
    addNewTeacher: 'Add New Teacher',
    addNewStudent: 'Add New Student',
    viewAllUsers: 'View All Users',
    deleteUser: 'Delete User',
    addTeacher: 'Add Teacher',
    addStudent: 'Add Student',
    teacherName: 'Teacher Name',
    teacherEmail: 'Teacher Email',
    teacherPhone: 'Teacher Phone',
    studentName: 'Student Name',
    studentClass: 'Student Class',
    studentSection: 'Student Section',
    cancel: 'Cancel',
    save: 'Save',
    userDeleted: 'User deleted successfully',
    userAdded: 'User added successfully',
    selectUser: 'Select User',
    confirmDelete: 'Confirm Delete',
    deleteUserMessage: 'Are you sure you want to delete this user?',
    generateUserId: 'Generate User ID',
    studentAccountCreated: 'Student Account creation successful',
    teacherAccountCreated: 'Teacher Account creation successful',
    loginAsStudent: 'Log in as Student',
    studentLogin: 'Student Login',
    studentId: 'Student ID',
    studentIdPlaceholder: 'Enter your Student ID',
    studentLoginMessage: 'Use the Student ID provided by your teacher or admin.',
    studentDashboard: 'Student Dashboard',
    welcomeStudent: 'السلام علیکم',
    yourHifzProgress: 'Your Hifz Progress',
    todaysLesson: 'Today\'s Lesson',
    revision: 'Revision',
    newLesson: 'New Lesson',
    surahName: 'Surah Name',
    startAyah: 'Start Ayah',
    endAyah: 'End Ayah',
    status: 'Status',
    markAsCompleted: 'Mark as Completed',
    noLessonAssigned: 'No lesson assigned',
    noLessonAssignedToday: 'No new lesson assigned today.',
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
    revision: 'سبقی',
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
    present: 'حاضر',
    absent: 'غیر حاضر',
    leave: 'رخصت',
    saveAttendance: 'حاضری محفوظ کریں',
    homeworkAssigned: 'گھر کا کام تفویض',
    attendanceMarked: 'حاضری درج',
    lessonUpdated: 'سبق اپڈیٹ',
    revisionUpdated: 'سبقی اپڈیٹ',
    manzilUpdated: 'منزل اپڈیٹ',
    newLessonAssigned: 'نیا سبق تفویض',
    submit: 'جمع کریں',
    loginAsAdmin: 'ایڈمن لاگ ان کریں',
    adminLogin: 'ایڈمن لاگ ان',
    adminDashboard: 'ایڈمن ڈیش بورڈ',
    welcomeAdmin: 'خوش آمدید ایڈمن',
    defaultAdminCredentials: 'ڈیفالٹ ایڈمن صارف کے اسناد:\nیوزرنیم: admin@hifztracker.com\nپاس ورڈ: admin123\n⚠️ براہ کرم لاگ ان کے بعد انہیں تبدیل کریں۔',
    username: 'یوزرنیم',
    changeCredentials: 'اسناد تبدیل کریں',
    updateCredentials: 'اسناد اپڈیٹ کریں',
    oldUsername: 'پرانا یوزرنیم',
    oldPassword: 'پرانا پاس ورڈ',
    newUsername: 'نیا یوزرنیم',
    newPassword: 'نیا پاس ورڈ',
    credentialsUpdated: 'ایڈمن صارف کے اسناد کامیابی سے اپ ڈیٹ ہو گئے ہیں۔',
    totalTeachers: 'کل اساتذہ',
    totalStudents: 'کل طلباء',
    totalClasses: 'کل جماعتیں',
    logout: 'لاگ آؤٹ',
    summaryStatistics: 'خلاصہ اعداد و شمار',
    manageUsers: 'صارفین کا انتظام',
    addNewTeacher: 'نیا استاد شامل کریں',
    addNewStudent: 'نیا طالب علم شامل کریں',
    viewAllUsers: 'تمام صارفین دیکھیں',
    deleteUser: 'صارف حذف کریں',
    addTeacher: 'استاد شامل کریں',
    addStudent: 'طالب علم شامل کریں',
    teacherName: 'استاد کا نام',
    teacherEmail: 'استاد کا ای میل',
    teacherPhone: 'استاد کا فون',
    studentName: 'طالب علم کا نام',
    studentClass: 'طالب علم کی جماعت',
    studentSection: 'طالب علم کا سیکشن',
    cancel: 'منسوخ',
    save: 'محفوظ کریں',
    userDeleted: 'صارف کامیابی سے حذف ہو گیا',
    userAdded: 'صارف کامیابی سے شامل ہو گیا',
    selectUser: 'صارف منتخب کریں',
    confirmDelete: 'حذف کی تصدیق',
    deleteUserMessage: 'کیا آپ واقعی اس صارف کو حذف کرنا چاہتے ہیں؟',
    generateUserId: 'یوزر آئی ڈی بنائیں',
    studentAccountCreated: 'طالب علم کا اکاؤنٹ کامیابی سے بن گیا',
    teacherAccountCreated: 'استاد کا اکاؤنٹ کامیابی سے بن گیا',
    loginAsStudent: 'طالب علم کے طور پر لاگ ان کریں',
    studentLogin: 'طالب علم لاگ ان',
    studentId: 'طالب علم آئی ڈی',
    studentIdPlaceholder: 'اپنا طالب علم آئی ڈی درج کریں',
    studentLoginMessage: 'اپنے استاد یا ایڈمن کی طرف سے فراہم کردہ طالب علم آئی ڈی استعمال کریں۔',
    studentDashboard: 'طالب علم ڈیش بورڈ',
    welcomeStudent: 'السلام علیکم',
    yourHifzProgress: 'آپ کی حفظ کی پیش رفت',
    todaysLesson: 'آج کا سبق',
    revision: 'سبقی',
    newLesson: 'نیا سبق',
    surahName: 'سورۃ کا نام',
    startAyah: 'شروع آیت',
    endAyah: 'آخر آیت',
    status: 'حالت',
    markAsCompleted: 'مکمل کے طور پر نشان زد کریں',
    noLessonAssigned: 'کوئی سبق تفویض نہیں',
    noLessonAssignedToday: 'آج کوئی نیا سبق تفویض نہیں کیا گیا۔',
  },
};
