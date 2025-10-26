import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { LogOut, Lock, Users, BookOpen, GraduationCap, Globe, UserPlus, Eye, Trash2, RefreshCw } from 'lucide-react-native';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import BackgroundPattern from '@/components/BackgroundPattern';
import { SuccessPopup } from '@/components/SuccessPopup';
import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService, User } from '@/services/api';

// Memoized ModalInput component to prevent re-renders
const ModalInput = React.memo(({ placeholder, value, onChangeText, keyboardType, autoCapitalize, secureTextEntry, isRTL }: any) => (
  <View style={styles.modalInputContainer}>
    <TextInput
      style={[styles.modalInput, isRTL && styles.modalInputRTL]}
      placeholder={placeholder}
      placeholderTextColor={colors.textLight}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      secureTextEntry={secureTextEntry}
    />
  </View>
));

// Memoized Add Teacher Modal
const AddTeacherModal = React.memo(({ 
  showAddTeacher, 
  teacherName, 
  setTeacherName, 
  teacherEmail, 
  setTeacherEmail, 
  teacherPhone, 
  setTeacherPhone, 
  teacherPassword,
  setTeacherPassword,
  handleAddTeacher, 
  handleCancelTeacher,
  t, 
  isRTL 
}: any) => {
  if (!showAddTeacher) return null;
  
  return (
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>
            {t.addTeacher}
          </Text>
          
          <ModalInput
            placeholder={t.teacherName}
            value={teacherName}
            onChangeText={setTeacherName}
            isRTL={isRTL}
          />
          
          <ModalInput
            placeholder={t.teacherEmail}
            value={teacherEmail}
            onChangeText={setTeacherEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            isRTL={isRTL}
          />
          
          <ModalInput
            placeholder={t.teacherPhone}
            value={teacherPhone}
            onChangeText={setTeacherPhone}
            keyboardType="phone-pad"
            isRTL={isRTL}
          />

          <ModalInput
            placeholder={t.password}
            value={teacherPassword}
            onChangeText={setTeacherPassword}
            secureTextEntry={true}
            isRTL={isRTL}
          />
          
          <View style={styles.modalButtons}>
            <Button
              title={t.cancel}
              onPress={handleCancelTeacher}
              style={[styles.modalButton, styles.cancelButton] as any}
            />
            <Button
              title={t.save}
              onPress={handleAddTeacher}
              style={[styles.modalButton, styles.saveButton] as any}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
});

// Memoized Add Student Modal
const AddStudentModal = React.memo(({ 
  showAddStudent, 
  studentName, 
  setStudentName, 
  studentClass, 
  setStudentClass, 
  studentSection, 
  setStudentSection, 
  studentUserId, 
  setStudentUserId, 
  studentPassword,
  setStudentPassword,
  generateUserId, 
  handleAddStudent, 
  handleCancelStudent,
  t, 
  isRTL 
}: any) => {
  if (!showAddStudent) return null;
  
  return (
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>
            {t.addStudent}
          </Text>
          
          <ModalInput
            placeholder={t.studentName}
            value={studentName}
            onChangeText={setStudentName}
            isRTL={isRTL}
          />
          
          <ModalInput
            placeholder={t.studentClass}
            value={studentClass}
            onChangeText={setStudentClass}
            isRTL={isRTL}
          />
          
          <ModalInput
            placeholder={t.studentSection}
            value={studentSection}
            onChangeText={setStudentSection}
            isRTL={isRTL}
          />

          <View style={styles.userIdContainer}>
            <View style={styles.userIdInputContainer}>
              <TextInput
                style={[styles.modalInput, isRTL && styles.modalInputRTL]}
                placeholder="User ID"
                placeholderTextColor={colors.textLight}
                value={studentUserId}
                onChangeText={setStudentUserId}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateUserId}
            >
              <RefreshCw size={16} color={colors.primary} />
              <Text style={styles.generateButtonText}>
                {t.generateUserId}
              </Text>
            </TouchableOpacity>
          </View>

          <ModalInput
            placeholder={t.password}
            value={studentPassword}
            onChangeText={setStudentPassword}
            secureTextEntry={true}
            isRTL={isRTL}
          />
          
          <View style={styles.modalButtons}>
            <Button
              title={t.cancel}
              onPress={handleCancelStudent}
              style={[styles.modalButton, styles.cancelButton] as any}
            />
            <Button
              title={t.save}
              onPress={handleAddStudent}
              style={[styles.modalButton, styles.saveButton] as any}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
});

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { t, isRTL, language, setLanguageTo } = useLanguage();
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  
  // All hooks must be called before any early returns
  const [showUpdateCredentials, setShowUpdateCredentials] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [oldUsername, setOldUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // User management states
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showViewUsers, setShowViewUsers] = useState(false);
  
  // Form states
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentSection, setStudentSection] = useState('');
  const [studentUserId, setStudentUserId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentSuccess, setShowStudentSuccess] = useState(false);
  const [showTeacherSuccess, setShowTeacherSuccess] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // All useCallback hooks must be called before any early returns
  const generateUserId = useCallback(() => {
    const randomId = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit number
    setStudentUserId(randomId.toString());
  }, []);

  const handleCancelTeacher = useCallback(() => {
    setShowAddTeacher(false);
    setTeacherName('');
    setTeacherEmail('');
    setTeacherPhone('');
    setTeacherPassword('');
  }, []);

  const handleCancelStudent = useCallback(() => {
    setShowAddStudent(false);
    setStudentName('');
    setStudentClass('');
    setStudentSection('');
    setStudentUserId('');
    setStudentPassword('');
  }, []);
  
  // Safety check - redirect if not admin or if user is null (logged out)
  React.useEffect(() => {
    if (!user || (user && user.role !== 'admin')) {
      console.log('User is not admin or logged out, redirecting to sign-in');
      router.replace('/sign-in' as any);
    }
  }, [user, router]);

  // Show loading if user is not loaded yet
  if (!user) {
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
              // Don't navigate here - let the useEffect handle it when user becomes null
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleUpdateCredentials = async () => {
    if (!oldUsername || !oldPassword || !newUsername || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // TODO: Implement API call to update credentials
    // For now, just show success message
    setShowSuccessPopup(true);
    setShowUpdateCredentials(false);
    setOldUsername('');
    setOldPassword('');
    setNewUsername('');
    setNewPassword('');
  };

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      console.log('Fetching all users from API...');
      
      const response = await apiService.getAllUsers();
      
      if (response.success && response.data) {
        setAllUsers(response.data.users);
        console.log('Users loaded from API:', response.data.users);
        setShowViewUsers(true);
      } else {
        console.error('Failed to fetch users:', response.error);
        Alert.alert('Error', response.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddTeacher = async () => {
    if (!teacherName || !teacherEmail || !teacherPhone || !teacherPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('Creating teacher:', { teacherName, teacherEmail, teacherPhone, teacherPassword });
    
    try {
      const teacherData = {
        name: teacherName,
        email: teacherEmail,
        phoneNumber: teacherPhone,
        password: teacherPassword, // Use password from form
        role: 'teacher' as const,
      };
      
      const response = await apiService.addTeacher(teacherData);
      
      if (response.success && response.data) {
        console.log('Teacher created successfully:', response.data.user);
        
        // Refresh the users list to show the new teacher
        await fetchAllUsers();
        
        setShowAddTeacher(false);
        setShowTeacherSuccess(true);
        setTeacherName('');
        setTeacherEmail('');
        setTeacherPhone('');
        setTeacherPassword('');
      } else {
        console.error('Failed to create teacher:', response.error);
        Alert.alert('Error', response.error || 'Failed to create teacher');
      }
    } catch (error) {
      console.error('Error creating teacher:', error);
      Alert.alert('Error', 'Failed to create teacher');
    }
  };

  const handleAddStudent = async () => {
    if (!studentName || !studentClass || !studentSection || !studentPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('Creating student:', { 
      studentName, 
      studentClass, 
      studentSection, 
      studentUserId,
      studentPassword,
      passwordLength: studentPassword?.length
    });
    
    try {
      const studentData = {
        name: studentName,
        phoneNumber: studentUserId || `STU${Date.now()}`, // This will be the student ID for login
        password: studentPassword, // Use password from form
        role: 'student' as const,
        studentInfo: {
          class: studentClass,
          section: studentSection
        }
      };
      
      console.log('Sending student data to API:', {
        ...studentData,
        password: '[REDACTED]',
        passwordLength: studentData.password?.length
      });
      
      const response = await apiService.addStudent(studentData);
      
      if (response.success && response.data) {
        console.log('Student created successfully:', response.data.user);
        
        // Refresh the users list to show the new student
        await fetchAllUsers();
        
        setShowAddStudent(false);
        setShowStudentSuccess(true);
        setStudentName('');
        setStudentClass('');
        setStudentSection('');
        setStudentUserId('');
        setStudentPassword('');
      } else {
        console.error('Failed to create student:', response.error);
        Alert.alert('Error', response.error || 'Failed to create student');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      Alert.alert('Error', 'Failed to create student');
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      t.confirmDelete,
      `Are you sure you want to delete ${userName}?`,
      [
        { text: t.cancel, style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.deleteUser(userId);
              
              if (response.success) {
                console.log(`User ${userName} (ID: ${userId}) deleted successfully`);
                
                // Refresh the users list to reflect the deletion
                await fetchAllUsers();
                
                Alert.alert('Success', t.userDeleted);
              } else {
                console.error('Failed to delete user:', response.error);
                Alert.alert('Error', response.error || 'Failed to delete user');
              }
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user');
            }
          }
        }
      ]
    );
  };

  const statsData = [
    { icon: Users, label: t.totalTeachers, value: '12', color: colors.primary },
    { icon: GraduationCap, label: t.totalStudents, value: '156', color: colors.gold },
    { icon: BookOpen, label: t.totalClasses, value: '8', color: colors.primaryLight },
  ];

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
              {/* Language on far left */}
              <View style={styles.languageContainer}>
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
              {/* Spacer pushes logout to the far right */}
              <View style={{ flex: 1 }} />
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
            
            <Text style={[styles.title, isRTL && styles.rtlText]}>
              {t.adminDashboard}
            </Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {t.welcomeAdmin}
            </Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t.summaryStatistics}
            </Text>
            <View style={styles.statsGrid}>
              {statsData.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                    <stat.icon size={24} color={colors.white} />
                  </View>
                  <Text style={[styles.statValue, isRTL && styles.rtlText]}>
                    {stat.value}
                  </Text>
                  <Text style={[styles.statLabel, isRTL && styles.rtlText]}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* User Management Section */}
          <View style={styles.userManagementContainer}>
            <TouchableOpacity
              style={styles.userManagementButton}
              onPress={() => setShowUserManagement(!showUserManagement)}
            >
              <Users size={20} color={colors.white} />
              <Text style={styles.userManagementButtonText}>
                {t.manageUsers}
              </Text>
            </TouchableOpacity>

            {showUserManagement && (
              <View style={styles.userManagementGrid}>
                <TouchableOpacity
                  style={styles.userManagementCard}
                  onPress={() => setShowAddTeacher(true)}
                >
                  <UserPlus size={24} color={colors.primary} />
                  <Text style={[styles.userManagementCardText, isRTL && styles.rtlText]}>
                    {t.addNewTeacher}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.userManagementCard}
                  onPress={() => setShowAddStudent(true)}
                >
                   <UserPlus size={24} color={colors.gold} />
                  <Text style={[styles.userManagementCardText, isRTL && styles.rtlText]}>
                    {t.addNewStudent}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.userManagementCard, styles.viewUsersCard]}
                  onPress={fetchAllUsers}
                  disabled={loadingUsers}
                >
                   <Eye size={24} color={colors.primaryLight} />
                  <Text style={[styles.userManagementCardText, isRTL && styles.rtlText]}>
                    {t.viewAllUsers}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Update Credentials Section */}
          <View style={styles.credentialsContainer}>
            <TouchableOpacity
              style={styles.credentialsButton}
              onPress={() => setShowUpdateCredentials(!showUpdateCredentials)}
            >
              <Lock size={20} color={colors.white} />
              <Text style={styles.credentialsButtonText}>
                {t.changeCredentials}
              </Text>
            </TouchableOpacity>

            {showUpdateCredentials && (
              <View style={styles.credentialsForm}>
                <Text style={[styles.formTitle, isRTL && styles.rtlText]}>
                  {t.updateCredentials}
                </Text>

                <Input
                  placeholder={t.oldUsername}
                  value={oldUsername}
                  onChangeText={setOldUsername}
                  autoCapitalize="none"
                  isRTL={isRTL}
                />

                <Input
                  placeholder={t.oldPassword}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry
                  isRTL={isRTL}
                />

                <Input
                  placeholder={t.newUsername}
                  value={newUsername}
                  onChangeText={setNewUsername}
                  autoCapitalize="none"
                  isRTL={isRTL}
                />

                <Input
                  placeholder={t.newPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  isRTL={isRTL}
                />

                <Button
                  title={t.updateCredentials}
                  onPress={handleUpdateCredentials}
                  style={styles.updateButton}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
      
      <SuccessPopup
        visible={showSuccessPopup}
        message={t.credentialsUpdated}
        onClose={() => setShowSuccessPopup(false)}
      />

      <SuccessPopup
        visible={showStudentSuccess}
        message={t.studentAccountCreated}
        onClose={() => setShowStudentSuccess(false)}
      />

      <SuccessPopup
        visible={showTeacherSuccess}
        message={t.teacherAccountCreated}
        onClose={() => setShowTeacherSuccess(false)}
      />

      {/* Add Teacher Modal */}
      <AddTeacherModal
        showAddTeacher={showAddTeacher}
        teacherName={teacherName}
        setTeacherName={setTeacherName}
        teacherEmail={teacherEmail}
        setTeacherEmail={setTeacherEmail}
        teacherPhone={teacherPhone}
        setTeacherPhone={setTeacherPhone}
        teacherPassword={teacherPassword}
        setTeacherPassword={setTeacherPassword}
        handleAddTeacher={handleAddTeacher}
        handleCancelTeacher={handleCancelTeacher}
        t={t}
        isRTL={isRTL}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        showAddStudent={showAddStudent}
        studentName={studentName}
        setStudentName={setStudentName}
        studentClass={studentClass}
        setStudentClass={setStudentClass}
        studentSection={studentSection}
        setStudentSection={setStudentSection}
        studentUserId={studentUserId}
        setStudentUserId={setStudentUserId}
        studentPassword={studentPassword}
        setStudentPassword={setStudentPassword}
        generateUserId={generateUserId}
        handleAddStudent={handleAddStudent}
        handleCancelStudent={handleCancelStudent}
        t={t}
        isRTL={isRTL}
      />


      {/* View All Users Modal */}
      {showViewUsers && (
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.viewUsersModalContainer}>
            <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>
              {t.viewAllUsers}
            </Text>
            
            <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
              {allUsers.map((user, index) => (
                <View key={user._id} style={styles.userCard}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>
                      {user.role === 'teacher' ? 'Teacher' : 'Student'}
                    </Text>
                    {user.email && (
                      <Text style={styles.userDetail}>{user.email}</Text>
                    )}
                    <Text style={styles.userDetail}>{user.phoneNumber}</Text>
                    {user.studentInfo && (
                      <Text style={styles.userDetail}>
                        Class: {user.studentInfo.class} - Section: {user.studentInfo.section}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteUser(user._id, user.name)}
                  >
                    <Trash2 size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <Button
                title={t.cancel}
                onPress={() => setShowViewUsers(false)}
                style={[styles.modalButton, styles.cancelButton] as any}
              />
            </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
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
    marginHorizontal: -24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageContainer: {
    position: 'relative' as const,
    marginRight: 8,
  },
  languageButton: {
    padding: 8,
    zIndex: 12,
  },
  languageMenu: {
    position: 'absolute' as const,
    top: 40,
    left: 0,
    marginLeft: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 4,
  },
  languageOverlay: {
    position: 'absolute' as const,
    top: -100,
    left: -200,
    right: -200,
    bottom: -100,
    zIndex: 10,
  },
  languageMenuItem: {
    paddingHorizontal: 7,
    paddingVertical: 10,
    minWidth: 90,
  },
  languageMenuText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center' as const,
  },
  languageText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    padding: 8,
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
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
  statsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  credentialsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  credentialsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  credentialsButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  credentialsForm: {
    marginTop: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  updateButton: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  userManagementContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userManagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userManagementButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  userManagementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  userManagementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userManagementCardText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: colors.textLight,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  modalInputContainer: {
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    minHeight: 52,
  },
  modalInputRTL: {
    textAlign: 'right',
  },
  userIdInputContainer: {
    marginBottom: 16,
    flex: 3,
  },
  userIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginLeft: 12,
    minHeight: 52,
    flex: 2,
    maxWidth: 140,
  },
  generateButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  viewUsersModalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  usersList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.textLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginLeft: 12,
  },
  viewUsersCard: {
    width: '100%',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
});
