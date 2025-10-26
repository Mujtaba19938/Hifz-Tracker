import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { firebasePhoneAuth } from '@/services/firebaseAuth';
import { apiService } from '@/services/api';

interface User {
  id: string;
  phoneNumber?: string;
  name: string;
  role?: string;
  email?: string;
  studentId?: string;
  class?: string;
  section?: string;
  teacherId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface RegistrationData {
  masjidName: string;
  masjidAddress: string;
  city: string;
  country: string;
  adminName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verificationFlow, setVerificationFlow] = useState<'signin' | 'forgot-password' | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      // Only set user from Firebase if we don't already have a user set
      // This prevents Firebase from overriding admin users
      if (firebaseUser && !user) {
        setUser({
          id: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber || '',
          name: firebaseUser.displayName || 'User',
          role: 'teacher', // Default role for Firebase users
        });
      } else if (!firebaseUser && user?.role !== 'admin' && user?.role !== 'student') {
        // Only clear user if it's not an admin or student user
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const signIn = useCallback(async (identifier: string, password: string, role?: string) => {
    setIsLoading(true);
    try {
      if (role === 'admin') {
        // Admin login logic
        const response = await apiService.adminLogin(identifier, password);
        
        if (response.success && response.data) {
          const adminUser = {
            id: response.data.user._id,
            name: response.data.user.name,
            role: 'admin',
            email: response.data.user.email,
          };
          
          console.log('Setting admin user:', adminUser);
          console.log('Setting token:', response.data.token);
          setUser(adminUser);
          setToken(response.data.token);
          // Set token in API service
          apiService.setToken(response.data.token);
          return { success: true };
        } else {
          return { success: false, error: response.error || 'Invalid admin credentials' };
        }
      } else if (role === 'student') {
        // Student login logic
        console.log('Attempting student login with:', { 
          identifier, 
          hasPassword: !!password, 
          passwordLength: password?.length 
        });
        
        const response = await apiService.studentLogin(identifier, password);
        
        console.log('Student login response:', {
          success: response.success,
          error: response.error,
          hasData: !!response.data
        });
        
        if (response.success && response.data) {
          const studentUser = {
            id: response.data.student.id || response.data.student._id,
            studentId: response.data.student.studentId,
            name: response.data.student.name,
            role: 'student',
            class: response.data.student.class,
            section: response.data.student.section,
            teacherId: response.data.student.teacherId,
          };
          
          console.log('Student login successful, setting user:', studentUser);
          setUser(studentUser);
          setToken(response.data.token);
          // Set token in API service
          apiService.setToken(response.data.token);
          return { success: true };
        } else {
          console.log('Student login failed:', response.error);
          return { success: false, error: response.error || 'Invalid student credentials' };
        }
      } else {
        // Teacher login logic - keep existing mock for now
        const mockUser = {
          id: '1',
          phoneNumber: identifier,
          name: 'Teacher',
          role: 'teacher',
        };
        
        setUser(mockUser);
        return { success: true };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Only sign out from Firebase if user is not an admin
      if (user?.role !== 'admin') {
        await firebaseSignOut(auth);
      }
      setUser(null);
      setToken(null);
      // Clear token in API service
      apiService.setToken(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear the user even if Firebase signout fails
      setUser(null);
      setToken(null);
      // Clear token in API service
      apiService.setToken(null);
    }
  }, [user]);

  const sendVerificationCode = useCallback(async (phoneNumber: string, flow: 'signin' | 'forgot-password' = 'signin') => {
    setIsLoading(true);
    try {
      // Format phone number to include country code if not present
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      const result = await firebasePhoneAuth.sendVerificationCode(formattedPhoneNumber);
      
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId);
        setVerificationFlow(flow);
      }
      
      return result;
    } catch (error) {
      console.error('Send verification error:', error);
      return { success: false, error: 'Failed to send code' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      if (!verificationId) {
        return { success: false, error: 'No verification ID found. Please request a new code.' };
      }

      const result = await firebasePhoneAuth.verifyCodeAndSignIn(verificationId, code);
      
      if (result.success) {
        setVerificationId(null); // Clear verification ID after successful verification
        // Don't clear verificationFlow here - we need it for routing
      }
      
      return { ...result, flow: verificationFlow };
    } catch (error) {
      console.error('Verify code error:', error);
      return { success: false, error: 'Invalid code' };
    } finally {
      setIsLoading(false);
    }
  }, [verificationId]);

  const resetPassword = useCallback(async (password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to reset password' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegistrationData) => {
    setIsLoading(true);
    try {
      console.log('Registering masjid:', data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Don't set user as authenticated after registration
      // User should sign in separately with their credentials
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      verificationId,
      verificationFlow,
      signIn,
      signOut,
      sendVerificationCode,
      verifyCode,
      resetPassword,
      register,
    }),
    [user, token, isLoading, verificationId, verificationFlow, signIn, signOut, sendVerificationCode, verifyCode, resetPassword, register]
  );
});
