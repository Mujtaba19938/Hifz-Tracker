import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { LogOut, Globe, BookOpen, CheckCircle, Clock, RefreshCw } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import colors from '@/constants/colors';
import { autoDetectingApiService } from '@/services/autoDetectingApi';
import { socket, joinStudentRoom } from '@/services/socket';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Assignment {
  id: string;
  surahName: string;
  startAyah: number;
  endAyah: number;
  type: 'lesson' | 'revision' | 'newLesson';
  status: 'pending' | 'completed';
  mistakes?: string[];
  qualities?: string[];
  assignedDate: string;
}

export default function StudentDashboardScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { t, isRTL, language, setLanguageTo } = useLanguage();
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'lesson' | 'revision' | 'newLesson'>('lesson');

  const normalizeType = (t: any): 'lesson' | 'revision' | 'newLesson' => {
    const s = String(t || '').toLowerCase();
    if (s === 'lesson') return 'lesson';
    if (s === 'revision') return 'revision';
    if (s === 'newlesson' || s === 'new_lesson' || s === 'new-lesson') return 'newLesson';
    return 'lesson';
  };

  // Load assigned tasks for this student (all types)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user?.studentId) return;
      setLoading(true);
      try {
        // Try v2 endpoint first
        const res = await autoDetectingApiService.getMyAssignments({ status: 'assigned', studentId: user.studentId });
        if (!cancelled && res.success) {
          console.log('StudentDashboard v2 getMyAssignments response:', res.data);
          const list = ((res.data as any)?.assignments || []) as any[];
          if (list.length > 0) {
            const mapped: Assignment[] = list.map((hw: any) => ({
              id: hw._id || `${Date.now()}`,
              surahName: hw.title || hw?.startSurah?.name || 'Assignment',
              startAyah: Number(hw?.startVerse ?? 0),
              endAyah: Number(hw?.endVerse ?? 0),
              type: normalizeType(hw?.type),
              status: (hw?.status && String(hw.status).toLowerCase() === 'completed') ? 'completed' : 'pending',
              assignedDate: hw?.assignedDate || hw?.createdAt || new Date().toISOString(),
            }));
            setAssignments(mapped);
            console.log('StudentDashboard mapped v2 assignments:', mapped.length);
            return;
          }
        }

        // Fallback to v1 endpoint if v2 missing or empty
        const resV1 = await autoDetectingApiService.getHomeworkByStudent(user.studentId, { status: 'assigned' });
        if (!cancelled && resV1.success) {
          console.log('StudentDashboard v1 getHomeworkByStudent response (status=assigned):', resV1.data);
          const listV1 = ((resV1.data as any)?.homework || []) as any[];
          const mappedV1: Assignment[] = listV1.map((hw: any) => ({
            id: hw._id || `${Date.now()}`,
            surahName: hw?.startSurah?.name || hw.title || 'Assignment',
            startAyah: Number(hw?.startVerse ?? 0),
            endAyah: Number(hw?.endVerse ?? 0),
            type: normalizeType(hw?.type || 'lesson'),
            status: (hw?.status && String(hw.status).toLowerCase() === 'completed') ? 'completed' : 'pending',
            assignedDate: hw?.assignedDate || hw?.createdAt || new Date().toISOString(),
          }));
          if (mappedV1.length > 0) {
            setAssignments(mappedV1);
            console.log('StudentDashboard mapped v1 assignments (status=assigned):', mappedV1.length);
            return;
          }
        }

        // Second fallback: v1 without status filter (if backend doesn't support it)
        const resV1All = await autoDetectingApiService.getHomeworkByStudent(user.studentId, {});
        if (!cancelled && resV1All.success) {
          console.log('StudentDashboard v1 getHomeworkByStudent response (no status):', resV1All.data);
          const listV1All = ((resV1All.data as any)?.homework || []) as any[];
          const mappedV1All: Assignment[] = listV1All.map((hw: any) => ({
            id: hw._id || `${Date.now()}`,
            surahName: hw?.startSurah?.name || hw.title || 'Assignment',
            startAyah: Number(hw?.startVerse ?? 0),
            endAyah: Number(hw?.endVerse ?? 0),
            type: normalizeType(hw?.type || 'lesson'),
            status: (hw?.status && String(hw.status).toLowerCase() === 'completed') ? 'completed' : 'pending',
            assignedDate: hw?.assignedDate || hw?.createdAt || new Date().toISOString(),
          }));
          setAssignments(mappedV1All);
          console.log('StudentDashboard mapped v1 assignments (no status):', mappedV1All.length);
        }
      } catch (e) {
        console.log('Failed to load student assignment:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user?.studentId]);

  // Safety check - redirect if not student
  React.useEffect(() => {
    if (user && user.role !== 'student') {
      console.log('User is not a student, redirecting to sign-in');
      router.replace('/sign-in' as any);
    }
  }, [user, router]);

  // Join student's room and listen for real-time tasks
  useEffect(() => {
    if (!user?.studentId) return;

    joinStudentRoom(user.studentId);

    const onNewTask = (task: any) => {
      // Map backend task payload to UI Assignment shape
      const mapped: Assignment = {
        id: task._id || `${Date.now()}`,
        surahName: task.title || 'New Task',
        startAyah: 0,
        endAyah: 0,
        type: 'lesson',
        status: 'pending',
        assignedDate: task.createdAt || new Date().toISOString(),
      };

      setAssignments(prev => [mapped, ...prev]);
    };

    socket.on('new_task', onNewTask);
    return () => {
      socket.off('new_task', onNewTask);
    };
  }, [user?.studentId]);

  // Show loading if user is not loaded yet
  if (!user) {
    console.log('Student Dashboard: No user found, showing loading screen');
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.gradient}
        >
          <BackgroundPattern />
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  console.log('Student Dashboard: User found, rendering dashboard:', {
    id: user.id,
    name: user.name,
    role: user.role,
    studentId: user.studentId
  });

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.push('/sign-in' as any);
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleMarkCompleted = async (assignmentId: string) => {
    try {
      // Simulate API call to mark assignment as completed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === assignmentId 
            ? { ...assignment, status: 'completed' as const }
            : assignment
        )
      );
      
      Alert.alert('Success', 'Assignment marked as completed!');
    } catch (error) {
      console.error('Error marking assignment as completed:', error);
      Alert.alert('Error', 'Failed to mark assignment as completed');
    }
  };

  const filteredAssignments = assignments.filter(assignment => normalizeType(assignment.type) === normalizeType(selectedTab));
  console.log('StudentDashboard tab:', selectedTab, 'assignments total:', assignments.length, 'filtered:', filteredAssignments.length);

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return BookOpen;
      case 'revision':
        return RefreshCw;
      case 'newLesson':
        return CheckCircle;
      default:
        return BookOpen;
    }
  };

  const getTabLabel = (type: string) => {
    switch (type) {
      case 'lesson':
        return t.todaysLesson;
      case 'revision':
        return t.revision;
      case 'newLesson':
        return t.newLesson;
      default:
        return t.lesson;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? colors.success : colors.gold;
  };

  const getStatusText = (status: string) => {
    return status === 'completed' ? t.completed : t.pending;
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
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
              
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <LogOut size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.logoContainer}>
              <Logo size={80} showText />
            </View>
            
            <Text style={[styles.welcomeText, isRTL && styles.rtlText]}>
              {t.welcomeStudent}, {user.name}
            </Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {t.yourHifzProgress}
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {(['lesson', 'revision', 'newLesson'] as const).map((tab) => {
              const IconComponent = getTabIcon(tab);
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tab,
                    selectedTab === tab && styles.activeTab
                  ]}
                  onPress={() => setSelectedTab(tab)}
                >
                  <IconComponent 
                    size={20} 
                    color={selectedTab === tab ? colors.primary : colors.white} 
                  />
                  <Text style={[
                    styles.tabText,
                    selectedTab === tab && styles.activeTabText,
                    isRTL && styles.rtlText
                  ]}>
                    {getTabLabel(tab)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Assignments */}
          <View style={styles.assignmentsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading assignments...</Text>
              </View>
            ) : filteredAssignments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <BookOpen size={48} color={colors.white} opacity={0.5} />
                <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                  {t.noLessonAssignedToday}
                </Text>
              </View>
            ) : (
              filteredAssignments.map((assignment) => (
                <View key={assignment.id} style={styles.assignmentCard}>
                  <View style={styles.assignmentHeader}>
                    <Text style={[styles.surahName, isRTL && styles.rtlText]}>
                      {assignment.surahName}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(assignment.status) }
                    ]}>
                      <Text style={styles.statusText}>
                        {getStatusText(assignment.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.assignmentDetails}>
                    <Text style={[styles.ayahRange, isRTL && styles.rtlText]}>
                      {t.startAyah}: {assignment.startAyah} - {t.endAyah}: {assignment.endAyah}
                    </Text>
                    
                    {assignment.mistakes && assignment.mistakes.length > 0 && (
                      <View style={styles.mistakesContainer}>
                        <Text style={[styles.mistakesTitle, isRTL && styles.rtlText]}>
                          {t.mistakes}:
                        </Text>
                        {assignment.mistakes.map((mistake, index) => (
                          <Text key={index} style={[styles.mistakeItem, isRTL && styles.rtlText]}>
                            • {mistake}
                          </Text>
                        ))}
                      </View>
                    )}
                    
                    {assignment.qualities && assignment.qualities.length > 0 && (
                      <View style={styles.qualitiesContainer}>
                        <Text style={[styles.qualitiesTitle, isRTL && styles.rtlText]}>
                          {t.qualities}:
                        </Text>
                        {assignment.qualities.map((quality, index) => (
                          <Text key={index} style={[styles.qualityItem, isRTL && styles.rtlText]}>
                            • {quality}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                  
                  {assignment.status === 'pending' && (
                    <Button
                      title={t.markAsCompleted}
                      onPress={() => handleMarkCompleted(assignment.id)}
                      style={styles.completeButton}
                    />
                  )}
                </View>
              ))
            )}
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  languageMenu: {
    position: 'absolute' as const,
    top: 36,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 20,
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
  logoutButton: {
    padding: 8,
  },
  logoContainer: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  tabText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    textAlign: 'center',
  },
  activeTabText: {
    color: colors.primary,
  },
  assignmentsContainer: {
    flex: 1,
  },
  assignmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  surahName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  assignmentDetails: {
    marginBottom: 16,
  },
  ayahRange: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 12,
  },
  mistakesContainer: {
    marginBottom: 12,
  },
  mistakesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 4,
  },
  mistakeItem: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  qualitiesContainer: {
    marginBottom: 12,
  },
  qualitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 4,
  },
  qualityItem: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.8,
  },
});
