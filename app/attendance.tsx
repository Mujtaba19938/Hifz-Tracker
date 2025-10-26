import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Globe, Check, X, Moon } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import { SuccessPopup } from '@/components/SuccessPopup';
import colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { socket, joinClassRoom } from '@/services/socket';
import { autoDetectingApiService } from '@/services/autoDetectingApi';

type AttendanceStatus = 'present' | 'absent' | 'leave';

interface StudentAttendance {
  id: string;
  name: string;
  urduName: string;
  class: string;
  section: string;
  status: AttendanceStatus;
}

export default function AttendanceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, isRTL, language, setLanguageTo } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const selectedClass = params.class as string;
  const selectedSection = params.section as string;
  
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch real students from backend
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!selectedClass || !selectedSection) return;
      setLoading(true);
      try {
        const res = await autoDetectingApiService.getStudentsByClassSection(selectedClass, selectedSection);
        if (!cancelled && res.success && res.data) {
          const list = res.data.students.map(s => ({
            id: s.studentId,
            name: s.name,
            urduName: s.urduName,
            class: selectedClass,
            section: selectedSection,
            status: 'present' as AttendanceStatus,
          }));
          setStudents(list);
        }
      } catch (e) {
        console.log('Failed to load students:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedClass, selectedSection]);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Join class room and listen for newly added students via Socket.io
  useEffect(() => {
    if (!selectedClass || !selectedSection) return;

    joinClassRoom(selectedClass, selectedSection);

    const onNewStudent = (student: any) => {
      // Avoid duplicates by studentId or name
      setStudents(prev => {
        const exists = prev.some(s => s.id === student.studentId || s.name === student.name);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: student.studentId || `${student.id}`,
            name: student.name,
            urduName: student.urduName || student.name,
            class: student.class,
            section: student.section,
            status: 'present' as AttendanceStatus,
          },
        ];
      });
    };

    socket.on('new_student', onNewStudent);
    return () => {
      socket.off('new_student', onNewStudent);
    };
  }, [selectedClass, selectedSection]);

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleSubmit = () => {
    const attendanceData = students.map(student => ({
      id: student.id,
      name: student.name,
      class: student.class,
      section: student.section,
      status: student.status,
    }));
    
    console.log('Attendance submitted:', attendanceData);
    
    // Show success popup
    setShowSuccessPopup(true);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    router.push('/(tabs)/class-selection' as any);
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return colors.success || '#4CAF50';
      case 'absent':
        return colors.error || '#F44336';
      case 'leave':
        return colors.warning || '#FF9800';
      default:
        return colors.white;
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <Check size={20} color={colors.white} />;
      case 'absent':
        return <X size={20} color={colors.white} />;
      case 'leave':
        return <Moon size={20} color={colors.white} />;
      default:
        return null;
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
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={28} color={colors.white} />
          </TouchableOpacity>

          <View>
            {showLangMenu && (
              <TouchableWithoutFeedback onPress={() => setShowLangMenu(false)}>
                <View style={styles.languageOverlay} />
              </TouchableWithoutFeedback>
            )}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowLangMenu((v) => !v)}
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
            <Text style={[styles.title, isRTL && styles.rtlText]}>Attendance</Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {selectedClass} - {selectedSection}
            </Text>
          </View>

          <View style={styles.attendanceContainer}>
            {!loading && students.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                  {language === 'ur' ? 'اس کلاس میں کوئی طالب علم نہیں ہے' : 'There are no students in this class'}
                </Text>
              </View>
            ) : students.map((student) => (
              <View key={student.id} style={styles.studentRow}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>
                    {language === 'ur' ? student.urduName : student.name}
                  </Text>
                </View>
                
                <View style={styles.attendanceButtons}>
                  <TouchableOpacity
                    style={[
                      styles.attendanceButton,
                      styles.presentButton,
                      student.status === 'present' && styles.presentActive
                    ]}
                    onPress={() => handleAttendanceChange(student.id, 'present')}
                  >
                    {student.status === 'present' && getStatusIcon('present')}
                    <Text style={[
                      styles.buttonText,
                      student.status === 'present' && styles.activeButtonText
                    ]}>
                      {t.present}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.attendanceButton,
                      styles.leaveButton,
                      student.status === 'leave' && styles.leaveActive
                    ]}
                    onPress={() => handleAttendanceChange(student.id, 'leave')}
                  >
                    {student.status === 'leave' && getStatusIcon('leave')}
                    <Text style={[
                      styles.buttonText,
                      student.status === 'leave' && styles.activeButtonText
                    ]}>
                      {t.leave}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.attendanceButton,
                      styles.absentButton,
                      student.status === 'absent' && styles.absentActive
                    ]}
                    onPress={() => handleAttendanceChange(student.id, 'absent')}
                  >
                    {student.status === 'absent' && getStatusIcon('absent')}
                    <Text style={[
                      styles.buttonText,
                      student.status === 'absent' && styles.activeButtonText
                    ]}>
                      {t.absent}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <Button
            title={t.saveAttendance}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </ScrollView>
      </LinearGradient>

      <SuccessPopup
        visible={showSuccessPopup}
        message={t.attendanceMarked}
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
    padding: 8,
    zIndex: 12,
  },
  languageMenu: {
    position: 'absolute' as const,
    top: 100,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 11,
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
  attendanceContainer: {
    flex: 1,
    marginBottom: 24,
  },
  emptyState: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyTextUrdu: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  studentRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  attendanceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  attendanceButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    flexDirection: 'row',
    gap: 4,
  },
  presentButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  presentActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  leaveButton: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderColor: 'rgba(255, 152, 0, 0.5)',
  },
  leaveActive: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  absentButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderColor: 'rgba(244, 67, 54, 0.5)',
  },
  absentActive: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: colors.white,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  activeButtonText: {
    color: colors.white,
  },
  submitButton: {
    marginTop: 16,
  },
});
